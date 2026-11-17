/**
 * ROTEADOR SIMPLES: primeiro uso → escolha de perfil → criança ou pais.
 * O perfil escolhido NÃO é salvo: num aparelho compartilhado, o app sempre
 * volta para "Quem é você?", e o painel dos pais sempre pede PIN.
 */
import { useEffect, useState } from 'react';
import { useStore } from './store.jsx';
import { Toast, Modal, PinPad, Avatar, cx, color } from './ui/kit.jsx';
import { hashPin } from './domain/ids.js';
import { SHOP } from './domain/shop.js';
import { DEMO_PIN } from './domain/demo.js';
import { emptyLock, registerFail, isLocked, secondsLeft, triesLeft, loadLock, saveLock, formatWait } from './domain/pinLock.js';
import { PrivacyModal } from './screens/Privacy.jsx';
import Onboarding from './screens/Onboarding.jsx';
import KidApp from './screens/kid/KidApp.jsx';
import ParentApp from './screens/parent/ParentApp.jsx';

export default function App() {
  const { state, toast, saveFailed } = useStore();
  const [view, setView] = useState({ screen: 'home' });

  let content;
  if (!state) content = <Onboarding />;
  else if (view.screen === 'kid' && state.kids.some((k) => k.id === view.id)) content = <KidApp kidId={view.id} onExit={() => setView({ screen: 'home' })} />;
  else if (view.screen === 'parent') content = <ParentApp onExit={() => setView({ screen: 'home' })} />;
  else content = <ProfilePicker onPick={setView} />;

  return (
    <>
      {saveFailed && (
        <div className="bg-rose-600 text-white text-sm font-bold text-center p-2">
          Não foi possível salvar neste navegador (modo privado?). Os dados podem se perder.
        </div>
      )}
      {content}
      <Toast toast={toast} />
    </>
  );
}

function ProfilePicker({ onPick }) {
  const { state } = useStore();
  const [askPin, setAskPin] = useState(false);
  const [error, setError] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [lock, setLock] = useState(loadLock);
  const [now, setNow] = useState(Date.now());

  // Contagem regressiva do bloqueio (só roda enquanto está bloqueado).
  useEffect(() => {
    if (!isLocked(lock, Date.now())) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [lock]);
  const locked = isLocked(lock, now);

  const tryPin = (p) => {
    if (isLocked(lock, Date.now())) return;
    if (hashPin(p) === state.pinHash) {
      saveLock(emptyLock());
      setLock(emptyLock());
      onPick({ screen: 'parent' });
      return;
    }
    const next = registerFail(lock, Date.now());
    saveLock(next);
    setLock(next);
    setNow(Date.now());
    setError(isLocked(next, Date.now())
      ? `Muitas tentativas. Espere ${formatWait(secondsLeft(next, Date.now()))}.`
      : `PIN incorreto. Restam ${triesLeft(next)} tentativas antes de um bloqueio.`);
  };
  const pending = state.requests.length + state.jobs.filter((j) => j.status === 'feito').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full fade-in">
        <div className="text-center text-white mb-8">
          <div className="text-6xl float" aria-hidden>🐷</div>
          <h1 className="text-4xl font-black mt-1">Quem é você?</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {state.kids.map((k) => {
            const item = SHOP.find((i) => i.id === k.wearing)?.emoji;
            return (
              <button key={k.id} type="button" onClick={() => onPick({ screen: 'kid', id: k.id })}
                className={cx('bg-gradient-to-br rounded-3xl p-5 text-white shadow-card active:scale-95 transition flex flex-col items-center', color(k.color).grad)}>
                <Avatar kid={k} item={item} size="text-6xl" />
                <span className="text-2xl font-black mt-3">{k.name}</span>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={() => { setError(''); setAskPin(true); }}
          className="relative mt-6 w-full bg-white/15 border-2 border-white/40 text-white font-extrabold rounded-2xl min-h-[56px]">
          🔒 Área dos pais
          {pending > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-500 rounded-full min-w-[24px] h-6 px-1.5 text-sm flex items-center justify-center"
              aria-label={`${pending} ${pending === 1 ? 'pedido' : 'pedidos'} esperando os pais`}>{pending}</span>
          )}
        </button>
        {pending > 0 && <p className="text-white/90 text-sm font-bold text-center mt-2">{pending} {pending === 1 ? 'pedido espera' : 'pedidos esperam'} os pais</p>}
        <button type="button" onClick={() => setPrivacy(true)} className="mt-4 w-full text-white/80 text-sm font-bold underline min-h-[44px]">Privacidade</button>
      </div>

      {askPin && (
        <Modal title="" onClose={() => setAskPin(false)}>
          <PinPad title="PIN dos pais" error={locked ? `Muitas tentativas. Espere ${formatWait(secondsLeft(lock, now))}.` : error}
            subtitle={state.isDemo ? `Demonstração: o PIN é ${DEMO_PIN}` : undefined}
            disabled={locked} onCancel={() => setAskPin(false)} onSubmit={tryPin} />
        </Modal>
      )}
      {privacy && <PrivacyModal onClose={() => setPrivacy(false)} />}
    </div>
  );
}
