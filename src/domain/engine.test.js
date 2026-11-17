import { describe, it, expect } from 'vitest';
import * as E from './engine.js';
import { newState } from './state.js';
import { splitIntoJars, toCents, jarsTotal } from './money.js';
import { weekKey, monthsAfter, addDays, weekdayOf } from './dates.js';
import { buildDemo } from './demo.js';
import { LESSONS } from './lessons.js';
import { migrate, SCHEMA_VERSION } from './state.js';
import { DEFAULT_INTEREST_BPS } from './config.js';
import { emptyLock, registerFail, secondsLeft, isLocked, triesLeft } from './pinLock.js';
import { encryptBackup, decryptBackup, isEncryptedBackup } from './backup.js';
import { weeklyReport } from './reports.js';
import { badgesFor } from './achievements.js';

const SAT = '2026-11-14'; // sábado
const base = (allowance = 2000) => {
  const s = newState({ pin: '1234', allowanceWeekday: 6 });
  return E.addKid(s, { name: 'Ana', age: 9, emoji: '🦊', color: 'indigo', allowance }, '2026-11-10');
};
const kid = (s) => s.kids[0];
const total = (k) => jarsTotal(k.jars) + k.bank;

describe('dinheiro', () => {
  it('divide nos potes sem perder centavo', () => {
    for (const c of [1, 7, 999, 1001, 2000, 12345]) {
      const p = splitIntoJars(c, { gastar: 50, poupar: 35, doar: 15 });
      expect(p.gastar + p.poupar + p.doar).toBe(c);
    }
  });
  it('pote com 0% não recebe nada', () => {
    expect(splitIntoJars(1000, { gastar: 60, poupar: 40, doar: 0 })).toEqual({ gastar: 600, poupar: 400, doar: 0 });
  });
  it('converte texto em centavos', () => {
    expect(toCents('12,50')).toBe(1250);
    expect(toCents('1.234,56')).toBe(123456);
    expect(toCents('7.5')).toBe(750);
    expect(toCents('abc')).toBeNaN();
  });
});

describe('datas', () => {
  it('semana começa na segunda', () => {
    expect(weekKey('2026-11-17')).toBe('2026-11-16');
    expect(weekKey('2026-11-22')).toBe('2026-11-16'); // domingo
  });
  it('lista meses seguintes', () => {
    expect(monthsAfter('2026-11', '2027-02')).toEqual(['2026-12', '2027-01', '2027-02']);
    expect(monthsAfter('2026-11', '2026-11')).toEqual([]);
  });
});

describe('mesada automática', () => {
  it('paga no dia configurado e divide nos potes', () => {
    const { state, events } = E.runAutomations(base(), SAT);
    expect(total(kid(state))).toBe(2000);
    expect(kid(state).jars).toEqual({ gastar: 1000, poupar: 800, doar: 200 });
    expect(events[0]).toMatchObject({ type: 'mesada', amount: 2000 });
  });
  it('não paga duas vezes no mesmo dia', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.runAutomations(s, SAT).state;
    expect(total(kid(s))).toBe(2000);
  });
  it('paga semanas atrasadas se o app ficou fechado', () => {
    const s = E.runAutomations(base(), addDays(SAT, 14)).state;
    expect(total(kid(s))).toBe(6000);
  });
  it('não paga fora do dia', () => {
    const s = E.runAutomations(base(), '2026-11-13').state;
    expect(total(kid(s))).toBe(0);
  });
});

describe('banco e juros', () => {
  it('juros compostos no virar do mês, uma vez só', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.updateKidSettings(s, kid(s).id, { interestBps: 300 }); // taxa explícita: 3%
    s = E.depositBank(s, kid(s).id, 800, SAT);
    s = E.runAutomations(s, '2026-12-01').state; // dez: 3% de 800 = 24
    expect(kid(s).bank).toBe(824);
    s = E.runAutomations(s, '2026-12-02').state;
    expect(kid(s).bank).toBe(824);
    expect(kid(s).interestEarned).toBe(24);
  });
  it('não deixa depositar mais do que tem no Poupar', () => {
    const s = E.runAutomations(base(), SAT).state;
    expect(() => E.depositBank(s, kid(s).id, 801, SAT)).toThrow(E.RuleError);
  });
  it('depósito não muda o total, só o lugar', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.depositBank(s, kid(s).id, 500, SAT);
    expect(total(kid(s))).toBe(2000);
    expect(kid(s).bank).toBe(500);
  });
});

describe('pedidos', () => {
  it('gasto aprovado sai do pote certo', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.createRequest(s, { kidId: kid(s).id, type: 'gastar', amount: 300, title: 'Gibi', emoji: '📗' }, SAT);
    s = E.resolveRequest(s, s.requests[0].id, true, SAT);
    expect(kid(s).jars.gastar).toBe(700);
    expect(s.requests).toHaveLength(0);
  });
  it('recusado não mexe no saldo', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.createRequest(s, { kidId: kid(s).id, type: 'doar', amount: 200, title: 'Abrigo', emoji: '🐶' }, SAT);
    s = E.resolveRequest(s, s.requests[0].id, false, SAT);
    expect(total(kid(s))).toBe(2000);
  });
  it('não aceita pedido maior que o pote', () => {
    const s = E.runAutomations(base(), SAT).state;
    expect(() => E.createRequest(s, { kidId: kid(s).id, type: 'gastar', amount: 1001, title: 'x' }, SAT)).toThrow();
  });
  it('realizar meta usa Poupar e depois banco', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.depositBank(s, kid(s).id, 500, SAT);
    s = E.setGoal(s, kid(s).id, { title: 'Bola', emoji: '⚽', target: 700 });
    s = E.createRequest(s, { kidId: kid(s).id, type: 'meta', amount: 700, title: 'Bola' }, SAT);
    s = E.resolveRequest(s, s.requests[0].id, true, SAT);
    expect(kid(s).jars.poupar).toBe(0);
    expect(kid(s).bank).toBe(100);
    expect(kid(s).goal).toBeNull();
    expect(kid(s).stats.goalsReached).toBe(1);
  });
});

describe('tarefas e trabalhos', () => {
  it('tarefa da família NÃO gera dinheiro nem estrelas', () => {
    let s = base();
    const t = kid(s).familyTasks[0];
    s = E.toggleFamilyTask(s, kid(s).id, t.id, SAT);
    expect(total(kid(s))).toBe(0);
    expect(kid(s).stars).toBe(0);
    expect(kid(s).taskLog[SAT]).toEqual([t.id]);
  });
  it('trabalho extra só paga depois da aprovação', () => {
    let s = E.addJob(base(), { title: 'Lavar carro', emoji: '🚗', reward: 500 });
    s = E.markJobDone(s, s.jobs[0].id, kid(s).id, SAT);
    expect(total(kid(s))).toBe(0);
    s = E.resolveJob(s, s.jobs[0].id, true, SAT);
    expect(total(kid(s))).toBe(500);
    expect(s.jobs).toHaveLength(0);
  });
  it('trabalho recorrente volta a ficar disponível', () => {
    let s = E.addJob(base(), { title: 'Regar', emoji: '🪴', reward: 200, recurring: true });
    s = E.markJobDone(s, s.jobs[0].id, kid(s).id, SAT);
    s = E.resolveJob(s, s.jobs[0].id, true, SAT);
    expect(s.jobs[0].status).toBe('aberto');
  });
});

describe('gamificação', () => {
  it('missão só é resgatada depois de feita, uma vez', () => {
    let s = base();
    expect(() => E.claimMission(s, kid(s).id, 'licao', SAT)).toThrow();
    s = E.completeLesson(s, kid(s).id, 'origem', SAT);
    s = E.claimMission(s, kid(s).id, 'licao', SAT);
    expect(kid(s).stars).toBe(20 + 15);
    expect(() => E.claimMission(s, kid(s).id, 'licao', SAT)).toThrow();
  });
  it('sequência conta semanas e tolera a semana atual em aberto', () => {
    let s = base();
    for (const d of ['2026-11-02', '2026-11-09']) {
      s = E.completeLesson(s, kid(s).id, d, d); // id qualquer, só para marcar atividade
      s = E.claimMission(s, kid(s).id, 'licao', d);
    }
    expect(E.weekStreak(kid(s), '2026-11-17')).toBe(2);
  });
  it('nível sobe com estrelas ganhas', () => {
    expect(E.levelFor(0)).toBe(1);
    expect(E.levelFor(49)).toBe(1);
    expect(E.levelFor(50)).toBe(2);
    expect(E.levelFor(150)).toBe(3);
    expect(E.starsForLevel(3)).toBe(150);
  });
  it('libera uma lição por semana', () => {
    const k = kid(base());
    expect(E.lessonsUnlocked(k, '2026-11-10', LESSONS.length)).toBe(1);
    expect(E.lessonsUnlocked(k, '2026-11-17', LESSONS.length)).toBe(2);
  });
});

describe('demonstração', () => {
  it('monta sem erro e com contas fechando', () => {
    const today = '2026-11-17';
    const s = buildDemo(today);
    expect(s.kids).toHaveLength(2);
    for (const k of s.kids) expect(total(k)).toBeGreaterThan(0);
    expect(s.requests).toHaveLength(1);
    expect(weekdayOf(today)).toBeTypeOf('number');
  });
});

// ---------------------------------------------------------------------------
// v2: melhorias baseadas em evidência (docs/PESQUISA.md, "Atualização de nov/2026")
// ---------------------------------------------------------------------------
describe('juros: bônus da família', () => {
  it('criança nova começa em 1% ao mês', () => {
    expect(DEFAULT_INTEREST_BPS).toBe(100);
    expect(kid(base()).interestBps).toBe(100);
  });
  it('R$ 100 por 12 meses a 1% a.m. = R$ 112,68 (referência do cartão de realidade)', () => {
    expect(Math.round(10000 * Math.pow(1.01, 12))).toBe(11268);
  });
  it('migração v1→v2 preserva a taxa antiga de 3% e acrescenta campos', () => {
    const v1 = { ...base(), version: 1 };
    delete v1.reviews;
    v1.kids = v1.kids.map((k) => ({ ...k, interestBps: 300 }));
    delete v1.settings.wishWait;
    const m = migrate(v1);
    expect(m.version).toBe(SCHEMA_VERSION);
    expect(m.kids[0].interestBps).toBe(300);
    expect(m.reviews).toEqual([]);
    expect(m.settings.wishWait.bigDays).toBe(7);
  });
  it('formato desconhecido recomeça do zero', () => {
    expect(migrate({ version: 99, kids: [] })).toBeNull();
  });
});

describe('sequência elástica (sem punição)', () => {
  const k0 = () => kid(base());
  const withWeeks = (weeks) => ({ ...k0(), claimedMissions: Object.fromEntries(weeks.map((w) => [w, ['licao']])) });
  const today = '2026-11-17'; // semana de 2026-11-16
  it('conta semanas ativas seguidas', () => {
    expect(E.weekStreak(withWeeks(['2026-11-16', '2026-11-09', '2026-11-02']), today)).toBe(3);
  });
  it('pular UMA semana não zera', () => {
    expect(E.weekStreak(withWeeks(['2026-11-16', '2026-11-02', '2026-10-26']), today)).toBe(3);
  });
  it('duas semanas vazias seguidas encerram a contagem', () => {
    expect(E.weekStreak(withWeeks(['2026-11-16', '2026-10-26', '2026-10-19']), today)).toBe(1);
  });
  it('semana atual em andamento não quebra a sequência', () => {
    expect(E.weekStreak(withWeeks(['2026-11-09', '2026-11-02']), today)).toBe(2);
  });
});

describe('espera do desejo proporcional ao preço', () => {
  const s0 = () => E.runAutomations(base(2000), SAT).state; // mesada R$ 20
  it('barato: 1 dia; médio: 3 dias; caro: 7 dias', () => {
    const s = s0();
    expect(E.wishWaitDays(s, kid(s), 1500)).toBe(1);
    expect(E.wishWaitDays(s, kid(s), 5000)).toBe(3);
    expect(E.wishWaitDays(s, kid(s), 15000)).toBe(7);
    expect(E.wishWaitDays(s, kid(s), 0)).toBe(1);
  });
  it('o item fica bloqueado até o prazo e guarda o prazo da época', () => {
    let s = s0();
    s = E.addWish(s, kid(s).id, { title: 'Patins', emoji: '🛼', price: 15000 }, SAT);
    const w = kid(s).wishes[0];
    expect(w.waitDays).toBe(7);
    expect(E.wishReady(w, addDays(SAT, 6))).toBe(false);
    expect(E.wishDaysLeft(w, addDays(SAT, 6))).toBe(1);
    expect(E.wishReady(w, addDays(SAT, 7))).toBe(true);
  });
  it('configuração dos pais vale, e o mínimo é sempre 1 dia', () => {
    let s = s0();
    s = { ...s, settings: { ...s.settings, wishWait: { ...s.settings.wishWait, smallDays: 0, bigDays: 14 } } };
    expect(E.wishWaitDays(s, kid(s), 1000)).toBe(1);
    expect(E.wishWaitDays(s, kid(s), 15000)).toBe(14);
  });
  it('desejo antigo (sem waitDays) segue valendo 1 dia', () => {
    expect(E.wishReady({ date: '2026-11-10' }, '2026-11-11')).toBe(true);
  });
});

describe('reflexões (sem estrelas, sem nota)', () => {
  const approved = (type) => {
    let s = E.runAutomations(base(2000), SAT).state;
    s = E.createRequest(s, { kidId: kid(s).id, type, amount: 150, title: type === 'doar' ? 'Abrigo' : 'Picolé', emoji: '🍦' }, SAT);
    return E.resolveRequest(s, s.requests[0].id, true, SAT);
  };
  it('gasto gera pergunta "valeu a pena?" só 7 dias depois', () => {
    const s = approved('gastar');
    expect(E.pendingReviews(s, kid(s).id, SAT)).toHaveLength(0);
    expect(E.pendingReviews(s, kid(s).id, addDays(SAT, 7))).toHaveLength(1);
  });
  it('doação gera reflexão na hora', () => {
    const s = approved('doar');
    expect(E.pendingReviews(s, kid(s).id, SAT)).toHaveLength(1);
  });
  it('responder não dá estrelas nem dinheiro', () => {
    let s = approved('doar');
    const before = { stars: kid(s).stars, total: total(kid(s)) };
    s = E.answerReview(s, s.reviews[0].id, 'bom', SAT);
    expect(kid(s).stars).toBe(before.stars);
    expect(total(kid(s))).toBe(before.total);
    expect(E.pendingReviews(s, kid(s).id, SAT)).toHaveLength(0);
    expect(E.reviewSummary(s, kid(s).id).doacao.bom).toBe(1);
  });
  it('resposta inválida é recusada', () => {
    const s = approved('doar');
    expect(() => E.answerReview(s, s.reviews[0].id, 'xyz', SAT)).toThrow(E.RuleError);
  });
});

describe('recompensas: ajudar e doar NÃO dão estrelas', () => {
  it('doação aprovada não altera estrelas', () => {
    let s = E.runAutomations(base(2000), SAT).state;
    s = E.createRequest(s, { kidId: kid(s).id, type: 'doar', amount: 200, title: 'Abrigo', emoji: '🐶' }, SAT);
    s = E.resolveRequest(s, s.requests[0].id, true, SAT);
    expect(kid(s).stars).toBe(0);
    expect(kid(s).starsEarned).toBe(0);
  });
  it('tarefa de casa e obrigado não alteram estrelas', () => {
    let s = base();
    const t = kid(s).familyTasks[0].id;
    s = E.toggleFamilyTask(s, kid(s).id, t, SAT);
    s = E.thankKid(s, kid(s).id);
    expect(kid(s).stars).toBe(0);
  });
});

describe('trilha de lições', () => {
  it('tem 17 lições, todas com quiz válido nas duas versões e conversa para os pais', () => {
    expect(LESSONS).toHaveLength(17);
    for (const l of LESSONS) {
      for (const v of [l.little, l.big]) {
        expect(v.options.length).toBeGreaterThanOrEqual(2);
        expect(v.correct).toBeLessThan(v.options.length);
      }
      expect(l.talk.length).toBeGreaterThan(10);
    }
  });
  it('inclui os temas que faltavam (troco, orçamento, inflação, jogos, golpes)', () => {
    const ids = LESSONS.map((l) => l.id);
    for (const id of ['troco', 'orcamento', 'inflacao', 'jogos', 'golpes']) expect(ids).toContain(id);
  });
  it('"Trilha completa" depende do total de lições, não de um número fixo', () => {
    const k = { ...kid(base()), lessonsDone: LESSONS.slice(0, 12).map((l) => ({ id: l.id, date: SAT })) };
    expect(badgesFor(k, base(), SAT).some((b) => b.id === 'sabio')).toBe(false);
    const all = { ...k, lessonsDone: LESSONS.map((l) => ({ id: l.id, date: SAT })) };
    expect(badgesFor(all, base(), SAT).some((b) => b.id === 'sabio')).toBe(true);
  });
});

describe('PIN: bloqueio progressivo', () => {
  it('as 4 primeiras tentativas erradas não bloqueiam; a 5ª bloqueia 30 s', () => {
    let lock = emptyLock();
    for (let i = 0; i < 4; i++) lock = registerFail(lock, 1000);
    expect(isLocked(lock, 1000)).toBe(false);
    expect(triesLeft(lock)).toBe(1);
    lock = registerFail(lock, 1000);
    expect(secondsLeft(lock, 1000)).toBe(30);
    expect(isLocked(lock, 1000 + 29_000)).toBe(true);
    expect(isLocked(lock, 1000 + 30_000)).toBe(false);
  });
  it('o bloqueio cresce a cada erro seguinte', () => {
    let lock = emptyLock();
    for (let i = 0; i < 6; i++) lock = registerFail(lock, 0);
    expect(secondsLeft(lock, 0)).toBe(60);
  });
});

describe('backup criptografado', () => {
  it('ida e volta com a senha certa; ilegível em texto puro', async () => {
    const state = base();
    const env = await encryptBackup(state, 'segredo-da-familia');
    expect(isEncryptedBackup(env)).toBe(true);
    expect(JSON.stringify(env)).not.toContain('Ana');
    expect(await decryptBackup(env, 'segredo-da-familia')).toEqual(state);
  });
  it('senha errada não abre', async () => {
    const env = await encryptBackup(base(), 'certa');
    await expect(decryptBackup(env, 'errada')).rejects.toThrow('Senha incorreta');
  });
  it('JSON antigo (sem criptografia) não é tratado como criptografado', () => {
    expect(isEncryptedBackup(base())).toBe(false);
  });
});

describe('resumo semanal para os pais', () => {
  it('gera texto com os números da semana e uma conversa sugerida', () => {
    let s = E.runAutomations(base(2000), SAT).state;
    s = E.depositBank(s, kid(s).id, 500, SAT);
    s = E.completeLesson(s, kid(s).id, 'origem', SAT);
    const txt = weeklyReport(s, kid(s), SAT);
    expect(txt).toContain('Ana');
    expect(txt).toContain('R$ 5');
    expect(txt).toContain('De onde vem o dinheiro?');
    expect(txt).toContain('Conversa sugerida');
  });
});

describe('demonstração v2', () => {
  it('não abre com modal de conquistas (já vistas) e marca o estado como demo', () => {
    const s = buildDemo('2026-11-17');
    expect(s.isDemo).toBe(true);
    for (const k of s.kids) expect(k.seenBadges.length).toBe(badgesFor(k, s, '2026-11-17').length);
  });
});
