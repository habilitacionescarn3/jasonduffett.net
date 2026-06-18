---
title: "Your Organisation Isn't AI Ready."
date: 2026-06-18
ogImage: "/assets/og-your-organisation-isnt-ai-ready.jpg"
summary: "TODO"
tags:
  - ai
  - software-engineering
  - agentic-coding
  - ai-assisted-development
  - engineering-culture
  - sdlc
---

<figure class="post-figure">
  <img
    src="{{ '/assets/ai-ready-iceberg.webp' | rel }}"
    alt="Hand-drawn editorial cartoon: a suited executive stands on the deck of a large ship with 'AI READY' painted in orange on the hull, arms wide and grinning at the viewer — while behind them, a crew member shuffles a deck chair and an enormous iceberg towers at the ship's bow, its peak cropped beyond the frame."
    width="1376"
    height="768"
    decoding="async"
  />
  <figcaption>The "AI Ready" banner looks great from the deck. The iceberg disagrees.</figcaption>
</figure>

It seems like every day I'm surrounded by people throwing out catch-phrases - "We need to be AI Ready", "Agentic Readiness is our goal", "How do we become AI Native?". And just as often, when I challenge them on what they mean by these phrases, I receive a proverbial ¯\_(ツ)_/¯. Like the definition doesn't matter - don't be a :square: man - we'll somehow vibe-code ourselves to this undefined nirvana.

This article is rant, rage prose to capture my frustration, about why the definition **does matter**. Why organisations, especially large ones, are failing to grasp the importance. Why might be existential. And why anything you do before you understand the definition is probably just moving the chairs around.

## What "AI Native" is not

<!-- 
  Flesh out each of these to describe the results of the anit-pattern
-->
Spoiler, this list not hyperbole but based on unfortunate real world experience :face-palm:

AI Native **does not** mean:
- Sprawling, AI-slopped, `AGENTS.md` whose size dwarfs the code base it is describing, contains myriads of hallucinations, and will be out-of-date on the next commit.
- An "AutoSDE" code reviewer who nit-picks code syntax and argues against itself on every subsequent revision.
- AI generated BRDs that need 6 pages to describe a 2 sentence idea someone through at Opus.
- A dark factory churning out "features" customers don't need, against an architecture that doesn't exist, using code nobody can maintain.
- Throwing out your data governance safeguards in the name of innovation _needs a stronger landing_
- Forcing 100s of engineers to adopt a hodge-podge list of one person's favourite static analysers or other tools

_insert more examples_

## Why this is possibly existential

If you're in a startup all of this probably sounds anachronistic, but its real. Teams and VP-size organisations are doing all of the above in the name of becoming "AI Ready". I _believe_ there are people in these teams who know better but they're not being heard. Or maybe they're not there? It's hard to tell with all the slop. 

And that's the reason this might be existential. These teams were constituted in a different world. Bureaucracy, inertia, and lack of direction, was a tax that large organisations needed to pay to support huge engineering divisions. But we don't need huge software engineering divisions anymore. We always knew smaller teams are nimbler, more responsive, and more productive but we just couldn't do the big things without scaling up. Now we don't need to scale up as LLMs make a 1 pizza team more effective than 20 of the 2-pizza team model.


## How I define AI Native

So here's my definition of being "AI Ready". 

First: acknowledge this is a revolution, not an evolution. Small changes to existing processes will not cut it. Radical rethinking is necessary. _Give more examples_

Second: Understand the new bottlenecks - _insert ref to Phoenix Project_. Code, documentation, research, design, prototyping - the work that used to be costly and expensive is no longer. But you still need _humans in the loop_ at particular places - what are they? 

Third: Change everything to optimise these bottlenecks.

<!--
  Flesh out more describing the new environment first and then the enablers that this requires.
  New positive feedback loop analogous to old SDLC cycle
-->
What does that mean?
- You need strong, directional, ideas for your product and solving your customer needs. These are not "feature lists" but strategic guidance that allows anyone in the team, including your Agents, to generate relevant and valuable backlog items that align with the business goals and customer needs.
- You need software engineers working only on the most novel and/or critical code. Even then, they are providing the high-level guidance to Agents, not hand-writing code. 
- You need human code review for only novel or controversial changes, everything else should be automated. 
- You need _reliable_ guardrails and **lots of them**. Accept that many of your software changes - certainly all of your bug fixes and maintenance tasks, but even many of your customer-facing features - will be delivered _without human intervention_. This means guardrails up and down your SDLC stack - from the backlog to the production gates.
- You test relentlessly. We're in a post-accepted-practice world. Is your code package "Agentic ready" - test it. Is your new feature usable by people with accessibility needs - test it. Is your system within latency goals - test it. Don't accept poor proxies, test the thing you actually want to observe.
- Automate the feedback loops. Push your test results, your customer tickets, your telemetry data back into the machine. Humans don't need to analyse this stuff, they provide the guidance and the Agents will work the rest out. Latency drops below the SLA? An Agent can identify, diagnose, fix, test, and deploy the fix without human intervention.
- AI Literacy - quote Steve Yegge.

_What else?_
