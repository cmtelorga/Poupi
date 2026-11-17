/**
 * DATAS NO FUSO LOCAL.
 *
 * O app original usava toISOString(), que é UTC: no Brasil o "dia" virava
 * às 21h, quebrando mesada, missões e sequências. Aqui tudo é local e as
 * datas são guardadas como texto "AAAA-MM-DD" (sem hora, sem fuso).
 */

const pad = (n) => String(n).padStart(2, '0');

export const toDateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** "2026-11-10" -> Date local à meia-noite (NUNCA new Date("2026-11-10"), que é UTC). */
export const fromDateKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const todayKey = (now = new Date()) => toDateKey(now);

export const addDays = (key, n) => {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + n);
  return toDateKey(d);
};

export const daysBetween = (fromKey, toKey) =>
  Math.round((fromDateKey(toKey) - fromDateKey(fromKey)) / 86400000);

export const monthKey = (dateKey) => dateKey.slice(0, 7); // "2026-11"

/** Lista os meses estritamente depois de `fromMonth` até `toMonth` inclusive. */
export const monthsAfter = (fromMonth, toMonth) => {
  const out = [];
  let [y, m] = fromMonth.split('-').map(Number);
  const [ty, tm] = toMonth.split('-').map(Number);
  while (y < ty || (y === ty && m < tm)) {
    m += 1;
    if (m > 12) { m = 1; y += 1; }
    out.push(`${y}-${pad(m)}`);
  }
  return out;
};

/**
 * Chave da semana: a data (AAAA-MM-DD) da segunda-feira daquela semana.
 * Mais simples e legível que semana ISO, e suficiente para "esta semana".
 */
export const weekKey = (dateKey) => {
  const d = fromDateKey(dateKey);
  const dow = (d.getDay() + 6) % 7; // segunda = 0
  d.setDate(d.getDate() - dow);
  return toDateKey(d);
};

export const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export const weekdayOf = (dateKey) => fromDateKey(dateKey).getDay();

/** Próxima data (a partir de amanhã) que cai no dia da semana `dow`. */
export const nextWeekday = (fromKey, dow) => {
  let k = addDays(fromKey, 1);
  while (weekdayOf(k) !== dow) k = addDays(k, 1);
  return k;
};

export const formatDate = (key) =>
  fromDateKey(key).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
