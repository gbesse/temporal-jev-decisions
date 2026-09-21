// Purpose: Provide an importable Temporal Workflow that calls the activity with bounded time and explicit retries.
const { proxyActivities } = require('@temporalio/workflow');
const { jevDecision } = proxyActivities({ startToCloseTimeout: '45 seconds', scheduleToCloseTimeout: '60 seconds', heartbeatTimeout: '35 seconds', retry: { maximumAttempts: 1 } });
async function decideWorkflow(request) { return await jevDecision(request); }
module.exports = { decideWorkflow };
