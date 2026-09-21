// Purpose: Run Jev only inside Temporal Activities, preserving the host's recorded-result replay semantics.
import { Context } from '@temporalio/activity';
import { ApplicationFailure } from '@temporalio/common';
import { evaluate, createJevProvider, validatePack } from '@gbesse/decisionpacks';
import { snapshot, ensure } from './contracts.mjs';
export function createDecisionActivities({ provider, timeoutMs = 30000 } = {}) {
  ensure(Number.isInteger(timeoutMs) && timeoutMs > 0 && timeoutMs <= 300000, 'Invalid decision timeout');
  return {
    async jevDecision(request) {
      const context = Context.current(); let pack, state;
      try {
        ({ pack, state } = snapshot(request)); validatePack(pack);
        ensure(JSON.stringify({ pack, state }).length <= 100000, 'Decision input too large');
      } catch (error) { throw ApplicationFailure.nonRetryable(error.message, 'InvalidDecisionRequest'); }
      // Activity cancellation reaches the HTTP request. Temporal persists only a successfully returned record.
      context.heartbeat({ pack: pack.name, version: pack.version });
      return evaluate(pack, state, { provider: provider ?? createJevProvider(), timeoutMs, signal: context.cancellationSignal });
    },
  };
}
