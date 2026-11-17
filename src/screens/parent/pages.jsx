import { useState } from 'react';
import { useStore } from '../../store.jsx';
import { Card, Button, Modal, Field, MoneyInput, SectionTitle, Empty, EmojiPicker, PinPad, PasswordModal, Progress, inputClass, confetti, cx, color } from '../../ui/kit.jsx';
import { brlShort, toCents, centsToInput } from '../../domain/money.js';
import { WEEKDAYS, formatDate } from '../../domain/dates.js';
import * as E from '../../domain/engine.js';
import { uid, hashPin } from '../../domain/ids.js';
import { PARENT_LESSONS, PARENT_LEVELS } from '../../domain/parentLessons.js';
import { isLittle } from '../../domain/state.js';
import { exportBackup, readBackup, clearState } from '../../storage.js';
import { KidForm } from '../Onboarding.jsx';
import { GoalModal } from '../kid/modals.jsx';
import { PrivacyModal } from '../Privacy.jsx';
import { DEFAULT_WISH_WAIT, INTEREST_WARN_BPS, MARKET_REF } from '../../domain/config.js';

const TASK_EMOJIS = ['🛏️', '🧸', '🍽️', '♻️', '🧺', '🐶', '🪴', '👟', '🧹', '📚', '🦷', '🚗'];

// ---------------------------------------------------------------------------
// TAREFAS: contribuição (sem pagamento) × trabalhos extras (pagos)
// ---------------------------------------------------------------------------
export function TasksPage() {
  const { state, act } = useStore();
  const [kidId, setKidId] = useState(state.kids[0]?.id);
  const [jobModal, setJobModal] = useState(false);
  const kid = E.getKid(state, kidId);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState(TASK_EMOJIS[0]);

  const addTask = () => {
    if (!title.trim()) return;
    act(E.setFamilyTasks, kid.id, [...kid.familyTasks, { id: uid('ft'), title: title.trim(), emoji }]);
    setTitle('');
  };

  return (
    <div className="space-y-4 fade-in">
      <Card className="bg-amber-50 border-2 border-amber-100">
        <p className="text-sm text-amber-900">
          <b>Por que dois tipos?</b> Ajudar em casa faz parte de ser família e <b>não é pago</b>: pagar por isso tende a reduzir a ajuda espontânea (Warneken & Tomasello, 2008). <b>Trabalhos extras</b> são opcionais e pagos: ensinam que trabalho gera renda. Veja a lição “Não pague para ajudar em casa” na Jornada.
        </p>
      </Card>

      <Card>
        <SectionTitle>🏡 Ajudar em casa (sem pagamento)</SectionTitle>
        <KidTabs kidId={kidId} setKidId={setKidId} />
        {kid && (
          <>
            <div className="space-y-2 mt-3">
              {kid.familyTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2">
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="flex-1 font-semibold">{t.title}</span>
                  <button type="button" aria-label={`Remover ${t.title}`} className="text-slate-400 font-bold px-2 min-h-[40px]"
                    onClick={() => act(E.setFamilyTasks, kid.id, kid.familyTasks.filter((x) => x.id !== t.id))}>✕</button>
                </div>
              ))}
              {kid.familyTasks.length === 0 && <Empty emoji="🏡">Nenhuma tarefa.</Empty>}
            </div>
            <div className="mt-4 space-y-2">
              <EmojiPicker options={TASK_EMOJIS} value={emoji} onChange={setEmoji} size="text-2xl" />
              <div className="flex gap-2">
                <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nova tarefa" maxLength={40} />
                <Button onClick={addTask} disabled={!title.trim()}>+</Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Card>
        <SectionTitle right={<Button size="sm" onClick={() => setJobModal(true)}>+ Novo</Button>}>💼 Trabalhos extras (pagos)</SectionTitle>
        {state.jobs.length === 0 && <Empty emoji="💼">Ofereça um trabalho opcional, como lavar o carro.</Empty>}
        <div className="space-y-2">
          {state.jobs.map((j) => (
            <div key={j.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2">
              <span className="text-2xl">{j.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold">{j.title}</p>
                <p className="text-xs text-slate-500">
                  {brlShort(j.reward)} · {j.kidId ? `só ${E.getKid(state, j.kidId)?.name}` : 'qualquer criança'}{j.recurring ? ' · repete' : ''}
                  {j.status === 'feito' && ' · aguardando sua aprovação'}
                </p>
              </div>
              <button type="button" aria-label={`Remover ${j.title}`} className="text-slate-400 font-bold px-2 min-h-[40px]" onClick={() => act(E.removeJob, j.id)}>✕</button>
            </div>
          ))}
        </div>
      </Card>

      {jobModal && <JobModal onClose={() => setJobModal(false)} />}
    </div>
  );
}

function KidTabs({ kidId, setKidId, all }) {
  const { state } = useStore();
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {all && (
        <button type="button" onClick={() => setKidId('all')} className={cx('px-4 min-h-[44px] rounded-xl font-bold shrink-0', kidId === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600')}>Todos</button>
      )}
      {state.kids.map((k) => (
        <button key={k.id} type="button" onClick={() => setKidId(k.id)}
          className={cx('px-4 min-h-[44px] rounded-xl font-bold shrink-0', kidId === k.id ? `bg-gradient-to-br text-white ${color(k.color).grad}` : 'bg-slate-100 text-slate-600')}>
          {k.emoji} {k.name}
        </button>
      ))}
    </div>
  );
}

function JobModal({ onClose }) {
  const { state, act } = useStore();
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🚗');
  const [reward, setReward] = useState('');
  const [kidId, setKidId] = useState(null);
  const [recurring, setRecurring] = useState(false);
  const cents = toCents(reward);
  const save = () => {
    if (act(E.addJob, { title: title.trim(), emoji, reward: cents, kidId, recurring })) onClose();
  };
  return (
    <Modal title="Novo trabalho extra" onClose={onClose}>
      <div className="space-y-4">
        <Field label="O que é"><input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: lavar o carro com o papai" maxLength={40} /></Field>
        <EmojiPicker options={['🚗', '🪴', '🍂', '🧽', '📦', '🐕', '🧺', '🪟', '🍰', '📚']} value={emoji} onChange={setEmoji} size="text-2xl" />
        <Field label="Pagamento" hint="Será dividido nos 3 potes automaticamente."><MoneyInput value={reward} onChange={setReward} /></Field>
        <Field label="Para quem">
          <div className="flex gap-2 flex-wrap">
            <button type="button" onClick={() => setKidId(null)} className={cx('px-3 min-h-[40px] rounded-xl font-bold', !kidId ? 'bg-indigo-500 text-white' : 'bg-slate-100')}>Qualquer um</button>
            {state.kids.map((k) => (
              <button key={k.id} type="button" onClick={() => setKidId(k.id)} className={cx('px-3 min-h-[40px] rounded-xl font-bold', kidId === k.id ? 'bg-indigo-500 text-white' : 'bg-slate-100')}>{k.emoji} {k.name}</button>
            ))}
          </div>
        </Field>
        <label className="flex items-center gap-3 font-semibold text-slate-700">
          <input type="checkbox" className="w-5 h-5 accent-indigo-500" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
          Repete (continua disponível depois de pago)
        </label>
        <Button size="lg" className="w-full" disabled={!title.trim() || !(cents > 0)} onClick={save}>Oferecer</Button>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// JORNADA DOS PAIS — gamificação leve para os adultos
// ---------------------------------------------------------------------------
export function JourneyPage() {
  const { state, today } = useStore();
  const [open, setOpen] = useState(null);
  const p = state.parent;
  const level = E.parentLevelFor(p.xp);
  const title = PARENT_LEVELS[Math.min(level - 1, PARENT_LEVELS.length - 1)];
  const streak = E.parentTalkStreak(state, today);
  const done = new Set(p.lessonsDone.map((l) => l.id));

  if (open) return <ParentLesson lesson={open} onBack={() => setOpen(null)} />;

  return (
    <div className="space-y-4 fade-in">
      <Card className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
        <p className="text-white/70 text-xs font-bold uppercase">Jornada dos Pais</p>
        <p className="text-2xl font-black">Nível {level} · {title}</p>
        <Progress value={p.xp % 150} max={150} className="mt-3 !bg-white/25" barClass="bg-white" label="XP da jornada" />
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="bg-white/15 rounded-2xl p-2"><p className="text-xl font-black">{p.lessonsDone.length}/{PARENT_LESSONS.length}</p><p className="text-[11px] font-bold text-white/80">lições</p></div>
          <div className="bg-white/15 rounded-2xl p-2"><p className="text-xl font-black">{p.challengesDone.length}</p><p className="text-[11px] font-bold text-white/80">desafios</p></div>
          <div className="bg-white/15 rounded-2xl p-2"><p className="text-xl font-black">{p.talks.length}</p><p className="text-[11px] font-bold text-white/80">papos{streak > 1 ? ` · 🔥${streak}` : ''}</p></div>
        </div>
      </Card>

      <Card className="text-sm text-slate-600">
        <p><b>Como funciona:</b> lições de 2–3 minutos sobre psicologia do dinheiro e sobre <b>por que o Poupi funciona assim</b>. Cada uma tem um desafio prático. XP: lição +30, desafio +40, papo da semana +25. Sem cobrança diária — faça no seu ritmo.</p>
      </Card>

      <div className="space-y-2">
        {PARENT_LESSONS.map((l, i) => (
          <button key={l.id} type="button" onClick={() => setOpen(l)}
            className="w-full bg-white rounded-2xl shadow-soft p-4 flex items-center gap-3 text-left active:scale-[.99] transition">
            <span className={cx('w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0', done.has(l.id) ? 'bg-emerald-100' : 'bg-indigo-50')}>{l.emoji}</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400">Lição {i + 1} · {l.minutes} min</p>
              <p className="font-bold text-slate-800 leading-tight">{l.title}</p>
            </div>
            <span className="text-sm font-black">{p.challengesDone.includes(l.id) ? '🏅' : done.has(l.id) ? '✅' : '›'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ParentLesson({ lesson, onBack }) {
  const { state, act, today, notify } = useStore();
  const done = state.parent.lessonsDone.some((l) => l.id === lesson.id);
  const challengeDone = state.parent.challengesDone.includes(lesson.id);
  const [answer, setAnswer] = useState(null);
  const correct = answer === lesson.quiz.correct;

  return (
    <div className="space-y-4 fade-in">
      <Card>
        <button type="button" onClick={onBack} className="text-slate-400 font-bold min-h-[44px]">← Jornada</button>
        <div className="text-5xl mt-1">{lesson.emoji}</div>
        <h2 className="text-2xl font-black text-slate-800 mt-2">{lesson.title}</h2>
        <p className="text-slate-700 leading-relaxed mt-3">{lesson.body}</p>
      </Card>

      <Card className="bg-slate-50">
        <p className="text-xs font-black text-slate-400 uppercase mb-1">🔬 O que diz a pesquisa</p>
        <p className="text-sm text-slate-700 leading-relaxed">{lesson.evidence}</p>
      </Card>

      <Card className="bg-indigo-50">
        <p className="text-xs font-black text-indigo-400 uppercase mb-1">🐷 Por que o Poupi faz assim</p>
        <p className="text-sm text-indigo-900 leading-relaxed">{lesson.inApp}</p>
      </Card>

      <Card>
        <p className="font-black text-slate-800 mb-3">{lesson.quiz.q}</p>
        <div className="space-y-2">
          {lesson.quiz.options.map((o, i) => (
            <button key={o} type="button" onClick={() => {
              setAnswer(i);
              if (i === lesson.quiz.correct && !done) { act(E.completeParentLesson, lesson.id, today); notify('+30 XP na sua jornada'); }
            }}
              className={cx('w-full text-left p-3 rounded-xl font-semibold border-2',
                answer === i ? (i === lesson.quiz.correct ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-200') : 'bg-slate-50 border-transparent')}>
              {o}
            </button>
          ))}
        </div>
        {answer !== null && !correct && <p className="text-rose-500 font-bold mt-2 text-sm">Releia o trecho acima e tente de novo.</p>}
        {(correct || done) && <p className="text-emerald-600 font-bold mt-2 text-sm">✅ Lição concluída</p>}
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100">
        <p className="text-xs font-black text-amber-600 uppercase mb-1">🎯 Desafio da semana</p>
        <p className="font-semibold text-amber-900">{lesson.challenge}</p>
        <Button variant={challengeDone ? 'soft' : 'warm'} className="w-full mt-3" disabled={challengeDone || !done}
          onClick={() => { act(E.markChallenge, lesson.id); confetti(); notify('🏅 Desafio cumprido! +40 XP'); }}>
          {challengeDone ? '🏅 Feito!' : done ? 'Fiz o desafio' : 'Conclua a lição primeiro'}
        </Button>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAMÍLIA: meta cooperativa + placar conjunto (sem ranking entre irmãos)
// ---------------------------------------------------------------------------
export function FamilyPage() {
  const { state, act, today, notify } = useStore();
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState('');
  const g = state.familyGoal;
  const teamStars = state.kids.reduce((a, k) => a + k.starsEarned, 0);
  const teamLessons = state.kids.reduce((a, k) => a + k.lessonsDone.length, 0);
  const contributions = state.history.filter((h) => h.kind === 'familia');

  return (
    <div className="space-y-4 fade-in">
      <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
        {g ? (
          <>
            <div className="flex items-center gap-3">
              <span className="text-5xl float">{g.emoji}</span>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase text-white/80">Meta da família</p>
                <p className="text-2xl font-black">{g.title}</p>
              </div>
              <button type="button" onClick={() => setEdit(true)} className="bg-white/20 rounded-xl px-3 min-h-[40px] text-sm font-bold">Editar</button>
            </div>
            <Progress value={g.saved} max={g.target} className="mt-4 h-4 !bg-white/30" barClass="bg-white" label="Meta da família" />
            <p className="font-bold mt-2">{brlShort(g.saved)} de {brlShort(g.target)}</p>
            <div className="flex gap-2 mt-3">
              <div className="flex-1"><MoneyInput value={add} onChange={setAdd} placeholder="Contribuição dos pais" /></div>
              <Button variant="white" onClick={() => { if (act(E.contributeFamilyGoal, null, toCents(add), today)) setAdd(''); }} disabled={!(toCents(add) > 0)}>+</Button>
            </div>
            {g.saved >= g.target && (
              <Button variant="white" size="lg" className="w-full mt-3" onClick={() => { act(E.completeFamilyGoal); confetti(); notify('🎉 Meta da família realizada!'); }}>🎉 Realizamos! Concluir meta</Button>
            )}
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-5xl">🏖️</p>
            <p className="font-black text-xl mt-2">Criem uma meta juntos</p>
            <p className="text-white/85 text-sm mt-1">Um passeio, um jogo de tabuleiro, um piquenique. Cooperar ensina tanto quanto poupar sozinho.</p>
            <Button variant="white" className="mt-4" onClick={() => setEdit(true)}>Criar meta da família</Button>
          </div>
        )}
      </Card>

      {/* Placar conjunto: substitui o "ranking entre irmãos" do briefing. */}
      <Card>
        <SectionTitle>🤝 Time da família</SectionTitle>
        <p className="text-sm text-slate-500 -mt-2 mb-3">Em vez de ranking entre irmãos (que pune o mais novo), o Poupi soma o esforço de todos.</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-amber-50 rounded-2xl p-3"><p className="text-xl font-black">{teamStars}⭐</p><p className="text-[11px] font-bold text-slate-500">estrelas juntos</p></div>
          <div className="bg-indigo-50 rounded-2xl p-3"><p className="text-xl font-black">{teamLessons}</p><p className="text-[11px] font-bold text-slate-500">lições</p></div>
          <div className="bg-emerald-50 rounded-2xl p-3"><p className="text-xl font-black">{state.familyGoalsDone}</p><p className="text-[11px] font-bold text-slate-500">metas realizadas</p></div>
        </div>
        {contributions.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Contribuições das crianças</p>
            {contributions.slice(0, 5).map((h) => {
              const k = E.getKid(state, h.kidId);
              return <p key={h.id} className="text-sm text-slate-700">{k?.emoji} {k?.name} · {brlShort(h.amount)} · {formatDate(h.date)}</p>;
            })}
          </div>
        )}
      </Card>

      {edit && <FamilyGoalModal onClose={() => setEdit(false)} />}
    </div>
  );
}

function FamilyGoalModal({ onClose }) {
  const { state, act } = useStore();
  const g = state.familyGoal;
  const [title, setTitle] = useState(g?.title || '');
  const [emoji, setEmoji] = useState(g?.emoji || '🏖️');
  const [target, setTarget] = useState(g ? centsToInput(g.target) : '');
  const cents = toCents(target);
  const save = () => {
    if (!(cents > 0) || !title.trim()) return;
    act((s) => ({ ...s, familyGoal: { saved: g?.saved || 0, title: title.trim(), emoji, target: cents } }));
    onClose();
  };
  return (
    <Modal title="Meta da família" onClose={onClose}>
      <div className="space-y-4">
        <EmojiPicker options={['🏖️', '🧺', '🎳', '🎡', '🍕', '🎲', '🏕️', '🎬', '🐠', '✈️']} value={emoji} onChange={setEmoji} />
        <Field label="O que é"><input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: piquenique no parque" maxLength={40} /></Field>
        <Field label="Quanto custa"><MoneyInput value={target} onChange={setTarget} /></Field>
        <Button size="lg" className="w-full" disabled={!title.trim() || !(cents > 0)} onClick={save}>Salvar</Button>
        {g && <Button variant="ghost" className="w-full" onClick={() => { act(E.setFamilyGoal, null); onClose(); }}>Remover meta</Button>}
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// EXTRATO
// ---------------------------------------------------------------------------
const KIND_LABEL = {
  mesada: '📅', trabalho: '💼', juros: '🍎', banco: '🏦', saque: '↩️', gasto: '💸', doacao: '❤️',
  meta: '🎯', familia: '👨‍👩‍👧', entrada: '➕', desistiu: '💭', recusado: '🚫',
};

export function HistoryPage() {
  const { state } = useStore();
  const [kidId, setKidId] = useState('all');
  const [limit, setLimit] = useState(30);
  const items = state.history.filter((h) => kidId === 'all' || h.kidId === kidId);
  return (
    <div className="space-y-4 fade-in">
      <Card>
        <KidTabs kidId={kidId} setKidId={setKidId} all />
        <div className="mt-3 divide-y divide-slate-100">
          {items.length === 0 && <Empty emoji="📒">Nada por aqui ainda.</Empty>}
          {items.slice(0, limit).map((h) => {
            const k = E.getKid(state, h.kidId);
            const sign = h.effect === 'in' ? '+' : h.effect === 'out' ? '−' : '';
            return (
              <div key={h.id} className="flex items-center gap-3 py-3">
                <span className="text-2xl w-8 text-center">{KIND_LABEL[h.kind] || '•'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{h.desc}</p>
                  <p className="text-xs text-slate-400">{k?.emoji} {k?.name} · {formatDate(h.date)}</p>
                </div>
                {h.amount > 0 && (
                  <span className={cx('font-black whitespace-nowrap', h.effect === 'in' ? 'text-emerald-600' : h.effect === 'out' ? 'text-rose-500' : 'text-slate-400')}>
                    {sign}{brlShort(h.amount)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {items.length > limit && <Button variant="soft" className="w-full mt-2" onClick={() => setLimit(limit + 30)}>Ver mais</Button>}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AJUSTES
// ---------------------------------------------------------------------------
export function SettingsPage() {
  const { state, act, replace, notify, today } = useStore();
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [pinStep, setPinStep] = useState(null);
  const [goalFor, setGoalFor] = useState(null);
  const [backupAsk, setBackupAsk] = useState(false);
  const [askPass, setAskPass] = useState(null); // { resolve }
  const [privacy, setPrivacy] = useState(false);

  const restore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      replace(await readBackup(file, () => new Promise((resolve) => setAskPass({ resolve }))));
      notify('Backup restaurado!');
    } catch (err) { notify(err.message, 'error'); }
    e.target.value = '';
  };

  return (
    <div className="space-y-4 fade-in">
      <Card>
        <SectionTitle right={<Button size="sm" variant="soft" onClick={() => setAdding(true)}>+ Criança</Button>}>👧 Crianças</SectionTitle>
        <div className="space-y-2">
          {state.kids.map((k) => (
            <div key={k.id} className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
              <span className="text-3xl">{k.emoji}</span>
              <div className="flex-1">
                <p className="font-bold">{k.name}, {k.age}</p>
                <p className="text-xs text-slate-500">{brlShort(k.allowance)}/sem · potes {k.split.gastar}/{k.split.poupar}/{k.split.doar} · bônus {(k.interestBps / 100).toLocaleString('pt-BR')}% ao mês</p>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="soft" onClick={() => setEditing(k)}>Ajustar</Button>
                {isLittle(k) && <Button size="sm" variant="ghost" onClick={() => setGoalFor(k)}>🎯 Sonho</Button>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>📅 Dia da mesada</SectionTitle>
        <div className="grid grid-cols-4 gap-2">
          {WEEKDAYS.map((d, i) => (
            <button key={d} type="button" onClick={() => act((s) => ({ ...s, settings: { ...s.settings, allowanceWeekday: i } }))}
              className={cx('min-h-[44px] rounded-xl font-bold text-sm capitalize', state.settings.allowanceWeekday === i ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600')}>{d.slice(0, 3)}</button>
          ))}
        </div>
      </Card>

      <WishWaitCard />

      <Card className="space-y-3">
        <SectionTitle>🔐 Segurança e dados</SectionTitle>
        <p className="text-sm text-slate-500">Tudo fica só neste aparelho. Faça backup de vez em quando: limpar os dados do navegador apaga o Poupi.</p>
        <Button variant="soft" className="w-full" onClick={() => setPinStep('new')}>Trocar PIN</Button>
        <Button variant="soft" className="w-full" onClick={() => setBackupAsk(true)}>⬇️ Baixar backup</Button>
        <label className="w-full min-h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center cursor-pointer">
          ⬆️ Restaurar backup
          <input type="file" accept="application/json" className="hidden" onChange={restore} />
        </label>
        <p className="text-xs text-slate-500">O PIN impede que a criança entre aqui, mas não protege contra quem tem acesso ao aparelho. Depois de 5 erros, o PIN bloqueia por alguns instantes.</p>
        <Button variant="soft" className="w-full" onClick={() => setPrivacy(true)}>🔒 Privacidade: como os dados são guardados</Button>
        <Button variant="danger" className="w-full" onClick={() => {
          if (window.confirm('Apagar TODOS os dados do Poupi neste aparelho? Isso não pode ser desfeito.')) { clearState(); replace(null); }
        }}>Apagar tudo</Button>
      </Card>

      <p className="text-center text-xs text-slate-400 pb-2">Poupi 1.0 · código aberto · sem anúncios, sem rastreamento</p>

      {privacy && <PrivacyModal onClose={() => setPrivacy(false)} />}
      {backupAsk && (
        <PasswordModal title="⬇️ Baixar backup" confirm optional submitLabel="Baixar"
          hint="Opcional: crie uma senha para criptografar o arquivo. Sem a senha, não dá para abrir o backup, então guarde bem. Deixe vazio para baixar sem criptografia."
          onClose={() => setBackupAsk(false)}
          onSubmit={async (pw) => { setBackupAsk(false); try { await exportBackup(state, pw); notify(pw ? 'Backup criptografado baixado!' : 'Backup baixado!'); } catch { notify('Não foi possível criar o backup.', 'error'); } }} />
      )}
      {askPass && <PasswordModal title="🔐 Backup protegido" hint="Digite a senha criada ao baixar este backup." submitLabel="Abrir" onClose={() => { askPass.resolve(''); setAskPass(null); }} onSubmit={(pw) => { askPass.resolve(pw); setAskPass(null); }} />}
      {editing && <KidSettingsModal kid={editing} onClose={() => setEditing(null)} />}
      {goalFor && <GoalModal kid={E.getKid(state, goalFor.id)} title={`🎯 Sonho de ${goalFor.name}`} onClose={() => setGoalFor(null)} />}
      {adding && (
        <Modal title="Nova criança" onClose={() => setAdding(false)}>
          <KidForm used={state.kids.map((k) => k.color)} submitLabel="Adicionar"
            onAdd={(k) => { act(E.addKid, k, today); setAdding(false); }} />
        </Modal>
      )}
      {pinStep && (
        <Modal title="" onClose={() => setPinStep(null)}>
          <PinPad title={pinStep === 'new' ? 'Novo PIN' : 'Confirme o novo PIN'} onCancel={() => setPinStep(null)}
            error={pinStep === 'mismatch' ? 'Não bateu. Comece de novo.' : ''}
            onSubmit={(p) => {
              if (pinStep === 'new' || pinStep === 'mismatch') setPinStep({ first: p });
              else if (pinStep.first === p) { act((s) => ({ ...s, pinHash: hashPin(p) })); notify('PIN trocado!'); setPinStep(null); }
              else setPinStep('mismatch');
            }} />
        </Modal>
      )}
    </div>
  );
}

function KidSettingsModal({ kid, onClose }) {
  const { act, notify } = useStore();
  const [name, setName] = useState(kid.name);
  const [age, setAge] = useState(kid.age);
  const [allowance, setAllowance] = useState(centsToInput(kid.allowance));
  const [split, setSplit] = useState(kid.split);
  const [rate, setRate] = useState(String(kid.interestBps / 100).replace('.', ','));
  const sum = split.gastar + split.poupar + split.doar;
  const rateBps = Math.round((Number(String(rate).replace(',', '.')) || 0) * 100);
  const rateWarn = rateBps > INTEREST_WARN_BPS;
  const save = () => {
    const a = toCents(allowance);
    const r = Number(String(rate).replace(',', '.'));
    if (Number.isNaN(a) || a < 0 || !(r >= 0 && r <= 10) || !name.trim()) { notify('Confira os valores.', 'error'); return; }
    if (act(E.updateKidSettings, kid.id, { name: name.trim(), age: Number(age), allowance: a, split, interestBps: Math.round(r * 100) })) {
      notify('Salvo!');
      onClose();
    }
  };
  const remove = () => {
    if (window.confirm(`Remover ${kid.name} e todo o histórico? Não dá para desfazer.`)) { act(E.removeKid, kid.id); onClose(); }
  };
  return (
    <Modal title={`Ajustes · ${kid.name}`} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Nome"><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={20} /></Field>
        <Field label={`Idade: ${age} anos`} hint={age <= 7 ? 'Modo lúdico' : 'Modo autônomo'}>
          <input type="range" min={5} max={12} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full accent-indigo-500" />
        </Field>
        <Field label="Mesada por semana"><MoneyInput value={allowance} onChange={setAllowance} /></Field>
        <Field label={`Divisão dos potes (soma: ${sum}%)`} hint="Padrão sugerido: 50 / 40 / 10. Converse com a criança antes de mudar.">
          {['gastar', 'poupar', 'doar'].map((j) => (
            <div key={j} className="flex items-center gap-3 mt-2">
              <span className="w-20 font-bold capitalize text-slate-600">{j}</span>
              <input type="range" min={0} max={100} step={5} value={split[j]} onChange={(e) => setSplit({ ...split, [j]: Number(e.target.value) })} className="flex-1 accent-indigo-500" />
              <span className="w-12 text-right font-black">{split[j]}%</span>
            </div>
          ))}
          {sum !== 100 && <p className="text-rose-500 font-bold text-sm mt-1">Precisa somar 100%.</p>}
        </Field>
        <Field label="Bônus da família (% ao mês)" hint={`Quem "paga" esse bônus são vocês, os pais. Padrão: 1%, parecido com o de um banco de verdade (${MARKET_REF.checkedAt}). Taxas muito maiores ensinam que o dinheiro cresce rápido demais.`}>
          <input className={inputClass} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
          {rateWarn && <p className="text-amber-700 bg-amber-50 rounded-xl p-3 text-sm font-bold mt-2">⚠️ Isso é cerca de {Math.round((rateBps / MARKET_REF.bps) * 10) / 10}× o que um banco paga hoje. A criança pode achar que o dinheiro sempre cresce assim. O simulador vai mostrar a comparação com o banco de verdade.</p>}
        </Field>
        <Button size="lg" className="w-full" disabled={sum !== 100} onClick={save}>Salvar</Button>
        <Button variant="ghost" className="w-full !text-rose-500" onClick={remove}>Remover criança</Button>
      </div>
    </Modal>
  );
}


/** Espera dos desejos por faixa de preço (em "mesadas"). O mínimo é sempre 1 dia. */
function WishWaitCard() {
  const { state, act, notify } = useStore();
  const cfg = { ...DEFAULT_WISH_WAIT, ...(state.settings.wishWait || {}) };
  const [small, setSmall] = useState(String(cfg.smallDays));
  const [mid, setMid] = useState(String(cfg.midDays));
  const [big, setBig] = useState(String(cfg.bigDays));
  const n = (v) => Math.max(1, Math.min(30, Math.round(Number(v) || 1)));
  const save = () => {
    act((st) => ({ ...st, settings: { ...st.settings, wishWait: { ...cfg, smallDays: n(small), midDays: n(mid), bigDays: n(big) } } }));
    notify('Espera salva!');
  };
  const row = (label, v, set) => (
    <div className="flex items-center gap-3">
      <span className="flex-1 text-sm font-bold text-slate-600">{label}</span>
      <input className={inputClass + ' !w-20 text-center'} inputMode="numeric" aria-label={label} value={v} onChange={(e) => set(e.target.value)} />
      <span className="text-sm text-slate-500 w-10">dia(s)</span>
    </div>
  );
  return (
    <Card className="space-y-3">
      <SectionTitle>⏳ Espera dos desejos</SectionTitle>
      <p className="text-sm text-slate-500">Quanto mais caro o desejo, mais tempo ele espera antes de a criança decidir. A espera só funciona se vocês cumprirem o combinado depois: se ela ainda quiser, levem a sério o pedido.</p>
      {row(`Barato (até 1 mesada)`, small, setSmall)}
      {row(`Médio (até 4 mesadas)`, mid, setMid)}
      {row(`Caro (mais de 4 mesadas)`, big, setBig)}
      <Button variant="soft" className="w-full" onClick={save}>Salvar espera</Button>
    </Card>
  );
}
