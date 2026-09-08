#!/usr/bin/env python3
"""
ClavisPrep — SAT item review tool.

A tiny local web app to review the AI-generated questions in sat_items.json.
Approve, reject, or fix each item with a click. Writes straight back to the
JSON file. Standard library only — nothing to install.

RUN (VS Code terminal, repo root)
  python3 sat/review.py
  then open http://localhost:8765 in your browser.

Only items with approved=true are meant to be loaded into the live sat_items
table. Rejected items are kept in the file (rejected=true) so nothing is lost.
"""

import json
import os
import tempfile
import webbrowser
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = 8765
DATA = Path(__file__).parent / "sat_items.json"

PAGE = r"""<!doctype html>
<html><head><meta charset="utf-8"><title>SAT Item Review</title>
<style>
  :root{--navy:#0a1628;--gold:#c88c24;--gold2:#91682b;--bg:#f5f0e8;}
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--navy)}
  header{position:sticky;top:0;background:#fff;border-bottom:1px solid #e5e0d5;padding:14px 24px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;z-index:10}
  header h1{font-size:18px;margin:0 12px 0 0}
  .stat{font-size:13px;color:#555}.stat b{color:var(--navy)}
  select,button{font-size:14px;border-radius:8px;border:1px solid #d8d2c4;padding:7px 10px;background:#fff;cursor:pointer}
  button.primary{background:linear-gradient(90deg,var(--gold),var(--gold2));color:#fff;border:none;font-weight:600}
  button.reject{color:#b42318;border-color:#f0c4bd}
  main{max-width:900px;margin:0 auto;padding:24px}
  .card{background:#fff;border:1px solid #e5e0d5;border-radius:16px;padding:20px;margin-bottom:18px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .badges{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;font-size:12px}
  .badge{padding:3px 9px;border-radius:999px;font-weight:600}
  .b-rw{background:#e0edff;color:#1d4ed8}.b-math{background:#e6f4ea;color:#137333}
  .b-d{background:#f3e8ff;color:#7e22ce}.b-approved{background:#dcfce7;color:#166534}.b-rejected{background:#fee2e2;color:#991b1b}
  .b-flag{background:#fee2e2;color:#991b1b}.b-ok{background:#dcfce7;color:#166534}
  .card.flagged{border-color:#f0a3a3;box-shadow:0 0 0 2px #fde2e2}
  label{display:block;font-size:12px;color:#777;margin:10px 0 4px}
  textarea,input.txt{width:100%;font-size:14px;font-family:inherit;border:1px solid #e0dacb;border-radius:8px;padding:8px;resize:vertical}
  .opt{display:flex;align-items:center;gap:8px;margin:6px 0}
  .opt .k{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;background:#eee;flex:0 0 auto}
  .opt.correct .k{background:#dcfce7;color:#166534}
  .opt input.txt{flex:1}
  .row{display:flex;gap:12px;align-items:center;margin-top:14px;flex-wrap:wrap}
  .muted{color:#999;font-size:13px}
  .empty{text-align:center;color:#999;padding:60px}
</style></head><body>
<header>
  <h1>SAT Item Review</h1>
  <span class="stat">Total <b id="s-total">0</b></span>
  <span class="stat">Pending <b id="s-pending">0</b></span>
  <span class="stat">Approved <b id="s-approved">0</b></span>
  <span class="stat">Rejected <b id="s-rejected">0</b></span>
  <select id="f-status">
    <option value="pending">Pending</option>
    <option value="flagged">Flagged (check)</option>
    <option value="approved">Approved</option>
    <option value="rejected">Rejected</option>
    <option value="all">All</option>
  </select>
  <select id="f-section">
    <option value="all">All sections</option>
    <option value="rw">Reading &amp; Writing</option>
    <option value="math">Math</option>
  </select>
</header>
<main id="list"></main>
<script>
let items=[];
const g=id=>document.getElementById(id);
async function load(){items=await (await fetch('/items')).json();render();}
function counts(){
  let a=0,r=0,p=0;
  items.forEach(it=>{if(it.approved)a++;else if(it.rejected)r++;else p++;});
  g('s-total').textContent=items.length;g('s-pending').textContent=p;
  g('s-approved').textContent=a;g('s-rejected').textContent=r;
}
function statusOf(it){return it.approved?'approved':it.rejected?'rejected':'pending';}
function render(){
  counts();
  const fs=g('f-status').value, fsec=g('f-section').value;
  const list=g('list');list.innerHTML='';
  const shown=items.map((it,i)=>[it,i]).filter(([it])=>
    (fs==='all'||(fs==='flagged'?it.verify_agree===false:statusOf(it)===fs))
    &&(fsec==='all'||it.section===fsec));
  if(!shown.length){list.innerHTML='<div class="empty">Nothing here. 🎉</div>';return;}
  shown.forEach(([it,i])=>list.appendChild(card(it,i)));
}
function card(it,i){
  const d=document.createElement('div');d.className='card'+(it.verify_agree===false?' flagged':'');
  const st=statusOf(it);
  let vbadge='';
  if(it.verify_agree===false)vbadge=`<span class="badge b-flag">⚠ Check: checker picked ${it.verify_answer}</span>`;
  else if(it.verify_agree===true)vbadge='<span class="badge b-ok">✓ Checker agrees</span>';
  d.innerHTML=`
    <div class="badges">
      <span class="badge ${it.section==='rw'?'b-rw':'b-math'}">${it.section==='rw'?'Reading &amp; Writing':'Math'}</span>
      <span class="badge b-d">Difficulty ${it.difficulty||'?'}</span>
      ${vbadge}
      <span class="muted">${it.domain||''} · ${it.skill||''}</span>
      ${st==='approved'?'<span class="badge b-approved">Approved</span>':''}
      ${st==='rejected'?'<span class="badge b-rejected">Rejected</span>':''}
    </div>
    <label>Question</label>
    <textarea rows="4" data-f="stem">${esc(it.stem||'')}</textarea>
    <label>Options (correct is highlighted; click a circle to mark correct)</label>
    <div class="opts"></div>
    <label>Explanation</label>
    <textarea rows="3" data-f="explanation">${esc(it.explanation||'')}</textarea>
    <div class="row">
      <button class="primary" data-act="approve">Save &amp; Approve</button>
      <button data-act="save">Save edits</button>
      <button class="reject" data-act="reject">Reject</button>
    </div>`;
  const opts=d.querySelector('.opts');
  ['A','B','C','D'].forEach(k=>{
    const row=document.createElement('div');
    row.className='opt'+(it.correct===k?' correct':'');
    row.innerHTML=`<div class="k" data-k="${k}">${k}</div>`;
    const inp=document.createElement('input');inp.className='txt';inp.dataset.opt=k;
    inp.value=(it.options&&it.options[k])||'';
    row.appendChild(inp);
    row.querySelector('.k').onclick=()=>{it.correct=k;
      opts.querySelectorAll('.opt').forEach(o=>o.classList.remove('correct'));
      row.classList.add('correct');};
    opts.appendChild(row);
  });
  d.querySelectorAll('button').forEach(b=>b.onclick=()=>act(d,it,i,b.dataset.act));
  return d;
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
async function act(d,it,i,action){
  it.stem=d.querySelector('[data-f=stem]').value;
  it.explanation=d.querySelector('[data-f=explanation]').value;
  it.options=it.options||{};
  d.querySelectorAll('[data-opt]').forEach(inp=>it.options[inp.dataset.opt]=inp.value);
  if(action==='approve'){it.approved=true;it.rejected=false;it.needs_review=false;}
  if(action==='reject'){it.rejected=true;it.approved=false;}
  await fetch('/save',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({index:i,item:it})});
  render();
}
g('f-status').onchange=render;g('f-section').onchange=render;
load();
</script></body></html>"""


def read_items():
    if not DATA.exists():
        return []
    return json.loads(DATA.read_text())


def write_items(items):
    fd, tmp = tempfile.mkstemp(dir=str(DATA.parent), suffix=".tmp")
    with os.fdopen(fd, "w") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
    os.replace(tmp, DATA)


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, body, ctype="application/json"):
        b = body.encode() if isinstance(body, str) else body
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        if self.path == "/":
            self._send(200, PAGE, "text/html; charset=utf-8")
        elif self.path == "/items":
            self._send(200, json.dumps(read_items()))
        else:
            self._send(404, "{}")

    def do_POST(self):
        if self.path != "/save":
            return self._send(404, "{}")
        length = int(self.headers.get("Content-Length", 0))
        payload = json.loads(self.rfile.read(length) or "{}")
        items = read_items()
        idx = payload.get("index")
        if isinstance(idx, int) and 0 <= idx < len(items):
            items[idx] = payload["item"]
            write_items(items)
            return self._send(200, json.dumps({"ok": True}))
        self._send(400, json.dumps({"ok": False, "error": "bad index"}))

    def log_message(self, *a):
        pass  # quiet


def main():
    if not DATA.exists():
        print(f"No {DATA} yet. Run generate_sat_items.py first.")
        return
    print(f"SAT review tool running at http://localhost:{PORT}")
    print("Reviewing:", DATA)
    print("Press Ctrl+C to stop.")
    try:
        webbrowser.open(f"http://localhost:{PORT}")
    except Exception:
        pass
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()


if __name__ == "__main__":
    main()
