import * as v from "valibot";
import { IdSchema, ownedEntity } from "./ids.ts";

/** A short reusable sequence of actions, such as logging in or filling an address. */
export const FragmentSchema = v.object({
  ...ownedEntity,
  description: v.optional(v.string()),
  actionIds: v.array(IdSchema),
});

export type Fragment = v.InferOutput<typeof FragmentSchema>;
