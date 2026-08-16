---
title: "The Making of Claude Code"
source_url: "https://www.anthropic.com/features/making-of-claude-code"
source_type: "web-extracted"
fetched_at: "2026-08-16T00:00:00Z"
category: "claude-code"
published: "2026"
---

# The Making of Claude Code

The inside story of how Claude Code went from an internal CLI to Anthropic's coding agent, told by the researchers, engineers, and early users who built it. This is an oral history assembled from first-person accounts.

> Note: This page is published by Anthropic as an interactive "read in terminal / read as article" feature. The narrative below is reconstructed from the article text.

## Origins (2021–2022): coding as the path to transformative AI

**Ben Mann (Anthropic co-founder and Labs team lead):** When we started Anthropic and eventually decided to build a product — controversial in itself — the first thing we made was a coding assistant. It was a VS Code extension. You could chat with it, and it would give you four different suggestions of what to do for each prompt.

**Shauna Kravec (Head of Reinforcement Learning):** At the beginning of 2022 we were already thinking about coding assistants and models that could do autonomous software engineering. We built the original RL codebase and figured out how to do all the training for agents. We were interested in coding because we thought the path to transformative AI would route through the ability to automate large chunks of software engineering.

**Dawn Drain (Research Engineer):** My main project for my first three years at Anthropic, beginning in 2021, was to make a model as good at coding as possible — at least as good as me. With RL training, we started with easy tasks: can the model write a simple function? Then, can it write a function and test whether it's correct? At first the models were really terrible at it.

The early VS Code extension was "fairly popular" in spring 2022, with around 100 external users. But the infrastructure for agentic coding is far more complicated than for a chatbot — especially code execution, which requires deciding which environment the code runs in. A key early challenge was **harness design**: the scaffolding around the model that lets it act. Engineers got a persistent shell working inside a container so the model could execute code, stream input and output, and handle timeouts.

The team then helped launch the first version of the API and "basically forgot about the coding assistant for a while," while research kept improving models at agentic coding.

## The rise of "clide" (2023–2024)

By the end of 2022, work shifted toward more open-ended, useful agents. By 2023 came basic function calling, some search, and other pieces. The RL team figured out how to give the model a **bash tool** and the ability to search around — the key pieces that make agentic coding work.

An internal command-line tool called **clide** (a name coined by colleague Eli Tran-Johnson) let people chat with Claude for code editing and dev tasks. It was wonky and very ahead of its time. One clide feature fanned out a hundred Claude Haikus in parallel so you could ask a question about an entire folder too large to fit in context.

**Sid Bidasaria (MTS, Labs; engineer #2 on Claude Code):** Everyone talked about clide, but it was clunky and slow to start up.

**Adam Wolff (first manager on the Claude Code team):** The clide agent was one of the last features I added before moving to Labs. clide didn't have a bash tool, so it was limited. The first time it worked, I was dancing around my kitchen.

**Boris Cherny (Head of Claude Code):** You had to use all these incantations to get clide to work. Even though it wasn't great software, it was amazing and magical, because it saw the future. Adam rejected a pull request I'd written by hand and told me to use clide instead. I pasted the issue into clide and it wrote the full request. I'd never seen anything like that. It felt like the future — "Holy shit." We'd seen the pieces; we just needed to put them together.

## Claude CLI: the standalone tool (late 2024)

**Boris Cherny:** My starter project was to "automate coding." I had to learn the API first. I built a standalone tool, separate from clide, from the ground up, and called it **Claude CLI**. I posted it on Slack — I got two or three likes. This was about two days of work; to recreate it today with Claude Code would take two minutes.

**Igor Kofman (MTS, Labs):** It was obvious to me this was the right approach.

**Robert Boyce (MTS, Labs):** The day after Boris posted, I recognized those red and green diff lines. He said, "Yeah, it's doing my coding." It was the craziest thing — it was useful. The app was very simple then, not much more than tool definitions in a loop and a simple REPL UI. It was really far from good, but I felt intense urgency to make it good, and started working every weekend.

Boris asked Adam to manage the effort; Adam declined several times (he wanted to be an IC again) before agreeing.

## Building the team, keeping it small (late 2024–early 2025)

**Cat Wu (Head of Product, Claude Code):** I joined in summer 2024. When Boris posted his Claude CLI demo, I used it to build RL environments and was so impressed by how much faster it made me. I sent Boris paragraphs of feedback and he'd land fixes just as fast.

**Meaghan Choi (Product Designer):** My first interaction was around December 2024. Designing for CLI tools isn't common, but I saw Claude CLI and thought, "We could make this a cool product; it just needs a little design love." I asked for a quick two-week spike.

Leadership deliberately held back rapid growth. Keeping the team small was "actually very important to our success" — it kept the team creative with resources, prevented overengineering, and forced everyone to use Claude more. It was an early experiment in how Claude Code would change engineering teams and productivity expectations. After the green light in December 2024, six or seven people joined for a final two-week sprint that produced many core features — bug reporting, the login flow.

## Fast iteration and a CLI advantage

Because Claude Code auto-updated and had good user metrics, feedback poured in and the team shipped same-day (sometimes same-hour) PRs, replying to every comment in minutes. Being a CLI rather than a web app meant no complex architecture — "just a client application. Super simple." A recurring theme: you have to build something that works 20–30% of the time now so that when the next model arrives, it works — which requires high pain tolerance.

## Launch and naming (February 2025)

The early-access reception was lukewarm — cool idea, lots of bugs — but the team launched as a research preview in February 2025. Claude CLI was renamed **Claude Code** (name proposed by Alex Isken in Product Marketing). Late one night before launch, an ASCII-art all-caps logo was created in collaboration with Claude, along with the little Clawd character in the terminal (originally made by Sam McAllister for the Claude 3.5 Sonnet launch).

## Early external users

**Austin Ray (AI DevX Lead, Ramp):** I've been a CLI guy my whole career. Within the first five minutes of trying Claude Code I started evangelizing it inside Ramp, going to people's desks saying "you gotta trust me." Boris, Cat, and I had weekly feedback meetings.

**Kyle Easterly (CEO, Delve Group; Claude Community Ambassador):** I was consulting for a nonprofit — the Statewide Independent Living Council of Alaska. Before Claude Code I copied and pasted files into the Workbench. When Claude Code was released I got chills: if it can read, edit, and run bash, it can do anything. Those primitives were all that was required to build everything else.

**Jarred Sumner (Founder, Bun):** I asked Claude Code to implement websocket client compression in Bun, fed it the RFC, and it figured out how to implement it — a bad job at first, then much better after iteration. I was probably too obsessed with it relative to its impact at the time.

## The Claude 4 inflection point (2025)

**Meaghan Choi / team:** When the Claude 4 models came out, that's when our moment came. Until then there wasn't much UX design we could do — the model just wasn't ready for the product we wanted to build. But then it was. Rolling out subscriptions plus the model innovation enabled Claude Code's takeoff: a business-model innovation coupled with a model innovation. Once you cross the model-capability threshold, the form factor reveals itself.

## The shift in how software gets built

Contributors describe writing progressively less code by hand — from ~10% of code written by Claude Code in February 2025 to 30–40% by May, to, for some, 100% by winter 2025 ("Not a single line by hand"). The article distinguishes two kinds of developers: those for whom writing code is a "zen garden," and those whose highest achievement is shipping something real to users. Power users describe running a "swarm of twelve different Claudes" reading documents, updating things, and pulling from Slack — and anticipate a next level of abstraction where "you're not managing a bunch of Claudes — now you're managing the Claudes' manager."

On trust: "When we first launched, everyone was reading every single permission request. These days, a huge portion of our users just auto-accept everything. The transition shows that Claude has earned their trust."

## Reflections and the road ahead

**Boris Cherny (on lessons from React):** React started as a pure computer-science idea and became something else entirely once it crossed a million daily active users. Claude Code will evolve the same way — whatever you think it is (the terminal, the personality, a prompting technique), none of those things matter at the limit.

**Austin Ray:** When driving adoption at Ramp, I was intentional about building a community and culture of experimentation — sharing failures and wins publicly. Compounding tribal knowledge is key.

Contributors emphasize open-ended usefulness as the real prize: curing cancer, accelerating research, and similar goals "you're not going to get from a model that just answers." You need a model that can be out in the world, acting. A nonprofit that could never afford custom software can now, for example, transcribe handwritten fuel-delivery logs from Alaska's North Slope into CSVs and ship a tablet app.

The closing note is one of acceleration and disorientation: for much of 2026–2027, "there's going to be quite a lot happening in as little as three months," and "I'm not sure if anybody is ready for it."
