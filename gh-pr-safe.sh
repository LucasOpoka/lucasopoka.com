#!/usr/bin/env bash
# Wraps `gh pr create` / `gh pr edit` to strip Claude Code's attribution footer (and, for
# consistency, the commit-message trailers) from a PR description before it reaches GitHub.
# gh has no local hook point for this the way git has commit-msg, so this wrapper is the
# closest equivalent — use it instead of calling `gh pr create`/`gh pr edit` directly.
#
# Usage: ./gh-pr-safe.sh create --title "..." --body "..." [...]
#        ./gh-pr-safe.sh edit <number> --body "..." [...]
set -euo pipefail

sanitize() {
  sed -E \
    -e '/^🤖 Generated with \[Claude Code\]/Id' \
    -e '/^https:\/\/claude\.ai\/code\/session_/Id' \
    -e '/^Co-Authored-By:.*(Claude|anthropic)/Id' \
    -e '/^Claude-Session:/Id' \
    | sed -e :a -e '/^\n*$/{$d;N;ba' -e '}'
}

args=()
i=1
while [ "$i" -le "$#" ]; do
  arg="${!i}"
  case "$arg" in
    --body)
      i=$((i + 1))
      body="${!i}"
      args+=(--body "$(printf '%s\n' "$body" | sanitize)")
      ;;
    --body-file)
      i=$((i + 1))
      file="${!i}"
      tmp="$(mktemp)"
      if [[ "$file" == "-" ]]; then
        sanitize > "$tmp"
      else
        sanitize < "$file" > "$tmp"
      fi
      args+=(--body-file "$tmp")
      ;;
    *)
      args+=("$arg")
      ;;
  esac
  i=$((i + 1))
done

exec gh pr "${args[@]}"
