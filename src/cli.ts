import { program } from "commander";
import { execSync } from "child_process";
import { config, validateConfig } from "./config.js";

async function sendNtfy(message: string, options: { title?: string; tags?: string; priority?: string; url?: string }) {
  const headers: Record<string, string> = {};
  if (options.title) headers["Title"] = options.title;
  if (options.tags) headers["Tags"] = options.tags;
  if (options.priority) headers["Priority"] = options.priority;
  if (options.url) headers["Click"] = options.url;

  const res = await fetch(`${config.ntfyServer}/${config.ntfyTopic}`, {
    method: "POST",
    body: message,
    headers,
  });

  if (!res.ok) {
    throw new Error(`ntfy returned ${res.status}: ${await res.text()}`);
  }
  return await res.json();
}

function sendMacNotification(message: string, title: string) {
  const escapedMsg = message.replace(/"/g, '\\"');
  const escapedTitle = title.replace(/"/g, '\\"');
  try {
    execSync(
      `osascript -e 'display notification "${escapedMsg}" with title "${escapedTitle}" sound name "Glass"'`,
      { stdio: "ignore" }
    );
    return true;
  } catch {
    return false;
  }
}

program
  .name("notify-cli")
  .description("Send notifications via macOS alerts and ntfy.sh push")
  .argument("<message>", "Notification message")
  .option("-t, --title <title>", "Notification title", "Agent Notification")
  .option("--tags <tags>", "ntfy tags/emojis (comma-separated)", "robot")
  .option("-p, --priority <priority>", "ntfy priority (1-5 or min/low/default/high/urgent)", "high")
  .option("--url <url>", "URL to open when notification is clicked")
  .option("--ntfy-only", "Only send ntfy push (skip macOS notification)")
  .option("--mac-only", "Only send macOS notification (skip ntfy push)")
  .action(async (message: string, options) => {
    validateConfig();

    const results: { mac?: boolean; ntfy?: boolean; error?: string } = {};

    // macOS notification (only attempted on macOS; other platforms skip it
    // so a successful ntfy push isn't dragged to a failure/exit(1))
    if (!options.ntfyOnly && process.platform === "darwin") {
      results.mac = sendMacNotification(message, options.title);
    }

    // ntfy push
    if (!options.macOnly) {
      try {
        await sendNtfy(message, {
          title: options.title,
          tags: options.tags,
          priority: options.priority,
          url: options.url,
        });
        results.ntfy = true;
      } catch (e: any) {
        results.ntfy = false;
        results.error = e.message;
      }
    }

    const ok = (results.mac !== false) && (results.ntfy !== false);
    console.log(JSON.stringify({ ok, data: results }));
    process.exit(ok ? 0 : 1);
  });

program.parse();
