// Re-evaluate a recorded synthetic judgment under a changed gate without another model call.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { MockActivityEnvironment } from '@temporalio/testing';
import { replay } from '@gbesse/decisionpacks';
import { createDecisionActivities } from '../src/index.mjs';

const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const request = { pack: await read('../packs/support-triage.json'), state: await read('./billing-state.json') };
const fixture = await read('./synthetic-billing-response.json');
let calls = 0;
const activity = createDecisionActivities({ provider: async () => { calls++; return structuredClone(fixture); } }).jevDecision;
const record = await new MockActivityEnvironment().run(activity, request);
const stricter = structuredClone(request.pack);
stricter.rules[0].all[1].value = 0.999;
const compared = replay(stricter, [{ record, state: request.state }])[0];
assert.equal(record.outcome, 'billing');
assert.equal(compared.after, 'review');
assert.equal(calls, 1);
console.log(JSON.stringify({ synthetic: true, original: record.outcome, stricterGate: compared.after, modelCalls: calls }, null, 2));
