#!/usr/bin/env bash
# Installed on the VPS as the forced command for the CI deploy SSH key
# (authorized_keys: command="/opt/lucasopoka/deploy-wrapper.sh",no-agent-forwarding,...).
# Whatever the client actually sends arrives in $SSH_ORIGINAL_COMMAND — this validates it
# strictly against the one shape cd.yml ever sends before running anything, so a leaked key
# can only ever trigger a deploy of this site, never an arbitrary command.

set -euo pipefail

if [[ "${SSH_ORIGINAL_COMMAND:-}" =~ ^/opt/lucasopoka/(production|staging)/deploy\.sh\ ([a-f0-9]{12})$ ]]; then
  env="${BASH_REMATCH[1]}"
  tag="${BASH_REMATCH[2]}"
  exec "/opt/lucasopoka/${env}/deploy.sh" "$tag"
else
  echo "Rejected command: ${SSH_ORIGINAL_COMMAND:-<empty>}" >&2
  exit 1
fi
