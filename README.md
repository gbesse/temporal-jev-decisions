# Jev decision Activities for Temporal

Keep Jev inference in Temporal Activities and let deterministic Workflows consume the returned DecisionPacks record. A recorded result can be compared against changed decision gates without calling the model again.

**v0.1.0 experimental alpha · MIT · TypeScript/JavaScript · Node.js 22+**. Uses the official Temporal SDK 1.24.0. Independent community integration.

## Install

```sh
npm install github:gbesse/temporal-jev-decisions#v0.1.1 @temporalio/activity@1.24.0 @temporalio/workflow@1.24.0 @temporalio/common@1.24.0
```

Register `createDecisionActivities()` on your Worker. The `jevDecision({pack,state})` Activity returns a full DecisionPacks record. `@gbesse/temporal-jev-decisions/workflow` exports the sample `decideWorkflow`. Set `TYPESAFE_API_KEY` only in the worker environment.

```js
import { createDecisionActivities } from '@gbesse/temporal-jev-decisions';
const activities = createDecisionActivities({ timeoutMs: 30000 });
// Worker.create({ ..., activities })
```

For the included worker, clone this repo, `npm ci`, configure `TEMPORAL_ADDRESS` and `TEMPORAL_NAMESPACE`, and run `node examples/worker.mjs`. This uses the SDK's normal workflow bundling at worker startup. In another Temporal client start `decideWorkflow` on task queue `jev-decisions` with `args: [{pack,state}]` and your unique `workflowId`.

The example Workflow sets 45-second start-to-close and 60-second schedule-to-close deadlines with one Activity attempt. Provider failures fail the Activity; they are not silently converted to review. Temporal cancellation reaches the provider's abort signal. If you enable retries, repeated inference may be billed and can produce another judgment. Workflow replay reuses recorded Activity completion, not a guarantee of exactly-once external inference. State and answers enter Temporal history: apply your host's payload codec and retention policy where needed.

## Shareable demo report

Run `npm run demo:report` to capture this repository’s bundled example as one JSON object with the project purpose, version and complete demo output. The command fails if the demo fails, so the report is useful when sharing a reproducible first look or reporting unexpected behavior. The bundled demo’s data and safety boundaries still apply.

## Verification

```sh
npm ci
npm run check
npm run typecheck
npm test
npm run demo
```

Five tests use the official `MockActivityEnvironment`: heartbeat/provenance, gate replay with no second provider call, invalid configuration, cancellation and provider timeout. No live Temporal service, Worker startup or full Workflow-history replay was exercised. All judgments in tests and the demo are synthetic. No build was run.

See [reuse and provenance](docs/reuse.md), [contributing](CONTRIBUTING.md) and [security](SECURITY.md).

[Recorded verification scope](docs/verification.md).
