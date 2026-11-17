/**
 * DECISÕES DA CRIANÇA — cada modal é um momento de "educação na hora certa"
 * (just-in-time, Fernandes et al. 2014): a informação aparece exatamente
 * quando a criança vai decidir.
 */
import { useState } from 'react';
import { useStore } from '../../store.jsx';
import { Modal, Button, AmountField, EmojiPicker, Field, inputClass, Speak, confetti } from '../../ui/kit.jsx';
import { brlShort } from '../../domain/money.js';
import * as E from '../../domain/engine.js';
import { isLittle } from '../../domain/state.js';

const SPEND_EMOJIS = ['🍦', '🍭', '🧸', '📗', '🎮', '🎨', '⚽', '🎟️', '🃏', '👕'];
const CAUSES = [
  { e: '🐶', t: 'Animais' },
  { e: '🧒', t: 'Crianças' },
  { e: '🌳', t: 'Natureza' },
  { e: '👵', t: 'Idosos' },
  { e: '🍲', t: 'Quem tem fome' },
];

/**
 * Pedido de gasto com "nudges" sutis (Thaler & Sunstein):
 *  - custo traduzido em TEMPO (semanas de pote) — torna o custo concreto;
 *  - opção de "pensar até amanhã" com o mesmo destaque do "pedir".
 * Nada é proibido: a criança pode pedir. Os nudges só tornam a pausa fácil.
 */
export function SpendModal({ kid, onClose, preset }) {
  const { act, today, notify } = useStore();
  const little = isLittle(kid);
  const [title, setTitle] = useState(preset?.title || '');
  const [emoji, setEmoji] = useState(preset?.emoji || '🍦');
  const [amount, setAmount] = useState(preset?.price || 0);
  const perWeek = Math.floor((kid.allowance * kid.split.gastar) / 100);
  const weeks = perWeek > 0 && amount > 0 ? amount / perWeek : null;
  const label = title.trim() || (little ? emoji : '');
  const valid = amount > 0 && amount <= kid.jars.gastar && label;

  const ask = () => {
    if (act(E.createRequest, { kidId: kid.id, type: 'gastar', amount, title: label, emoji }, today)) {
      if (preset?.wishId) act(E.removeWish, kid.id, preset.wishId);
      notify(little ? '🙋 Pedido enviado para papai/mamãe!' : 'Pedido enviado! Seus pais vão responder.');
      onClose();
    }
  };
  const think = () => {
    act(E.addWish, kid.id, { title: label, emoji, price: amount }, today);
    notify('💭 Guardado na lista de desejos. Amanhã você decide!');
    onClose();
  };

  return (
    <Modal title={little ? '💸 Quero gastar' : 'Quero gastar'} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-slate-500 font-semibold">No pote Gastar: <b className="text-slate-800">{brlShort(kid.jars.gastar)}</b></p>
        <Field label={little ? 'O que é?' : 'O que você quer comprar?'}>
          <EmojiPicker options={SPEND_EMOJIS} value={emoji} onChange={setEmoji} />
          {!little && <input className={inputClass + ' mt-2'} maxLength={40} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: gibi da Turma" />}
        </Field>
        <Field label={little ? 'Quanto custa?' : 'Quanto custa?'}>
          <AmountField little={little} cents={amount} setCents={setAmount} max={kid.jars.gastar} />
        </Field>
        {amount > kid.jars.gastar && <p className="text-rose-500 font-bold">Não tem tudo isso no pote Gastar.</p>}

        {weeks !== null && amount <= kid.jars.gastar && (
          <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4 text-amber-900">
            {little ? (
              <p className="font-bold text-lg text-center">
                {weeks <= 1 ? 'Isso é quase uma semana de mesada do pote 💸' : `Isso é ${Math.round(weeks)} semanas de mesada do pote 💸`}
              </p>
            ) : (
              <p className="font-semibold">
                Isso equivale a <b>{weeks < 1 ? `${Math.round(weeks * 7)} dias` : `${weeks.toFixed(1).replace('.', ',')} semanas`}</b> do seu pote Gastar.
                {' '}Vai continuar querendo amanhã?
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="soft" size="lg" onClick={think} disabled={!label || preset?.wishId}>😴 {little ? 'Pensar' : 'Pensar até amanhã'}</Button>
          <Button variant="warm" size="lg" onClick={ask} disabled={!valid}>🙋 Pedir</Button>
        </div>
      </div>
    </Modal>
  );
}

export function DonateModal({ kid, onClose }) {
  const { act, today, notify } = useStore();
  const little = isLittle(kid);
  const [cause, setCause] = useState(CAUSES[0]);
  const [other, setOther] = useState('');
  const [amount, setAmount] = useState(0);
  const title = other.trim() ? other.trim() : cause.t;
  const send = () => {
    if (act(E.createRequest, { kidId: kid.id, type: 'doar', amount, title: `Doação: ${title}`, emoji: cause.e }, today)) {
      notify('❤️ Que lindo! Seus pais vão te ajudar a entregar.');
      onClose();
    }
  };
  return (
    <Modal title="❤️ Quem você quer ajudar?" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {CAUSES.map((c) => (
            <button key={c.t} type="button" onClick={() => { setCause(c); setOther(''); }} aria-pressed={cause.t === c.t}
              className={'rounded-2xl p-3 text-center font-bold ' + (cause.t === c.t ? 'bg-pink-100 ring-2 ring-pink-400' : 'bg-slate-50')}>
              <div className="text-3xl">{c.e}</div><div className="text-xs mt-1">{c.t}</div>
            </button>
          ))}
        </div>
        {!little && <input className={inputClass} placeholder="Outra causa (opcional)" maxLength={40} value={other} onChange={(e) => setOther(e.target.value)} />}
        <Field label={`No pote Doar: ${brlShort(kid.jars.doar)}`}>
          <AmountField little={little} cents={amount} setCents={setAmount} max={kid.jars.doar} />
        </Field>
        <Button variant="success" size="lg" className="w-full" disabled={!amount || amount > kid.jars.doar} onClick={send}>Quero doar ❤️</Button>
      </div>
    </Modal>
  );
}

export function BankModal({ kid, mode, onClose }) {
  const { act, today, notify } = useStore();
  const little = isLittle(kid);
  const [amount, setAmount] = useState(0);
  const deposit = mode === 'deposit';
  const max = deposit ? kid.jars.poupar : kid.bank;
  const go = () => {
    const ok = deposit ? act(E.depositBank, kid.id, amount, today) : act(E.withdrawBank, kid.id, amount, today);
    if (ok) {
      if (deposit) confetti();
      notify(deposit ? (little ? '🌱 Plantado! Sua fazenda cresceu.' : 'Guardado! Ele vai render no dia 1º.') : 'Voltou para o pote Poupar.');
      onClose();
    }
  };
  return (
    <Modal title={deposit ? '🏦 Guardar no banco' : 'Tirar do banco'} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-slate-500 font-semibold">{deposit ? 'Sai do pote Poupar' : 'Volta para o pote Poupar'} · disponível: <b className="text-slate-800">{brlShort(max)}</b></p>
        <AmountField little={little} cents={amount} setCents={setAmount} max={max} />
        {!deposit && !little && (
          <p className="text-sm text-slate-500 bg-slate-50 rounded-xl p-3">Lembre: dinheiro fora do banco não rende juros no dia 1º.</p>
        )}
        <Button variant={deposit ? 'success' : 'soft'} size="lg" className="w-full" disabled={!amount || amount > max} onClick={go}>
          {deposit ? (little ? 'Plantar 🌱' : 'Guardar') : 'Tirar'}
        </Button>
      </div>
    </Modal>
  );
}

export function FamilyModal({ kid, onClose }) {
  const { state, act, today, notify } = useStore();
  const little = isLittle(kid);
  const [amount, setAmount] = useState(0);
  const g = state.familyGoal;
  const go = () => {
    if (act(E.contributeFamilyGoal, kid.id, amount, today)) {
      confetti();
      notify(`${g.emoji} Você ajudou a família!`);
      onClose();
    }
  };
  return (
    <Modal title={`${g.emoji} ${g.title}`} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-slate-500 font-semibold">Sai do pote Poupar · disponível: <b className="text-slate-800">{brlShort(kid.jars.poupar)}</b></p>
        <AmountField little={little} cents={amount} setCents={setAmount} max={kid.jars.poupar} />
        <Button variant="warm" size="lg" className="w-full" disabled={!amount || amount > kid.jars.poupar} onClick={go}>Ajudar a família</Button>
      </div>
    </Modal>
  );
}

const GOAL_EMOJIS = ['🎮', '🛼', '🚲', '🧸', '⚽', '📚', '🎧', '🛹', '🎨', '🪀', '🏕️', '🎁'];

export function GoalModal({ kid, onClose, title: modalTitle = '🎯 Meu sonho', onSave }) {
  const { act, notify } = useStore();
  const [title, setTitle] = useState(kid.goal?.title || '');
  const [emoji, setEmoji] = useState(kid.goal?.emoji || GOAL_EMOJIS[0]);
  const [amount, setAmount] = useState(kid.goal?.target || 0);
  const save = () => {
    if (act(E.setGoal, kid.id, { title: title.trim(), emoji, target: amount })) {
      notify('🎯 Meta salva!');
      onSave?.();
      onClose();
    }
  };
  return (
    <Modal title={modalTitle} onClose={onClose}>
      <div className="space-y-4">
        <Field label="O que é?">
          <EmojiPicker options={GOAL_EMOJIS} value={emoji} onChange={setEmoji} />
          <input className={inputClass + ' mt-2'} maxLength={30} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: bicicleta" />
        </Field>
        <Field label="Quanto custa?"><AmountField little={false} cents={amount} setCents={setAmount} /></Field>
        <Button size="lg" className="w-full" disabled={!title.trim() || !amount} onClick={save}>Salvar meta</Button>
        {kid.goal && <Button variant="ghost" className="w-full" onClick={() => { act(E.setGoal, kid.id, null); onClose(); }}>Remover meta</Button>}
      </div>
    </Modal>
  );
}

export function WishModal({ kid, onClose }) {
  const { act, today, notify } = useStore();
  const little = isLittle(kid);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState(SPEND_EMOJIS[0]);
  const [amount, setAmount] = useState(0);
  const save = () => {
    act(E.addWish, kid.id, { title: title.trim() || emoji, emoji, price: amount }, today);
    notify(little ? '💭 Guardado! Amanhã você decide.' : '💭 Na lista! Volte amanhã para decidir.');
    onClose();
  };
  return (
    <Modal title="💭 Novo desejo" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-indigo-50 rounded-2xl p-3">
          <Speak text="Escolha o que você quer. Amanhã você decide se ainda quer." />
          <p className="text-indigo-900 font-semibold text-sm">Desejos esperam 1 dia. Se ainda quiser amanhã, é um desejo de verdade!</p>
        </div>
        <EmojiPicker options={SPEND_EMOJIS} value={emoji} onChange={setEmoji} />
        {!little && <input className={inputClass} maxLength={40} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="O que é?" />}
        {!little && <Field label="Preço (se souber)"><AmountField little={false} cents={amount} setCents={setAmount} /></Field>}
        <Button size="lg" className="w-full" onClick={save}>Guardar desejo</Button>
      </div>
    </Modal>
  );
}
