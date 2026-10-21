import * as v from "valibot";
import { ownedEntity } from "./ids.ts";

const ACTION_KINDS = ["navigate", "click", "fill", "select", "wait", "assert"] as const;

/** One atomic operation, either recorded in the browser or entered by hand. */
export const ActionSchema = v.object({
  ...ownedEntity,
  kind: v.picklist(ACTION_KINDS),
  origin: v.picklist(["recorded", "manual"]),
  target: v.optional(v.string()),
  value: v.optional(v.string()),
});

export type Action = v.InferOutput<typeof ActionSchema>;
