#!/usr/bin/env python3
"""
ClavisPrep — SAT item verifier.

Independent second-opinion check on the questions in sat_items.json. For each
item, Claude re-solves the question from ONLY the stem and options (it never
sees the stored "correct" answer or the explanation). If its answer disagrees
with the stored answer, the item is flagged so you know to look closely.

This does not decide correctness for you — it surfaces the risky ones so your
human review is focused instead of exhausting.

RUN (VS Code terminal, repo root)
  export ANTHROPIC_API_KEY=$(grep ANTHROPIC_API_KEY .env.local | cut -d '=' -f2-)
  python3 sat/verify_sat_items.py          # verifies items not yet verified
  python3 sat/verify_sat_items.py --all    # re-verifies everything

Writes these fields onto each item:
  verify_answer  the letter Claude independently chose
  verify_agree   true if it matches the stored correct answer
  verify_conf    Claude's stated confidence (high|medium|low)
Then run review.py — disagreements show a red "Check this" flag.
"""

import os
import re
import sys
import json
import time
import urllib.request
import urllib.error
from pathlib import Path

API_URL = "https://api.anthropic.com/v1/messages"
MODELS_URL = "https://api.anthropic.com/v1/models"
MODEL_PREFERENCE = "sonnet"
DATA = Path(__file__).parent / "sat_items.json"
MAX_RETRIES = 3


def resolve_model(api_key):
    req = urllib.request.Request(
        MODELS_URL, headers={"x-api-key": api_key, "anthropic-version": "2023-06-01"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        ids = [m["id"] for m in json.loads(resp.read()).get("data", [])]
    if not ids:
        sys.exit("No models available.")
    chosen = next((i for i in ids if MODEL_PREFERENCE in i), ids[0])
    print(f"Using model: {chosen}")
    return chosen


def call_claude(prompt, api_key, model):
    body = json.dumps({
        "model": model, "max_tokens": 300, "temperature": 0,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()
    req = urllib.request.Request(
        API_URL, data=body,
        headers={"x-api-key": api_key, "anthropic-version": "2023-06-01",
                 "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read())
    parts = [b.get("text", "") for b in data.get("content", []) if b.get("type") == "text"]
    return "".join(parts).strip()


def solve_prompt(item):
    opts = item.get("options", {})
    lines = "\n".join(f"{k}) {opts.get(k,'')}" for k in ["A", "B", "C", "D"])
    return (
        "Solve this multiple-choice question. Choose the single best answer.\n\n"
        f"{item.get('stem','')}\n\n{lines}\n\n"
        'Respond with ONLY a JSON object, no other text:\n'
        '{"answer":"A|B|C|D","confidence":"high|medium|low"}'
    )


def parse_obj(text):
    text = re.sub(r"^```(?:json)?|```$", "", text.strip()).strip()
    s, e = text.find("{"), text.rfind("}")
    if s == -1 or e == -1:
        raise ValueError("no JSON object")
    return json.loads(text[s:e + 1])


def verify_one(item, api_key, model):
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            obj = parse_obj(call_claude(solve_prompt(item), api_key, model))
            ans = str(obj.get("answer", "")).strip().upper()[:1]
            if ans not in ("A", "B", "C", "D"):
                raise ValueError("bad answer letter")
            return ans, str(obj.get("confidence", "")).lower()
        except urllib.error.HTTPError as ex:
            print(f"    HTTP {ex.code}: {ex.read().decode(errors='replace')[:160]}")
        except Exception as ex:
            print(f"    attempt {attempt} failed ({ex})")
        time.sleep(2 * attempt)
    return None, None


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("Set ANTHROPIC_API_KEY (see .env.local).")
    if not DATA.exists():
        sys.exit(f"No {DATA}. Generate items first.")
    do_all = "--all" in sys.argv
    model = resolve_model(api_key)
    items = json.loads(DATA.read_text())

    checked, flagged = 0, 0
    for i, it in enumerate(items):
        if not do_all and "verify_agree" in it:
            continue
        ans, conf = verify_one(it, api_key, model)
        if ans is None:
            continue
        it["verify_answer"] = ans
        it["verify_conf"] = conf
        it["verify_agree"] = (ans == it.get("correct"))
        checked += 1
        if not it["verify_agree"]:
            flagged += 1
            print(f"  [{i}] FLAG: stored {it.get('correct')} vs checker {ans} "
                  f"({it.get('section')}/{it.get('domain')})")
        if checked % 10 == 0:
            DATA.write_text(json.dumps(items, indent=2, ensure_ascii=False))
            print(f"  ...{checked} checked, {flagged} flagged (saved)")

    DATA.write_text(json.dumps(items, indent=2, ensure_ascii=False))
    print(f"\nDone. Checked {checked}, flagged {flagged} disagreements.")
    print("Run review.py — flagged items show a red 'Check this' badge. "
          "A flag means look closely, not that it's definitely wrong.")


if __name__ == "__main__":
    main()
