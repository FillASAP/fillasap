import * as v from "valibot";
import { IdSchema, ownedEntity } from "./ids.ts";

/** Groups flows by feature, domain, or task; it carries no test-suite semantics. */
export const SuiteSchema = v.object({
  ...ownedEntity,
  groupedBy: v.picklist(["feature", "domain", "task"]),
  flowIds: v.array(IdSchema),
});

export type Suite = v.InferOutput<typeof SuiteSchema>;
