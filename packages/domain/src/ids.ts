import * as v from "valibot";

export const IdSchema = v.pipe(v.string(), v.nonEmpty());

export const NameSchema = v.pipe(v.string(), v.trim(), v.nonEmpty());

/** Every entity except the workspace belongs to exactly one workspace. */
export const ownedEntity = {
  id: IdSchema,
  workspaceId: IdSchema,
  name: NameSchema,
};
