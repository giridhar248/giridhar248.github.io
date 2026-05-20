import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeProgress } from '../assets/js/lib/scroll-progress.js';

test('returns 0 at the top of the page', () => {
  assert.equal(computeProgress(0, 5000, 800), 0);
});

test('returns 1 at the bottom of the page', () => {
  assert.equal(computeProgress(4200, 5000, 800), 1);
});

test('returns 0.5 at the midpoint of scrollable area', () => {
  assert.equal(computeProgress(2100, 5000, 800), 0.5);
});

test('clamps over-scroll to 1', () => {
  assert.equal(computeProgress(9999, 5000, 800), 1);
});

test('returns 0 when content fits in the viewport', () => {
  assert.equal(computeProgress(0, 600, 800), 0);
});

test('handles zero scrollHeight gracefully', () => {
  const v = computeProgress(0, 0, 800);
  assert.ok(v >= 0 && v <= 1);
});
