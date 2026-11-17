/** ID curto e único o suficiente para um app local (crypto.randomUUID não existe em http:// na rede local). */
export const uid = (prefix = '') =>
  prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/**
 * Hash simples (cyrb53) para o PIN dos pais.
 * HONESTIDADE: isto NÃO é segurança contra um adulto com acesso ao aparelho
 * (o localStorage é legível). O objetivo é só impedir que a criança entre no
 * painel dos pais e se pague sozinha.
 */
export const hashPin = (pin, salt = 'poupi') => {
  const str = `${salt}:${pin}`;
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
};
