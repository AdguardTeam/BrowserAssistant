#!/bin/bash

# Archives source files into a zip for AMO (addons.mozilla.org) publishing.
# Excludes files matching .gitignore patterns.
#
# Usage: ./archive-source.sh beta|release

# 'set' should be added to the beginning of each script to ensure that it runs with the correct options.
# Please do not move it to some common file, like `setup-tests.sh`, because sourcing A script from B script
# cannot change the options of B script.
#  -e: Exit immediately if any command exits with a non-zero status (i.e., if a command fails).
#  -x: Print each command to the terminal as it is executed, which is useful for debugging.
set -ex

# Validate argument
TARGET="$1"
if [ "$TARGET" != "beta" ] && [ "$TARGET" != "release" ]; then
  echo "Error: Argument must be 'beta' or 'release'"
  exit 1
fi

# Set output path
OUTPUT_DIR="build/$TARGET"
OUTPUT_ZIP="$OUTPUT_DIR/source.zip"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# gitignore-excludes.txt is generated on the host (where .git exists) and
# copied into the Docker context. Fail loud if it is missing — a silent
# fallback would zip node_modules and other junk into the AMO source archive.
if [ ! -f gitignore-excludes.txt ]; then
  echo "Error: gitignore-excludes.txt is missing; run scripts/ci/generate-find-excludes.sh on the host first"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
. "$SCRIPT_DIR/parse-gitignore.sh" gitignore-excludes.txt

# Find all files, excluding .git, .github (CI topology), and .gitignore patterns
find . -type f ! -path './.git/*' ! -path './.github/*' "${GITIGNORE_EXCLUDE_ARGS[@]}" -print0 \
  | xargs -0 zip "$OUTPUT_ZIP"

echo "source.zip created at $OUTPUT_ZIP"
