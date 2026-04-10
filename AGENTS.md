# notify-cli

Send push notifications to get Christian's attention. Sends both a macOS notification and an ntfy.sh push to his phone.

## Commands

```bash
notify-cli "message"                              # Send notification (macOS + phone)
notify-cli "message" -t "Title"                   # Custom title
notify-cli "message" -p urgent                    # Urgent priority
notify-cli "message" --url "https://example.com"  # Clickable link
notify-cli "message" --ntfy-only                  # Phone only
notify-cli "message" --mac-only                   # Mac only
```

## Examples

```bash
# Agent needs input
notify-cli "Blocking: need API key for Stripe setup" -t "Agent Blocked"

# Deploy completed
notify-cli "Deploy to prod finished successfully" -t "Deploy Done" --tags "white_check_mark"

# Urgent
notify-cli "Tests failing on main branch" -t "CI Failure" -p urgent --tags "warning"
```

## Options

- `-t, --title` — Notification title (default: "Agent Notification")
- `--tags` — ntfy emoji tags, comma-separated (default: "robot")
- `-p, --priority` — min, low, default, high, urgent (default: high)
- `--url` — URL to open on click
- `--ntfy-only` — Skip macOS notification
- `--mac-only` — Skip ntfy push

Requires `.env` with `NTFY_TOPIC`. See `.env.example`.
