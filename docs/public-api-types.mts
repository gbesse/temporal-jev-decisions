// Purpose: Type-check activity registration without compiling a Workflow bundle.
import { createDecisionActivities, type Request } from '../src/index.mjs';
declare const request: Request;
const record = await createDecisionActivities().jevDecision(request);
const name: string = record.pack.name;
void name;
