import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const deployDir = join(root, 'deploy');
const bestzip = join(root, 'backend', 'node_modules', '.bin', 'bestzip');

mkdirSync(deployDir, { recursive: true });

function zip(cwd, output, files) {
  const cmd = `"${bestzip}" "${output}" ${files.join(' ')}`;
  execSync(cmd, { cwd, stdio: 'inherit', shell: true });
}

const target = process.argv[2];

if (target === 'backend' || target === 'all') {
  execSync('npm run build:zip --prefix backend', { cwd: root, stdio: 'inherit', shell: true });
  console.log('Created deploy/backend-deploy.zip');
}

if (target === 'frontend' || target === 'all') {
  execSync('npm run build --prefix frontend', { cwd: root, stdio: 'inherit', shell: true });
  zip(join(root, 'frontend'), join(deployDir, 'frontend-deploy.zip'), ['dist']);
  console.log('Created deploy/frontend-deploy.zip');
}

if (!target || !['backend', 'frontend', 'all'].includes(target)) {
  console.error('Usage: node deploy/zip.mjs [backend|frontend|all]');
  process.exit(1);
}
