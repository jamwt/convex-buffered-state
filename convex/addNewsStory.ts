import { Story } from "./common";
import { mutation } from "./_generated/server";

export default mutation(async ({ db }, story: Story) => {
    db.insert("stories", story);
});
