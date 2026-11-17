/**
 * BLOQUEIO PROGRESSIVO DO PIN (funções puras + persistência isolada).
 *
 * HONESTIDADE: um PIN de 4 dígitos guardado no aparelho não protege contra
 * quem tem acesso ao armazenamento do navegador. Este bloqueio só impede que
 * uma criança fique tentando combinações na tela. Ver docs/PRIVACIDADE.md.
 */
const FREE_TRIES = 5;
const STEPS_SECONDS = [30, 60, 300, 900, 3600];

export const emptyLock = () => ({ fails: 0, until: 0 });

/** Registra um erro. A partir da 5ª tentativa errada, bloqueia por tempos crescentes. */
export const registerFail = (lock, nowMs) => {
  const fails = lock.fails + 1;
  if (fails < FREE_TRIES) return { fails, until: 0 };
  const step = Math.min(fails - FREE_TRIES, STEPS_SECONDS.length - 1);
  return { fails, until: nowMs + STEPS_SECONDS[step] * 1000 };
};

export const secondsLeft = (lock, nowMs) => Math.max(0, Math.ceil((lock.until - nowMs) / 1000));

export const isLocked = (lock, nowMs) => secondsLeft(lock, nowMs) > 0;

export const triesLeft = (lock) => Math.max(0, FREE_TRIES - lock.fails);

const KEY = 'poupi_pinlock';

export const loadLock = () => {
  try {
    const l = JSON.parse(localStorage.getItem(KEY) || 'null');
    return l && Number.isFinite(l.fails) && Number.isFinite(l.until) ? l : emptyLock();
  } catch { return emptyLock(); }
};

export const saveLock = (lock) => {
  try { localStorage.setItem(KEY, JSON.stringify(lock)); } catch { /* sem armazenamento */ }
};

export const formatWait = (s) => (s >= 60 ? `${Math.ceil(s / 60)} min` : `${s} s`);
