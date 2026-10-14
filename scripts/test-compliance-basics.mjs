// Source regression checks, not a legal certification or a runtime network audit.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const read = path => readFileSync(path, 'utf8');
const legal = read('app/legal-compliance.tsx');
const page = read('app/page.tsx');
assert(legal.includes('Без сохранения'));
assert(legal.includes("if (choice === 'necessary')"));
assert(!legal.includes('<b>Оператор:</b> Switch Brewing'));
assert(!legal.includes('Данные не продаются'));
assert(!page.includes('className="beer-status"'));
assert(read('app/layout.tsx').includes("referrer: 'no-referrer'"));
function files(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}
const clients = files('app').filter(path => /\.tsx$/.test(path));
for (const path of clients) {
  assert(!/<form\b|<iframe\b|sendBeacon\s*\(|XMLHttpRequest|document\.cookie\s*=/.test(read(path)), `Review data flow in ${path}`);
}
for (const name of ['neucha', 'geist', 'geistmono', 'caveat']) {
  assert(read(`public/licenses/${name}-OFL.txt`).includes('SIL OPEN FONT LICENSE'));
}
console.log('PASS: storage choice, truthful notices, no featured badge, referrer policy, source data-flow checks, font notices.');
