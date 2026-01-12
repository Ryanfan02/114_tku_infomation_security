import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

async function main() {
  await connectDb(env.MONGO_URI);

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`API listening on :${env.PORT}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
