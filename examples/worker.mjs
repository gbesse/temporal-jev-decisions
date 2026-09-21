// Purpose: Connect a user-configured Temporal service and register the packaged Workflow and decision Activity.
import { NativeConnection, Worker } from '@temporalio/worker';
import { fileURLToPath } from 'node:url';
import { createDecisionActivities } from '../src/index.mjs';
import { bounded } from '../src/contracts.mjs';
const connection = await bounded(() => NativeConnection.connect({ address: process.env.TEMPORAL_ADDRESS || 'localhost:7233', connectTimeout: '10 seconds' }), { timeoutMs: 15000 });
try {
  const worker = await bounded(() => Worker.create({ connection, namespace: process.env.TEMPORAL_NAMESPACE || 'default', taskQueue: 'jev-decisions', workflowsPath: fileURLToPath(new URL('../src/workflow.cjs', import.meta.url)), activities: createDecisionActivities() }), { timeoutMs: 60000 });
  await worker.run();
} finally { await connection.close(); }
