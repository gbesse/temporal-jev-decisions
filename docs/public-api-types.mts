// Purpose: Type-check activity registration without compiling a Workflow bundle.
import { createDecisionActivities, type Request } from '../src/index.mjs';
declare const request: Request;
const record = await createDecisionActivities().jevDecision(request);
const name: string = record.pack.name;
void name;

import { decideWorkflow } from '@gbesse/temporal-jev-decisions/workflow';
const workflowRecord = await decideWorkflow(request);
const workflowPackName: string = workflowRecord.pack.name;
void workflowPackName;
// @ts-expect-error Workflow requests must contain a pack and state.
void decideWorkflow({});
