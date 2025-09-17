import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function replaceQuotes(content) {
  return content
    .replace(/'/g, "'")
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/&/g, '&');
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fixed = replaceQuotes(content);
  fs.writeFileSync(filePath, fixed);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      processFile(filePath);
    }
  });
}

// Get the root directory (one level up from scripts folder)
const rootDir = path.join(__dirname, '..');
walkDir(rootDir);
