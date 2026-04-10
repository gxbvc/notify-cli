import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// When running from dist/, go up one more level
if (!process.env.NTFY_TOPIC) {
  dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });
}

export const config = {
  ntfyTopic: process.env.NTFY_TOPIC || "",
  ntfyServer: process.env.NTFY_SERVER || "https://ntfy.sh",
};

export function validateConfig() {
  if (!config.ntfyTopic) {
    console.error(
      JSON.stringify({ ok: false, error: "NTFY_TOPIC not set in .env", code: "MISSING_CONFIG" })
    );
    process.exit(1);
  }
}
