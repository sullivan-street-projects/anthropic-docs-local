---
title: "Claude Code Guide for Designers — Felix Lee"
source_url: "https://adplist.substack.com/p/claude-code-guide-for-designers"
source_type: "web-extracted"
fetched_at: "2026-03-10T00:00:00Z"
category: "claude-code"
---

# Claude Code Guide for Designers — Felix Lee

**Author:** Felix Lee (@felixleezd), CEO & Co-founder of ADPList
**Source:** [Substack](https://adplist.substack.com/p/claude-code-guide-for-designers) | [Original tweet](https://x.com/felixleezd/status/2029236285005860903)
**Context:** "I'm not a developer. I'm a designer. A year ago, I couldn't ship a single line of code without an engineer. Now I deploy products on weekends."

---

## Core Thesis

Designers using Claude Code can go from concept to shipped product without traditional engineering handoffs. The gap between "designer who designs" and "designer who builds" is the new career differentiator.

## Key Projects Featured

**Tetris Game**: Built entirely through Figma MCP connected to FigJam, then deployed via Claude Code — no manual coding required.

**Growth Design Tool**: A database-backed application with user authentication and AI-powered recommendations, completed in three days with 500+ users.

## Setup

### Installation
```bash
npm install -g @anthropic-ai/claude-code
```

Verify by typing `claude` in terminal.

### Essential Terminal Commands
- `claude` — Launch Claude Code
- `cd folder-name` — Navigate directories
- `ls` (Mac) / `dir` (Windows) — List files
- `pwd` — Show current location

## The Designer's Workflow

### Step 1: Planning Phase
Ask Claude Code to research implementation approaches and generate a `plan.md`:
- Recommended technology stack
- File structure overview
- Design considerations
- Step-by-step implementation strategy

### Step 2: Implementation
Give directives in plain English:
- "Implement this project according to plan.md. Start with the HTML structure, then add CSS styling."

### Step 3: Local Preview
```bash
npx serve
```
Access at `http://localhost:3000`

### Step 4: Iterative Refinement
Request styling adjustments in natural language:
- "Make the hero section full-height (100vh) with vertically centered text"
- "Add 32px padding between project cards"
- "Include subtle hover effects with scale and shadow"

Add functionality:
- "Add smooth scroll navigation"
- "Implement contact form using Formspree"
- "Create responsive hamburger menu for screens under 768px"

## Version Control & Deployment

### GitHub Integration
```bash
git init
git remote add origin [repository-url]
git add .
git commit -m "Initial commit"
git push -u origin main
```

Create documentation:
- `README.md` — Project explanation and local setup instructions
- `claude.md` — Architecture details and context for future sessions

### Vercel Deployment
1. Sign up at vercel.com using GitHub credentials
2. Import repository
3. Click Deploy — auto-deploys with each GitHub push

### Custom Domain
```
Type: A,     Name: @,   Value: 76.76.21.21
Type: CNAME, Name: www, Value: cname.vercel-dns.com
```

## Building Web Applications

### Environment Variables
```bash
# .env (add to .gitignore!)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyxxxxx
OPENAI_API_KEY=sk-xxxxx
```

### Supabase Setup (Database & Auth)
1. Create project at supabase.com
2. Enable Google sign-in under Authentication > Providers
3. Create OAuth Client ID at console.cloud.google.com
4. Copy credentials back to Supabase
5. Redeploy application

## Effective Prompting Patterns

| Category | Example |
|----------|---------|
| **Planning** | "Research how to build [X] and create a plan.md with tech stack, structure, and implementation steps." |
| **Implementation** | "Implement this according to plan.md. Start with [component]." |
| **Feature Addition** | "Add a [feature] that [behavior]. Use [service/API] if needed." |
| **Debugging** | "I'm getting this error: [error]. Find and fix the issue." (Include screenshots) |

## Key Takeaways for Designers

1. **Figma MCP integration** bridges design tools directly to code generation
2. **plan.md first** — always start with a plan, not code
3. **Natural language refinement** — describe visual changes in design terms (padding, hover effects, typography)
4. **Verification loop** — use `npx serve` to preview and iterate continuously
5. **Ship fast** — Vercel + GitHub gives you continuous deployment from day one

## Sources

- [Claude Code Guide for Designers](https://adplist.substack.com/p/claude-code-guide-for-designers)
- [Vibe-Coding for Designers School](https://adplist.org/vibe-code-designers)
- [Original tweet](https://x.com/felixleezd/status/2029236285005860903)
