/**
 * MOTOR DE REGRAS — funções PURAS: recebem o estado e devolvem um novo estado.
 * Nada aqui toca em tela ou localStorage, então tudo é testável
 * (ver engine.test.js). Valores sempre em centavos.
 */
import { splitIntoJars, jarsTotal, brl } from './money.js';
import { addDays, weekdayOf, monthKey, monthsAfter, weekKey, daysBetween } from './dates.js';
import { uid } from './ids.js';
import { newKid } from './state.js';

// ---------------------------------------------------------------------------
// utilidades
// ---------------------------------------------------------------------------
export class RuleError extends Error {}
const fail = (msg) => { throw new RuleError(msg); };

export const getKid = (state, kidId) => state.kids.find((k) => k.id === kidId);

export const updateKid = (state, kidId, fn) => ({
  ...state,
  kids: state.kids.map((k) => (k.id === kidId ? fn(k) : k)),
});

/** effect: 'in' (entrou dinheiro), 'out' (saiu), 'move' (mudou de lugar, total igual) */
const addTx = (state, tx) => ({
  ...state,
  history: [{ id: uid('h'), ...tx }, ...state.history].slice(0, 2000),
});

/** Marca uma atividade da semana (usada pelas missões semanais). */
const markActivity = (kid, today, act) => {
  const w = weekKey(today);
  const acts = kid.weekActs || {};
  return { ...kid, weekActs: { ...acts, [w]: { ...(acts[w] || {}), [act]: true } } };
};

export const kidTotal = (kid) => jarsTotal(kid.jars) + kid.bank;

const positive = (cents) => {
  if (!Number.isInteger(cents) || cents <= 0) fail('Valor inválido.');
};

// ---------------------------------------------------------------------------
// crianças
// ---------------------------------------------------------------------------
export const addKid = (state, data, today) => ({ ...state, kids: [...state.kids, newKid(data, today)] });

export const updateKidSettings = (state, kidId, patch) => {
  if (patch.split) {
    const sum = patch.split.gastar + patch.split.poupar + patch.split.doar;
    if (sum !== 100) fail('Os potes precisam somar 100%.');
  }
  return updateKid(state, kidId, (k) => ({ ...k, ...patch }));
};

export const removeKid = (state, kidId) => ({
  ...state,
  kids: state.kids.filter((k) => k.id !== kidId),
  requests: state.requests.filter((r) => r.kidId !== kidId),
  history: state.history.filter((h) => h.kidId !== kidId),
});

// ---------------------------------------------------------------------------
// entradas de dinheiro (sempre divididas nos 3 potes)
// ---------------------------------------------------------------------------
/**
 * Toda renda passa pela divisão automática nos potes. É o "nudge" estrutural
 * (Thaler): a criança não precisa decidir poupar toda vez — poupar é o padrão.
 */
export const creditKid = (state, kidId, cents, { kind, desc, date }) => {
  positive(cents);
  const kid = getKid(state, kidId);
  const parts = splitIntoJars(cents, kid.split);
  const s = updateKid(state, kidId, (k) => ({
    ...k,
    jars: {
      gastar: k.jars.gastar + parts.gastar,
      poupar: k.jars.poupar + parts.poupar,
      doar: k.jars.doar + parts.doar,
    },
  }));
  return addTx(s, { kidId, date, kind, desc, amount: cents, effect: 'in', parts });
};

/** Entrada em um pote específico (ex.: presente da avó que vai todo para Poupar). */
export const creditJar = (state, kidId, cents, jar, { desc, date }) => {
  positive(cents);
  const s = updateKid(state, kidId, (k) => ({ ...k, jars: { ...k.jars, [jar]: k.jars[jar] + cents } }));
  return addTx(s, { kidId, date, kind: 'entrada', desc, amount: cents, effect: 'in', jar });
};

/** Saída lançada pelos pais (ex.: a criança gastou no mercado com os pais). */
export const debitJar = (state, kidId, cents, jar, { desc, date, kind = 'gasto' }) => {
  positive(cents);
  const kid = getKid(state, kidId);
  if (kid.jars[jar] < cents) fail(`Só tem ${brl(kid.jars[jar])} no pote.`);
  const s = updateKid(state, kidId, (k) => ({ ...k, jars: { ...k.jars, [jar]: k.jars[jar] - cents } }));
  return addTx(s, { kidId, date, kind, desc, amount: cents, effect: 'out', jar });
};

// ---------------------------------------------------------------------------
// automações: mesada semanal e juros mensais
// ---------------------------------------------------------------------------
/**
 * Roda sempre que o app abre. Paga TODAS as mesadas e juros devidos desde a
 * última abertura (se ninguém abriu o app por 3 semanas, as 3 mesadas caem).
 *
 * Pesquisa: crianças esperam mais e confiam mais quando o adulto é
 * previsível (Kidd, Palmeri & Aslin, 2013). Mesada automática e no dia
 * certo é parte do ensino, não só conveniência.
 */
export const runAutomations = (state, today) => {
  const events = [];
  let s = state;
  for (const kid of state.kids) {
    // Mesada: para cada dia depois da última mesada até hoje, no dia da semana configurado.
    let last = kid.lastAllowanceDate;
    const gap = Math.min(daysBetween(last, today), 400);
    let paid = 0;
    for (let i = 1; i <= gap; i++) {
      const d = addDays(last, i);
      if (weekdayOf(d) === s.settings.allowanceWeekday && kid.allowance > 0) {
        s = creditKid(s, kid.id, kid.allowance, { kind: 'mesada', desc: 'Mesada da semana', date: d });
        paid += kid.allowance;
      }
    }
    if (gap > 0) s = updateKid(s, kid.id, (k) => ({ ...k, lastAllowanceDate: today }));
    if (paid) events.push({ type: 'mesada', kidId: kid.id, amount: paid });

    // Juros: no dia 1º de cada mês, sobre o saldo do banco (juros compostos).
    const months = monthsAfter(kid.lastInterestMonth, monthKey(today));
    let interest = 0;
    for (const m of months) {
      const k = getKid(s, kid.id);
      const j = Math.round((k.bank * k.interestBps) / 10000);
      if (j > 0) {
        s = updateKid(s, kid.id, (kk) => ({ ...kk, bank: kk.bank + j, interestEarned: kk.interestEarned + j }));
        s = addTx(s, { kidId: kid.id, date: `${m}-01`, kind: 'juros', desc: 'Rendimento do banco', amount: j, effect: 'in' });
        interest += j;
      }
    }
    if (months.length) s = updateKid(s, kid.id, (k) => ({ ...k, lastInterestMonth: monthKey(today) }));
    if (interest) events.push({ type: 'juros', kidId: kid.id, amount: interest });
  }
  return { state: s, events };
};

// ---------------------------------------------------------------------------
// banco da família (movimentos internos — a criança decide sozinha)
// ---------------------------------------------------------------------------
export const depositBank = (state, kidId, cents, today) => {
  positive(cents);
  const kid = getKid(state, kidId);
  if (kid.jars.poupar < cents) fail('Não tem tudo isso no pote Poupar.');
  const s = updateKid(state, kidId, (k) =>
    markActivity({ ...k, bank: k.bank + cents, jars: { ...k.jars, poupar: k.jars.poupar - cents } }, today, 'banco'));
  return addTx(s, { kidId, date: today, kind: 'banco', desc: 'Guardou no banco', amount: cents, effect: 'move' });
};

export const withdrawBank = (state, kidId, cents, today) => {
  positive(cents);
  const kid = getKid(state, kidId);
  if (kid.bank < cents) fail('Não tem tudo isso no banco.');
  const s = updateKid(state, kidId, (k) => ({ ...k, bank: k.bank - cents, jars: { ...k.jars, poupar: k.jars.poupar + cents } }));
  return addTx(s, { kidId, date: today, kind: 'saque', desc: 'Tirou do banco', amount: cents, effect: 'move' });
};

// ---------------------------------------------------------------------------
// meta pessoal
// ---------------------------------------------------------------------------
/** A meta é alimentada pelo pote Poupar + banco (o "dinheiro guardado"). */
export const goalProgress = (kid) => (kid.goal ? kid.jars.poupar + kid.bank : 0);

export const setGoal = (state, kidId, goal) => {
  if (goal) positive(goal.target);
  return updateKid(state, kidId, (k) => ({ ...k, goal }));
};

/** Semanas estimadas até a meta, considerando só a parte da mesada que vai para Poupar. */
export const weeksToGoal = (kid) => {
  if (!kid.goal) return null;
  const missing = kid.goal.target - goalProgress(kid);
  if (missing <= 0) return 0;
  const perWeek = Math.floor((kid.allowance * kid.split.poupar) / 100);
  return perWeek > 0 ? Math.ceil(missing / perWeek) : null;
};

// ---------------------------------------------------------------------------
// pedidos (dinheiro saindo de verdade — os pais aprovam)
// ---------------------------------------------------------------------------
/**
 * type: 'gastar' (pote Gastar), 'doar' (pote Doar), 'meta' (realizar a meta
 * com Poupar + banco).
 */
export const createRequest = (state, { kidId, type, amount, title, emoji }, today) => {
  positive(amount);
  const kid = getKid(state, kidId);
  const available = type === 'meta' ? kid.jars.poupar + kid.bank : kid.jars[type];
  if (available < amount) fail('Ainda não tem dinheiro suficiente.');
  const req = { id: uid('r'), kidId, type, amount, title, emoji, date: today, status: 'pendente' };
  return { ...state, requests: [req, ...state.requests] };
};

export const cancelRequest = (state, reqId) => ({
  ...state,
  requests: state.requests.filter((r) => r.id !== reqId),
});

export const resolveRequest = (state, reqId, approve, today) => {
  const req = state.requests.find((r) => r.id === reqId);
  if (!req) fail('Pedido não encontrado.');
  let s = { ...state, requests: state.requests.filter((r) => r.id !== reqId) };
  if (!approve) {
    return addTx(s, { kidId: req.kidId, date: today, kind: 'recusado', desc: `Pedido não aprovado: ${req.title}`, amount: 0, effect: 'none' });
  }
  const kid = getKid(s, req.kidId);
  if (req.type === 'meta') {
    const total = kid.jars.poupar + kid.bank;
    if (total < req.amount) fail('Saldo mudou: não tem mais o suficiente.');
    const fromJar = Math.min(kid.jars.poupar, req.amount);
    const fromBank = req.amount - fromJar;
    s = updateKid(s, kid.id, (k) => ({
      ...k,
      jars: { ...k.jars, poupar: k.jars.poupar - fromJar },
      bank: k.bank - fromBank,
      goal: null,
      stats: { ...k.stats, goalsReached: k.stats.goalsReached + 1 },
    }));
    return addTx(s, { kidId: kid.id, date: today, kind: 'meta', desc: `Meta realizada: ${req.title}`, amount: req.amount, effect: 'out' });
  }
  if (kid.jars[req.type] < req.amount) fail('Saldo mudou: não tem mais o suficiente.');
  s = updateKid(s, kid.id, (k) => ({
    ...k,
    jars: { ...k.jars, [req.type]: k.jars[req.type] - req.amount },
    stats: req.type === 'doar' ? { ...k.stats, donations: k.stats.donations + 1 } : k.stats,
  }));
  return addTx(s, {
    kidId: kid.id,
    date: today,
    kind: req.type === 'doar' ? 'doacao' : 'gasto',
    desc: req.title,
    amount: req.amount,
    effect: 'out',
    jar: req.type,
  });
};

// ---------------------------------------------------------------------------
// lista de desejos — "pense até amanhã" (gratificação adiada)
// ---------------------------------------------------------------------------
export const WISH_WAIT_DAYS = 1;

export const addWish = (state, kidId, { title, emoji, price }, today) =>
  updateKid(state, kidId, (k) =>
    markActivity({ ...k, wishes: [{ id: uid('w'), title, emoji, price, date: today }, ...k.wishes] }, today, 'desejo'));

export const wishReady = (wish, today) => daysBetween(wish.date, today) >= WISH_WAIT_DAYS;

/** Desistir depois de pensar: comemorado (decidir NÃO comprar também é uma boa decisão). */
export const giveUpWish = (state, kidId, wishId, today) => {
  const wish = getKid(state, kidId).wishes.find((w) => w.id === wishId);
  const s = updateKid(state, kidId, (k) =>
    markActivity({
      ...k,
      wishes: k.wishes.filter((w) => w.id !== wishId),
      stats: { ...k.stats, wishesGivenUp: k.stats.wishesGivenUp + 1 },
    }, today, 'desejo'));
  return addTx(s, { kidId, date: today, kind: 'desistiu', desc: `Pensou melhor: ${wish.title}`, amount: wish.price || 0, effect: 'none' });
};

export const removeWish = (state, kidId, wishId) =>
  updateKid(state, kidId, (k) => ({ ...k, wishes: k.wishes.filter((w) => w.id !== wishId) }));

// ---------------------------------------------------------------------------
// tarefas da família (SEM dinheiro) e trabalhos extras (COM dinheiro)
// ---------------------------------------------------------------------------
/**
 * Tarefas de contribuição NÃO são pagas: recompensas externas reduzem a
 * vontade espontânea de ajudar (Warneken & Tomasello, 2008). O reforço é
 * social: os pais veem e mandam um "obrigado".
 */
export const toggleFamilyTask = (state, kidId, taskId, today) =>
  updateKid(state, kidId, (k) => {
    const done = k.taskLog[today] || [];
    const next = done.includes(taskId) ? done.filter((t) => t !== taskId) : [...done, taskId];
    // guarda só os últimos ~60 dias
    const log = Object.fromEntries(Object.entries({ ...k.taskLog, [today]: next }).filter(([d]) => daysBetween(d, today) <= 60));
    return { ...k, taskLog: log };
  });

export const setFamilyTasks = (state, kidId, tasks) => updateKid(state, kidId, (k) => ({ ...k, familyTasks: tasks }));

export const thankKid = (state, kidId) =>
  updateKid(state, kidId, (k) => ({ ...k, thanksPending: k.thanksPending + 1, thanksTotal: k.thanksTotal + 1 }));

export const clearThanks = (state, kidId) => updateKid(state, kidId, (k) => ({ ...k, thanksPending: 0 }));

/**
 * Trabalhos extras: opcionais, combinados antes, pagos após aprovação.
 * Ensinam "trabalho gera renda" sem transformar a casa em negociação.
 */
export const addJob = (state, { title, emoji, reward, kidId = null, recurring = false }) => {
  positive(reward);
  const job = { id: uid('j'), title, emoji, reward, kidId, recurring, status: 'aberto', doneBy: null };
  return { ...state, jobs: [...state.jobs, job] };
};

export const removeJob = (state, jobId) => ({ ...state, jobs: state.jobs.filter((j) => j.id !== jobId) });

export const markJobDone = (state, jobId, kidId, today) => ({
  ...state,
  jobs: state.jobs.map((j) => (j.id === jobId && j.status === 'aberto' ? { ...j, status: 'feito', doneBy: kidId, doneDate: today } : j)),
});

export const resolveJob = (state, jobId, approve, today) => {
  const job = state.jobs.find((j) => j.id === jobId);
  if (!job || job.status !== 'feito') fail('Trabalho não está aguardando aprovação.');
  const reopen = { ...job, status: 'aberto', doneBy: null, doneDate: null };
  let s = {
    ...state,
    jobs: approve && !job.recurring ? state.jobs.filter((j) => j.id !== jobId) : state.jobs.map((j) => (j.id === jobId ? reopen : j)),
  };
  if (!approve) return s;
  s = creditKid(s, job.doneBy, job.reward, { kind: 'trabalho', desc: `Trabalho: ${job.title}`, date: today });
  return updateKid(s, job.doneBy, (k) => ({ ...k, stats: { ...k.stats, jobsDone: k.stats.jobsDone + 1 } }));
};

// ---------------------------------------------------------------------------
// meta da família (cooperação, não competição)
// ---------------------------------------------------------------------------
export const setFamilyGoal = (state, goal) => ({ ...state, familyGoal: goal ? { saved: 0, ...goal } : null });

export const contributeFamilyGoal = (state, kidId, cents, today) => {
  positive(cents);
  if (!state.familyGoal) fail('Não há meta da família.');
  let s = state;
  if (kidId) {
    const kid = getKid(state, kidId);
    if (kid.jars.poupar < cents) fail('Não tem tudo isso no pote Poupar.');
    s = updateKid(s, kidId, (k) => markActivity({ ...k, jars: { ...k.jars, poupar: k.jars.poupar - cents } }, today, 'familia'));
    s = addTx(s, { kidId, date: today, kind: 'familia', desc: `Meta da família: ${state.familyGoal.title}`, amount: cents, effect: 'out' });
  }
  return { ...s, familyGoal: { ...s.familyGoal, saved: s.familyGoal.saved + cents } };
};

export const completeFamilyGoal = (state) => ({ ...state, familyGoal: null, familyGoalsDone: state.familyGoalsDone + 1 });

// ---------------------------------------------------------------------------
// estrelas, níveis, missões semanais e sequência
// ---------------------------------------------------------------------------
/**
 * UMA moeda de jogo só (estrelas ⭐). O protótipo tinha R$ + pontos + XP:
 * três "dinheiros" diferentes confundem uma criança de 6 anos.
 * Estrelas vêm de APRENDER e DECIDIR — nunca de tarefas domésticas.
 * Nível = estrelas ganhas na vida (gastar estrelas na loja não baixa o nível).
 */
export const levelFor = (starsEarned) => Math.floor((1 + Math.sqrt(1 + (8 * starsEarned) / 50)) / 2);
export const starsForLevel = (level) => 25 * level * (level - 1);

export const giveStars = (kid, n) => ({ ...kid, stars: kid.stars + n, starsEarned: kid.starsEarned + n });

/**
 * Missões SEMANAIS (não diárias): o ritmo da mesada é semanal e missões
 * diárias empurram para uso compulsivo. Três pequenas tarefas abertas na
 * semana aproveitam o Efeito Zeigarnik sem cobrar presença diária.
 */
export const MISSIONS = [
  { id: 'licao', emoji: '📚', title: 'Fazer a lição da semana', little: 'Ver a historinha', stars: 15 },
  { id: 'banco', emoji: '🏦', title: 'Guardar algo no banco', little: 'Pôr moedinha no banco', stars: 10 },
  { id: 'desejo', emoji: '💭', title: 'Usar a lista de desejos', little: 'Pensar num desejo', stars: 10 },
];

export const missionsFor = (kid, today) => {
  const w = weekKey(today);
  const acts = kid.weekActs?.[w] || {};
  const claimed = kid.claimedMissions[w] || [];
  return MISSIONS.map((m) => ({ ...m, done: !!acts[m.id], claimed: claimed.includes(m.id) }));
};

export const claimMission = (state, kidId, missionId, today) => {
  const kid = getKid(state, kidId);
  const m = missionsFor(kid, today).find((x) => x.id === missionId);
  if (!m || !m.done || m.claimed) fail('Missão ainda não concluída.');
  const w = weekKey(today);
  return updateKid(state, kidId, (k) =>
    giveStars({ ...k, claimedMissions: { ...k.claimedMissions, [w]: [...(k.claimedMissions[w] || []), missionId] } }, m.stars));
};

/**
 * Sequência em SEMANAS, não dias. Uma semana conta se a criança resgatou ao
 * menos 1 missão. A semana atual ainda em andamento não quebra a sequência.
 */
export const weekStreak = (kid, today) => {
  let w = weekKey(today);
  const has = (wk) => (kid.claimedMissions[wk] || []).length > 0;
  let streak = 0;
  if (!has(w)) w = addDays(w, -7);
  while (has(w)) { streak += 1; w = addDays(w, -7); }
  return streak;
};

// ---------------------------------------------------------------------------
// lições
// ---------------------------------------------------------------------------
/** Uma lição nova por semana (microlição semanal), a partir do 1º dia da criança. */
export const lessonsUnlocked = (kid, today, total) =>
  Math.min(total, Math.floor(daysBetween(kid.startDate, today) / 7) + 1);

export const completeLesson = (state, kidId, lessonId, today) =>
  updateKid(state, kidId, (k) => {
    if (k.lessonsDone.some((l) => l.id === lessonId)) return k;
    return markActivity(giveStars({ ...k, lessonsDone: [...k.lessonsDone, { id: lessonId, date: today }] }, 20), today, 'licao');
  });

// ---------------------------------------------------------------------------
// loja do avatar (estrelas, sem sorteio, preço sempre visível)
// ---------------------------------------------------------------------------
export const buyItem = (state, kidId, item) =>
  updateKid(state, kidId, (k) => {
    if (k.owned.includes(item.id)) return k;
    if (k.stars < item.price) fail('Estrelas insuficientes.');
    return { ...k, stars: k.stars - item.price, owned: [...k.owned, item.id], wearing: item.id };
  });

export const wearItem = (state, kidId, itemId) =>
  updateKid(state, kidId, (k) => ({ ...k, wearing: k.wearing === itemId ? null : itemId }));

// ---------------------------------------------------------------------------
// jornada dos pais
// ---------------------------------------------------------------------------
const PARENT_XP = { lesson: 30, challenge: 40, talk: 25 };

export const parentLevelFor = (xp) => Math.floor(xp / 150) + 1;

export const completeParentLesson = (state, lessonId, today) =>
  state.parent.lessonsDone.some((l) => l.id === lessonId)
    ? state
    : { ...state, parent: { ...state.parent, xp: state.parent.xp + PARENT_XP.lesson, lessonsDone: [...state.parent.lessonsDone, { id: lessonId, date: today }] } };

export const markChallenge = (state, lessonId) =>
  state.parent.challengesDone.includes(lessonId)
    ? state
    : { ...state, parent: { ...state.parent, xp: state.parent.xp + PARENT_XP.challenge, challengesDone: [...state.parent.challengesDone, lessonId] } };

/** "Papo da semana": conversa sobre a lição que a criança fez. */
export const recordTalk = (state, kidId, lessonId, today) =>
  state.parent.talks.some((t) => t.kidId === kidId && t.lessonId === lessonId)
    ? state
    : { ...state, parent: { ...state.parent, xp: state.parent.xp + PARENT_XP.talk, talks: [...state.parent.talks, { kidId, lessonId, date: today }] } };

/** Semanas seguidas com pelo menos um papo registrado. */
export const parentTalkStreak = (state, today) => {
  const weeks = new Set(state.parent.talks.map((t) => weekKey(t.date)));
  let w = weekKey(today);
  if (!weeks.has(w)) w = addDays(w, -7);
  let n = 0;
  while (weeks.has(w)) { n += 1; w = addDays(w, -7); }
  return n;
};
