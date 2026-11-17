/**
 * MODELO DE DADOS (versão 1)
 *
 * Princípio central — "banco da família" (modelo FamZoo):
 *   O dinheiro de verdade fica com os pais. O app é o livro-caixa que diz
 *   quanto pertence a cada criança. Isso evita qualquer regulação bancária,
 *   não expõe dados financeiros reais e funciona sem internet.
 *
 * Regra de ouro do livro-caixa:
 *   saldo total da criança = gastar + poupar + doar + banco
 *   Não existe um campo "balance" separado que possa dessincronizar
 *   (esse era um bug do protótipo original).
 *
 * Regra de autonomia:
 *   - Movimentos INTERNOS (pote -> banco, pote -> meta da família) a criança
 *     faz sozinha: são decisões que ela precisa praticar.
 *   - Dinheiro que SAI do livro-caixa (gastar de verdade, doar de verdade)
 *     vira um pedido que os pais aprovam, porque são eles que entregam o
 *     dinheiro físico.
 */
import { todayKey, monthKey, addDays } from './dates.js';
import { hashPin, uid } from './ids.js';
import { DEFAULT_INTEREST_BPS, DEFAULT_WISH_WAIT } from './config.js';

export const SCHEMA_VERSION = 2;

/** Crianças até 7 anos usam o modo "pequeno" (lúdico); 8+ usam o modo "grande" (autônomo). */
export const isLittle = (kid) => kid.age <= 7;

export const DEFAULT_SPLIT = { gastar: 50, poupar: 40, doar: 10 };

/** Tarefas de CONTRIBUIÇÃO familiar: sem pagamento (ver docs/PESQUISA.md, seção 2). */
export const DEFAULT_FAMILY_TASKS = (little) =>
  little
    ? [
        { id: uid('ft'), title: 'Guardar os brinquedos', emoji: '🧸' },
        { id: uid('ft'), title: 'Levar o prato para a pia', emoji: '🍽️' },
        { id: uid('ft'), title: 'Arrumar a cama', emoji: '🛏️' },
      ]
    : [
        { id: uid('ft'), title: 'Arrumar o quarto', emoji: '🛏️' },
        { id: uid('ft'), title: 'Ajudar a pôr a mesa', emoji: '🍽️' },
        { id: uid('ft'), title: 'Separar o lixo reciclável', emoji: '♻️' },
      ];

export const newKid = ({ name, age, emoji, color, allowance }, today = todayKey()) => ({
  id: uid('k'),
  name: name.trim(),
  age: Number(age),
  emoji,
  color,
  jars: { gastar: 0, poupar: 0, doar: 0 },
  bank: 0,
  interestEarned: 0,
  split: { ...DEFAULT_SPLIT },
  allowance, // centavos por semana
  interestBps: DEFAULT_INTEREST_BPS, // "bônus da família": 1% ao mês por padrão (docs/PESQUISA.md); famílias antigas mantêm o que já tinham
  lastAllowanceDate: addDays(today, -1), // a primeira mesada já cai se hoje for o dia
  lastInterestMonth: monthKey(today),
  startDate: today,
  goal: null, // { title, emoji, target }
  familyTasks: DEFAULT_FAMILY_TASKS(Number(age) <= 7),
  taskLog: {}, // { 'AAAA-MM-DD': [taskId, ...] }
  thanksPending: 0, // "obrigados" dos pais ainda não vistos
  thanksTotal: 0,
  lessonsDone: [], // [{ id, date }]
  wishes: [], // lista de desejos: [{ id, title, emoji, price, date }]
  stars: 0,
  starsEarned: 0,
  claimedMissions: {}, // { semana: [missionId] }
  weekActs: {}, // { semana: { licao, banco, desejo, familia } } — progresso das missões
  owned: [],
  wearing: null,
  seenBadges: [],
  stats: { wishesGivenUp: 0, donations: 0, jobsDone: 0, goalsReached: 0 },
});

export const newState = ({ pin, allowanceWeekday = 6 }) => ({
  version: SCHEMA_VERSION,
  createdAt: todayKey(),
  pinHash: hashPin(pin),
  settings: { allowanceWeekday, wishWait: { ...DEFAULT_WISH_WAIT } }, // 0=domingo ... 6=sábado
  kids: [],
  jobs: [], // trabalhos extras PAGOS e opcionais
  requests: [], // pedidos que os pais aprovam
  history: [],
  reviews: [], // reflexões: "valeu a pena?" (gasto) e "como se sentiu?" (doação)
  familyGoal: null, // { title, emoji, target, saved }
  familyGoalsDone: 0,
  parent: {
    lessonsDone: [], // [{ id, date }]
    challengesDone: [], // ids das lições cujo desafio prático foi feito
    talks: [], // [{ kidId, lessonId, date }] — "papo da semana" registrado
    xp: 0,
  },
});

/**
 * Migração de versões salvas. v1 → v2 só ACRESCENTA campos (nada é apagado):
 * famílias antigas mantêm a taxa de juros que já tinham.
 */
export const migrate = (saved) => {
  if (!saved || typeof saved !== 'object') return null;
  if (saved.version === SCHEMA_VERSION) return saved;
  if (saved.version === 1 && Array.isArray(saved.kids)) {
    return {
      ...saved,
      version: SCHEMA_VERSION,
      settings: { ...saved.settings, wishWait: { ...DEFAULT_WISH_WAIT, ...(saved.settings?.wishWait || {}) } },
      reviews: saved.reviews || [],
    };
  }
  return null; // formato desconhecido (ex.: protótipo antigo): começa do zero
};
