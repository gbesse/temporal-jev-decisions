// Purpose: Exercise the official Temporal activity context, heartbeats, cancellation and deterministic policy replay.
import test from 'node:test';
import assert from 'node:assert/strict';
import { MockActivityEnvironment } from '@temporalio/testing';
import { replay } from '@gbesse/decisionpacks';
import { readFile } from 'node:fs/promises';
import { createDecisionActivities } from '../src/index.mjs';
const read = async p => JSON.parse(await readFile(new URL(p, import.meta.url), 'utf8'));
const request = { pack: await read('../packs/support-triage.json'), state: await read('../examples/billing-state.json') };
const fixture = await read('../examples/synthetic-billing-response.json');
test('activity returns provenance and emits a native heartbeat', async () => {
  const env = new MockActivityEnvironment(); const beats = []; env.on('heartbeat', value => beats.push(value));
  const activity = createDecisionActivities({ provider: async () => structuredClone(fixture) }).jevDecision;
  const result = await env.run(activity, request); assert.equal(result.outcome, 'billing'); assert.ok(beats.length); assert.equal(result.model, request.pack.model);
});
test('recorded judgments support gate comparison without another model call', async () => {
  let calls = 0; const activity = createDecisionActivities({ provider: async () => { calls++; return structuredClone(fixture); } }).jevDecision;
  const result = await new MockActivityEnvironment().run(activity, request);
  const next = structuredClone(request.pack); next.rules[0].all[1].value = .999;
  assert.equal(replay(next, [{ record: result, state: request.state }])[0].after, 'review'); assert.equal(calls, 1);
});
test('invalid requests are non-retryable application failures', async () => {
  await assert.rejects(new MockActivityEnvironment().run(createDecisionActivities({ provider: async () => fixture }).jevDecision, { ...request, pack: {} }), error => error.nonRetryable === true && error.type === 'InvalidDecisionRequest');
});
test('native Temporal cancellation aborts the provider and fails the activity', async () => {
  const env = new MockActivityEnvironment(); let signal;
  const activity = createDecisionActivities({ provider: async options => { signal = options.signal; env.cancel(); return new Promise(() => {}); } }).jevDecision;
  await assert.rejects(env.run(activity, request)); assert.ok(signal.aborted);
});
test('provider timeout is explicit, not an invented fallback', async () => {
  const activity = createDecisionActivities({ provider: () => new Promise(() => {}), timeoutMs: 5 }).jevDecision;
  await assert.rejects(new MockActivityEnvironment().run(activity, request), /timeout/);
});
