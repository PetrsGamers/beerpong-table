import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { season } from "./schema";

export type Season = InferSelectModel<typeof season>;
export type NewSeason = InferInsertModel<typeof season>;
