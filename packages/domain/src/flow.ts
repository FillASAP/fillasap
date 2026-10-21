import * as v from "valibot";
import { IdSchema, ownedEntity } from "./ids.ts";
import { VariableSchema } from "./variables.ts";

const FlowStepSchema = v.variant("type", [
  v.object({ type: v.literal("action"), actionId: IdSchema }),
  v.object({ type: v.literal("fragment"), fragmentId: IdSchema }),
]);

/** A sequence with one goal, such as creating an order or reproducing a bug. */
export const FlowSchema = v.object({
  ...ownedEntity,
  goal: v.string(),
  steps: v.array(FlowStepSchema),
  variables: v.array(VariableSchema),
});

export type FlowStep = v.InferOutput<typeof FlowStepSchema>;
export type Flow = v.InferOutput<typeof FlowSchema>;
