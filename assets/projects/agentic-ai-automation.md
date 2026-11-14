---
title: Agentic AI automation portfolio: five agents for marketing and growth
date: 2026-08-20
readTime: 4 min read
---

# Agentic AI automation portfolio: five agents for marketing and growth

> **Result:** Five AI agents that automate **all five stages of the marketing funnel**, from research to measurement, turning one idea into three channel-ready posts and calling new leads within seconds. Each one turns a slow, manual task into an **AI-first process with a human in the loop**, and each comes with its own North Star and guardrail metrics.

**Role:** Product owner and builder · **Type:** Process automation, operating-model redesign · **Stack:** n8n, OpenAI and Gemini models, Google Workspace, Meta, LinkedIn, Telegram, Retell AI (voice)

---

## The results first

- **Full-funnel coverage.** Mapped against the marketing **value chain** (research → creative → distribution → engagement → measurement), the five agents leave no gaps.
- **Flagship: AlumniMatch.** Replaces generic event blasts with **one-to-one, explainable, human-approved invites**. The aim is fewer emails, higher registrations and zero fatigue.
- **One idea, three channels.** The social publisher turns one topic or link into three platform-ready posts with matching images, queued in a content calendar.
- **Speed-to-lead in seconds.** A voice agent calls a new lead seconds after they fill in a form, with their details already loaded.
- **Cost is visible, not guessed.** Each run logs its own token cost, so **unit economics per task** are clear.

## Situation

Marketing, growth and alumni teams spend hours on **high-frequency, low-value work**: rewriting the same post for three platforms, sending blanket event emails, chasing cold leads, and juggling ten tools for one task. These are classic candidates for **process improvement**, but most automation stops at "send faster", not "send smarter".

## Task

Build a set of agents that each solve one clear business problem, and treat every agent as a **product**: problem framing, user journey, success metrics, guardrails, test plan and rollout.

## Action

I used a **MECE breakdown** of the marketing workflow to pick where agents add the most value, then built five systems:

1. **AlumniMatch (original build, flagship).** Alumni offices send the same invite to everyone. I designed a **100-point scoring model** that decides *who* to invite using fixed rules, and boxed the AI into deciding only *how to say it*. Every invite carries a "why you" reason, passes a policy check and waits for **human approval**. A waitlist fills seats in order, and a **15-case test matrix** covers edge cases like frequency caps and consent.
2. **Ultimate Media Agent.** One chat runs email, calendar, CRM, research, image and video generation, and posting. A lead agent hands work to **8 specialist agents with 34 tools**, with a backup model if one fails.
3. **Ad Agency in a Box.** Creates video ad scripts **seeded by the brand's own best-performing ads**. A weekly pull of ad results feeds the next round, closing the **learning loop**.
4. **Auto Social Publisher.** Researches the topic on the live web first to cut factual errors, then writes and schedules posts with an approval status.
5. **Voice Call Agent.** A minimal two-step design for the fastest **time-to-value**.

**Patterns I reused across agents:**
- **Rules decide, AI writes.** Compliance-critical choices stay rule-based and auditable.
- **Human-in-the-loop approval** to build trust before scaling.
- **Research before writing** to lower the risk of made-up facts.
- **Fallbacks and fixed output formats** so the next step never breaks.

## How I would measure success

| Agent | North Star | Guardrail (must not get worse) |
|---|---|---|
| AlumniMatch | Registrations per invite sent | Unsubscribes, frequency-cap breaches (target 0) |
| Media Agent | Tasks completed per message | Cost per task |
| Ad Agency | Share of scripts beating the account's average results | Brand and compliance rejections |
| Social Publisher | Posts shipped per marketer per week | Factual-error flags |
| Voice Agent | Time from form to call | Opt-out and complaint rate |

**Example:** a blanket email to 2,000 alumni might bring in 40 sign-ups. AlumniMatch invites only the most relevant people up to event capacity, each with a personal reason. Fewer emails, a higher conversion rate, and no fatigue. The guardrail metrics are there to prove that trade-off.

## Credits and next steps

AlumniMatch is my original build (IIM Kozhikode, *Marketing Automation and Agentic Systems*, Group 07). The Media Agent and Social Publisher started from open templates that I configured, extended and documented; the product framing and metrics are my own. **Next:** run small pilots and publish only measured results.

---

**Keywords:** process improvement · operational efficiency · business transformation · value-chain mapping · MECE · KPIs · North Star metric · human-in-the-loop · build vs buy · unit economics · governance

[View the agents on GitHub →](https://github.com/ArunTejaKamisetti/agents_portfolio1)
