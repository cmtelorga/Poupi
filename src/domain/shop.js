/**
 * LOJA DO AVATAR — paga com estrelas (moeda de jogo), nunca com reais.
 * Sem sorteio, sem caixa-surpresa, sem item "por tempo limitado":
 * o preço está sempre visível e a escolha é da criança (autonomia, SDT).
 * Os itens mais caros ensinam a juntar estrelas para algo maior.
 */
export const SHOP = [
  { id: 'laco', emoji: '🎀', name: 'Laço', price: 30 },
  { id: 'bone', emoji: '🧢', name: 'Boné', price: 30 },
  { id: 'flor', emoji: '🌸', name: 'Flor', price: 40 },
  { id: 'oculos', emoji: '🕶️', name: 'Óculos', price: 60 },
  { id: 'cartola', emoji: '🎩', name: 'Cartola', price: 80 },
  { id: 'chapeu', emoji: '🤠', name: 'Chapéu', price: 100 },
  { id: 'formatura', emoji: '🎓', name: 'Capelo', price: 150 },
  { id: 'arco', emoji: '🌈', name: 'Arco-íris', price: 200 },
  { id: 'coroa', emoji: '👑', name: 'Coroa', price: 300 },
];

export const ANIMALS = ['🦁', '🦄', '🐼', '🐯', '🐶', '🐱', '🦊', '🐸', '🐵', '🐰', '🐻', '🐨'];

/**
 * Cores por criança. Classes escritas POR EXTENSO para o Tailwind
 * encontrá-las no build (classes montadas com `bg-${cor}` somem no build).
 */
export const COLORS = {
  indigo: { grad: 'from-indigo-500 to-violet-500', soft: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-300', solid: 'bg-indigo-500' },
  pink: { grad: 'from-pink-500 to-fuchsia-500', soft: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-300', solid: 'bg-pink-500' },
  emerald: { grad: 'from-emerald-500 to-teal-500', soft: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-300', solid: 'bg-emerald-500' },
  amber: { grad: 'from-amber-500 to-orange-500', soft: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-300', solid: 'bg-amber-500' },
  sky: { grad: 'from-sky-500 to-cyan-500', soft: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-300', solid: 'bg-sky-500' },
  rose: { grad: 'from-rose-500 to-red-500', soft: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-300', solid: 'bg-rose-500' },
};
