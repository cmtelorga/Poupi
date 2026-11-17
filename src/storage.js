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

export const exportBackup = (state) => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `poupi-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const readBackup = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = migrate(JSON.parse(reader.result));
        if (!data || !Array.isArray(data.kids)) throw new Error('formato');
        resolve(data);
      } catch {
        reject(new Error('Arquivo de backup inválido.'));
      }
    };
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsText(file);
  });
