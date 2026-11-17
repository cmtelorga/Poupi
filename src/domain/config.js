/**
 * CONFIGURAÇÃO PEDAGÓGICA — valores que a pesquisa recomenda e que podem
 * mudar com o tempo. Ficam num só lugar, com data, para serem revisados.
 * Ver docs/PESQUISA.md ("Atualização de nov/2026").
 */

/** Juros-padrão do "bônus da família" para crianças novas: 1% ao mês (100 bps). */
export const DEFAULT_INTEREST_BPS = 100;

/**
 * Referência de mercado usada no "cartão de realidade" do simulador.
 * ≈ Selic de 13,75% a.a. (≈1,08% a.m.), arredondada para 1% a.m.
 * REVISAR quando a Selic mudar (última conferência: nov/2026).
 */
export const MARKET_REF = { bps: 100, label: 'no banco de verdade', checkedAt: '2026-11' };

/** Acima disto, os pais veem um aviso: a taxa distorce a ideia de quanto o dinheiro rende. */
export const INTEREST_WARN_BPS = 150;

/**
 * Espera antes de decidir um desejo, proporcional ao preço em "mesadas".
 * Padrão: até 1 mesada → 1 dia; até 4 mesadas → 3 dias; mais que isso → 7 dias.
 * Os pais podem editar em Ajustes. O mínimo é sempre 1 dia.
 */
export const DEFAULT_WISH_WAIT = { smallDays: 1, midDays: 3, bigDays: 7, midFromAllowances: 1, bigFromAllowances: 4 };

/** Aviso gentil de pausa (não bloqueia): diretrizes de uso conjunto e sessões curtas. */
export const SESSION_BREAK_MINUTES = 10;

/** Semana de "folga": uma semana sem atividade não quebra a sequência. */
export const STREAK_GRACE_WEEKS = 1;
