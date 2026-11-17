import { describe, it, expect } from 'vitest';
import * as E from './engine.js';
import { newState } from './state.js';
import { splitIntoJars, toCents, jarsTotal } from './money.js';
import { weekKey, monthsAfter, addDays, weekdayOf } from './dates.js';
import { buildDemo } from './demo.js';
import { LESSONS } from './lessons.js';

const SAT = '2026-11-14'; // sábado
const base = (allowance = 2000) => {
  const s = newState({ pin: '1234', allowanceWeekday: 6 });
  return E.addKid(s, { name: 'Ana', age: 9, emoji: '🦊', color: 'indigo', allowance }, '2026-11-10');
};
const kid = (s) => s.kids[0];
const total = (k) => jarsTotal(k.jars) + k.bank;

describe('dinheiro', () => {
  it('divide nos potes sem perder centavo', () => {
    for (const c of [1, 7, 999, 1001, 2000, 12345]) {
      const p = splitIntoJars(c, { gastar: 50, poupar: 35, doar: 15 });
      expect(p.gastar + p.poupar + p.doar).toBe(c);
    }
  });
  it('pote com 0% não recebe nada', () => {
    expect(splitIntoJars(1000, { gastar: 60, poupar: 40, doar: 0 })).toEqual({ gastar: 600, poupar: 400, doar: 0 });
  });
  it('converte texto em centavos', () => {
    expect(toCents('12,50')).toBe(1250);
    expect(toCents('1.234,56')).toBe(123456);
    expect(toCents('7.5')).toBe(750);
    expect(toCents('abc')).toBeNaN();
  });
});

describe('datas', () => {
  it('semana começa na segunda', () => {
    expect(weekKey('2026-11-17')).toBe('2026-11-16');
    expect(weekKey('2026-11-22')).toBe('2026-11-16'); // domingo
  });
  it('lista meses seguintes', () => {
    expect(monthsAfter('2026-11', '2027-02')).toEqual(['2026-12', '2027-01', '2027-02']);
    expect(monthsAfter('2026-11', '2026-11')).toEqual([]);
  });
});

describe('mesada automática', () => {
  it('paga no dia configurado e divide nos potes', () => {
    const { state, events } = E.runAutomations(base(), SAT);
    expect(total(kid(state))).toBe(2000);
    expect(kid(state).jars).toEqual({ gastar: 1000, poupar: 800, doar: 200 });
    expect(events[0]).toMatchObject({ type: 'mesada', amount: 2000 });
  });
  it('não paga duas vezes no mesmo dia', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.runAutomations(s, SAT).state;
    expect(total(kid(s))).toBe(2000);
  });
  it('paga semanas atrasadas se o app ficou fechado', () => {
    const s = E.runAutomations(base(), addDays(SAT, 14)).state;
    expect(total(kid(s))).toBe(6000);
  });
  it('não paga fora do dia', () => {
    const s = E.runAutomations(base(), '2026-11-13').state;
    expect(total(kid(s))).toBe(0);
  });
});

describe('banco e juros', () => {
  it('juros compostos no virar do mês, uma vez só', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.depositBank(s, kid(s).id, 800, SAT);
    s = E.runAutomations(s, '2026-12-01').state; // dez: 3% de 800 = 24
    expect(kid(s).bank).toBe(824);
    s = E.runAutomations(s, '2026-12-02').state;
    expect(kid(s).bank).toBe(824);
    expect(kid(s).interestEarned).toBe(24);
  });
  it('não deixa depositar mais do que tem no Poupar', () => {
    const s = E.runAutomations(base(), SAT).state;
    expect(() => E.depositBank(s, kid(s).id, 801, SAT)).toThrow(E.RuleError);
  });
  it('depósito não muda o total, só o lugar', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.depositBank(s, kid(s).id, 500, SAT);
    expect(total(kid(s))).toBe(2000);
    expect(kid(s).bank).toBe(500);
  });
});

describe('pedidos', () => {
  it('gasto aprovado sai do pote certo', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.createRequest(s, { kidId: kid(s).id, type: 'gastar', amount: 300, title: 'Gibi', emoji: '📗' }, SAT);
    s = E.resolveRequest(s, s.requests[0].id, true, SAT);
    expect(kid(s).jars.gastar).toBe(700);
    expect(s.requests).toHaveLength(0);
  });
  it('recusado não mexe no saldo', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.createRequest(s, { kidId: kid(s).id, type: 'doar', amount: 200, title: 'Abrigo', emoji: '🐶' }, SAT);
    s = E.resolveRequest(s, s.requests[0].id, false, SAT);
    expect(total(kid(s))).toBe(2000);
  });
  it('não aceita pedido maior que o pote', () => {
    const s = E.runAutomations(base(), SAT).state;
    expect(() => E.createRequest(s, { kidId: kid(s).id, type: 'gastar', amount: 1001, title: 'x' }, SAT)).toThrow();
  });
  it('realizar meta usa Poupar e depois banco', () => {
    let s = E.runAutomations(base(), SAT).state;
    s = E.depositBank(s, kid(s).id, 500, SAT);
    s = E.setGoal(s, kid(s).id, { title: 'Bola', emoji: '⚽', target: 700 });
    s = E.createRequest(s, { kidId: kid(s).id, type: 'meta', amount: 700, title: 'Bola' }, SAT);
    s = E.resolveRequest(s, s.requests[0].id, true, SAT);
    expect(kid(s).jars.poupar).toBe(0);
    expect(kid(s).bank).toBe(100);
    expect(kid(s).goal).toBeNull();
    expect(kid(s).stats.goalsReached).toBe(1);
  });
});

describe('tarefas e trabalhos', () => {
  it('tarefa da família NÃO gera dinheiro nem estrelas', () => {
    let s = base();
    const t = kid(s).familyTasks[0];
    s = E.toggleFamilyTask(s, kid(s).id, t.id, SAT);
    expect(total(kid(s))).toBe(0);
    expect(kid(s).stars).toBe(0);
    expect(kid(s).taskLog[SAT]).toEqual([t.id]);
  });
  it('trabalho extra só paga depois da aprovação', () => {
    let s = E.addJob(base(), { title: 'Lavar carro', emoji: '🚗', reward: 500 });
    s = E.markJobDone(s, s.jobs[0].id, kid(s).id, SAT);
    expect(total(kid(s))).toBe(0);
    s = E.resolveJob(s, s.jobs[0].id, true, SAT);
    expect(total(kid(s))).toBe(500);
    expect(s.jobs).toHaveLength(0);
  });
  it('trabalho recorrente volta a ficar disponível', () => {
    let s = E.addJob(base(), { title: 'Regar', emoji: '🪴', reward: 200, recurring: true });
    s = E.markJobDone(s, s.jobs[0].id, kid(s).id, SAT);
    s = E.resolveJob(s, s.jobs[0].id, true, SAT);
    expect(s.jobs[0].status).toBe('aberto');
  });
});

describe('gamificação', () => {
  it('missão só é resgatada depois de feita, uma vez', () => {
    let s = base();
    expect(() => E.claimMission(s, kid(s).id, 'licao', SAT)).toThrow();
    s = E.completeLesson(s, kid(s).id, 'origem', SAT);
    s = E.claimMission(s, kid(s).id, 'licao', SAT);
    expect(kid(s).stars).toBe(20 + 15);
    expect(() => E.claimMission(s, kid(s).id, 'licao', SAT)).toThrow();
  });
  it('sequência conta semanas e tolera a semana atual em aberto', () => {
    let s = base();
    for (const d of ['2026-11-02', '2026-11-09']) {
      s = E.completeLesson(s, kid(s).id, d, d); // id qualquer, só para marcar atividade
      s = E.claimMission(s, kid(s).id, 'licao', d);
    }
    expect(E.weekStreak(kid(s), '2026-11-17')).toBe(2);
  });
  it('nível sobe com estrelas ganhas', () => {
    expect(E.levelFor(0)).toBe(1);
    expect(E.levelFor(49)).toBe(1);
    expect(E.levelFor(50)).toBe(2);
    expect(E.levelFor(150)).toBe(3);
    expect(E.starsForLevel(3)).toBe(150);
  });
  it('libera uma lição por semana', () => {
    const k = kid(base());
    expect(E.lessonsUnlocked(k, '2026-11-10', LESSONS.length)).toBe(1);
    expect(E.lessonsUnlocked(k, '2026-11-17', LESSONS.length)).toBe(2);
  });
});

describe('demonstração', () => {
  it('monta sem erro e com contas fechando', () => {
    const today = '2026-11-17';
    const s = buildDemo(today);
    expect(s.kids).toHaveLength(2);
    for (const k of s.kids) expect(total(k)).toBeGreaterThan(0);
    expect(s.requests).toHaveLength(1);
    expect(weekdayOf(today)).toBeTypeOf('number');
  });
});
