#!/usr/bin/env bash
# Daily publish: rebuild the site so any note whose publishedAt has arrived goes live.
# Runs from Windows Task Scheduler on Max's PC ("ForwardWeb daily publish", 6:30am).
# Builds master and pushes dist to branch `live`, which Hostinger auto-deploys.
# Pushes only when the built output changed, so quiet days are a no-op.
set -euo pipefail

REPO="/c/Users/maksu/Documents/themothership/workspace/forwardweb"
LOG="$REPO/.publish-log.txt"
WT="$(mktemp -d)/fwlive"
exec >>"$LOG" 2>&1
echo "=== $(date '+%Y-%m-%d %H:%M:%S')"

cd "$REPO"
git config user.email maksut890@gmail.com
git config user.name BigmacM

if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then echo "not on master, skipping"; exit 0; fi
git pull --ff-only origin master
npm run build --silent

git fetch -q origin live
git worktree add -q --detach "$WT" origin/live
trap 'git worktree remove --force "$WT" >/dev/null 2>&1 || true' EXIT
find "$WT" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r dist/. "$WT"/
cd "$WT"
git add -A
# rss.xml carries a build timestamp, so it changes every run; that alone isn't a publish.
if git diff --cached --quiet -- . ':!rss.xml'; then echo "no change"; exit 0; fi
git commit -q -m "daily publish $(date +%Y-%m-%d) from master $(git -C "$REPO" rev-parse --short HEAD)"
git push -q origin HEAD:live
echo "pushed $(git rev-parse --short HEAD)"
