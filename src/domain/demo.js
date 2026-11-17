/**
 * MODO DEMONSTRAÇÃO — família fictícia para testar o app em 1 minuto.
 * Nomes fictícios de propósito: nenhum dado real fica no código.
 * PIN dos pais da demonstração: 1234.
 */
import { newState } from './state.js';
import { addDays, weekdayOf } from './dates.js';
import * as E from './engine.js';

export const DEMO_PIN = '1234';

export const buildDemo = (today) => {
  const start = addDays(today, -24); // ~3 semanas e meia de uso
  let s = newState({ pin: DEMO_PIN, allowanceWeekday: weekdayOf(addDays(today, -2)) });
  s = E.addKid(s, { name: 'Bia', age: 10, emoji: '🦊', color: 'indigo', allowance: 2000 }, start);
  s = E.addKid(s, { name: 'Tom', age: 6, emoji: '🐼', color: 'pink', allowance: 1000 }, start);
  const [bia, tom] = s.kids;

  // Rodar as automações até hoje simula as mesadas das últimas semanas.
  s = E.runAutomations(s, addDays(today, -10)).state;
  s = E.depositBank(s, bia.id, 1200, addDays(today, -9));
  s = E.depositBank(s, tom.id, 400, addDays(today, -9));
  s = E.setGoal(s, bia.id, { title: 'Patins', emoji: '🛼', target: 15000 });
  s = E.setGoal(s, tom.id, { title: 'Pelúcia grande', emoji: '🧸', target: 6000 });
  s = E.completeLesson(s, bia.id, 'origem', addDays(today, -20));
  s = E.completeLesson(s, bia.id, 'preciso-quero', addDays(today, -13));
  s = E.completeLesson(s, tom.id, 'origem', addDays(today, -19));
  s = E.addJob(s, { title: 'Lavar o carro com o papai', emoji: '🚗', reward: 500 });
  s = E.addJob(s, { title: 'Regar as plantas da varanda', emoji: '🪴', reward: 200, recurring: true });
  s = E.markJobDone(s, s.jobs[0].id, bia.id, addDays(today, -1));
  s = E.addWish(s, bia.id, { title: 'Figurinhas', emoji: '🃏', price: 800 }, addDays(today, -2));
  s = E.setFamilyGoal(s, { title: 'Piquenique no parque', emoji: '🧺', target: 10000 });
  s = E.contributeFamilyGoal(s, null, 3000, addDays(today, -5));
  s = E.thankKid(s, tom.id);
  s = E.runAutomations(s, today).state;
  s = E.createRequest(s, { kidId: tom.id, type: 'gastar', amount: 300, title: 'Picolé', emoji: '🍦' }, today);
  return s;
};
