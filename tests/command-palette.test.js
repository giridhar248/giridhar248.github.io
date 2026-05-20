import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fuzzyScore, rank } from '../assets/js/lib/command-palette.js';

test('contiguous match earlier in label scores higher', () => {
  assert.ok(fuzzyScore('proj', 'Goto Projects') > fuzzyScore('proj', 'Open Projects List Long'));
});

test('non-matching query returns -1', () => {
  assert.equal(fuzzyScore('zzz', 'Goto Projects'), -1);
});

test('subsequence match returns a positive score', () => {
  assert.ok(fuzzyScore('gpr', 'Goto Projects') > 0);
});

test('empty query treats all as neutral', () => {
  assert.equal(fuzzyScore('', 'Goto Projects'), 0);
});

test('rank filters non-matching entries', () => {
  const out = rank(
    [
      { label: 'Goto Projects' },
      { label: 'Open LinkedIn' },
      { label: 'Copy email' },
    ],
    'mail',
  );
  assert.equal(out.length, 1);
  assert.equal(out[0].label, 'Copy email');
});

test('rank sorts by descending score', () => {
  const out = rank(
    [
      { label: 'Goto Projects' },        // subseq match
      { label: 'Open Projects List' },   // contiguous 'proj' at offset 5
      { label: 'Projects only' },        // contiguous 'proj' at offset 0
    ],
    'proj',
  );
  assert.equal(out[0].label, 'Projects only');
});
