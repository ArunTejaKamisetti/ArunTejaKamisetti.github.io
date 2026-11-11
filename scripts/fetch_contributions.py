#!/usr/bin/env python3
"""Fetch the public GitHub contribution calendar and save it as contributions.json.

Why: third-party contribution APIs (deno.dev / jogruber) go down or rate-limit, which
left the site's graph blank. This reads GitHub's own public calendar HTML instead and
writes a same-origin JSON file that the site loads. Runs daily via GitHub Actions.
Usage: python3 scripts/fetch_contributions.py [username]
"""
import json, re, sys, urllib.request, datetime, os

user = sys.argv[1] if len(sys.argv) > 1 else "ArunTejaKamisetti"
req = urllib.request.Request("https://github.com/users/%s/contributions" % user,
                             headers={"User-Agent": "Mozilla/5.0 portfolio-contrib-fetch"})
html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8")

# id -> count from tooltips ("No contributions on ..." / "3 contributions on ...")
counts = {}
for cid, txt in re.findall(r'<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)</tool-tip>', html):
    m = re.match(r"\s*(\d+)\s+contribution", txt)
    counts[cid] = int(m.group(1)) if m else 0

days = []
for td in re.findall(r"<td[^>]*ContributionCalendar-day[^>]*>", html):
    date = re.search(r'data-date="([^"]+)"', td)
    if not date: continue
    cid = re.search(r'id="([^"]+)"', td)
    lvl = re.search(r'data-level="(\d)"', td)
    days.append({"date": date.group(1),
                 "contributionCount": counts.get(cid.group(1) if cid else "", 0),
                 "level": int(lvl.group(1)) if lvl else 0})
if not days:
    sys.exit("No calendar cells found — GitHub markup may have changed.")
days.sort(key=lambda d: d["date"])

# group into Sunday-starting weeks (same shape the site already renders)
weeks, cur = [], []
for d in days:
    dow = (datetime.date.fromisoformat(d["date"]).weekday() + 1) % 7  # Sun=0
    if dow == 0 and cur:
        weeks.append(cur); cur = []
    cur.append(d)
if cur: weeks.append(cur)

m = re.search(r"([\d,]+)\s+contributions?\s+in the last year", re.sub(r"\s+", " ", html))
total = int(m.group(1).replace(",", "")) if m else sum(d["contributionCount"] for d in days)

out = {"user": user, "totalContributions": total, "contributions": weeks,
       "updated": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%MZ")}
path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "contributions.json")
with open(path, "w", encoding="utf-8") as f:
    json.dump(out, f, separators=(",", ":"))
print("Saved %d days, %d weeks, total=%d" % (len(days), len(weeks), total))
