---
title: Cartis: an agentic shopping assistant for Indian shoppers
date: 2026-10-10
readTime: 4 min read
---

# Cartis: an agentic shopping assistant for Indian shoppers

> **Result:** **National Semi-Finalist (top 7% of 6,000+ teams)** at The Ken's Great Rewiring Case Competition 2026, with a working product that turns one spoken request into three trusted picks, aimed at fewer returns for shoppers and sellers.

**Role:** Product lead and builder (team of 3, IIM Kozhikode) · **Type:** 0-to-1 product, case competition · **Stack:** Claude agent, Python/FastAPI, voice (Gnani.ai), Pine Labs and Delhivery rails

---

## The results first

- **Shipped a working MVP, not a slide.** Shoppers speak in English or Hinglish and get a shortlist of three, with the reasons read out loud and shown on screen.
- **Found a hidden quality signal.** Every shirt we tested averaged 4.2★ to 4.6★, yet the share of angry 1★ buyers ranged from **2.4% to about 10%**: a 4x gap the star average hides. Cartis makes that gap visible.
- **Built a business case for partners.** Positioned the agent around **return reduction**, a shared win for shoppers, sellers, payments (Pine Labs) and logistics (Delhivery) partners.
- **Zero-form onboarding.** Cartis learns size, usual spend and preferred brands from past order emails, so the shopper never fills in a preference quiz.

## Situation

Online fashion shopping in India has a **discovery problem, not a supply problem**. Shoppers face hundreds of near-identical listings, star ratings that all look the same, and costly returns when size or fabric is wrong. Apps also try to fix cold start with preference forms that most users skip.

Our **customer discovery** (user interviews with friends and classmates) surfaced one key insight: *people won't describe their taste, but they will describe their method.* One said, "I read the 2–3★ reviews and ignore 5★ ratings with no comment."

## Task

Within the competition's rules, we had to design and demo an agent that finds "the exact right thing" for an Indian household, using the partner rails (Pine Labs for payments, Delhivery for logistics, Gnani.ai for voice). I owned the **product strategy**, the **PRD-style flow design**, and most of the build.

## Action

- **Framed the job-to-be-done.** "When I need something specific by a deadline, help me find the one item that fits and arrives on time, and show me why." We mapped three personas: the deadline shopper, the method shopper and the repeat buyer.
- **Set a North Star and guardrails.** North Star: **kept-item rate** (requests that end in an item the shopper keeps). Guardrails: return rate, time-to-shortlist, and at most one clarifying question per request.
- **Wrote clear product principles** that drove the **engineering trade-offs**:
  - *Do, then ask.* Ask a question only if the answer would change the top three.
  - *Trust behaviour over stated preference.* A kept item is a strong signal; one return changes nothing.
  - *The human holds the wallet.* A spoken "yes" never moves money; payment needs a tap.
  - *Never fake data.* If a field doesn't exist, Cartis says so.
- **Split decisions from rules.** The AI agent decides intent, which tool to use and how to explain. Fixed business rules (budget, size, fabric, delivery date, the "ask or not" test) run as plain, testable code. This keeps every recommendation **auditable**.
- **Designed a Review Risk Score.** It weighs 1★ share, 2–3★ share and ratings with no comment. Shoppers can change the weights by voice ("1-stars matter most").
- **Mapped the full customer journey** in nine stages, from sign-in to "kept or returned", and wired each stage to a real data source or partner rail.
- **Used a Wizard-of-Oz test** for partner APIs that were not yet open, playing their documented responses so the demo stayed honest.
- **Planned a three-layer memory for cold start:** what we know for everyone (from research), what we learn at sign-up (order emails), and what we learn with each use.

## Business impact (the case for partners)

| For the shopper | For the ecosystem |
|---|---|
| One sentence in, three explained picks out | Higher conversion and fewer returns from fit-aware picks |
| Reasons spoken and shown | A trust layer: every number spoken is also on screen |
| No forms to fill | Ready for agentic payments and logistics rails |

**Key risks and mitigations:** a buyer-side agent can conflict with platform incentives, so we positioned Cartis around **return reduction**, a shared win for merchants. Privacy is scoped to order emails only.

## Roadmap

- **v1 (now):** voice plus dashboard, multi-shop search, review intelligence, learning from order emails, payment and delivery flows.
- **v2:** gifting with consent-based preferences, photo input, share-to-Cartis.
- **v3:** safe autonomous repeat buys within UPI mandate limits, plus back-in-stock and price-drop alerts.

## What I learned

The hardest product decision was **when not to ask**. A good agent earns trust by doing the work first and asking only when the answer changes the outcome.

---

**Keywords:** 0-to-1 product development · MVP · customer discovery · user research · JTBD · North Star metric · KPIs · roadmap prioritization · engineering trade-offs · stakeholder alignment · business case · GTM

[View Cartis on GitHub →](https://github.com/ArunTejaKamisetti/cartis)
