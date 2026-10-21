import * as v from "valibot";
import { IdSchema, NameSchema } from "./ids.ts";

const EnvironmentSchema = v.object({
  id: IdSchema,
  name: NameSchema,
  baseUrl: v.pipe(v.string(), v.url()),
});

/** The context of one application: its environments, URLs, and settings. */
export const WorkspaceSchema = v.object({
  id: IdSchema,
  name: NameSchema,
  description: v.optional(v.string()),
  environments: v.array(EnvironmentSchema),
  settings: v.record(v.string(), v.string()),
});

export type Environment = v.InferOutput<typeof EnvironmentSchema>;
export type Workspace = v.InferOutput<typeof WorkspaceSchema>;
