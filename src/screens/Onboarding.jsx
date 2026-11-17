/**
 * PRIMEIRO USO: cria a família do zero (sem dados falsos) ou abre a
 * demonstração. Explica em 3 frases o modelo pedagógico antes de começar.
 */
import { useState } from 'react';
import { useStore } from '../store.jsx';
import { Button, Card, Field, MoneyInput, EmojiPicker, PinPad, PasswordModal, inputClass, cx, color } from '../ui/kit.jsx';
import { PrivacyModal } from './Privacy.jsx';
import { newState } from '../domain/state.js';
import { addKid, runAutomations } from '../domain/engine.js';
import { buildDemo } from '../domain/demo.js';
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
  const [consent, setConsent] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [askPass, setAskPass] = useState(null); // { resolve }

  const finish = () => {
    let s = newState({ pin, allowanceWeekday: weekday });
    for (const k of kids) s = addKid(s, k, today);
    replace(runAutomations(s, today).state);
  };

  const restore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readBackup(file, () => new Promise((resolve) => setAskPass({ resolve })));
      replace(data);
      notify('Backup restaurado!');
    } catch (err) { notify(err.message, 'error'); }
    e.target.value = '';
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center fade-in">
          <div className="text-8xl float" aria-hidden>🐷</div>
          <h1 className="text-5xl font-black mt-2">Poupi</h1>
          <p className="text-white/90 text-lg mt-2">Educação financeira para crianças, com a família junto.</p>
          <ul className="mt-5 space-y-2 text-left text-white/95 font-semibold text-sm bg-white/10 rounded-2xl p-4">
            <li>🫙 A mesada se divide em 3 potes: <b>gastar, poupar e doar</b>.</li>
            <li>⏳ Desejos esperam um tempo antes da decisão: nada de compra por impulso.</li>
            <li>💬 Os pais aprendem junto, com uma conversa sugerida por semana.</li>
            <li>🔒 Sem anúncios e sem cadastro: tudo fica só neste aparelho.</li>
          </ul>
          <div className="mt-6 space-y-3">
            <Button variant="white" size="lg" className="w-full" onClick={() => setStep('how')}>Criar minha família</Button>
            <Button variant="ghost" className="w-full !text-white border-2 border-white/40" onClick={() => replace(buildDemo(today))}>
              👀 Ver demonstração
            </Button>
            <label className="w-full min-h-[48px] rounded-2xl border-2 border-white/40 text-white font-bold flex items-center justify-center cursor-pointer">
              ⬆️ Restaurar um backup
              <input type="file" accept="application/json" className="hidden" onChange={restore} />
            </label>
            <button type="button" onClick={() => setPrivacy(true)} className="text-white/90 text-sm font-bold underline min-h-[44px]">Privacidade: como o Poupi guarda os dados</button>
          </div>
        </div>
        {privacy && <PrivacyModal onClose={() => setPrivacy(false)} />}
        {askPass && <PasswordModal title="🔐 Backup protegido" hint="Digite a senha que você criou ao baixar este backup." submitLabel="Abrir" onClose={() => { askPass.resolve(''); setAskPass(null); }} onSubmit={(pw) => { askPass.resolve(pw); setAskPass(null); }} />}
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
            <Button size="lg" className="w-full mt-6" onClick={() => setStep('consent')}>Vamos lá</Button>
          </Card>
        )}

        {step === 'consent' && (
          <Card>
            <h2 className="text-2xl font-extrabold text-slate-800">Antes de começar</h2>
            <p className="text-slate-600 mt-2">O Poupi guarda nomes ou apelidos, idades e valores <b>só neste aparelho</b>. Não envia nada para a internet, não tem anúncios e não rastreia ninguém.</p>
            <button type="button" className="mt-3 text-indigo-600 font-bold underline min-h-[44px]" onClick={() => setPrivacy(true)}>Ler como os dados são guardados</button>
            <label className="flex items-start gap-3 mt-3 bg-slate-50 rounded-2xl p-4 cursor-pointer">
              <input type="checkbox" className="mt-1 w-6 h-6 accent-indigo-500" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span className="text-slate-700 font-semibold">Sou pai, mãe ou responsável legal pelas crianças que vou cadastrar e concordo com o uso descrito.</span>
            </label>
            <Button size="lg" className="w-full mt-5" disabled={!consent} onClick={() => { setStep('pin'); }}>Continuar</Button>
            <Button variant="ghost" className="w-full mt-2" onClick={() => setStep('how')}>Voltar</Button>
            {privacy && <PrivacyModal onClose={() => setPrivacy(false)} />}
          </Card>
        )}

        {step === 'pin' && (
          <Card>
            <PinPad title="Crie o PIN dos pais" subtitle="4 números. Ele protege o painel dos pais."
              onSubmit={(p) => { setPin(p); setPinError(''); setStep('pin2'); }} onCancel={() => setStep('consent')} />
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
