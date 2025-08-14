// Mini "DB" fichier JSON avec une file d'attente (queue) pour sérialiser les écritures
// Évite la corruption en cas de multiples writes quasi simultanés sur un même process.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function ensureFile(path, defaultValue) {
  // Crée le fichier + dossiers parents si absent
  try {
    await readFile(path, 'utf-8');
  } catch {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, JSON.stringify(defaultValue, null, 2));
  }
}

export class FileDB {
  constructor(path, defaultValue) {
    // Supporte chemins relatifs à /backend
    this.path = path.startsWith('/') ? path : `${__dirname}/../${path}`;
    this.defaultValue = defaultValue;
    this._queue = Promise.resolve(); // queue = promesse chaînée
  }

  async _read() {
    await ensureFile(this.path, this.defaultValue);
    const raw = await readFile(this.path, 'utf-8');
    return raw ? JSON.parse(raw) : this.defaultValue;
  }

  async _write(data) {
    await writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async read() {
    // Lecture attend le tour actuel de la queue
    return this._queue.then(() => this._read());
  }

  async write(mutator) {
    // Toute écriture est sérialisée via la queue
    this._queue = this._queue.then(async () => {
      const data = await this._read();
      const next = await mutator(structuredClone(data));
      await this._write(next);
    });
    return this._queue;
  }
}