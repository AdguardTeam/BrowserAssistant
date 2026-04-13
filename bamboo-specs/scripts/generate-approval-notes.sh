#!/bin/bash

# Generates approval-notes.txt with plain-text build instructions for Mozilla AMO reviewers.
# The file is passed to the AMO API via the approval_notes field so reviewers see
# the build instructions without needing to inspect the source archive.
#
# Usage: ./generate-approval-notes.sh <output-dir>
# Example: ./generate-approval-notes.sh build/release
#          ./generate-approval-notes.sh build/beta
#
# See https://mozilla.github.io/addons-server/topics/api/addons.html

# 'set' should be added to the beginning of each script to ensure that it runs with the correct options.
# Please do not move it to some common file, because sourcing A script from B script
# cannot change the options of B script.
#  -e: Exit immediately if any command exits with a non-zero status (i.e., if a command fails).
#  -x: Print each command to the terminal as it is executed, which is useful for debugging.
set -ex

# Validate argument
OUTPUT_DIR="$1"
if [ -z "$OUTPUT_DIR" ]; then
  echo "Error: Output directory argument is required"
  echo "Usage: $0 <output-dir>"
  exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

APPROVAL_NOTES_FILE="$OUTPUT_DIR/approval-notes.txt"

cat > "$APPROVAL_NOTES_FILE" << 'APPROVAL_EOF'
Build reproduction instructions for Firefox Add-ons Review Team.

Prerequisites: Docker (https://docs.docker.com/get-docker/)
All build tools (Node.js v22, pnpm v10) are pre-installed in the Docker image.

To build the RELEASE version:

  docker run --rm \
      -v "$(pwd)":/workspace \
      -w /workspace \
      adguard/extension-builder:22.17--0.4.1--0 \
      bash -c "pnpm install && pnpm release firefox"

Output: ./build/release/firefox directory.
Compare build/release/firefox.zip with the uploaded add-on.

To build the BETA version:

  docker run --rm \
      -v "$(pwd)":/workspace \
      -w /workspace \
      adguard/extension-builder:22.17--0.4.1--0 \
      bash -c "pnpm install && pnpm beta firefox"

Output: ./build/beta/firefox directory.
Compare build/beta/firefox.zip with the uploaded add-on.
APPROVAL_EOF

echo "approval-notes.txt created at $APPROVAL_NOTES_FILE"

