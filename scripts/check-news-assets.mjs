import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

for (const [prefix, count] of [['festival', 20], ['trepang', 4]]) {
  for (let i = 1; i <= count; i++) assert(existsSync(`public/news/${prefix}-${i}.jpg`));
}
for (const name of ['two-step', 'tiki', 'lemon-hazed']) assert(existsSync(`public/optimized/${name}-front.png`));
assert(existsSync('public/news/rule-taproom.jpg'));
const source = readFileSync('app/news-gallery.tsx', 'utf8');
// lucide exports icon data, not React components; render via the existing adapter.
assert(!/<Chevron(?:Left|Right)\b/.test(source), 'Render lucide data through MorphButton');
assert(source.includes("from './morph-ui'"));
const expression = source.match(/const next = (.*);/)[1];
const next = new Function('index', 'step', 'images', `return ${expression}`);
assert.equal(next(0, -1, Array(20)), 0);
assert.equal(next(19, 1, Array(20)), 19);
assert.equal(next(0, 1, Array(4)), 1);
console.log('Gallery assets and bounded navigation: OK');
