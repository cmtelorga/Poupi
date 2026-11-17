/**
 * BACKUP CRIPTOGRAFADO (opcional): AES-GCM com chave derivada da senha (PBKDF2).
 * Funciona no navegador e no Node (WebCrypto). Sem senha, o backup continua
 * sendo o JSON simples de antes; arquivos antigos seguem sendo aceitos.
 */
const ITER = 250_000;
const enc = new TextEncoder();
const dec = new TextDecoder();

const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

const keyFrom = async (password, salt) => {
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
};

export const isEncryptedBackup = (obj) => !!obj && obj.poupiBackup === 2 && obj.encrypted === true;

export const encryptBackup = async (state, password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFrom(password, salt);
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(state)));
  return { poupiBackup: 2, encrypted: true, salt: b64(salt), iv: b64(iv), data: b64(data) };
};

export const decryptBackup = async (envelope, password) => {
  try {
    const key = await keyFrom(password, unb64(envelope.salt));
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(envelope.iv) }, key, unb64(envelope.data));
    return JSON.parse(dec.decode(plain));
  } catch {
    throw new Error('Senha incorreta ou arquivo danificado.');
  }
};
