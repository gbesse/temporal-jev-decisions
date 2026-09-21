// Purpose: Type the Temporal activity factory without exposing provider calls to Workflow code.
import type { Pack, Provider, JSONValue, DecisionRecord } from '@gbesse/decisionpacks';
export interface Request { pack: Pack; state: Record<string, JSONValue> }
export function createDecisionActivities(options?: { provider?: Provider; timeoutMs?: number }): { jevDecision(request: Request): Promise<DecisionRecord> };
