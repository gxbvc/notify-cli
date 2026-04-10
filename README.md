# notify-cli

Send notifications via macOS alerts and [ntfy.sh](https://ntfy.sh) push notifications. Designed for AI agents to get a human's attention when they hit a blocking step.

## How it works

When called, `notify-cli` sends **two** notifications simultaneously:

1. **macOS notification** — appears in Notification Center with a sound (for when you're at the computer)
2. **ntfy.sh push notification** — delivered to the ntfy iOS/Android app (for when you're away)

## Prerequisites

- Node.js 18+
- macOS (for local notifications)
- [ntfy app](https://ntfy.sh) installed on your phone, subscribed to your topic

## Setup

```bash
cd ~/tools/notify-cli
npm install
npm run build
npm link

# Configure
cp .env.example .env
# Edit .env with your ntfy topic
```

Then subscribe to your topic in the ntfy app on your phone.

## Usage

```bash
# Basic notification
notify-cli "Build complete!"

# With title and priority
notify-cli "Need your approval to deploy" -t "Agent Blocked" -p urgent

# With a clickable URL
notify-cli "PR ready for review" --url "https://github.com/org/repo/pull/42"

# Phone only (skip macOS notification)
notify-cli "Reminder: check logs" --ntfy-only

# Mac only (skip phone push)
notify-cli "Quick heads up" --mac-only
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `-t, --title <title>` | Notification title | `Agent Notification` |
| `--tags <tags>` | ntfy emoji tags (comma-separated) | `robot` |
| `-p, --priority <p>` | Priority: min, low, default, high, urgent | `high` |
| `--url <url>` | URL to open when clicked | — |
| `--ntfy-only` | Skip macOS notification | — |
| `--mac-only` | Skip ntfy push | — |

## Output

JSON envelope to stdout:

```json
{"ok": true, "data": {"mac": true, "ntfy": true}}
```
