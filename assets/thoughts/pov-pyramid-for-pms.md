---
title: "The POV Pyramid: How PMs Should Think Up While Shipping Down"
date: 2026-11-17
readTime: 4 min read
---

Every PM has two clocks running. One is the sprint: *ship this by Friday.* The other is the mission: *why does this product exist?* Most bad product decisions come from listening to only one of them.

I use a simple mental model to listen to both. I call it the **POV Pyramid**.

<div class="pov-pyramid">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 460" role="img" aria-label="POV Pyramid: Self, Close People, Larger Community, Global Community, Ethereal">
  <title>The POV Pyramid</title>
  <style>
    .lbl{font:600 17px 'Inter',system-ui,sans-serif;fill:#fff;text-anchor:middle}
    .sub{font:400 12px 'Inter',system-ui,sans-serif;fill:#fff;opacity:.9;text-anchor:middle}
    .hz{font:500 12px 'Inter',system-ui,sans-serif;fill:#3C3489}
    .ttl{font:700 18px 'Inter',system-ui,sans-serif;fill:#26215C}
  </style>
  <text x="20" y="28" class="ttl">The POV Pyramid</text>
  <!-- Level 5: Ethereal -->
  <polygon points="300,50 380,50 412,130 268,130" fill="#26215C"/>
  <text x="340" y="96" class="lbl">Ethereal</text>
  <text x="340" y="114" class="sub">purpose · values</text>
  <!-- Level 4: Global -->
  <polygon points="268,134 412,134 444,214 236,214" fill="#3C3489"/>
  <text x="340" y="172" class="lbl">Global Community</text>
  <text x="340" y="192" class="sub">society · ecosystem</text>
  <!-- Level 3: Larger community -->
  <polygon points="236,218 444,218 476,298 204,298" fill="#534AB7"/>
  <text x="340" y="256" class="lbl">Larger Community</text>
  <text x="340" y="276" class="sub">users · company · market</text>
  <!-- Level 2: Close people -->
  <polygon points="204,302 476,302 508,382 172,382" fill="#7F77DD"/>
  <text x="340" y="340" class="lbl">Close People</text>
  <text x="340" y="360" class="sub">team · stakeholders</text>
  <!-- Level 1: Self -->
  <polygon points="172,386 508,386 540,450 140,450" fill="#AFA9EC"/>
  <text x="340" y="416" class="lbl" style="fill:#26215C">Self</text>
  <text x="340" y="434" class="sub" style="fill:#26215C">skills · OKRs · calendar</text>
  <!-- Horizons -->
  <g class="hz">
    <text x="430" y="94">→ beyond a lifetime</text>
    <text x="462" y="178">→ this decade</text>
    <text x="494" y="262">→ this year</text>
    <text x="526" y="346">→ this quarter</text>
    <text x="556" y="422">→ this week</text>
  </g>
  <!-- Arrow: think up, act down -->
  <line x1="80" y1="430" x2="80" y2="70" stroke="#534AB7" stroke-width="3" marker-end="url(#a)"/>
  <defs><marker id="a" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#534AB7"/></marker></defs>
  <text x="96" y="250" class="hz" transform="rotate(-90 96 250)" text-anchor="middle">think up · act down</text>
</svg>
</div>

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
