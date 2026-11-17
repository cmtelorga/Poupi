/**
 * ESTADO GLOBAL: um único objeto, salvo a cada mudança.
 * `act(fn, ...args)` aplica uma função do motor de regras de forma
 * síncrona; se a regra recusar (RuleError), mostra a mensagem em vez de
 * quebrar a tela e retorna false.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { loadState, saveState } from './storage.js';
import { runAutomations, RuleError } from './domain/engine.js';
import { todayKey } from './domain/dates.js';
import { brlShort } from './domain/money.js';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

const boot = () => {
  const saved = loadState();
  if (!saved) return { state: null, events: [] };
  return runAutomations(saved, todayKey());
};

export function StoreProvider({ children }) {
  const initial = useRef(null);
  if (!initial.current) initial.current = boot();

  const [state, setStateRaw] = useState(initial.current.state);
  const [events, setEvents] = useState(initial.current.events);
  const [today, setToday] = useState(todayKey());
  const [toast, setToast] = useState(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const ref = useRef(state);
  const toastTimer = useRef();

  const setState = useCallback((next) => {
    ref.current = next;
    setStateRaw(next);
  }, []);

  const notify = useCallback((text, type = 'info') => {
    clearTimeout(toastTimer.current);
    setToast({ text, type });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => {
    if (state) setSaveFailed(!saveState(state));
  }, [state]);

  // Se o app ficar aberto e virar o dia (ou voltar do segundo plano), roda as automações.
  useEffect(() => {
    const check = () => {
      const t = todayKey();
      setToday(t);
      if (!ref.current) return;
      const r = runAutomations(ref.current, t);
      if (r.events.length) {
        setEvents((e) => [...e, ...r.events]);
        setState(r.state);
      } else if (r.state !== ref.current) {
        setState(r.state);
      }
    };
    document.addEventListener('visibilitychange', check);
    const timer = setInterval(check, 60_000);
    return () => { document.removeEventListener('visibilitychange', check); clearInterval(timer); };
  }, [setState]);

  const act = useCallback((fn, ...args) => {
    try {
      setState(fn(ref.current, ...args));
      return true;
    } catch (e) {
      if (e instanceof RuleError) notify(e.message, 'error');
      else { console.error(e); notify('Algo deu errado. Tente de novo.', 'error'); }
      return false;
    }
  }, [notify, setState]);

  const takeEvents = useCallback((kidId) => {
    const mine = events.filter((e) => e.kidId === kidId);
    if (mine.length) setEvents((ev) => ev.filter((e) => e.kidId !== kidId));
    return mine;
  }, [events]);

  return (
    <Ctx.Provider value={{ state, today, act, replace: setState, notify, toast, saveFailed, takeEvents }}>
      {children}
    </Ctx.Provider>
  );
}

export const describeEvent = (e) =>
  e.type === 'mesada' ? `💰 Sua mesada chegou: ${brlShort(e.amount)}!` : `🍎 O banco rendeu ${brlShort(e.amount)} de juros!`;
