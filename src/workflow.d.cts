import type { Request } from './index.mjs' with { 'resolution-mode': 'import' };
import type { DecisionRecord } from '@gbesse/decisionpacks' with { 'resolution-mode': 'import' };
export declare function decideWorkflow(request: Request): Promise<DecisionRecord>;
