import * as v from "valibot";
import { IdSchema, NameSchema, ownedEntity } from "./ids.ts";

export const VariableSchema = v.object({
  name: NameSchema,
  defaultValue: v.optional(v.string()),
});

/** Rows of variable values that run the same flow with different data. */
export const DatasetSchema = v.object({
  ...ownedEntity,
  flowId: IdSchema,
  rows: v.array(v.record(v.string(), v.string())),
});

export type Variable = v.InferOutput<typeof VariableSchema>;
export type Dataset = v.InferOutput<typeof DatasetSchema>;
