/**
 * REPRESENTAÇÕES CONCRETAS DO DINHEIRO (Piaget: concreto antes do abstrato).
 *   - Potes de vidro que enchem.
 *   - Fazendinha: cada árvore é dinheiro guardado no banco; cada fruta,
 *     um pedaço dos juros. A fazenda cresce com o TEMPO e com o que é
 *     GUARDADO — não com toques na tela (o protótipo dava XP por "regar").
 */
import { brlShort } from '../domain/money.js';
import { cx } from './kit.jsx';

export const JAR_INFO = {
  gastar: { emoji: '💸', label: 'Gastar', little: 'Gastar', fill: 'from-amber-300 to-amber-400', soft: 'bg-amber-50', text: 'text-amber-700' },
  poupar: { emoji: '🎯', label: 'Poupar', little: 'Guardar', fill: 'from-emerald-300 to-emerald-400', soft: 'bg-emerald-50', text: 'text-emerald-700' },
  doar: { emoji: '❤️', label: 'Doar', little: 'Ajudar', fill: 'from-pink-300 to-pink-400', soft: 'bg-pink-50', text: 'text-pink-700' },
};

/** Três potes de vidro. A altura é relativa ao maior pote (comparação visual). */
export function Jars({ jars, little, onJar }) {
  const max = Math.max(1, jars.gastar, jars.poupar, jars.doar);
  return (
    <div className="grid grid-cols-3 gap-3">
      {Object.entries(JAR_INFO).map(([k, info]) => {
        const h = Math.max(6, (jars[k] / max) * 100);
        const Tag = onJar ? 'button' : 'div';
        return (
          <Tag key={k} type={onJar ? 'button' : undefined} onClick={onJar ? () => onJar(k) : undefined}
            className="flex flex-col items-center" aria-label={`Pote ${info.label}: ${brlShort(jars[k])}`}>
            <div className={cx('relative w-full rounded-b-3xl rounded-t-xl border-4 border-slate-200 bg-white/70 overflow-hidden', little ? 'h-32' : 'h-24')}>
              <div className="absolute top-0 inset-x-2 h-2 bg-slate-200 rounded-b" />
              <div className={cx('absolute bottom-0 inset-x-0 bg-gradient-to-t fill-anim', info.fill)} style={{ height: `${h}%` }} />
              <div className={cx('absolute inset-0 flex items-center justify-center', little ? 'text-4xl' : 'text-3xl')}>{info.emoji}</div>
            </div>
            <div className={cx('font-bold mt-1', little ? 'text-base' : 'text-xs', info.text)}>{little ? info.little : info.label}</div>
            <div className={cx('font-black text-slate-800', little ? 'text-xl' : 'text-base')}>{brlShort(jars[k])}</div>
          </Tag>
        );
      })}
    </div>
  );
}

/** Fazendinha derivada do banco: nunca dessincroniza do dinheiro real. */
export function Garden({ bank, interestEarned, little }) {
  const unit = little ? 200 : 500; // R$ 2 por árvore (pequenos) ou R$ 5 (grandes)
  const trees = Math.floor(bank / unit);
  const frac = (bank % unit) / unit;
  const sprout = bank % unit === 0 ? null : frac < 0.34 ? '🌱' : frac < 0.67 ? '🌿' : '🪴';
  const fruits = Math.min(24, Math.floor(interestEarned / 50));
  const shown = Math.min(trees, 11);
  const cells = [...Array(shown).fill('🌳'), ...(sprout ? [sprout] : [])];
  return (
    <div className="rounded-3xl overflow-hidden shadow-card">
      <div className="bg-gradient-to-b from-sky-200 to-sky-100 px-4 pt-4 pb-2 flex justify-between items-start">
        <span className="text-3xl float" aria-hidden>☀️</span>
        <span className="text-xs font-bold text-sky-800 bg-white/70 rounded-full px-2 py-1">
          {trees} {trees === 1 ? 'árvore' : 'árvores'} · {fruits} 🍎
        </span>
      </div>
      <div className="bg-gradient-to-b from-lime-200 to-green-300 p-4 min-h-[140px]">
        {cells.length === 0 ? (
          <p className="text-center text-green-900 font-bold py-6">
            {little ? 'Guarde moedinhas no banco para plantar! 🌱' : 'Guarde dinheiro no banco para plantar sua primeira árvore.'}
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2" aria-label={`Fazendinha com ${trees} árvores`}>
            {cells.map((c, i) => (
              <div key={i} className="relative aspect-square bg-white/40 rounded-2xl flex items-center justify-center text-4xl pop" style={{ animationDelay: `${i * 40}ms` }}>
                {c}
                {c === '🌳' && i < fruits && <span className="absolute top-1 right-1 text-base">🍎</span>}
              </div>
            ))}
            {trees > shown && (
              <div className="aspect-square bg-white/40 rounded-2xl flex items-center justify-center font-black text-green-900">+{trees - shown}</div>
            )}
          </div>
        )}
      </div>
      <div className="bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {little
          ? <>Cada 🌳 é <b>{brlShort(unit)}</b> guardado. As 🍎 aparecem quando o banco rende.</>
          : <>Cada 🌳 = <b>{brlShort(unit)}</b> no banco. Cada 🍎 = R$ 0,50 de juros que o banco te pagou. Quanto mais tempo guardado, mais frutas.</>}
      </div>
    </div>
  );
}
