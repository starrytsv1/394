import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Exercise the actual pointer handler without requiring a browser or test framework.
const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const handler = page.match(/onPointerMove=\{(event => \{[\s\S]*?\n        \})\}/)?.[1];
assert.ok(handler, 'Beer drag handler must be present');
const beerDrag = { current: null };
let previewClosed = false;
const move = runInNewContext(`(${handler})`, {
  beerDrag,
  setPreviewBeer: value => { previewClosed = value === null; },
});
const rail = { scrollLeft: 200 };
move({ clientX: 50, currentTarget: rail });
assert.equal(rail.scrollLeft, 200, 'Moving without a drag must not scroll');
beerDrag.current = { x: 100, scroll: 200 };
move({ clientX: 98, currentTarget: rail });
assert.equal(rail.scrollLeft, 202);
assert.equal(previewClosed, false, 'Small pointer jitter must not close the description');
move({ clientX: 50, currentTarget: rail });
assert.equal(rail.scrollLeft, 250, 'Dragging left advances the shelf');
assert.equal(previewClosed, true);
move({ clientX: 150, currentTarget: rail });
assert.equal(rail.scrollLeft, 150, 'Dragging right goes backwards');
for (const label of ['Предыдущая страница фотографий', 'Следующая страница фотографий', 'Предыдущая страница мерча', 'Следующая страница мерча']) {
  assert.ok(page.includes(`aria-label="${label}"`), `Missing control: ${label}`);
}
const icons = readFileSync(new URL('../app/morph-ui.tsx', import.meta.url), 'utf8');
assert.equal(icons.includes('active ? to : from'), false, 'Arrow shape must stay stable on hover');
console.log('Video-review controls: all checks passed');
