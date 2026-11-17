/**
 * CONQUISTAS — calculadas a partir do estado (não podem "dessincronizar").
 * Celebram AÇÕES (elogio de processo, Mueller & Dweck 1998), não rótulos.
 * Nenhuma conquista depende de tarefa doméstica paga.
 */
import { weekStreak } from './engine.js';

export const BADGES = [
  { id: 'mesada', emoji: '📅', title: 'Primeira mesada', test: (k, s) => s.history.some((h) => h.kidId === k.id && h.kind === 'mesada') },
  { id: 'banco', emoji: '🏦', title: 'Guardou no banco', test: (k, s) => s.history.some((h) => h.kidId === k.id && h.kind === 'banco') },
  { id: 'juros', emoji: '🍎', title: 'Primeiros juros', test: (k) => k.interestEarned > 0 },
  { id: 'meta', emoji: '🎯', title: 'Meta definida', test: (k) => !!k.goal || k.stats.goalsReached > 0 },
  { id: 'meta-ok', emoji: '🏆', title: 'Realizou uma meta', test: (k) => k.stats.goalsReached > 0 },
  { id: 'pensou', emoji: '💭', title: 'Pensou duas vezes', test: (k) => k.stats.wishesGivenUp > 0 },
  { id: 'doou', emoji: '❤️', title: 'Fez uma doação', test: (k) => k.stats.donations > 0 },
  { id: 'trabalho', emoji: '💼', title: 'Primeiro trabalho', test: (k) => k.stats.jobsDone > 0 },
  { id: 'familia', emoji: '👨‍👩‍👧', title: 'Ajudou a meta da família', test: (k, s) => s.history.some((h) => h.kidId === k.id && h.kind === 'familia') },
  { id: 'ajudante', emoji: '💛', title: 'Recebeu 5 obrigados', test: (k) => k.thanksTotal >= 5 },
  { id: 'leitor', emoji: '📚', title: '3 lições', test: (k) => k.lessonsDone.length >= 3 },
  { id: 'sabio', emoji: '🦉', title: 'Trilha completa', test: (k) => k.lessonsDone.length >= 12 },
  { id: 'seq3', emoji: '🔥', title: '3 semanas seguidas', test: (k, s, today) => weekStreak(k, today) >= 3 },
  { id: 'seq8', emoji: '🌟', title: '8 semanas seguidas', test: (k, s, today) => weekStreak(k, today) >= 8 },
];

export const badgesFor = (kid, state, today) => BADGES.filter((b) => b.test(kid, state, today));
