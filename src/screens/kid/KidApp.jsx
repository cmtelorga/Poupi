/**
 * APP DA CRIANÇA — mesma estrutura para todos, mas a INTERFACE muda com a
 * idade (isLittle): até 7 anos, botões maiores, menos texto, áudio (🔊),
 * moedas em vez de teclado. 8+ anos: números, prazos e mais autonomia.
 */
import { useEffect, useMemo, useState } from 'react';
import { useStore, describeEvent } from '../../store.jsx';
import { Card, Button, Progress, TabBar, Avatar, Modal, Speak, SectionTitle, confetti, cx, color } from '../../ui/kit.jsx';
import { Jars } from '../../ui/money-visuals.jsx';
import { brlShort } from '../../domain/money.js';
import * as E from '../../domain/engine.js';
import { isLittle } from '../../domain/state.js';
import { badgesFor } from '../../domain/achievements.js';
import { SHOP } from '../../domain/shop.js';
import { SpendModal, DonateModal, BankModal, FamilyModal } from './modals.jsx';
import { BankPage, DreamsPage, LearnPage, MePage } from './pages.jsx';

export default function KidApp({ kidId, onExit }) {
  const { state, today, act, takeEvents } = useStore();
  const kid = E.getKid(state, kidId);
  const little = isLittle(kid);
  const c = color(kid.color);
  const [tab, setTab] = useState('home');
  const [celebrate, setCelebrate] = useState(null);

  // Ao entrar: mostra mesada/juros que chegaram.
  useEffect(() => {
    const ev = takeEvents(kidId);
    if (ev.length) { setCelebrate({ lines: ev.map(describeEvent) }); confetti(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Conquistas novas: celebra uma vez e marca como vista.
  const badges = useMemo(() => badgesFor(kid, state, today), [kid, state, today]);
  useEffect(() => {
    const fresh = badges.filter((b) => !kid.seenBadges.includes(b.id));
    if (fresh.length && !celebrate) {
      act((s) => E.updateKid(s, kidId, (k) => ({ ...k, seenBadges: [...k.seenBadges, ...fresh.map((b) => b.id)] })));
      setCelebrate({ title: 'Nova conquista!', lines: fresh.map((b) => `${b.emoji} ${b.title}`) });
      confetti();
    }
  }, [badges, kid.seenBadges, celebrate, act, kidId]);

  const level = E.levelFor(kid.starsEarned);
  const streak = E.weekStreak(kid, today);
  const wearing = SHOP.find((i) => i.id === kid.wearing)?.emoji;
  const pendingMissions = E.missionsFor(kid, today).filter((m) => m.done && !m.claimed).length;

  const tabs = [
    { k: 'home', icon: '🏠', label: 'Início', badge: pendingMissions },
    { k: 'bank', icon: '🌳', label: little ? 'Fazenda' : 'Banco' },
    { k: 'dreams', icon: '🎯', label: 'Sonhos' },
    { k: 'learn', icon: '📚', label: 'Aprender' },
    { k: 'me', icon: kid.emoji, label: 'Eu' },
  ];

  return (
    <div className={cx('min-h-screen bg-slate-50 pb-28', little && 'text-lg')}>
      <header className={cx('bg-gradient-to-br text-white px-5 pt-6 pb-12 rounded-b-[2rem] relative overflow-hidden', c.grad)}>
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-white/10 rounded-full" aria-hidden />
        <div className="max-w-md mx-auto relative flex items-center gap-3">
          <Avatar kid={kid} item={wearing} size="text-5xl" className="pop" />
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-sm font-semibold">Oi,</p>
            <h1 className="text-2xl font-black truncate">{kid.name}</h1>
            <div className="flex gap-1.5 mt-1 flex-wrap text-xs font-bold">
              <span className="bg-white/20 rounded-full px-2 py-0.5">Nível {level}</span>
              <span className="bg-white/20 rounded-full px-2 py-0.5">⭐ {kid.stars}</span>
              {streak > 0 && <span className="bg-white/20 rounded-full px-2 py-0.5">🔥 {streak} {streak === 1 ? 'semana' : 'semanas'}</span>}
            </div>
          </div>
          <button type="button" onClick={onExit} className="bg-white/20 rounded-xl px-3 min-h-[44px] text-sm font-bold">Trocar</button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 -mt-8 space-y-4">
        {tab === 'home' && <KidHome kid={kid} little={little} goTo={setTab} />}
        {tab === 'bank' && <BankPage kid={kid} little={little} />}
        {tab === 'dreams' && <DreamsPage kid={kid} little={little} />}
        {tab === 'learn' && <LearnPage kid={kid} little={little} />}
        {tab === 'me' && <MePage kid={kid} little={little} badges={badges} />}
      </main>

      <TabBar items={tabs} value={tab} onChange={setTab} big={little} activeClass={cx('bg-gradient-to-br text-white', c.grad)} />

      {celebrate && (
        <Modal title={celebrate.title || 'Oba!'} onClose={() => setCelebrate(null)}>
          <div className="space-y-3 text-center">
            {celebrate.lines.map((l, i) => <p key={i} className="text-xl font-extrabold text-slate-800 pop">{l}</p>)}
            <Button size="lg" className="w-full mt-2" onClick={() => setCelebrate(null)}>Legal! 🎉</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function KidHome({ kid, little, goTo }) {
  const { state, today, act, notify } = useStore();
  const [modal, setModal] = useState(null);
  const total = E.kidTotal(kid);
  const missions = E.missionsFor(kid, today);
  const doneToday = kid.taskLog[today] || [];
  const jobs = state.jobs.filter((j) => !j.kidId || j.kidId === kid.id);
  const myRequests = state.requests.filter((r) => r.kidId === kid.id);
  const fg = state.familyGoal;

  const onJar = (jar) => setModal(jar);

  return (
    <div className="space-y-4 fade-in">
      {kid.thanksPending > 0 && (
        <Card className="bg-gradient-to-br from-amber-50 to-pink-50 border-2 border-amber-200 pop">
          <div className="flex items-center gap-3">
            <span className="text-5xl">💛</span>
            <div className="flex-1">
              <p className="font-black text-slate-800 text-lg">{kid.thanksPending > 1 ? `${kid.thanksPending} obrigados!` : 'Obrigado!'}</p>
              <p className="text-slate-600 text-sm">Sua família agradeceu por você ajudar em casa.</p>
            </div>
          </div>
          <Button variant="warm" className="w-full mt-3" onClick={() => act(E.clearThanks, kid.id)}>💛 Recebi!</Button>
        </Card>
      )}

      {/* Os 3 potes: tocar abre a decisão daquele pote */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">{little ? 'Meu dinheiro' : 'Meu dinheiro total'}</p>
            <p className="text-3xl font-black text-slate-800">{brlShort(total)}</p>
            {kid.bank > 0 && <p className="text-xs text-slate-500 font-semibold">{brlShort(kid.bank)} no banco 🏦</p>}
          </div>
          {little && <Speak text={`Você tem ${brlShort(total).replace('R$', '')} reais. Toque num pote para usar.`} />}
        </div>
        <Jars jars={kid.jars} little={little} onJar={onJar} />
        <p className="text-center text-xs text-slate-400 font-semibold mt-3">{little ? 'Toque num pote 👆' : 'Toque num pote para usar o dinheiro'}</p>
      </Card>

      {myRequests.length > 0 && (
        <Card>
          <SectionTitle>⏳ Esperando resposta</SectionTitle>
          {myRequests.map((r) => (
            <div key={r.id} className="flex items-center gap-3 py-2">
              <span className="text-2xl">{r.emoji || '🛍️'}</span>
              <span className="flex-1 font-semibold">{r.title}</span>
              <b>{brlShort(r.amount)}</b>
              <button type="button" className="text-xs text-slate-400 underline" onClick={() => act(E.cancelRequest, r.id)}>cancelar</button>
            </div>
          ))}
        </Card>
      )}

      {/* Missões SEMANAIS */}
      <Card>
        <SectionTitle right={little && <Speak text="Missões da semana. Faça e ganhe estrelas." className="!w-10 !h-10 !text-xl" />}>🎯 Missões da semana</SectionTitle>
        <div className="space-y-2">
          {missions.map((m) => (
            <div key={m.id} className={cx('flex items-center gap-3 p-3 rounded-2xl', m.claimed ? 'bg-emerald-50' : 'bg-slate-50')}>
              <span className="text-2xl">{m.claimed ? '✅' : m.emoji}</span>
              <span className={cx('flex-1 font-bold', m.claimed && 'text-slate-400 line-through')}>{little ? m.little : m.title}</span>
              {m.done && !m.claimed ? (
                <Button variant="warm" size="sm" className="pop" onClick={() => { act(E.claimMission, kid.id, m.id, today); confetti(); }}>+{m.stars}⭐</Button>
              ) : (
                <span className="text-sm font-bold text-amber-600">{m.claimed ? '' : `+${m.stars}⭐`}</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Renovam toda segunda-feira. Sem pressa 😊</p>
      </Card>

      {/* Ajudar em casa: sem dinheiro, sem estrelas — reconhecimento */}
      {kid.familyTasks.length > 0 && (
        <Card>
          <SectionTitle>🏡 Ajudar em casa hoje</SectionTitle>
          <div className={cx('grid gap-2', little ? 'grid-cols-1' : 'grid-cols-1')}>
            {kid.familyTasks.map((t) => {
              const done = doneToday.includes(t.id);
              return (
                <button key={t.id} type="button" onClick={() => act(E.toggleFamilyTask, kid.id, t.id, today)} aria-pressed={done}
                  className={cx('flex items-center gap-3 p-3 rounded-2xl text-left transition', done ? 'bg-emerald-50' : 'bg-slate-50')}>
                  <span className={cx('w-9 h-9 rounded-full border-2 flex items-center justify-center font-black shrink-0', done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300')}>{done && '✓'}</span>
                  <span className="text-2xl">{t.emoji}</span>
                  <span className={cx('font-bold', done && 'text-slate-500')}>{t.title}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-2">Ajudar faz parte de ser família 💛</p>
        </Card>
      )}

      {/* Trabalhos extras: opcionais e pagos */}
      {jobs.length > 0 && (
        <Card>
          <SectionTitle>💼 Trabalhos extras</SectionTitle>
          <p className="text-sm text-slate-500 -mt-2 mb-3">{little ? 'Quer ganhar um dinheirinho?' : 'Opcionais. Combine com seus pais e ganhe dinheiro.'}</p>
          {jobs.map((j) => (
            <div key={j.id} className="flex items-center gap-3 py-2">
              <span className="text-3xl">{j.emoji}</span>
              <div className="flex-1">
                <p className="font-bold">{j.title}</p>
                <p className="text-emerald-600 font-black">+{brlShort(j.reward)}</p>
              </div>
              {j.status === 'aberto' ? (
                <Button variant="success" size="sm" onClick={() => { act(E.markJobDone, j.id, kid.id, today); notify('✋ Avisado! Seus pais vão conferir.'); }}>Fiz! ✋</Button>
              ) : (
                <span className="text-xs font-bold text-slate-400 text-right whitespace-pre-line">{j.doneBy === kid.id ? 'Esperando\naprovação' : 'Já feito'}</span>
              )}
            </div>
          ))}
        </Card>
      )}

      {fg && (
        <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
          <div className="flex items-center gap-3">
            <span className="text-4xl float">{fg.emoji}</span>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase text-white/80">Meta da família</p>
              <p className="font-black text-lg">{fg.title}</p>
            </div>
          </div>
          <Progress value={fg.saved} max={fg.target} className="mt-3 !bg-white/30" barClass="bg-white" label="Meta da família" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-bold">{brlShort(fg.saved)} de {brlShort(fg.target)}</span>
            <Button variant="white" size="sm" onClick={() => setModal('familia')} disabled={kid.jars.poupar <= 0}>Ajudar</Button>
          </div>
        </Card>
      )}

      {modal === 'gastar' && <SpendModal kid={kid} onClose={() => setModal(null)} />}
      {modal === 'doar' && <DonateModal kid={kid} onClose={() => setModal(null)} />}
      {modal === 'familia' && <FamilyModal kid={kid} onClose={() => setModal(null)} />}
      {modal === 'poupar' && (
        <Modal title="🎯 Pote Poupar" onClose={() => setModal(null)}>
          <p className="text-slate-600 mb-4">{little ? 'Esse dinheiro é para o seu sonho!' : 'Dinheiro para seus sonhos. No banco ele rende juros todo mês.'}</p>
          <div className="space-y-3">
            <Button variant="success" size="lg" className="w-full" onClick={() => setModal('banco')}>🏦 {little ? 'Plantar no banco' : 'Guardar no banco'}</Button>
            <Button variant="soft" size="lg" className="w-full" onClick={() => { setModal(null); goTo('dreams'); }}>🎯 Ver meu sonho</Button>
            {fg && <Button variant="warm" size="lg" className="w-full" onClick={() => setModal('familia')}>{fg.emoji} Ajudar a família</Button>}
          </div>
        </Modal>
      )}
      {modal === 'banco' && <BankModal kid={kid} mode="deposit" onClose={() => setModal(null)} />}
    </div>
  );
}
