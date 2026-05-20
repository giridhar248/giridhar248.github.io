import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatRelativeTime } from '../assets/js/lib/github-stats.js';

const NOW = new Date('2026-05-20T12:00:00Z').getTime();
const iso = (d) => new Date(d).toISOString();

test('returns "today" for activity earlier today', () => {
  assert.equal(formatRelativeTime(NOW, iso('2026-05-20T02:00:00Z')), 'today');
});

test('returns days ago for activity in last week', () => {
  assert.equal(formatRelativeTime(NOW, iso('2026-05-17T12:00:00Z')), '3d ago');
});

test('returns weeks ago for activity in last 2 months', () => {
  assert.equal(formatRelativeTime(NOW, iso('2026-04-15T12:00:00Z')), '5w ago');
});

test('returns months ago for activity in last year', () => {
  assert.equal(formatRelativeTime(NOW, iso('2026-01-01T12:00:00Z')), '4mo ago');
});

test('returns years ago for older activity', () => {
  assert.equal(formatRelativeTime(NOW, iso('2024-01-01T12:00:00Z')), '2y ago');
});

test('returns em-dash for invalid date', () => {
  assert.equal(formatRelativeTime(NOW, 'not-a-date'), '—');
});
