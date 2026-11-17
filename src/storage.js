/**
 * PERSISTÊNCIA LOCAL (fase 1): tudo fica neste aparelho, no localStorage.
 * Para virar SaaS, só este arquivo precisa ser trocado por um backend.
 *
 * - try/catch em tudo: modo privado do Safari e cota cheia não podem
 *   derrubar o app.
 * - Backup/restauração em arquivo JSON, porque limpar os dados do navegador
 *   apagaria o histórico da família.
 */
import { migrate } from './domain/state.js';
import { encryptBackup, decryptBackup, isEncryptedBackup } from './domain/backup.js';

const KEY = 'poupi_v1';

export const loadState = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? migrate(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

/** Retorna false se não conseguiu salvar (o app avisa os pais). */
export const saveState = (state) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
};

export const clearState = () => {
  try { localStorage.removeItem(KEY); } catch { /* nada a fazer */ }
};

const download = (text, name) => {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Com `password`, o arquivo sai criptografado (AES-GCM). Sem senha, é o JSON simples de sempre. */
export const exportBackup = async (state, password = '') => {
  const day = new Date().toISOString().slice(0, 10);
  if (password) {
    download(JSON.stringify(await encryptBackup(state, password)), `poupi-backup-${day}.criptografado.json`);
  } else {
    download(JSON.stringify(state, null, 2), `poupi-backup-${day}.json`);
  }
};

/**
 * Lê um backup. Se estiver criptografado, chama `askPassword()` (que devolve a
 * senha digitada). Backups antigos, sem criptografia, continuam funcionando.
 */
export const readBackup = (file, askPassword = async () => '') =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        let data = JSON.parse(reader.result);
        if (isEncryptedBackup(data)) {
          const password = await askPassword();
          if (!password) throw new Error('Senha necessária para abrir este backup.');
          data = await decryptBackup(data, password);
        }
        data = migrate(data);
        if (!data || !Array.isArray(data.kids)) throw new Error('Arquivo de backup inválido.');
        resolve(data);
      } catch (e) {
        reject(new Error(e.message && /Senha|inválido/.test(e.message) ? e.message : 'Arquivo de backup inválido.'));
      }
    };
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsText(file);
  });
