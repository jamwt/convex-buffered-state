import { Story } from "./common";
import { query } from "./_generated/server";

export default query(async ({ db }): Promise<Story[]> => {
  const stories = await db.table("stories").order("desc").collect();
  return stories;
});
