/**
 * DINHEIRO SEMPRE EM CENTAVOS (inteiros).
 *
 * Por quê: 0,1 + 0,2 !== 0,3 em ponto flutuante. Em um app que ensina
 * criança a contar dinheiro, um saldo de "R$ 31,500000001" ou um centavo
 * que some é inaceitável. Toda a lógica trabalha com inteiros; só a tela
 * converte para reais.
 */

const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** 1234 -> "R$ 12,34" */
export const brl = (cents) => fmt.format((cents || 0) / 100);

/** 1200 -> "R$ 12" (sem centavos quando redondo — mais fácil de ler aos 6 anos) */
export const brlShort = (cents) =>
  cents % 100 === 0 ? `R$ ${(cents / 100).toLocaleString('pt-BR')}` : brl(cents);

/** "12,5" | "12.50" | 12.5 -> 1250. Retorna NaN se inválido. */
export const toCents = (value) => {
  if (typeof value === 'number') return Math.round(value * 100);
  const s = String(value ?? '').trim().replace(/\s|R\$/g, '');
  if (!s) return NaN;
  // Aceita vírgula ou ponto como separador decimal.
  const normalized = s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s;
  const n = Number(normalized);
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
};

/** Valor de centavos para campo de texto: 1250 -> "12,50" */
export const centsToInput = (cents) => (cents / 100).toFixed(2).replace('.', ',');

export const JARS = ['gastar', 'poupar', 'doar'];

/**
 * Divide um valor entre os 3 potes segundo os percentuais da criança.
 * Arredonda para baixo nos dois primeiros e joga o resto no último que
 * tiver percentual > 0, garantindo que a soma bata EXATAMENTE com o total.
 */
export const splitIntoJars = (cents, split) => {
  const out = { gastar: 0, poupar: 0, doar: 0 };
  let rest = cents;
  const active = JARS.filter((j) => (split[j] || 0) > 0);
  active.forEach((jar, i) => {
    if (i === active.length - 1) {
      out[jar] = rest;
    } else {
      const part = Math.floor((cents * split[jar]) / 100);
      out[jar] = part;
      rest -= part;
    }
  });
  return out;
};

export const jarsTotal = (jars) => JARS.reduce((a, j) => a + (jars[j] || 0), 0);
