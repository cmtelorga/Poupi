/**
 * RESUMO SEMANAL PARA OS PAIS — texto simples para ler ou compartilhar
 * (WhatsApp, e-mail). Só usa dados do próprio aparelho; o compartilhamento é
 * sempre uma ação do responsável, nunca automática.
 */
import { addDays, daysBetween } from './dates.js';
import { brlShort } from './money.js';
import { LESSONS } from './lessons.js';
import * as E from './engine.js';

const sumKind = (history, kidId, kind, from, to) =>
  history
    .filter((h) => h.kidId === kidId && h.kind === kind && h.date > from && h.date <= to)
    .reduce((a, h) => a + (h.amount || 0), 0);

export const weeklyReport = (state, kid, today) => {
  const from = addDays(today, -7);
  const saved = sumKind(state.history, kid.id, 'banco', from, today);
  const spent = sumKind(state.history, kid.id, 'gasto', from, today);
  const donated = sumKind(state.history, kid.id, 'doacao', from, today);
  const lessonsThisWeek = kid.lessonsDone.filter((l) => daysBetween(l.date, today) < 7);
  const lastLesson = LESSONS.find((l) => l.id === lessonsThisWeek[lessonsThisWeek.length - 1]?.id);
  const reviews = (state.reviews || []).filter((r) => r.kidId === kid.id && r.answer && daysBetween(r.answeredDate || r.date, today) < 7);
  const goal = kid.goal ? { title: kid.goal.title, pct: Math.min(100, Math.round((E.goalProgress(kid) / kid.goal.target) * 100)) } : null;

  const lines = [`🐷 Poupi · resumo da semana de ${kid.name}`, ''];
  lines.push(`💰 Guardou no banco: ${brlShort(saved)}`);
  lines.push(`💸 Gastou: ${brlShort(spent)}`);
  lines.push(`❤️ Doou: ${brlShort(donated)}`);
  if (goal) lines.push(`🎯 Sonho "${goal.title}": ${goal.pct}%`);
  lines.push(lessonsThisWeek.length ? `📚 Lição feita: ${lastLesson?.title || 'sim'}` : '📚 Nenhuma lição nova esta semana');
  if (reviews.length) lines.push(`💭 Reflexões respondidas: ${reviews.length}`);
  lines.push(`🔥 Semanas ativas: ${E.weekStreak(kid, today)}`);
  if (lastLesson?.talk) lines.push('', `💬 Conversa sugerida: ${lastLesson.talk}`);
  lines.push('', 'Dica: mostre a eles uma decisão de dinheiro que você mesmo tomou esta semana. Crianças aprendem muito vendo os pais.');
  return lines.join('\n');
};
