import { useMemo, useState } from 'react';
import { useStore } from '../../store.jsx';
import { Card, Button, Progress, Speak, SectionTitle, Empty, Avatar, confetti, cx, color } from '../../ui/kit.jsx';
import { Garden } from '../../ui/money-visuals.jsx';
import { brlShort } from '../../domain/money.js';
import { daysBetween, formatDate } from '../../domain/dates.js';
import * as E from '../../domain/engine.js';
import { LESSONS } from '../../domain/lessons.js';
import { MARKET_REF } from '../../domain/config.js';
import { BADGES } from '../../domain/achievements.js';
import { SHOP } from '../../domain/shop.js';
import { BankModal, GoalModal, WishModal, SpendModal } from './modals.jsx';

// ---------------------------------------------------------------------------
// BANCO + FAZENDINHA
// ---------------------------------------------------------------------------
export function BankPage({ kid, little }) {
  const [modal, setModal] = useState(null);
  const rate = (kid.interestBps / 100).toLocaleString('pt-BR');
  const nextMonthInterest = Math.round((kid.bank * kid.interestBps) / 10000);
  const c = color(kid.color);
  return (
    <div className="space-y-4 fade-in">
      {!little && (
        // Cartão virtual: simula o mundo real sem número de cartão realista.
        <div className={cx('rounded-3xl p-5 text-white shadow-card bg-gradient-to-br relative overflow-hidden', c.grad)}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-white/5" aria-hidden />
          <div className="relative">
            <div className="flex justify-between items-start">
              <p className="font-black text-lg">Poupi Banco</p>
              <span className="text-2xl" aria-hidden>📶</span>
            </div>
            <p className="text-white/70 text-xs mt-6 font-bold">SALDO NO BANCO</p>
            <p className="text-3xl font-black">{brlShort(kid.bank)}</p>
            <div className="flex justify-between items-end mt-4">
              <p className="font-bold tracking-widest uppercase">{kid.name}</p>
              <p className="text-sm font-bold">bônus da família: {rate}% ao mês</p>
            </div>
          </div>
        </div>
      )}

      <Garden bank={kid.bank} interestEarned={kid.interestEarned} little={little} />

      <Card>
        {little ? (
          <div className="flex items-center gap-3 mb-4">
            <Speak text="Quando você guarda dinheiro no banco, ele vira árvore. Todo mês, o banco te dá frutinhas, que são os juros." />
            <p className="font-bold text-slate-700">Guardou, plantou! Todo mês nascem 🍎 de bônus.</p>
          </div>
        ) : (
          <div className="mb-4 space-y-1">
            <p className="text-slate-600">Guardado no banco: <b className="text-slate-800">{brlShort(kid.bank)}</b></p>
            <p className="text-slate-600">Bônus ganho até hoje: <b className="text-emerald-600">{brlShort(kid.interestEarned)}</b></p>
            {kid.bank > 0 && <p className="text-slate-600">No dia 1º o bônus deve ser: <b className="text-emerald-600">+{brlShort(nextMonthInterest)}</b></p>}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="success" size="lg" onClick={() => setModal('deposit')} disabled={kid.jars.poupar <= 0}>{little ? '🌱 Plantar' : '⬇️ Guardar'}</Button>
          <Button variant="soft" size="lg" onClick={() => setModal('withdraw')} disabled={kid.bank <= 0}>{little ? '↩️ Tirar' : '⬆️ Tirar'}</Button>
        </div>
        {kid.jars.poupar <= 0 && <p className="text-xs text-slate-400 mt-2 text-center">O pote Poupar está vazio. A próxima mesada enche ele!</p>}
      </Card>

      {!little && kid.bank > 0 && <InterestSimulator kid={kid} />}

      {modal && <BankModal kid={kid} mode={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

/**
 * "E se eu deixar guardado?" — torna visível o crescimento exponencial
 * (Stango & Zinman, 2009). Mostra também o "cartão de realidade": quanto
 * renderia num banco de verdade, para o bônus da família não virar a
 * ideia de que o dinheiro sempre cresce tão rápido.
 */
function InterestSimulator({ kid }) {
  const grow = (bps, m) => Math.round(kid.bank * Math.pow(1 + bps / 10000, m));
  const points = [3, 6, 12].map((m) => ({ m, v: grow(kid.interestBps, m), real: grow(MARKET_REF.bps, m) }));
  const higher = kid.interestBps > MARKET_REF.bps;
  return (
    <Card>
      <SectionTitle>🔮 E se eu deixar guardado?</SectionTitle>
      <div className="grid grid-cols-3 gap-2 text-center">
        {points.map((p) => (
          <div key={p.m} className="bg-emerald-50 rounded-2xl p-3">
            <p className="text-xs font-bold text-emerald-700">{p.m} meses</p>
            <p className="font-black text-slate-800">{brlShort(p.v)}</p>
            <p className="text-xs text-emerald-600 font-bold">+{brlShort(p.v - kid.bank)}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-3">Sem colocar nem tirar nada. Os juros de um mês também rendem no mês seguinte: isso é juros compostos.</p>
      <div className="mt-3 bg-amber-50 border-2 border-amber-100 rounded-2xl p-3">
        <p className="text-sm font-black text-amber-800">🏦 E {MARKET_REF.label}?</p>
        <div className="grid grid-cols-3 gap-2 text-center mt-2">
          {points.map((p) => (
            <div key={p.m}>
              <p className="text-xs font-bold text-amber-700">{p.m} meses</p>
              <p className="font-black text-slate-800">{brlShort(p.real)}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-amber-800 mt-2">
          {higher
            ? 'O bônus da sua família é maior que o de um banco de verdade: é um presente para ajudar você a ver o dinheiro crescer. Fora de casa, o rendimento é menor.'
            : 'Um banco de verdade paga mais ou menos isso (a taxa muda com o tempo).'}
        </p>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// SONHOS: meta pessoal + lista de desejos
// ---------------------------------------------------------------------------
export function DreamsPage({ kid, little }) {
  const { state, act, today, notify } = useStore();
  const goalRequested = state.requests.some((r) => r.kidId === kid.id && r.type === 'meta');
  const [modal, setModal] = useState(null);
  const progress = E.goalProgress(kid);
  const weeks = E.weeksToGoal(kid);
  const reached = kid.goal && progress >= kid.goal.target;

  return (
    <div className="space-y-4 fade-in">
      <Card>
        <SectionTitle right={!little && <Button variant="soft" size="sm" onClick={() => setModal('goal')}>{kid.goal ? 'Editar' : '+ Criar'}</Button>}>🎯 Meu sonho</SectionTitle>
        {kid.goal ? (
          <>
            <div className="flex items-center gap-4">
              <span className={cx('float', little ? 'text-7xl' : 'text-6xl')}>{kid.goal.emoji}</span>
              <div className="flex-1">
                <p className="font-black text-xl text-slate-800">{kid.goal.title}</p>
                <p className="text-slate-500 font-semibold">{brlShort(progress)} de {brlShort(kid.goal.target)}</p>
              </div>
            </div>
            <Progress value={progress} max={kid.goal.target} className="h-5 mt-4" barClass="bg-gradient-to-r from-emerald-400 to-teal-400" label="Progresso do sonho" />
            {reached ? (
              <div className="mt-4 text-center">
                <p className="text-2xl font-black text-emerald-600 pop">Você conseguiu! 🎉</p>
                {goalRequested ? (
                  <p className="mt-3 font-bold text-slate-500">⏳ Pedido enviado. Esperando papai/mamãe!</p>
                ) : (
                <Button variant="success" size="lg" className="w-full mt-3" onClick={() => {
                  if (act(E.createRequest, { kidId: kid.id, type: 'meta', amount: kid.goal.target, title: kid.goal.title, emoji: kid.goal.emoji }, today)) {
                    confetti(); notify('🎉 Pedido enviado! Seus pais vão realizar seu sonho com o seu dinheiro.');
                  }
                }}>Realizar meu sonho</Button>
                )}
              </div>
            ) : (
              weeks !== null && (
                <p className="mt-3 text-slate-600 font-semibold">
                  {little ? `Faltam umas ${weeks} ${weeks === 1 ? 'semana' : 'semanas'} de mesada 📅` : `No ritmo da mesada, faltam ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}. Guardar mais ou fazer trabalhos extras encurta o caminho.`}
                </p>
              )
            )}
            <p className="text-xs text-slate-400 mt-3">O sonho conta o pote Poupar + o banco.</p>
          </>
        ) : little ? (
          <Empty emoji="🌟">Peça para papai ou mamãe criarem seu sonho com você!</Empty>
        ) : (
          <Empty emoji="🌟">Qual é o seu sonho? Crie uma meta com preço e acompanhe aqui.</Empty>
        )}
      </Card>

      <Card>
        <SectionTitle right={<Button variant="soft" size="sm" onClick={() => setModal('wish')}>+ Desejo</Button>}>💭 Lista de desejos</SectionTitle>
        <p className="text-sm text-slate-500 -mt-2 mb-3">{little ? 'Espere um pouquinho. Ainda quer? Então decida!' : 'Todo desejo espera um tempo (quanto mais caro, mais tempo). Depois você decide com calma: pedir ou desistir.'}</p>
        {kid.wishes.length === 0 && <Empty emoji="💭">Nenhum desejo por enquanto.</Empty>}
        <div className="space-y-2">
          {kid.wishes.map((w) => {
            const ready = E.wishReady(w, today);
            return (
              <div key={w.id} className="bg-slate-50 rounded-2xl p-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{w.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold">{w.title}</p>
                    <p className="text-xs text-slate-500">{w.price ? brlShort(w.price) + ' · ' : ''}desde {formatDate(w.date)}</p>
                  </div>
                  {!ready && (() => { const d = E.wishDaysLeft(w, today); return <span className="text-xs font-bold text-indigo-500">⏳ {d === 1 ? 'amanhã' : `em ${d} dias`}</span>; })()}
                </div>
                {ready && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Button variant="soft" size="sm" onClick={() => { act(E.giveUpWish, kid.id, w.id, today); confetti(); notify(w.price ? `👏 Boa decisão! ${brlShort(w.price)} continuam com você.` : '👏 Pensar antes é uma ótima estratégia!'); }}>🙅 Não quero mais</Button>
                    <Button variant="warm" size="sm" onClick={() => setModal({ wish: w })}>🙋 Ainda quero</Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {modal === 'goal' && <GoalModal kid={kid} onClose={() => setModal(null)} />}
      {modal === 'wish' && <WishModal kid={kid} onClose={() => setModal(null)} />}
      {modal?.wish && <SpendModal kid={kid} preset={{ ...modal.wish, wishId: modal.wish.id }} onClose={() => setModal(null)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// APRENDER: uma microlição por semana
// ---------------------------------------------------------------------------
const shuffle = (arr) => {
  const a = arr.map((x, i) => ({ ...x, i }));
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

export function LearnPage({ kid, little }) {
  const { act, today } = useStore();
  const unlocked = E.lessonsUnlocked(kid, today, LESSONS.length);
  const doneIds = kid.lessonsDone.map((l) => l.id);
  const next = LESSONS.slice(0, unlocked).find((l) => !doneIds.includes(l.id));
  const [open, setOpen] = useState(null); // lição aberta (nova ou revisão)
  const daysToNext = 7 - (daysBetween(kid.startDate, today) % 7);

  if (open) return <Lesson lesson={open} kid={kid} little={little} review={doneIds.includes(open.id)} onDone={() => setOpen(null)}
    onComplete={() => act(E.completeLesson, kid.id, open.id, today)} />;

  return (
    <div className="space-y-4 fade-in">
      <Card className={next ? 'ring-4 ring-indigo-200' : ''}>
        {next ? (
          <div className="text-center">
            <p className="text-xs font-black text-indigo-500 uppercase">Lição da semana</p>
            <div className="text-7xl my-3 float">{next.emoji}</div>
            <h2 className="text-2xl font-black text-slate-800">{next.title}</h2>
            <Button size="lg" className="w-full mt-4" onClick={() => setOpen(next)}>{little ? '▶️ Começar' : 'Começar (2 min)'}</Button>
          </div>
        ) : doneIds.length >= LESSONS.length ? (
          <Empty emoji="🦉">Você completou a trilha toda! Pode revisar quando quiser.</Empty>
        ) : (
          <Empty emoji="📅">Lição feita! A próxima chega em {daysToNext} {daysToNext === 1 ? 'dia' : 'dias'}.</Empty>
        )}
      </Card>

      <Card>
        <SectionTitle>🗺️ Minha trilha</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {LESSONS.map((l, i) => {
            const done = doneIds.includes(l.id);
            const avail = i < unlocked;
            return (
              <button key={l.id} type="button" disabled={!avail} onClick={() => setOpen(l)}
                aria-label={avail ? `${l.title}${done ? ' (feita)' : ''}` : `Lição ${i + 1}: ${l.title}, ainda bloqueada`}
                className={cx('rounded-2xl flex flex-col items-center justify-center p-1 min-h-[88px]', done ? 'bg-emerald-100' : avail ? 'bg-indigo-100' : 'bg-slate-100 opacity-60')}>
                <span className="text-3xl" aria-hidden>{avail ? l.emoji : '🔒'}</span>
                <span className="text-[11px] font-bold leading-tight text-center text-slate-700 mt-1">{l.title}</span>
                {done && <span className="text-[11px] font-black text-emerald-700">✓ feita</span>}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-3">Uma lição nova por semana: pouco e sempre ensina mais que muito de uma vez. As lições bloqueadas abrem uma por semana. Você pode revisar as que já fez quando quiser.</p>
      </Card>
    </div>
  );
}

function Lesson({ lesson, kid, little, review, onDone, onComplete }) {
  const v = little ? lesson.little : lesson.big;
  const options = useMemo(() => shuffle(v.options), [v]);
  // Prática de recuperação (Roediger & Karpicke, 2006): antes de uma lição NOVA, 1 pergunta de uma lição já feita.
  const recall = useMemo(() => {
    if (review) return null;
    const done = kid.lessonsDone.map((d) => LESSONS.find((x) => x.id === d.id)).filter((x) => x && x.id !== lesson.id);
    if (!done.length) return null;
    const pick = done[Math.floor(Math.random() * done.length)];
    const rv = little ? pick.little : pick.big;
    return { lesson: pick, v: rv, options: shuffle(rv.options) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);
  const [phase, setPhase] = useState(recall ? 'recall' : 'read');
  const [recallPick, setRecallPick] = useState(null);
  const [wrong, setWrong] = useState([]);

  const answer = (o) => {
    if (o.i === v.correct) {
      if (!review) onComplete();
      confetti();
      setPhase('done');
    } else {
      setWrong([...wrong, o.i]);
    }
  };

  return (
    <div className="fade-in">
      <Card>
        <div className="flex items-center justify-between">
          <button type="button" onClick={onDone} className="text-slate-400 font-bold min-h-[44px]">← Voltar</button>
          {review && <span className="text-xs font-bold bg-slate-100 rounded-full px-2 py-1">revisão</span>}
        </div>
        <div className="text-center text-7xl my-2">{lesson.emoji}</div>
        <h2 className="text-2xl font-black text-slate-800 text-center">{lesson.title}</h2>

        {phase === 'recall' && recall && (
          <>
            <p className="text-xs font-black text-indigo-500 uppercase text-center mt-4">Lembra da lição passada? ({recall.lesson.emoji} {recall.lesson.title})</p>
            <div className="flex gap-3 items-center mt-2">
              {little && <Speak text={`${recall.v.quiz} ${recall.v.options.map((o) => o.t).join(', ou ')}?`} />}
              <p className="font-black text-slate-800 text-xl">{recall.v.quiz}</p>
            </div>
            <div className={cx('mt-4 gap-3', little ? 'grid grid-cols-2' : 'space-y-2')}>
              {recall.options.map((o) => {
                const chosen = recallPick !== null;
                const right = o.i === recall.v.correct;
                return (
                  <button key={o.i} type="button" disabled={chosen} onClick={() => setRecallPick(o.i)}
                    className={cx('w-full rounded-2xl font-bold border-2', little ? 'p-4 flex flex-col items-center text-lg' : 'p-4 text-left',
                      !chosen ? 'bg-slate-50 border-slate-100 active:bg-indigo-50' : right ? 'bg-emerald-50 border-emerald-300' : o.i === recallPick ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-400')}>
                    {o.e && <span className={little ? 'text-5xl mb-1' : 'mr-2'}>{o.e}</span>}{o.t}
                  </button>
                );
              })}
            </div>
            {recallPick !== null && (
              <>
                <p className="text-center font-bold text-slate-600 mt-3">{recallPick === recall.v.correct ? 'Isso! Você lembrou 👏' : 'Sem problema: lembrar é treino. A resposta certa está em verde 💚'}</p>
                <Button size="lg" className="w-full mt-4" onClick={() => setPhase('read')}>{little ? 'Vamos 👉' : 'Ir para a lição nova'}</Button>
              </>
            )}
          </>
        )}

        {phase === 'read' && (
          <>
            <div className="flex gap-3 items-start mt-4">
              {little && <Speak text={v.text} />}
              <p className={cx('text-slate-700 leading-relaxed', little ? 'text-xl font-bold' : 'text-lg')}>{v.text}</p>
            </div>
            <Button size="lg" className="w-full mt-6" onClick={() => setPhase('quiz')}>{little ? 'Entendi! 👍' : 'Responder 🤔'}</Button>
          </>
        )}

        {phase === 'quiz' && (
          <>
            <div className="flex gap-3 items-center mt-4">
              {little && <Speak text={`${v.quiz} ${v.options.map((o) => o.t).join(', ou ')}?`} />}
              <p className="font-black text-slate-800 text-xl">{v.quiz}</p>
            </div>
            <div className={cx('mt-4 gap-3', little ? 'grid grid-cols-2' : 'space-y-2')}>
              {options.map((o) => {
                const isWrong = wrong.includes(o.i);
                return (
                  <button key={o.i} type="button" disabled={isWrong} onClick={() => answer(o)}
                    className={cx('w-full rounded-2xl font-bold transition border-2',
                      little ? 'p-4 flex flex-col items-center text-lg' : 'p-4 text-left',
                      isWrong ? 'bg-rose-50 border-rose-200 text-rose-300 wiggle' : 'bg-slate-50 border-slate-100 active:bg-indigo-50')}>
                    {o.e && <span className={little ? 'text-5xl mb-1' : 'mr-2'}>{o.e}</span>}
                    {o.t}
                  </button>
                );
              })}
            </div>
            {/* Errar não revela a resposta: a criança tenta de novo (persistência, sem punição). */}
            {wrong.length > 0 && <p className="text-center text-rose-500 font-bold mt-3">Quase! Tenta outra 💪</p>}
          </>
        )}

        {phase === 'done' && (
          <div className="text-center py-4">
            <div className="text-6xl pop">🎉</div>
            <p className="text-2xl font-black text-slate-800 mt-2">{review ? 'Mandou bem de novo!' : 'Você aprendeu!'}</p>
            {!review && <p className="text-amber-600 font-black mt-1">+20 ⭐</p>}
            <div className="bg-indigo-50 rounded-2xl p-4 mt-4 text-indigo-900 font-semibold">
              💬 {little ? `Conte para papai ou mamãe o que você aprendeu!` : 'Conte para sua família o que você aprendeu hoje.'}
            </div>
            <Button size="lg" className="w-full mt-4" onClick={onDone}>Voltar</Button>
          </div>
        )}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EU: avatar, loja (estrelas), conquistas
// ---------------------------------------------------------------------------
export function MePage({ kid, little, badges }) {
  const { act, notify } = useStore();
  const level = E.levelFor(kid.starsEarned);
  const from = E.starsForLevel(level);
  const to = E.starsForLevel(level + 1);
  const earned = new Set(badges.map((b) => b.id));
  const wearing = SHOP.find((i) => i.id === kid.wearing)?.emoji;

  return (
    <div className="space-y-4 fade-in">
      <Card className="text-center">
        <Avatar kid={kid} item={wearing} size="text-8xl" className="mt-4 float" />
        <h2 className="text-2xl font-black text-slate-800 mt-2">{kid.name}</h2>
        <p className="text-slate-500 font-bold">Nível {level} · ⭐ {kid.stars} para gastar</p>
        <Progress value={kid.starsEarned - from} max={to - from} className="mt-3" label="Progresso do nível" />
        <p className="text-xs text-slate-400 mt-1">Faltam {to - kid.starsEarned} ⭐ para o nível {level + 1}</p>
        <p className="text-xs text-slate-400 mt-3">{little ? 'Ganhe ⭐ aprendendo e com as missões.' : 'Estrelas vêm de aprender e de missões. Gastar estrelas na loja não baixa seu nível.'}</p>
      </Card>

      <Card>
        <SectionTitle>🛍️ Loja de estrelas</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {SHOP.map((item) => {
            const owned = kid.owned.includes(item.id);
            const worn = kid.wearing === item.id;
            const can = kid.stars >= item.price;
            return (
              <button key={item.id} type="button"
                onClick={() => {
                  if (owned) act(E.wearItem, kid.id, item.id);
                  else if (can && act(E.buyItem, kid.id, item)) { confetti(); notify(`${item.emoji} É seu!`); }
                }}
                className={cx('rounded-2xl p-3 flex flex-col items-center border-2 transition', worn ? 'border-indigo-400 bg-indigo-50' : owned ? 'border-transparent bg-indigo-50/50' : 'border-transparent bg-slate-50', !owned && !can && 'opacity-50')}>
                <span className="text-4xl">{item.emoji}</span>
                <span className="text-xs font-bold mt-1 text-slate-700">{item.name}</span>
                <span className={cx('text-xs font-black mt-1', owned ? 'text-indigo-500' : 'text-amber-600')}>
                  {worn ? 'Usando' : owned ? 'Usar' : `${item.price}⭐`}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <SectionTitle>🏆 Conquistas ({earned.size}/{BADGES.length})</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {BADGES.map((b) => (
            <div key={b.id} className={cx('rounded-2xl p-3 text-center', earned.has(b.id) ? 'bg-amber-50' : 'bg-slate-50 grayscale opacity-50')}>
              <div className="text-3xl">{b.emoji}</div>
              <div className="text-[11px] font-bold text-slate-600 mt-1 leading-tight">{b.title}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
