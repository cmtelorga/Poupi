/**
 * PRIMEIRO USO: cria a família do zero (sem dados falsos) ou abre a
 * demonstração. Explica em 3 frases o modelo pedagógico antes de começar.
 */
import { useState } from 'react';
import { useStore } from '../store.jsx';
import { Button, Card, Field, MoneyInput, EmojiPicker, PinPad, inputClass, cx, color } from '../ui/kit.jsx';
import { newState } from '../domain/state.js';
import { addKid, runAutomations } from '../domain/engine.js';
import { buildDemo, DEMO_PIN } from '../domain/demo.js';
import { WEEKDAYS } from '../domain/dates.js';
import { toCents, brlShort } from '../domain/money.js';
import { ANIMALS, COLORS } from '../domain/shop.js';
import { readBackup } from '../storage.js';

export default function Onboarding() {
  const { replace, today, notify } = useStore();
  const [step, setStep] = useState('welcome');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [weekday, setWeekday] = useState(6);
  const [kids, setKids] = useState([]);

  const finish = () => {
    let s = newState({ pin, allowanceWeekday: weekday });
    for (const k of kids) s = addKid(s, k, today);
    replace(runAutomations(s, today).state);
  };

  const restore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { replace(await readBackup(file)); notify('Backup restaurado!'); } catch (err) { notify(err.message, 'error'); }
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center fade-in">
          <div className="text-8xl float" aria-hidden>🐷</div>
          <h1 className="text-5xl font-black mt-2">Poupi</h1>
          <p className="text-white/90 text-lg mt-2">Educação financeira para crianças, com a família junto.</p>
          <div className="mt-8 space-y-3">
            <Button variant="white" size="lg" className="w-full" onClick={() => setStep('how')}>Criar minha família</Button>
            <Button variant="ghost" className="w-full !text-white border-2 border-white/40" onClick={() => replace(buildDemo(today))}>
              👀 Ver demonstração (PIN {DEMO_PIN})
            </Button>
            <label className="block text-white/80 text-sm underline cursor-pointer pt-2">
              Restaurar um backup
              <input type="file" accept="application/json" className="hidden" onChange={restore} />
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <div className="max-w-md mx-auto fade-in" key={step}>
        {step === 'how' && (
          <Card>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-4">Como o Poupi funciona</h2>
            <ul className="space-y-4 text-slate-700">
              <li className="flex gap-3"><span className="text-3xl">🏦</span><span><b>O dinheiro de verdade fica com você.</b> O app é o “banco da família”: anota quanto é de cada criança.</span></li>
              <li className="flex gap-3"><span className="text-3xl">📅</span><span><b>Mesada fixa, toda semana, no mesmo dia.</b> Ela cai sozinha e se divide em 3 potes: Gastar, Poupar e Doar.</span></li>
              <li className="flex gap-3"><span className="text-3xl">🧹</span><span><b>Ajudar em casa não é pago</b> — vale um “obrigado”. Já os <b>trabalhos extras</b> (combinados antes) rendem dinheiro.</span></li>
              <li className="flex gap-3"><span className="text-3xl">💬</span><span><b>Você também aprende.</b> A Jornada dos Pais explica a ciência por trás de cada escolha e sugere um papo por semana.</span></li>
            </ul>
            <Button size="lg" className="w-full mt-6" onClick={() => setStep('pin')}>Vamos lá</Button>
          </Card>
        )}

        {step === 'pin' && (
          <Card>
            <PinPad title="Crie o PIN dos pais" subtitle="4 números. Ele protege o painel dos pais."
              onSubmit={(p) => { setPin(p); setPinError(''); setStep('pin2'); }} onCancel={() => setStep('how')} />
          </Card>
        )}
        {step === 'pin2' && (
          <Card>
            <PinPad title="Confirme o PIN" error={pinError}
              onSubmit={(p) => (p === pin ? setStep('day') : setPinError('Os PINs não batem. Tente de novo.'))}
              onCancel={() => setStep('pin')} />
          </Card>
        )}

        {step === 'day' && (
          <Card>
            <h2 className="text-2xl font-extrabold text-slate-800">Dia da mesada</h2>
            <p className="text-slate-500 mt-1 mb-4">Escolha um dia fixo. Previsibilidade ensina confiança e paciência.</p>
            <div className="grid grid-cols-2 gap-2">
              {WEEKDAYS.map((d, i) => (
                <button key={d} type="button" onClick={() => setWeekday(i)}
                  className={cx('py-3 rounded-2xl font-bold capitalize', weekday === i ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600')}>{d}</button>
              ))}
            </div>
            <Button size="lg" className="w-full mt-5" onClick={() => setStep('kids')}>Continuar</Button>
          </Card>
        )}

        {step === 'kids' && (
          <div className="space-y-4">
            <Card>
              <h2 className="text-2xl font-extrabold text-slate-800">Suas crianças</h2>
              <p className="text-slate-500 mt-1">Use só o primeiro nome ou um apelido. Nada sai deste aparelho.</p>
              {kids.length > 0 && (
                <div className="mt-4 space-y-2">
                  {kids.map((k, i) => (
                    <div key={i} className={cx('flex items-center gap-3 p-3 rounded-2xl', color(k.color).soft)}>
                      <span className="text-3xl">{k.emoji}</span>
                      <div className="flex-1"><b>{k.name}</b>, {k.age} anos · {brlShort(k.allowance)}/semana</div>
                      <button type="button" className="text-slate-400 font-bold px-2" aria-label={`Remover ${k.name}`} onClick={() => setKids(kids.filter((_, j) => j !== i))}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            <KidForm onAdd={(k) => setKids([...kids, k])} used={kids.map((k) => k.color)} />
            <Button size="lg" variant="success" className="w-full" disabled={!kids.length} onClick={finish}>
              Pronto! Abrir o Poupi 🎉
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function KidForm({ onAdd, used = [], submitLabel = '+ Adicionar criança' }) {
  const firstFree = Object.keys(COLORS).find((c) => !used.includes(c)) || 'indigo';
  const [name, setName] = useState('');
  const [age, setAge] = useState(8);
  const [emoji, setEmoji] = useState(ANIMALS[used.length % ANIMALS.length]);
  const [col, setCol] = useState(firstFree);
  const [allowance, setAllowance] = useState('');

  const suggested = age <= 7 ? 1000 : 2000;
  const submit = () => {
    const cents = allowance ? toCents(allowance) : suggested;
    if (!name.trim() || Number.isNaN(cents) || cents < 0) return;
    onAdd({ name: name.trim(), age: Number(age), emoji, color: col, allowance: cents });
    setName(''); setAllowance('');
    const next = Object.keys(COLORS).find((c) => ![...used, col].includes(c));
    if (next) setCol(next);
  };

  return (
    <Card className="space-y-4">
      <Field label="Nome ou apelido">
        <input className={inputClass} value={name} maxLength={20} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Ana" />
      </Field>
      <Field label={`Idade: ${age} anos`} hint={age <= 7 ? 'Modo lúdico: botões grandes, pouco texto, áudio.' : 'Modo autônomo: mais números e decisões.'}>
        <input type="range" min={5} max={12} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full accent-indigo-500" />
      </Field>
      <Field label="Bichinho"><EmojiPicker options={ANIMALS} value={emoji} onChange={setEmoji} /></Field>
      <Field label="Cor">
        <div className="flex gap-2">
          {Object.keys(COLORS).map((c) => (
            <button key={c} type="button" aria-label={`Cor ${c}`} aria-pressed={col === c} onClick={() => setCol(c)}
              className={cx('w-10 h-10 rounded-full bg-gradient-to-br', COLORS[c].grad, col === c && 'ring-4 ring-offset-2 ' + COLORS[c].ring)} />
          ))}
        </div>
      </Field>
      <Field label="Mesada por semana" hint={`Sugestão: ${brlShort(suggested)}. Comece pequeno; dá para mudar depois.`}>
        <MoneyInput value={allowance} onChange={setAllowance} placeholder={String(suggested / 100)} />
      </Field>
      <Button variant="soft" className="w-full" onClick={submit} disabled={!name.trim()}>{submitLabel}</Button>
    </Card>
  );
}
