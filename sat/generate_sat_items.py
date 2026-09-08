#!/usr/bin/env python3
"""
ClavisPrep — SAT-style item generator (Claude edition).

Generates digital-SAT-style practice questions, validates them structurally,
de-duplicates, and writes them to sat_items.json (schema matches sat/schema.sql).

Uses your ANTHROPIC_API_KEY (in .env.local). No pip installs needed — this uses
only the Python standard library (calls the Anthropic REST API directly).

WHAT THIS IS / IS NOT
  - ORIGINAL "digital SAT-style" practice items. NOT real College Board
    questions. "SAT" is a College Board trademark.
  - Difficulty (1-5) is an authoring judgment tag, not a psychometric
    calibration. Every item defaults to needs_review = True. YOU approve items
    into the live bank; only approved items should ever be served.

SETUP (VS Code terminal, at repo root)
  export ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY .env.local | cut -d '=' -f2-)
  python3 sat/generate_sat_items.py

  Re-run any time. It appends and de-dupes against the existing JSON file.

TUNING
  Edit PLAN below to change how many items per section/domain/difficulty.
  Start small, check quality, then scale up. ~300-500 approved items is enough
  to run a real adaptive test.
"""

import os
import re
import sys
import json
import time
import hashlib
import urllib.request
import urllib.error
from pathlib import Path

# ----------------------------------------------------------------------------
# Config
# ----------------------------------------------------------------------------
MODEL = None                       # auto-detected from your account at startup
MODEL_PREFERENCE = "sonnet"        # pick the newest model whose id contains this
API_URL = "https://api.anthropic.com/v1/messages"
MODELS_URL = "https://api.anthropic.com/v1/models"
OUT_FILE = Path(__file__).parent / "sat_items.json"
BATCH_SIZE = 5                     # items requested per API call
MAX_RETRIES = 3

DOMAINS = {
    "rw": [
        "Information and Ideas",
        "Craft and Structure",
        "Expression of Ideas",
        "Standard English Conventions",
    ],
    "math": [
        "Algebra",
        "Advanced Math",
        "Problem-Solving and Data Analysis",
        "Geometry and Trigonometry",
    ],
}

# How many items per (section, difficulty 1-5).
# 10 each across difficulties 2-4 x 2 sections x 4 domains = ~240 items/run.
# Add ("rw",1)/("rw",5)/("math",1)/("math",5) later for full easy+hard coverage.
PLAN = {
    ("rw", 2): 10,
    ("rw", 3): 10,
    ("rw", 4): 10,
    ("math", 2): 10,
    ("math", 3): 10,
    ("math", 4): 10,
}

# ----------------------------------------------------------------------------
# Prompt
# ----------------------------------------------------------------------------
def build_prompt(section, domain, difficulty, n):
    section_label = "Reading and Writing" if section == "rw" else "Math"
    return f"""You write ORIGINAL practice questions in the style of the digital SAT.
These must NOT copy any real College Board question. Do not reference any real
passage, book, or published test.

Write {n} multiple-choice questions for the {section_label} section,
domain "{domain}", at difficulty {difficulty} on a 1-5 scale
(1 = easiest, 5 = hardest).

Rules:
- Exactly 4 answer options each, labeled A, B, C, D.
- Exactly one correct option.
- For Reading and Writing items that need a passage, include a SHORT original
  passage (1-4 sentences) inside the "stem" itself.
- For Math, the question must be fully self-contained and unambiguously solvable
  from the stem.
- Every item includes a clear worked "explanation" of why the answer is correct.
- Tag a specific "skill" within the domain.

Return ONLY a JSON array. No prose, no citations, no markdown fences. Each element:
{{
  "section": "{section}",
  "domain": "{domain}",
  "skill": "<specific skill>",
  "difficulty": {difficulty},
  "stem": "<the full question, including any short passage>",
  "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
  "correct": "<A|B|C|D>",
  "explanation": "<worked explanation>"
}}"""

# ----------------------------------------------------------------------------
# Validation
# ----------------------------------------------------------------------------
def stem_hash(stem):
    return hashlib.sha256(re.sub(r"\s+", " ", stem.strip().lower()).encode()).hexdigest()

def valid_item(item):
    try:
        if item["section"] not in ("rw", "math"):
            return False, "bad section"
        opts = item["options"]
        if set(opts.keys()) != {"A", "B", "C", "D"}:
            return False, "options must be exactly A-D"
        if any(not str(v).strip() for v in opts.values()):
            return False, "empty option"
        if len(set(str(v).strip() for v in opts.values())) != 4:
            return False, "duplicate options"
        if item["correct"] not in ("A", "B", "C", "D"):
            return False, "bad correct key"
        if not str(item.get("stem", "")).strip():
            return False, "empty stem"
        if not str(item.get("explanation", "")).strip():
            return False, "empty explanation"
        if not (1 <= int(item["difficulty"]) <= 5):
            return False, "difficulty out of range"
    except (KeyError, TypeError, ValueError) as e:
        return False, f"missing field: {e}"
    return True, "ok"

def parse_json_array(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()
    text = re.sub(r"\[\d+\]", "", text)   # strip stray [1] style citations
    start, end = text.find("["), text.rfind("]")
    if start == -1 or end == -1:
        raise ValueError("no JSON array found")
    return json.loads(text[start:end + 1])

# ----------------------------------------------------------------------------
# Anthropic call (stdlib only)
# ----------------------------------------------------------------------------
def resolve_model(api_key):
    """Ask the account which models exist; prefer newest with MODEL_PREFERENCE."""
    req = urllib.request.Request(
        MODELS_URL,
        headers={"x-api-key": api_key, "anthropic-version": "2023-06-01"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
    ids = [m["id"] for m in data.get("data", [])]
    if not ids:
        sys.exit("No models available on this API account.")
    # API returns models newest-first. Prefer the preferred family, else first.
    preferred = [i for i in ids if MODEL_PREFERENCE in i]
    chosen = preferred[0] if preferred else ids[0]
    print(f"Using model: {chosen}")
    print(f"(available: {', '.join(ids)})")
    return chosen

def call_claude(prompt, api_key):
    body = json.dumps({
        "model": MODEL,
        "max_tokens": 4000,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()
    req = urllib.request.Request(
        API_URL, data=body,
        headers={"x-api-key": api_key,
                 "anthropic-version": "2023-06-01",
                 "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read())
    # Concatenate all text blocks (skip thinking/other block types).
    parts = [b.get("text", "") for b in data.get("content", []) if b.get("type") == "text"]
    text = "".join(parts).strip()
    if not text:
        raise ValueError(f"no text block in response: {json.dumps(data)[:300]}")
    return text

def generate(prompt, api_key):
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            return parse_json_array(call_claude(prompt, api_key))
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors="replace")[:300]
            print(f"    attempt {attempt} HTTP {e.code}: {detail}")
        except Exception as e:
            print(f"    attempt {attempt} failed ({e})")
        time.sleep(2 * attempt)
    print("    giving up on this batch")
    return []

def main():
    global MODEL
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("Set ANTHROPIC_API_KEY. Run:\n"
                 "  export ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY .env.local | cut -d '=' -f2-)")
    MODEL = resolve_model(api_key)

    existing = []
    if OUT_FILE.exists():
        existing = json.loads(OUT_FILE.read_text())
    seen = {stem_hash(it["stem"]) for it in existing}

    added, rejected = 0, 0
    for (section, difficulty), count in PLAN.items():
        for domain in DOMAINS[section]:
            remaining = count
            while remaining > 0:
                n = min(BATCH_SIZE, remaining)
                print(f"[{section} | {domain} | d{difficulty}] requesting {n}...")
                for item in generate(build_prompt(section, domain, difficulty, n), api_key):
                    ok, why = valid_item(item)
                    if not ok:
                        rejected += 1
                        print(f"    rejected: {why}")
                        continue
                    h = stem_hash(item["stem"])
                    if h in seen:
                        continue
                    seen.add(h)
                    item["approved"] = False
                    item["needs_review"] = True
                    item["source"] = "ai"
                    existing.append(item)
                    added += 1
                remaining -= n

    OUT_FILE.write_text(json.dumps(existing, indent=2, ensure_ascii=False))
    print(f"\nDone. Added {added}, rejected {rejected}. Total in file: {len(existing)}.")
    print(f"Wrote {OUT_FILE}")
    print("Next: review items, flip approved=true on the good ones, then load "
          "into the sat_items table (see sat/schema.sql).")

if __name__ == "__main__":
    main()
