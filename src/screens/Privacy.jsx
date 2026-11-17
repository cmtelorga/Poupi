/**
 * PRIVACIDADE — texto dentro do app (funciona offline), em duas versões:
 * para os pais e para as crianças. Ver também docs/PRIVACIDADE.md.
 *
 * Linguagem: "alinhado a" LGPD art. 14 e ECA Digital (Lei 15.211/2025).
 * Isto NÃO é parecer jurídico: validar com advogado antes de qualquer
 * cadastro, sincronização ou cobrança.
 */
import { useState } from 'react';
import { Modal, Button, cx } from '../ui/kit.jsx';

export const PRIVACY_PARENTS = [
  ['O que o Poupi guarda', 'Nomes ou apelidos, idades, valores, histórico, metas e escolhas. Só isso, e só no navegador deste aparelho.'],
  ['Para onde vai', 'Para lugar nenhum. O Poupi não tem servidor, não tem cadastro e não envia nada para a internet. Sem anúncios, sem rastreadores, sem estatísticas de terceiros.'],
  ['Quem decide', 'Os pais. O painel dos pais fica atrás de um PIN. As crianças não recebem notificações, não têm links externos e não podem comprar nada.'],
  ['Seus direitos', 'Em Ajustes você baixa um backup (pode criptografar com senha) e apaga tudo com um toque. Apagar remove tudo deste aparelho.'],
  ['Limites honestos', 'O PIN de 4 números serve para a criança não entrar no painel dos pais; ele não protege contra quem tem acesso ao aparelho. Limpar os dados do navegador apaga o Poupi, por isso o backup existe. A leitura em voz alta usa a voz do próprio aparelho e, dependendo do sistema, pode usar o serviço de voz dele.'],
  ['Se isso mudar', 'Se um dia houver contas ou sincronização, o Poupi vai pedir o consentimento específico de um responsável antes de coletar qualquer dado (LGPD, art. 14), e vai avisar o que muda.'],
];

export const PRIVACY_KIDS = [
  '🔒 O Poupi guarda seus dados só neste aparelho.',
  '🙅 Ele não conta o que você faz para ninguém.',
  '👨‍👩‍👧 Seus pais é que cuidam do dinheiro de verdade.',
  '🗑️ Seus pais podem apagar tudo quando quiserem.',
  '🕵️ Nunca passe a senha ou o PIN dos seus pais para ninguém, nem por mensagem.',
];

export function PrivacyModal({ onClose, kids = false }) {
  const [tab, setTab] = useState(kids ? 'kids' : 'parents');
  return (
    <Modal title="🔒 Privacidade" onClose={onClose}>
      <div className="grid grid-cols-2 gap-2 mb-4" role="tablist">
        {[['parents', 'Para os pais'], ['kids', 'Para as crianças']].map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={cx('min-h-[44px] rounded-xl font-bold text-sm', tab === k ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600')}>{l}</button>
        ))}
      </div>
      {tab === 'parents' ? (
        <div className="space-y-3">
          {PRIVACY_PARENTS.map(([t, d]) => (
            <div key={t}><p className="font-black text-slate-800">{t}</p><p className="text-sm text-slate-600 leading-relaxed">{d}</p></div>
          ))}
          <p className="text-xs text-slate-400">Código aberto. Este texto descreve o funcionamento atual do app e não substitui orientação jurídica.</p>
        </div>
      ) : (
        <div className="space-y-3 text-lg font-bold text-slate-700">
          {PRIVACY_KIDS.map((l) => <p key={l}>{l}</p>)}
        </div>
      )}
      <Button className="w-full mt-5" onClick={onClose}>Entendi</Button>
    </Modal>
  );
}
