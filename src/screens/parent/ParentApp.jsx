/**
 * PAINEL DOS PAIS — protegido por PIN.
 * Objetivo: acompanhar tudo sem planilha, aprovar o que sai de verdade
 * e, principalmente, CONVERSAR (papo da semana + Jornada dos Pais).
 */
import { useState } from 'react';
import { useStore } from '../../store.jsx';
import { Card, Button, TabBar, Modal, Field, MoneyInput, SectionTitle, Empty, Avatar, inputClass, confetti, cx, color } from '../../ui/kit.jsx';
import { Jars, JAR_INFO } from '../../ui/money-visuals.jsx';
import { brlShort, toCents } from '../../domain/money.js';
import { WEEKDAYS, nextWeekday, weekdayOf, formatDate } from '../../domain/dates.js';
import * as E from '../../domain/engine.js';
import { LESSONS } from '../../domain/lessons.js';
import { SHOP } from '../../domain/shop.js';
import { weeklyReport } from '../../domain/reports.js';
import { TasksPage, JourneyPage, FamilyPage, HistoryPage, SettingsPage } from './pages.jsx';

export default function ParentApp({ onExit }) {
  const { state } = useStore();
  const [tab, setTab] = useState('home');
  const approvals = state.requests.length + state.jobs.filter((j) => j.status === 'feito').length;
  const tabs = [
    { k: 'home', icon: '🏠', label: 'Resumo', badge: approvals },
    { k: 'tasks', icon: '✅', label: 'Tarefas' },
    { k: 'journey', icon: '🧭', label: 'Jornada' },
    { k: 'family', icon: '👨‍👩‍👧', label: 'Família' },
    { k: 'history', icon: '📒', label: 'Extrato' },
    { k: 'settings', icon: '⚙️', label: 'Ajustes' },
  ];
  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <header className="bg-gradient-to-br from-slate-800 to-indigo-900 text-white px-5 pt-6 pb-12 rounded-b-[2rem]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Área dos pais</p>
            <h1 className="text-2xl font-black">{tabs.find((t) => t.k === tab).label}</h1>
          </div>
          <button type="button" onClick={onExit} className="bg-white/15 rounded-xl px-3 min-h-[44px] text-sm font-bold">🔒 Sair</button>
        </div>
      </header>
      <main className="max-w-md mx-auto px-4 -mt-8 space-y-4">
        {tab === 'home' && <ParentHome goTo={setTab} />}
        {tab === 'tasks' && <TasksPage />}
        {tab === 'journey' && <JourneyPage />}
        {tab === 'family' && <FamilyPage />}
        {tab === 'history' && <HistoryPage />}
        {tab === 'settings' && <SettingsPage />}
      </main>
      <TabBar items={tabs} value={tab} onChange={setTab} activeClass="bg-slate-800 text-white" />
    </div>
  );
}

function ParentHome({ goTo }) {
  const { state, today, act, notify } = useStore();
  const [entry, setEntry] = useState(null); // { kid, dir }
  const doneJobs = state.jobs.filter((j) => j.status === 'feito');
  const nextAllowance = nextWeekday(today, state.settings.allowanceWeekday);
  const isAllowanceToday = weekdayOf(today) === state.settings.allowanceWeekday;

  // Papos pendentes: lições que a criança fez e ainda não viraram conversa.
  const talks = state.kids.flatMap((k) =>
    k.lessonsDone
      .filter((l) => !state.parent.talks.some((t) => t.kidId === k.id && t.lessonId === l.id))
      .map((l) => ({ kid: k, lesson: LESSONS.find((x) => x.id === l.id) }))
      .filter((x) => x.lesson),
  ).slice(0, 3);

  return (
    <div className="space-y-4 fade-in">
      {(state.requests.length > 0 || doneJobs.length > 0) ? (
        <Card className="ring-4 ring-rose-100">
          <SectionTitle>🔔 Para aprovar</SectionTitle>
          <div className="space-y-3">
            {state.requests.map((r) => {
              const k = E.getKid(state, r.kidId);
              if (!k) return null;
              const what = r.type === 'gastar' ? 'quer gastar' : r.type === 'doar' ? 'quer doar' : 'quer realizar a meta';
              return (
                <div key={r.id} className="bg-slate-50 rounded-2xl p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{r.emoji || k.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold">{k.name} {what}</p>
                      <p className="text-slate-600 text-sm">{r.title} · <b>{brlShort(r.amount)}</b></p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {r.type === 'gastar' && 'Aprovar = você entrega o dinheiro ou compra junto. Dica: aprove até escolhas que você não faria (erro barato ensina).'}
                    {r.type === 'doar' && 'Aprovar = vocês entregam a doação juntos.'}
                    {r.type === 'meta' && 'Aprovar = vocês compram o sonho com o dinheiro guardado dela/dele. Momento de celebrar!'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button variant="soft" size="sm" onClick={() => act(E.resolveRequest, r.id, false, today)}>Agora não</Button>
                    <Button variant="success" size="sm" onClick={() => { if (act(E.resolveRequest, r.id, true, today)) { confetti(); notify('Aprovado!'); } }}>Aprovar</Button>
                  </div>
                </div>
              );
            })}
            {doneJobs.map((j) => {
              const k = E.getKid(state, j.doneBy);
              if (!k) return null;
              return (
                <div key={j.id} className="bg-slate-50 rounded-2xl p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{j.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold">{k.name} fez um trabalho extra</p>
                      <p className="text-slate-600 text-sm">{j.title} · <b>+{brlShort(j.reward)}</b></p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button variant="soft" size="sm" onClick={() => act(E.resolveJob, j.id, false, today)}>Ainda não</Button>
                    <Button variant="success" size="sm" onClick={() => { if (act(E.resolveJob, j.id, true, today)) notify(`Pago! ${brlShort(j.reward)} dividido nos potes.`); }}>Aprovar e pagar</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="flex items-center gap-3">
          <span className="text-4xl">✅</span>
          <p className="font-bold text-slate-700">Nada para aprovar. Tudo em dia!</p>
        </Card>
      )}

      {talks.length > 0 && (
        <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 border-2 border-indigo-100">
          <SectionTitle>💬 Papo da semana</SectionTitle>
          <p className="text-sm text-slate-500 -mt-2 mb-3">A conversa é onde o aprendizado acontece. Leva 2 minutos.</p>
          {talks.map(({ kid, lesson }) => (
            <div key={kid.id + lesson.id} className="bg-white rounded-2xl p-3 mb-2">
              <p className="text-xs font-bold text-indigo-500">{kid.emoji} {kid.name} fez “{lesson.title}”</p>
              <p className="font-semibold text-slate-700 mt-1">{lesson.talk}</p>
              <Button variant="primary" size="sm" className="w-full mt-2" onClick={() => { act(E.recordTalk, kid.id, lesson.id, today); notify('💬 Papo registrado! +25 XP na sua jornada'); }}>Conversamos ✓</Button>
            </div>
          ))}
        </Card>
      )}

      <p className="text-sm text-slate-500 font-semibold px-1">
        📅 Mesada {isAllowanceToday ? 'cai hoje' : `cai ${WEEKDAYS[state.settings.allowanceWeekday]} (${formatDate(nextAllowance)})`}, automaticamente.
      </p>

      {state.kids.map((k) => <KidSummary key={k.id} kid={k} onEntry={(dir) => setEntry({ kid: k, dir })} />)}

      {state.kids.length === 0 && (
        <Card><Empty emoji="👶">Nenhuma criança cadastrada. <button className="underline" onClick={() => goTo('settings')}>Adicionar</button></Empty></Card>
      )}

      {entry && <EntryModal kid={entry.kid} dir={entry.dir} onClose={() => setEntry(null)} />}
    </div>
  );
}

function KidSummary({ kid, onEntry }) {
  const { state, today, act, notify } = useStore();
  const rv = E.reviewSummary(state, kid.id);
  const answered = Object.values(rv).reduce((a, o) => a + o.bom + o.meio + o.ruim, 0);

  // Compartilhar é sempre uma ação do responsável (nada é enviado sozinho).
  const share = async () => {
    const text = weeklyReport(state, kid, today);
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); notify('Resumo copiado! Cole onde quiser.'); }
    } catch { /* o responsável cancelou */ }
  };
  const c = color(kid.color);
  const tasksToday = (kid.taskLog[today] || []).map((id) => kid.familyTasks.find((t) => t.id === id)).filter(Boolean);
  const wearing = SHOP.find((i) => i.id === kid.wearing)?.emoji;
  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <div className={cx('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center', c.grad)}>
          <Avatar kid={kid} item={wearing} size="text-3xl" />
        </div>
        <div className="flex-1">
          <p className="font-black text-lg text-slate-800">{kid.name}, {kid.age}</p>
          <p className="text-xs font-bold text-slate-500">Nível {E.levelFor(kid.starsEarned)} · 🔥 {E.weekStreak(kid, today)} sem. ativas · 📚 {kid.lessonsDone.length}/{LESSONS.length}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-bold">Total</p>
          <p className="text-xl font-black">{brlShort(E.kidTotal(kid))}</p>
        </div>
      </div>
      <Jars jars={kid.jars} />
      <div className="flex justify-between text-sm mt-3 bg-slate-50 rounded-xl px-3 py-2">
        <span>🏦 Banco: <b>{brlShort(kid.bank)}</b></span>
        {kid.goal && <span>{kid.goal.emoji} {Math.min(100, Math.round((E.goalProgress(kid) / kid.goal.target) * 100))}%</span>}
      </div>

      {answered > 0 && (
        <p className="text-sm text-slate-600 mt-3 bg-indigo-50 rounded-xl px-3 py-2">
          💭 Reflexões: gastos que "valeram" {rv.gasto.bom} de {rv.gasto.bom + rv.gasto.meio + rv.gasto.ruim}
          {rv.doacao.bom + rv.doacao.meio + rv.doacao.ruim > 0 && ` · doações que deixaram ${kid.name} feliz(a): ${rv.doacao.bom} de ${rv.doacao.bom + rv.doacao.meio + rv.doacao.ruim}`}. Bom assunto para conversar.
        </p>
      )}

      <div className="mt-3">
        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Ajudou em casa hoje</p>
        {tasksToday.length ? (
          <p className="text-sm text-slate-700">{tasksToday.map((t) => `${t.emoji} ${t.title}`).join(' · ')}</p>
        ) : <p className="text-sm text-slate-400">Nada marcado ainda.</p>}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <Button variant="soft" size="sm" onClick={() => onEntry('in')}>+ Entrada</Button>
        <Button variant="soft" size="sm" onClick={() => onEntry('out')}>− Saída</Button>
        <Button variant="warm" size="sm" onClick={() => { act(E.thankKid, kid.id); notify(`💛 Obrigado enviado para ${kid.name}`); }}>💛 Obrigado</Button>
      </div>
      <Button variant="ghost" size="sm" className="w-full mt-2" onClick={share}>📤 Compartilhar resumo da semana</Button>
    </Card>
  );
}

/** Lançamento manual: presente da avó, gasto feito junto no mercado etc. */
function EntryModal({ kid, dir, onClose }) {
  const { act, today, notify } = useStore();
  const [text, setText] = useState('');
  const [desc, setDesc] = useState('');
  const [jar, setJar] = useState(dir === 'in' ? 'split' : 'gastar');
  const cents = toCents(text);
  const save = () => {
    const d = desc.trim() || (dir === 'in' ? 'Entrada' : 'Saída');
    let ok;
    if (dir === 'in') ok = jar === 'split' ? act(E.creditKid, kid.id, cents, { kind: 'entrada', desc: d, date: today }) : act(E.creditJar, kid.id, cents, jar, { desc: d, date: today });
    else ok = act(E.debitJar, kid.id, cents, jar, { desc: d, date: today });
    if (ok) { notify('Lançado!'); onClose(); }
  };
  const jarOptions = dir === 'in' ? [['split', '🫙 Dividir nos 3 potes'], ...Object.entries(JAR_INFO).map(([k, v]) => [k, `${v.emoji} Só ${v.label}`])] : Object.entries(JAR_INFO).map(([k, v]) => [k, `${v.emoji} ${v.label} (${brlShort(kid.jars[k])})`]);
  return (
    <Modal title={`${dir === 'in' ? 'Entrada' : 'Saída'} · ${kid.name}`} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Descrição"><input className={inputClass} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={dir === 'in' ? 'Ex.: presente da avó' : 'Ex.: pipoca no cinema'} maxLength={40} /></Field>
        <Field label="Valor"><MoneyInput value={text} onChange={setText} autoFocus /></Field>
        <Field label={dir === 'in' ? 'Para onde vai' : 'De qual pote sai'}>
          <div className="space-y-2">
            {jarOptions.map(([k, label]) => (
              <button key={k} type="button" onClick={() => setJar(k)} aria-pressed={jar === k}
                className={cx('w-full text-left rounded-xl px-4 py-3 font-bold', jar === k ? 'bg-indigo-100 ring-2 ring-indigo-400' : 'bg-slate-50')}>{label}</button>
            ))}
          </div>
        </Field>
        {dir === 'in' && jar === 'split' && <p className="text-xs text-slate-500">Dividir é o padrão recomendado: reforça o hábito dos potes.</p>}
        <Button size="lg" className="w-full" disabled={!(cents > 0)} onClick={save}>Lançar</Button>
      </div>
    </Modal>
  );
}
