#!/bin/bash
# ClavisPrep — local key-exposure & persistence audit (READ ONLY)
#
# Checks the specific ways an API key gets stolen off a Mac:
#   1. Where API keys sit in plaintext on disk
#   2. Whether a key leaked into your shell history
#   3. Whether your keys file lives in a cloud-synced folder (iCloud/Dropbox/Drive)
#   4. Whether anything suspicious is set to auto-run (info-stealer persistence)
#
# This script CHANGES NOTHING. It only reads and reports.
#
# RUN:  bash security-audit.sh

echo "=================================================="
echo " ClavisPrep local security audit"
echo " $(date)"
echo "=================================================="
echo

# --------------------------------------------------------------------
echo "### 1. Files on disk containing an Anthropic key (sk-ant-) ###"
echo "(paths only — the key itself is not printed)"
echo
grep -rl "sk-ant-api" "$HOME" 2>/dev/null \
  | grep -v "/node_modules/" \
  | grep -v "/.git/" \
  | grep -v "/Library/Caches/" \
  | head -40
echo
echo "--> Every file listed above is a place your key can be stolen from."
echo "    Anything that is not .env.local should be deleted or moved to a password manager."
echo

# --------------------------------------------------------------------
echo "### 2. Key exposure in shell history ###"
for h in "$HOME/.zsh_history" "$HOME/.bash_history" "$HOME/.zsh_sessions"/*; do
  [ -f "$h" ] || continue
  if grep -qi "sk-ant-api\|ANTHROPIC_API_KEY=sk" "$h" 2>/dev/null; then
    n=$(grep -ci "sk-ant-api\|ANTHROPIC_API_KEY=sk" "$h" 2>/dev/null)
    echo "  !! FOUND key material in: $h  ($n line(s))"
  fi
done
echo "  (no '!!' lines above = your shell history is clean)"
echo
echo "--> Shell history is a plaintext file. If a key was ever typed or echoed,"
echo "    it is sitting there readable by anything running as you."
echo

# --------------------------------------------------------------------
echo "### 3. Keys files in CLOUD-SYNCED folders (leaves your machine!) ###"
for d in "$HOME/Library/Mobile Documents/com~apple~CloudDocs" \
         "$HOME/Dropbox" "$HOME/Google Drive" "$HOME/OneDrive" \
         "$HOME/Library/CloudStorage"; do
  [ -d "$d" ] || continue
  echo "  Scanning: $d"
  find "$d" -maxdepth 4 \( -iname "*key*" -o -iname "*.env*" -o -iname "*secret*" -o -iname "*credential*" \) -type f 2>/dev/null | head -10
done
echo
echo "--> Anything above syncs OFF your Mac to a cloud provider."
echo

# --------------------------------------------------------------------
echo "### 4. Desktop / Documents / Downloads plaintext key files ###"
find "$HOME/Desktop" "$HOME/Documents" "$HOME/Downloads" -maxdepth 2 \
  \( -iname "*key*" -o -iname "*secret*" -o -iname "*credential*" -o -iname "*.env*" \) \
  -type f 2>/dev/null | head -20
echo
echo "--> Plaintext key files here are exactly what info-stealer malware targets."
echo

# --------------------------------------------------------------------
echo "### 5. Auto-run items (malware persistence) ###"
echo
echo "-- User LaunchAgents (~/Library/LaunchAgents):"
ls -la "$HOME/Library/LaunchAgents" 2>/dev/null | tail -n +2
echo
echo "-- System LaunchAgents (/Library/LaunchAgents):"
ls -la /Library/LaunchAgents 2>/dev/null | tail -n +2
echo
echo "-- System LaunchDaemons (/Library/LaunchDaemons):"
ls -la /Library/LaunchDaemons 2>/dev/null | tail -n +2
echo
echo "--> Most of these are legit (Apple, Google, Adobe, Dropbox...)."
echo "    Look for anything with a random/gibberish name or a company you don't use."
echo

# --------------------------------------------------------------------
echo "### 6. Login items ###"
osascript -e 'tell application "System Events" to get the name of every login item' 2>/dev/null
echo
echo "--> Anything unfamiliar here should be investigated."
echo

# --------------------------------------------------------------------
echo "### 7. Recently modified auto-run files (last 60 days) ###"
find "$HOME/Library/LaunchAgents" /Library/LaunchAgents /Library/LaunchDaemons \
  -type f -mtime -60 2>/dev/null
echo "  (empty = nothing new installed itself recently)"
echo

echo "=================================================="
echo " Done. Nothing was changed."
echo
echo " WHAT TO DO WITH THIS:"
echo "  - Section 1: delete every plaintext key file except .env.local"
echo "  - Section 2: if key material is in shell history, clear it"
echo "  - Section 3: a key file in a cloud folder is a likely leak path"
echo "  - Sections 5-7: anything you don't recognize, look it up before trusting it"
echo "=================================================="
