---
title: Anime x AI: If Frontier Models Were Shonen Protagonists
date: 2026-11-17
readTime: 5 min read
---

Every shonen anime follows the same story: a hero starts weak, trains hard, unlocks a new form, and beats an even stronger opponent. Then the next arc begins.

Frontier AI has followed the same pattern. New "form" every few months. Benchmarks as the power level. A rival always waiting in the next arc.

So I matched four model families with four protagonists. Here's the lineup:

| Model family | Character | Signature trait | Their "power level" moment |
|---|---|---|---|
| **GPT (OpenAI)** | Goku | The original who made everyone care | ChatGPT hits 100M users in ~2 months |
| **Gemini (Google)** | Ichigo | Hidden lineage, late awakening | Gemini 3 tops LMArena at 1501 |
| **DeepSeek** | Naruto | The dismissed underdog | Shook Nvidia by ~$589B in one day |
| **Claude (Anthropic)** | Luffy | Powered by crew and a code | 97% on SWE-bench Verified |

*Benchmarks are self-reported or from third-party trackers, as of each linked date. Treat them as power levels, not court verdicts.*

---

## 1. GPT = Goku: the one who started it all

**Why Goku:** Dragon Ball wasn't the first anime, but it's the one that made the world pay attention, and almost every shonen since has borrowed from it. Goku's thing is transformations: Super Saiyan, then Super Saiyan 2, then 3, then God, each one resetting what "strong" means.

**The parallel:** ChatGPT did for AI what Goku did for anime. It [reached about 100 million monthly users roughly two months after launch](https://www.techspot.com/news/97486-chatgpt-adds-100-million-users-two-months-making.html). TikTok took nine months to get there, and Instagram took two and a half years.

Then came the transformations: GPT-3.5, then GPT-4, then the "thinking" o-series, then GPT-5. At launch, GPT-5 posted [94.6% on AIME 2025 without tools and 74.9% on SWE-bench Verified](https://odsc.medium.com/openai-launches-gpt-5-setting-new-benchmarks-in-ai-performance-and-reliability-e7da99b43cbb). Going Super Saiyan in this world means turning reasoning on, which [added 22.1 points on SWE-bench](https://website.vellum.ai/blog/gpt-5-benchmarks). By April 2026, GPT-5.5 reported [88.7% on SWE-bench Verified](https://hn.jakechampion.name/reader/https://www.marc0.dev/en/leaderboard).

**The Goku flaw:** Goku sometimes forgets why he's fighting. Many users felt GPT-5 had [a duller personality than GPT-4o](https://www.fastcompany.com/91444801/gemini-3-google-ai). Lesson: power without feel doesn't win hearts.

---

## 2. Gemini = Ichigo: the power was in the blood all along

**Why Ichigo:** Ichigo Kurosaki spends most of *Bleach* finding out he was never ordinary. He has Shinigami, Hollow and Quincy heritage, and he gets stronger the moment he accepts all of it.

**The parallel:** Google wrote the blueprint for modern AI. The 2017 paper ["Attention Is All You Need"](https://research.google/pubs/pub46201/) introduced the Transformer, and it is [now the underlying architecture for most modern LLMs](https://wiki.riteme.site/wiki/Attention_is_all_you_need). The power was in Google's blood. Yet ChatGPT landed first, and Google looked slow to awaken.

Then it accepted all of its heritage: search, YouTube, Android, TPUs. Gemini 3 [topped LMArena with a record 1501 Elo, scored 37.5% on Humanity's Last Exam and 91.9% on GPQA Diamond](https://www.neowin.net/amp/google-announces-gemini-3-surpassing-openais-gpt-51-across-key-ai-benchmarks/). Its multiple heritages show up as native multimodality: [81% on MMMU-Pro versus GPT-5.1's 76%](https://itpro.com/technology/artificial-intelligence/google-launches-flagship-gemini-3-model-and-google-antigravity-a-new-agentic-ai-development-platform). And Bankai? That's **Deep Think** mode, which pushed HLE to [41% and ARC-AGI-2 to 45.1%](https://www.neowin.net/news/google-announces-gemini-3-surpassing-openais-gpt-51-across-key-ai-benchmarks/).

**The Ichigo flaw:** raw power, uneven control. At launch, Gemini 3 Pro's [76.2% on SWE-bench Verified trailed GPT-5.1 and Claude Sonnet 4.5](https://www.neowin.net/amp/google-announces-gemini-3-surpassing-openais-gpt-51-across-key-ai-benchmarks/).

---

## 3. DeepSeek = Naruto: the underdog nobody believed in

**Why Naruto:** He's the outcast with no resources who keeps shouting he'll be Hokage while everyone laughs. His signature move, the shadow clone jutsu, splits the work across many copies of himself.

**The parallel:** DeepSeek was a lab spun out of a Chinese hedge fund, working with export-restricted chips. Then it said its V3 model's final training run [cost about $5.6M](https://understandingai.org/p/i-dont-believe-deepseek-crashed-nvidias?r=4hopqq), using 2,048 H800 GPUs. For comparison, [GPT-4 reportedly cost more than $100M](https://newatlas.com/ai-humanoids/deepseek-ai/). When R1 arrived, Nvidia [lost about $589 billion in market value in a single day](https://barchart.com/story/news/30653690/how-deepseeks-r1-model-is-reshaping-global-ai-competition), the biggest one-day wipeout in US market history.

*(Fair caveat: analysts argued the $5.6M figure [didn't reflect total investment](https://tech.slashdot.org/story/25/01/28/1315215). Even Naruto had the Nine-Tails sealed inside him.)*

And the shadow clones? That's **Mixture-of-Experts**. V3 has 671B parameters but only [activates about 37B per token](https://yespress.io/deepseek). Many experts, and only the right ones show up for each fight.

**Where Naruto is now:** By September 2026, DeepSeek V4 Pro scored [96.4% on SWE-bench Verified at about $0.10 per task, versus $1.29 for the leader](https://www.vals.ai/benchmarks/swebench-2025-08-27). That's almost the same power at roughly one-thirteenth of the cost. Open weights are its version of talk-no-jutsu: it turns rivals into allies by sharing.

---

## 4. Claude = Luffy: powered by the crew and the code

**Why Luffy:** Luffy isn't the smartest pirate, and early on he isn't the strongest either. What makes him great is his **crew** and his **code**. He never abandons his nakama (his crewmates), and he has firm lines he won't cross. Then Gear 5 shows up and rewrites what's possible.

**The parallel:** Anthropic built Claude around a written set of principles, [Constitutional AI](https://arxiv.org/abs/2212.08073). That's Luffy's code. Claude's strength has always been **working with a crew**: tools, files, terminals, agents. In other words, agentic coding.

Its climb looks like a full Luffy arc. On launch day in October 2023, Claude 2 [resolved 1.96% of issues on the original SWE-bench](https://www.codesota.com/benchmark/swe-bench-verified). On SWE-bench Verified, Claude 3 Opus scored [33.4% in March 2024](https://codingfleet.com/blog/ai-coding-progress-tracker-benchmarks-timeline-2024-2026/). Opus 4.7 [hit 87.6% in April 2026](https://www.codesota.com/benchmark/swe-bench-verified). Then came Gear 5: Claude Opus 5 at [97.0% on SWE-bench Verified as of September 2026](https://www.vals.ai/benchmarks/swebench-2025-09-24).

**The Luffy flaw:** Gear 5 is expensive. At [$1.29 per task versus DeepSeek's $0.10](https://www.vals.ai/benchmarks/swebench-2025-08-27), you're paying for the captain.

---

## The real lesson (for PMs)

1. **Benchmarks saturate like power levels.** Vals has stopped running SWE-bench Verified on new models because [performance has saturated](https://www.vals.ai/benchmarks/swebench-2025-09-24). In Dragon Ball, once power levels hit "over 9000", they stopped meaning much. The next arc is fought on new metrics: cost, latency, reliability, feel.
2. **Every hero wins a different way.** Goku wins on reach, Ichigo on heritage, Naruto on efficiency, and Luffy on crew and code. Picking a model works the same way. Match the hero to the fight.
3. **The arc never ends.** Any ranking here will be out of date within a quarter. Plan for that.

*Next in the series: which anime character is your AI product strategy?*
