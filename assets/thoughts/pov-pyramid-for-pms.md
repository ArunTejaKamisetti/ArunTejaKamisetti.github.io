---
title: The POV Pyramid: How PMs Should Think Up While Shipping Down
date: 2026-11-17
readTime: 4 min read
---

Every PM has two clocks running. One is the sprint: *ship this by Friday.* The other is the mission: *why does this product exist?* Most bad product decisions come from listening to only one of them.

I use a simple mental model to listen to both. I call it the **POV Pyramid**.

![The POV Pyramid: Self, Close People, Larger Community, Global Community, Ethereal](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3MjAgNDYwIiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBPViBQeXJhbWlkOiBTZWxmLCBDbG9zZSBQZW9wbGUsIExhcmdlciBDb21tdW5pdHksIEdsb2JhbCBDb21tdW5pdHksIEV0aGVyZWFsIj4KICA8dGl0bGU+VGhlIFBPViBQeXJhbWlkPC90aXRsZT4KICA8c3R5bGU+CiAgICAubGJse2ZvbnQ6NjAwIDE3cHggJ0ludGVyJyxzeXN0ZW0tdWksc2Fucy1zZXJpZjtmaWxsOiNmZmY7dGV4dC1hbmNob3I6bWlkZGxlfQogICAgLnN1Yntmb250OjQwMCAxMnB4ICdJbnRlcicsc3lzdGVtLXVpLHNhbnMtc2VyaWY7ZmlsbDojZmZmO29wYWNpdHk6Ljk7dGV4dC1hbmNob3I6bWlkZGxlfQogICAgLmh6e2ZvbnQ6NTAwIDEycHggJ0ludGVyJyxzeXN0ZW0tdWksc2Fucy1zZXJpZjtmaWxsOiMzQzM0ODl9CiAgICAudHRse2ZvbnQ6NzAwIDE4cHggJ0ludGVyJyxzeXN0ZW0tdWksc2Fucy1zZXJpZjtmaWxsOiMyNjIxNUN9CiAgPC9zdHlsZT4KICA8dGV4dCB4PSIyMCIgeT0iMjgiIGNsYXNzPSJ0dGwiPlRoZSBQT1YgUHlyYW1pZDwvdGV4dD4KICAgIDxwb2x5Z29uIHBvaW50cz0iMzAwLDUwIDM4MCw1MCA0MTIsMTMwIDI2OCwxMzAiIGZpbGw9IiMyNjIxNUMiLz4KICA8dGV4dCB4PSIzNDAiIHk9Ijk2IiBjbGFzcz0ibGJsIj5FdGhlcmVhbDwvdGV4dD4KICA8dGV4dCB4PSIzNDAiIHk9IjExNCIgY2xhc3M9InN1YiI+cHVycG9zZSDCtyB2YWx1ZXM8L3RleHQ+CiAgICA8cG9seWdvbiBwb2ludHM9IjI2OCwxMzQgNDEyLDEzNCA0NDQsMjE0IDIzNiwyMTQiIGZpbGw9IiMzQzM0ODkiLz4KICA8dGV4dCB4PSIzNDAiIHk9IjE3MiIgY2xhc3M9ImxibCI+R2xvYmFsIENvbW11bml0eTwvdGV4dD4KICA8dGV4dCB4PSIzNDAiIHk9IjE5MiIgY2xhc3M9InN1YiI+c29jaWV0eSDCtyBlY29zeXN0ZW08L3RleHQ+CiAgICA8cG9seWdvbiBwb2ludHM9IjIzNiwyMTggNDQ0LDIxOCA0NzYsMjk4IDIwNCwyOTgiIGZpbGw9IiM1MzRBQjciLz4KICA8dGV4dCB4PSIzNDAiIHk9IjI1NiIgY2xhc3M9ImxibCI+TGFyZ2VyIENvbW11bml0eTwvdGV4dD4KICA8dGV4dCB4PSIzNDAiIHk9IjI3NiIgY2xhc3M9InN1YiI+dXNlcnMgwrcgY29tcGFueSDCtyBtYXJrZXQ8L3RleHQ+CiAgICA8cG9seWdvbiBwb2ludHM9IjIwNCwzMDIgNDc2LDMwMiA1MDgsMzgyIDE3MiwzODIiIGZpbGw9IiM3Rjc3REQiLz4KICA8dGV4dCB4PSIzNDAiIHk9IjM0MCIgY2xhc3M9ImxibCI+Q2xvc2UgUGVvcGxlPC90ZXh0PgogIDx0ZXh0IHg9IjM0MCIgeT0iMzYwIiBjbGFzcz0ic3ViIj50ZWFtIMK3IHN0YWtlaG9sZGVyczwvdGV4dD4KICAgIDxwb2x5Z29uIHBvaW50cz0iMTcyLDM4NiA1MDgsMzg2IDU0MCw0NTAgMTQwLDQ1MCIgZmlsbD0iI0FGQTlFQyIvPgogIDx0ZXh0IHg9IjM0MCIgeT0iNDE2IiBjbGFzcz0ibGJsIiBzdHlsZT0iZmlsbDojMjYyMTVDIj5TZWxmPC90ZXh0PgogIDx0ZXh0IHg9IjM0MCIgeT0iNDM0IiBjbGFzcz0ic3ViIiBzdHlsZT0iZmlsbDojMjYyMTVDIj5za2lsbHMgwrcgT0tScyDCtyBjYWxlbmRhcjwvdGV4dD4KICAgIDxnIGNsYXNzPSJoeiI+CiAgICA8dGV4dCB4PSI0MzAiIHk9Ijk0Ij7ihpIgYmV5b25kIGEgbGlmZXRpbWU8L3RleHQ+CiAgICA8dGV4dCB4PSI0NjIiIHk9IjE3OCI+4oaSIHRoaXMgZGVjYWRlPC90ZXh0PgogICAgPHRleHQgeD0iNDk0IiB5PSIyNjIiPuKGkiB0aGlzIHllYXI8L3RleHQ+CiAgICA8dGV4dCB4PSI1MjYiIHk9IjM0NiI+4oaSIHRoaXMgcXVhcnRlcjwvdGV4dD4KICAgIDx0ZXh0IHg9IjU1NiIgeT0iNDIyIj7ihpIgdGhpcyB3ZWVrPC90ZXh0PgogIDwvZz4KICAgIDxsaW5lIHgxPSI4MCIgeTE9IjQzMCIgeDI9IjgwIiB5Mj0iNzAiIHN0cm9rZT0iIzUzNEFCNyIgc3Ryb2tlLXdpZHRoPSIzIiBtYXJrZXItZW5kPSJ1cmwoI2EpIi8+CiAgPGRlZnM+PG1hcmtlciBpZD0iYSIgbWFya2VyV2lkdGg9IjEwIiBtYXJrZXJIZWlnaHQ9IjEwIiByZWZYPSI1IiByZWZZPSI1IiBvcmllbnQ9ImF1dG8iPjxwYXRoIGQ9Ik0wLDAgTDEwLDUgTDAsMTAgeiIgZmlsbD0iIzUzNEFCNyIvPjwvbWFya2VyPjwvZGVmcz4KICA8dGV4dCB4PSI5NiIgeT0iMjUwIiBjbGFzcz0iaHoiIHRyYW5zZm9ybT0icm90YXRlKC05MCA5NiAyNTApIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj50aGluayB1cCDCtyBhY3QgZG93bjwvdGV4dD4KPC9zdmc+)

## The five levels

| Level | Who it covers | Time horizon | PM question |
|---|---|---|---|
| **5. Ethereal** | Purpose, values, legacy | Beyond a lifetime | *Why should this exist at all?* |
| **4. Global Community** | Society, ecosystem, planet | This decade | *What happens if a billion people use this?* |
| **3. Larger Community** | Users, customers, the company, the market | This year | *Does this create real value for users and the business?* |
| **2. Close People** | Your team: engineering, design, stakeholders | This quarter | *Can my team build and sustain this?* |
| **1. Self** | Your skills, your OKRs, your calendar | This week | *What do I need to do today?* |

The base is wide because that's where most of your hours go. The top is narrow because it's a single point, the "why". But that point gives every level below it its direction.

## Thinking up the pyramid

The rule is: **act at the bottom, decide at the top.**

**Simple example:** Your growth OKR says to raise daily active users by 10% this quarter. Someone suggests more push notifications. Walk it up the pyramid:

1. **Self:** It's quick to ship and hits my OKR. ✅
2. **Close People:** Engineering can build it in a sprint. Support will get more "how do I turn this off" tickets. ⚠️
3. **Larger Community:** DAU goes up for a while, then notification opt-outs and uninstalls follow. ❌
4. **Global Community:** It adds to the attention economy we all complain about. ❌
5. **Ethereal:** Does this make anyone's life better? Not really. ❌

Now you have a better question: *what would bring users back because they want to come back?* Maybe it's a weekly digest of things they actually care about. Same OKR, a different path, and it holds up at every level.

## Why it matters: long-term pays

This isn't idealism. McKinsey's Corporate Horizon Index tracked 615 large and mid-cap US companies from 2001 to 2015. The long-term-oriented ones had [47% higher revenue growth and 36% higher earnings growth](https://www.mckinsey.com.br/mgi/media-center/the-case-against-corporate-short-termism), and they [added nearly 12,000 more jobs](https://www.mckinsey.com/about-us/new-at-mckinsey-blog/long-term-value-from-intuition-to-index) than short-term peers.

The pressure goes the other way, though. [87% of executives and directors](https://www.consultancy.uk/news/13089/companies-with-a-longterm-strategy-significantly-outperform-their-rivals) said they felt the most pressure to show strong results within two years or less. That's exactly why PMs need a deliberate habit of thinking up.

## How each level maps to PM skills

- **Self → Ownership and prioritisation.** Manage your own time and craft. A PM who can't run their own week can't run a roadmap.
- **Close People → Stakeholder management and team health.** Your engineers' energy is a finite resource. A burnt-out team can't ship next quarter.
- **Larger Community → User empathy and North Star metrics.** Choose metrics that measure value delivered, not just activity.
- **Global Community → Second-order thinking and responsibility.** This matters even more for AI products. Think about misuse, bias, privacy, and how the product behaves at scale.
- **Ethereal → Vision and mission.** It's the compass for every "should we?" debate. The best mission statements read like the top of this pyramid.

## Juggling, not choosing

The pyramid doesn't tell you to ignore the sprint. You can't live at the top. A PM who only talks about purpose and never ships is a philosopher, not a PM.

The skill is **juggling**:

- **Daily**, live at levels 1–2. Ship, unblock, communicate.
- **Weekly**, check level 3. Are users actually better off?
- **Quarterly**, zoom out to levels 4–5. Is the roadmap still pointing at the "why"?

Short-term objectives are the steps. Long-term ones are the staircase. Without steps you never climb, and without the staircase you're just stepping in place.

## The takeaway

Next time you're stuck on a trade-off, don't ask "what's fastest?" or "what's most visionary?" Walk it up the pyramid, level by level, and pick the option that holds up all the way to the top.
