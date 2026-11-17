/**
 * COMPONENTES BÁSICOS DE INTERFACE.
 * Botões com no mínimo 48px de altura (alvo de toque confortável para
 * dedos pequenos) e rótulos acessíveis em tudo que é só emoji.
 */
import { useEffect, useState } from 'react';
import { brl, brlShort, toCents } from '../domain/money.js';
import { COLORS } from '../domain/shop.js';

export const cx = (...c) => c.filter(Boolean).join(' ');
export const color = (name) => COLORS[name] || COLORS.indigo;

export function Card({ className, children, ...rest }) {
  return <div className={cx('bg-white rounded-3xl p-5 shadow-card', className)} {...rest}>{children}</div>;
}

const VARIANTS = {
  primary: 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white',
  success: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white',
  warm: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white',
  danger: 'bg-rose-500 text-white',
  soft: 'bg-slate-100 text-slate-700',
  ghost: 'bg-transparent text-slate-500',
  white: 'bg-white text-indigo-600 shadow-soft',
};

export function Button({ variant = 'primary', size = 'md', className, disabled, children, ...rest }) {
  const sizes = { sm: 'min-h-[40px] px-3 text-sm rounded-xl', md: 'min-h-[48px] px-4 rounded-2xl', lg: 'min-h-[60px] px-5 text-lg rounded-2xl' };
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx(
        'font-extrabold transition active:scale-[.97] inline-flex items-center justify-center gap-2',
        sizes[size],
        disabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Progress({ value, max, className, barClass = 'bg-gradient-to-r from-amber-400 to-orange-400', label }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={cx('h-3 bg-slate-100 rounded-full overflow-hidden', className)} role="progressbar"
      aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className={cx('h-full rounded-full fill-anim', barClass)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Money({ cents, short, className }) {
  return <span className={className}>{short ? brlShort(cents) : brl(cents)}</span>;
}

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title}
        className="bg-white rounded-3xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto fade-in"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-xl font-extrabold text-slate-800">{title}</h2>
          {onClose && (
            <button onClick={onClose} aria-label="Fechar" className="w-10 h-10 -mt-1 -mr-1 rounded-full bg-slate-100 text-slate-500 font-bold">✕</button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-slate-600 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400 mt-1">{hint}</span>}
    </label>
  );
}

export const inputClass = 'w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-300 rounded-xl px-4 py-3 font-semibold';

/** Campo de valor em reais (modo grande / pais). */
export function MoneyInput({ value, onChange, placeholder = '0,00', autoFocus }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
      <input inputMode="decimal" className={cx(inputClass, 'pl-12')} placeholder={placeholder}
        value={value} autoFocus={autoFocus} onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ''))} />
    </div>
  );
}

/**
 * Escolha de valor SEM digitar, para crianças de 6–7 anos:
 * toca nas moedas/notas e o valor soma (representação concreta — Piaget).
 */
export function CoinPicker({ value, onChange, max }) {
  const coins = [
    { c: 50, label: '50¢', cls: 'bg-amber-200 text-amber-800 w-12 h-12 text-sm rounded-full' },
    { c: 100, label: 'R$1', cls: 'bg-amber-300 text-amber-900 w-14 h-14 rounded-full' },
    { c: 200, label: 'R$2', cls: 'bg-sky-200 text-sky-900 w-16 h-12 rounded-lg' },
    { c: 500, label: 'R$5', cls: 'bg-violet-200 text-violet-900 w-16 h-12 rounded-lg' },
  ];
  return (
    <div>
      <div className="text-center text-4xl font-black text-slate-800 mb-3" aria-live="polite">{brlShort(value)}</div>
      <div className="flex justify-center items-center gap-3 flex-wrap">
        {coins.map((x) => (
          <button key={x.c} type="button" aria-label={`Somar ${x.label}`}
            disabled={value + x.c > max}
            onClick={() => onChange(value + x.c)}
            className={cx('font-black shadow-soft active:scale-90 transition flex items-center justify-center', x.cls, value + x.c > max && 'opacity-30')}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-3">
        <Button variant="soft" size="sm" onClick={() => onChange(0)}>↺ Zerar</Button>
        <Button variant="soft" size="sm" onClick={() => onChange(max)} disabled={max <= 0}>Tudo ({brlShort(max)})</Button>
      </div>
    </div>
  );
}

/** Escolhe a forma de entrada de valor conforme a idade. */
export function AmountField({ little, cents, setCents, max }) {
  const [text, setText] = useState(cents ? String(cents / 100).replace('.', ',') : '');
  if (little) return <CoinPicker value={cents} onChange={setCents} max={max ?? 100000} />;
  return (
    <MoneyInput value={text} autoFocus onChange={(t) => { setText(t); const c = toCents(t); setCents(Number.isNaN(c) ? 0 : c); }} />
  );
}

/** Lê o texto em voz alta (crianças que ainda estão aprendendo a ler). */
export function Speak({ text, className }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const say = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };
  return (
    <button type="button" onClick={say} aria-label="Ouvir"
      className={cx('w-12 h-12 rounded-full bg-white/90 shadow-soft text-2xl active:scale-90 transition shrink-0', className)}>
      🔊
    </button>
  );
}

export function EmojiPicker({ options, value, onChange, size = 'text-3xl' }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((e) => (
        <button key={e} type="button" onClick={() => onChange(e)} aria-label={e} aria-pressed={value === e}
          className={cx('w-12 h-12 rounded-2xl flex items-center justify-center', size, value === e ? 'bg-indigo-100 ring-2 ring-indigo-400' : 'bg-slate-50')}>
          {e}
        </button>
      ))}
    </div>
  );
}

export function Avatar({ kid, item, size = 'text-5xl', className }) {
  return (
    <div className={cx('relative inline-flex items-center justify-center', size, className)} aria-hidden="true">
      <span>{kid.emoji}</span>
      {item && <span className="absolute -top-[0.45em] left-1/2 -translate-x-1/2 text-[0.6em]">{item}</span>}
    </div>
  );
}

/** Confete: reforço positivo em conquistas reais (não em todo toque). */
export const confetti = () => {
  if (typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#0ea5e9', '#fbbf24'];
  for (let i = 0; i < 36; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = `${Math.random() * 0.4}s`;
    c.style.borderRadius = i % 2 ? '50%' : '2px';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3200);
  }
};

export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm pointer-events-none" role="status" aria-live="polite">
      <div className={cx('rounded-2xl px-4 py-3 font-bold shadow-card fade-in text-center',
        toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white')}>
        {toast.text}
      </div>
    </div>
  );
}

/** Teclado numérico para PIN (grande, fácil de tocar). */
export function PinPad({ title, subtitle, onSubmit, onCancel, error }) {
  const [pin, setPin] = useState('');
  useEffect(() => { if (error) setPin(''); }, [error]);
  const press = (d) => {
    const next = (pin + d).slice(0, 4);
    setPin(next);
    if (next.length === 4) setTimeout(() => { onSubmit(next); setPin(''); }, 120);
  };
  return (
    <div className="text-center">
      <h2 className="text-2xl font-extrabold text-slate-800">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      <div className={cx('flex justify-center gap-3 my-6', error && 'wiggle')} aria-label={`${pin.length} de 4 dígitos`}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={cx('w-4 h-4 rounded-full', i < pin.length ? 'bg-indigo-500' : 'bg-slate-200')} />
        ))}
      </div>
      {error && <p className="text-rose-500 font-bold -mt-3 mb-3">{error}</p>}
      <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" onClick={() => press(d)} className="h-16 rounded-2xl bg-slate-100 text-2xl font-extrabold active:bg-indigo-100">{d}</button>
        ))}
        <button type="button" onClick={onCancel} className="h-16 rounded-2xl text-sm font-bold text-slate-500">{onCancel ? 'Voltar' : ''}</button>
        <button type="button" onClick={() => press('0')} className="h-16 rounded-2xl bg-slate-100 text-2xl font-extrabold active:bg-indigo-100">0</button>
        <button type="button" onClick={() => setPin(pin.slice(0, -1))} aria-label="Apagar" className="h-16 rounded-2xl text-2xl text-slate-500">⌫</button>
      </div>
    </div>
  );
}

/** Barra de abas inferior. `items`: [{ k, icon, label, badge }] */
export function TabBar({ items, value, onChange, activeClass = 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white', big }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-100 safe-bottom pt-2">
      <div className="max-w-md mx-auto flex justify-around px-2">
        {items.map((t) => (
          <button key={t.k} type="button" onClick={() => onChange(t.k)} aria-label={t.label} aria-current={value === t.k ? 'page' : undefined}
            className={cx('relative flex flex-col items-center justify-center rounded-2xl transition', big ? 'w-16 h-16' : 'w-14 h-14',
              value === t.k ? activeClass : 'text-slate-500')}>
            <span className={big ? 'text-2xl' : 'text-xl'}>{t.icon}</span>
            <span className="text-[10px] font-bold leading-tight mt-0.5">{t.label}</span>
            {t.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">{t.badge}</span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

export function SectionTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-extrabold text-slate-800 text-lg">{children}</h3>
      {right}
    </div>
  );
}

export function Empty({ emoji, children }) {
  return (
    <div className="text-center py-6 text-slate-400">
      <div className="text-4xl mb-2">{emoji}</div>
      <p className="font-semibold">{children}</p>
    </div>
  );
}
