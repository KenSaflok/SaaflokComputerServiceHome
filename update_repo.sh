#!/usr/bin/env bash
set -euo pipefail

cd /workspaces/SaaflokComputerServiceHome

git add index.html styles.css main.js
git commit -m "Remove theme palette picker and update hero copy"
git push origin main
