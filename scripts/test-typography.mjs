import assert from 'node:assert/strict';
import { keepRussianShortWords } from '../app/typography.ts';

assert.equal(
  keepRussianShortWords('Попадает в наши сорта и в названия. Музыка и доски.'),
  'Попадает в\u00a0наши сорта и\u00a0в\u00a0названия. Музыка и\u00a0доски.',
);
console.log('PASS: short Russian words stay with the following word.');
