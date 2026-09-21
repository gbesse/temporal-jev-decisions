// Purpose: Execute the real Temporal Activity in the official test environment using a synthetic provider.
import { MockActivityEnvironment } from '@temporalio/testing';
import { readFile } from 'node:fs/promises';
import { createDecisionActivities } from '../src/index.mjs';
const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const request = { pack: await read('../packs/support-triage.json'), state: await read('./billing-state.json') };
const activity = createDecisionActivities({ provider: async () => read('./synthetic-billing-response.json') }).jevDecision;
const result = await new MockActivityEnvironment().run(activity, request);
console.log(JSON.stringify({ syntheticFixture: true, outcome: result.outcome, record: result }, null, 2));
