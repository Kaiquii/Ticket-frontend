import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const envPath = resolve(root, '.env');
const outputPath = resolve(root, 'public', 'env.js');

function parseEnv(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((values, line) => {
      const separatorIndex = line.indexOf('=');

      if (separatorIndex === -1) {
        return values;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

      values[key] = value;
      return values;
    }, {});
}

const env = parseEnv(readFileSync(envPath, 'utf8'));

if (!env.API_BASE_URL) {
  throw new Error('API_BASE_URL não foi encontrada no arquivo .env');
}

writeFileSync(
  outputPath,
  `window.__env = ${JSON.stringify({ API_BASE_URL: env.API_BASE_URL }, null, 2)};\n`,
);
