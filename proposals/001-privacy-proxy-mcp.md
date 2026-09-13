# RFC-001: Privacy-Preserving MCP Proxy with Local LLM Support

**Status:** Proposal
**Author:** Community Contributor
**Created:** 2026-01-08

## Summary

Add an optional privacy-preserving proxy layer that allows users to route sensitive MCP data through local LLMs (via Ollama or similar) before it reaches Claude. This enables safe use of MCPs like Trello, Google Workspace, Notion, and others without exposing sensitive business or personal data to external APIs.

## The Problem: Risks of Sending Raw Business Data to Claude Code

When you connect MCPs to Claude Code, **every piece of data flows through Anthropic's API**. For many users, this creates unacceptable risks:

### Data Exposure Risks

| Data Type | Where It Lives | What Gets Exposed |
|-----------|---------------|-------------------|
| **Contracts & Legal** | Google Drive, Notion | Client names, deal terms, pricing, obligations |
| **Meeting Notes** | Notion, Google Docs | Strategic discussions, personnel issues, M&A talks |
| **Invoices & Expenses** | Gmail, Drive, Trello | Vendor relationships, pricing, financial data |
| **Client Communications** | Gmail, Slack | Names, projects, confidential discussions |
| **Project Management** | Trello, Notion, Asana | Roadmaps, timelines, resource allocation |
| **HR & Personnel** | Google Workspace | Salaries, reviews, personal information |

### Concrete Risk Scenarios

1. **Contract Review via Gmail MCP**
   - You ask Claude to "summarize the contract from Acme Corp in my inbox"
   - Full contract text (pricing, terms, client name) sent to Anthropic API
   - Risk: Confidential deal terms now exist outside your control

2. **Expense Tracking via Trello MCP**
   - You ask Claude to "categorize my expense cards"
   - All expense descriptions, amounts, vendor names transmitted
   - Risk: Financial patterns and vendor relationships exposed

3. **Meeting Notes via Notion MCP**
   - You ask Claude to "find action items from last week's board meeting"
   - Sensitive strategic discussions sent to external API
   - Risk: Competitive intelligence, personnel decisions leaked

4. **Invoice Processing via Google Drive MCP**
   - You ask Claude to "extract line items from recent invoices"
   - Client names, project codes, billing rates transmitted
   - Risk: Client relationships and pricing strategy exposed

### Compliance & Legal Implications

- **GDPR/CCPA**: Personal data of EU/CA residents sent to third-party API
- **HIPAA**: Healthcare-related communications may violate regulations
- **SOC 2**: Data handling may not meet audit requirements
- **NDAs**: Sharing client data with third parties likely violates agreements
- **Attorney-Client Privilege**: Legal communications lose protection
- **Fiduciary Duty**: Financial advisors exposing client data

### The Trust Paradox

Anthropic has strong privacy policies, but:
- Data still leaves your infrastructure
- You have no control over retention, logging, or access
- Future policy changes could affect historical data
- Subpoenas or breaches at Anthropic could expose your data
- Many compliance frameworks require data to stay on-premises

## The Solution: Why a Private Ollama Cloud Instance Is Worth It

Running Ollama on a private cloud GPU instance creates a **privacy boundary**—sensitive data goes to YOUR server, gets filtered, and only sanitized content reaches Claude's API.

### What You Gain

| Benefit | Description |
|---------|-------------|
| **Data Sovereignty** | Sensitive content stays on your controlled infrastructure |
| **Compliance Ready** | Meet GDPR, HIPAA, SOC 2 data residency requirements |
| **NDA Safe** | Client data stays within contractual boundaries |
| **Audit Trail** | Full visibility into what was filtered vs. shared |
| **Selective Sharing** | Keep Claude's power for reasoning, protect raw data |
| **No Local GPU Needed** | Runs on cloud—your laptop just connects to it |

### Cloud GPU Pricing (Real Costs)

Most users don't have a local GPU capable of running 30B+ models. Here's what cloud hosting actually costs:

#### GPU Cloud Providers Compared

| Provider | A100 40GB | A100 80GB | RTX 4090 | H100 | Best For |
|----------|-----------|-----------|----------|------|----------|
| **[RunPod](https://www.runpod.io/pricing)** | $1.19/hr | $1.74/hr | $0.34/hr | $1.99/hr | Easy setup, good reliability |
| **[Vast.ai](https://vast.ai)** | $0.50-1.50/hr | $0.80-2.00/hr | $0.24-0.60/hr | $1.87/hr | Cheapest, variable quality |
| **[Lambda Labs](https://lambda.ai/pricing)** | $1.29/hr | Higher | N/A | Enterprise | Enterprise, reserved capacity |
| **[Thunder Compute](https://thundercompute.com)** | $0.66/hr | ~$1.00/hr | N/A | N/A | Budget-friendly |

#### Realistic Monthly Cost Scenarios

| Usage Pattern | GPU Choice | Hours/Month | Monthly Cost |
|---------------|------------|-------------|--------------|
| **Light** (5 hrs/week) | RTX 4090 on Vast.ai | 20 hrs | **$5-12** |
| **Moderate** (2 hrs/day) | RTX 4090 on RunPod | 60 hrs | **$20-35** |
| **Heavy** (8 hrs/day) | A100 40GB on RunPod | 240 hrs | **$285** |
| **Always-on** | A100 40GB on Vast.ai | 720 hrs | **$360-1,080** |

#### Instance Lifecycle: Manual vs Automated

**For manual CLI use:**
- Start instance at beginning of workday
- Stop at end of day
- Don't start/stop between every request (30-60s startup kills productivity)

**For apps/automation calling Ollama:**

| Approach | How It Works | Best For | Cost |
|----------|--------------|----------|------|
| **Serverless (RunPod)** | Auto-scales to zero, spins up on request | Variable/unpredictable traffic | ~$0.01-0.05/request |
| **Auto-shutdown script** | Cron job stops instance after N minutes idle | Scheduled workloads | Low |
| **App-managed lifecycle** | Your app calls provider API to start/stop | Full control | Lowest |
| **Always-on** | Never stops | High-traffic, teams | Highest |

**Serverless is ideal for apps** - RunPod Serverless handles everything:
```
App request → RunPod spins up worker → Processes → Auto-scales to zero
```
No idle costs, no manual management, ~30s cold start (or keep 1 warm worker for instant response).

**App-managed example (Python):**
```python
import runpod

# Start instance before batch of requests
runpod.api.start_pod(pod_id="your-pod-id")
wait_for_ready()

# Process requests
for task in tasks:
    result = call_ollama(task)

# Stop when done
runpod.api.stop_pod(pod_id="your-pod-id")
```

**Auto-shutdown script (on the instance):**
```bash
#!/bin/bash
# shutdown-if-idle.sh - run via cron every 5 minutes
IDLE_MINUTES=30
LAST_REQUEST=$(stat -c %Y /var/log/ollama/requests.log 2>/dev/null || echo 0)
NOW=$(date +%s)
IDLE_TIME=$(( (NOW - LAST_REQUEST) / 60 ))

if [ $IDLE_TIME -gt $IDLE_MINUTES ]; then
    # Call provider API to stop this instance
    curl -X POST "https://api.runpod.io/v2/pod/${POD_ID}/stop" \
         -H "Authorization: Bearer ${RUNPOD_API_KEY}"
fi
```

#### Cost Optimization Strategies

1. **Use serverless for apps**: Auto-scales, no idle cost, minimal management
2. **Stop when not using**: GPU billing stops immediately; storage is cheap (~$5/mo)
3. **Use spot instances**: 50-70% cheaper (can be interrupted—fine for non-critical)
4. **Right-size GPU**: RTX 4090 ($0.35/hr) handles 30B MoE models; A100 only for dense 70B+
5. **Batch operations**: Queue tasks, process in batches to minimize instance uptime

### The Cost-Benefit Reality

**Setup Cost (One-Time):**
- Create cloud GPU account: 10 minutes
- Deploy Ollama template/container: 15 minutes
- Download model: 10-30 minutes (depends on model size)
- Configure privacy proxy: 15-30 minutes
- **Total: ~1 hour**

**Ongoing Cost:**
- Cloud GPU: $5-50/month for typical use
- Slight latency increase (2-5 seconds per request)

**What You Protect:**
- Contracts worth $10K-$10M+
- Client relationships built over years
- Competitive advantages in pricing/strategy
- Personal liability from compliance violations
- Reputation damage from data exposure

**Break-even**: A single protected contract or avoided compliance violation pays for years of cloud GPU costs.

### Practical Use Cases

#### Contracts & Legal Documents
```
Raw: "Agreement between Acme Corp and BigClient Inc for $2.4M annually..."
Filtered: "Agreement between [ORG_1] and [ORG_2] for [AMOUNT] annually..."
Claude sees: Structure, terms, obligations — not identities or amounts
```

#### Meeting Notes
```
Raw: "John mentioned we're acquiring StartupX for $50M, don't tell Sarah yet..."
Filtered: "Discussion of potential acquisition, confidential personnel matters..."
Claude sees: Topics and action items — not names or sensitive details
```

#### Invoices & Expenses
```
Raw: "Invoice #4521 from AWS: $34,521.00 for Project Chimera infrastructure"
Filtered: "Invoice from [VENDOR] for [AMOUNT] - infrastructure costs"
Claude sees: Expense categorization — not vendor relationships or project names
```

#### Client Communications
```
Raw: "Hi Mike, following up on the Jones Foundation proposal for $500K..."
Filtered: "Email follow-up regarding proposal for [ORG] - [AMOUNT]"
Claude sees: Communication pattern — not client identity or deal size
```

### Why Ollama Specifically?

| Feature | Why It Matters |
|---------|---------------|
| **Your Infrastructure** | Data stays on your cloud instance, not a third party |
| **100+ Models** | Choose based on task requirements and GPU capacity |
| **No Vendor Lock-in** | Open source, deploy anywhere |
| **Easy Deployment** | One-line install, pre-built cloud templates available |
| **API Compatible** | Drop-in replacement for OpenAI API format |
| **Active Community** | Regular updates, new models added frequently |

### Recommended Models for Privacy Filtering (Verified Available on Ollama)

All models below are confirmed available in the [Ollama Library](https://ollama.com/library):

| Use Case | Model | Size | GPU Needed | Why |
|----------|-------|------|------------|-----|
| **General filtering** | `nemotron-3-nano:30b` | 30B (3.5B active) | RTX 4090 / 24GB | Best balance—MoE architecture means fast inference |
| **Complex documents** | `llama3.3:70b` | 70B | A100 40GB+ | Matches 405B quality at fraction of compute |
| **Fast/lightweight** | `llama3.2:8b` | 8B | RTX 3090 / 16GB | Quick filtering, good for high volume |
| **Budget option** | `llama3.2:3b` | 3B | Any GPU / CPU | Runs anywhere, basic redaction |
| **Multilingual** | `qwen2.5:14b` | 14B | RTX 4090 / 24GB | 18T token training, 6 languages |
| **Multilingual large** | `qwen2.5:72b` | 72B | A100 80GB | Best for international enterprises |
| **Reasoning-heavy** | `deepseek-r1:14b` | 14B | RTX 4090 / 24GB | Distilled reasoning, good for complex logic |
| **Reasoning large** | `deepseek-r1:70b` | 70B | A100 40GB+ | Full reasoning capability |
| **Code-aware** | `qwen2.5-coder:7b` | 7B | RTX 3090 / 16GB | Understands code context in docs |
| **Lightweight reasoning** | `mistral:7b` | 7B | Any 12GB+ GPU | Fast, good for simple summarization |

#### Model Selection by GPU

| Your GPU | Recommended Models | Max Model Size |
|----------|-------------------|----------------|
| **RTX 4090 (24GB)** | nemotron-3-nano:30b, qwen2.5:14b, deepseek-r1:14b | ~30B |
| **A100 40GB** | llama3.3:70b, deepseek-r1:70b, qwen2.5:32b | ~70B |
| **A100 80GB** | qwen2.5:72b, any 70B model comfortably | ~72B |
| **H100 80GB** | All models, fastest inference | Any |
| **RTX 3090 (24GB)** | llama3.2:8b, mistral:7b, qwen2.5-coder:7b | ~14B quantized |

#### Special Considerations

- **nemotron-3-nano:30b** uses Mixture-of-Experts (MoE)—only 3.5B parameters active per token, so it runs faster than its size suggests
- **deepseek-r1** models are distilled from the full 671B model, retaining reasoning capability at manageable sizes
- **qwen2.5** series supports 128K context length—useful for long documents
- All models support **quantization** (Q4, Q8) to fit larger models on smaller GPUs with some quality tradeoff

### Secure Networking with Tailscale (Recommended)

Your Ollama cloud instance shouldn't be exposed to the public internet. [Tailscale](https://tailscale.com/) provides a free, zero-config private network that connects all your devices securely.

#### Why Tailscale?

| Feature | Benefit |
|---------|---------|
| **Free tier** | Up to 100 devices, 3 users—more than enough |
| **Zero config** | No port forwarding, firewall rules, or VPN setup |
| **WireGuard-based** | Modern, fast, secure encryption |
| **Works everywhere** | Linux, macOS, Windows, iOS, Android |
| **MagicDNS** | Access your instance via `ollama-server.tailnet-name.ts.net` |

#### Architecture with Tailscale

```
┌─────────────────────────────────────────────────────────────────────┐
│                     YOUR TAILSCALE NETWORK                          │
│                    (Private, Encrypted, Free)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Laptop     │  │    Phone     │  │    iPad      │              │
│  │ Claude Code  │  │  Mobile App  │  │  Future App  │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                 │                       │
│         └────────────────┼─────────────────┘                       │
│                          │                                          │
│                          ▼                                          │
│              ┌───────────────────────┐                              │
│              │  Cloud GPU Instance   │                              │
│              │  (RunPod/Vast.ai)     │                              │
│              │                       │                              │
│              │  ┌─────────────────┐  │                              │
│              │  │     Ollama      │  │                              │
│              │  │  Privacy Proxy  │  │                              │
│              │  └─────────────────┘  │                              │
│              │                       │                              │
│              │  Tailscale IP only    │                              │
│              │  No public exposure   │                              │
│              └───────────────────────┘                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (filtered data only)
                    ┌─────────────────┐
                    │  Claude API     │
                    │  (Anthropic)    │
                    └─────────────────┘
```

#### Setup Steps

1. **Install Tailscale on cloud instance:**
   ```bash
   curl -fsSL https://tailscale.com/install.sh | sh
   tailscale up
   ```

2. **Install Tailscale on your devices:**
   - Laptop: `brew install tailscale` or download from tailscale.com
   - Phone/iPad: Install from App Store / Play Store

3. **Configure Ollama to listen on Tailscale IP only:**
   ```bash
   # On cloud instance
   OLLAMA_HOST=100.x.x.x:11434 ollama serve
   ```

4. **Access from any device:**
   ```bash
   # From laptop
   curl http://ollama-server:11434/api/generate ...
   ```

### Security Best Practices

#### Network Security

| Practice | Implementation |
|----------|---------------|
| **No public IP exposure** | Bind Ollama to Tailscale IP only (100.x.x.x) |
| **Firewall rules** | Block all inbound except Tailscale (UDP 41641) |
| **Tailscale ACLs** | Restrict which devices can access the Ollama server |
| **SSH via Tailscale** | Disable password auth, use Tailscale SSH |

#### Instance Security

```bash
# Example cloud instance hardening
# 1. Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# 2. SSH key only (no passwords)
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# 3. Install and enable firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 41641/udp  # Tailscale
sudo ufw enable

# 4. Keep system updated
sudo apt update && sudo apt upgrade -y

# 5. Install fail2ban for SSH protection
sudo apt install fail2ban -y
```

#### Data Security

| Practice | Why |
|----------|-----|
| **Encrypt instance storage** | Protects data at rest if instance is compromised |
| **Don't persist sensitive data** | Process and discard—don't store filtered content |
| **Audit logging** | Log all requests (without sensitive content) for review |
| **Regular key rotation** | Rotate Tailscale auth keys periodically |

#### Access Control

```yaml
# Example Tailscale ACL policy (tailscale.com/admin/acls)
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:trusted-devices"],
      "dst": ["tag:ollama-server:11434"]
    }
  ],
  "tagOwners": {
    "tag:trusted-devices": ["your-email@example.com"],
    "tag:ollama-server": ["your-email@example.com"]
  }
}
```

#### Monitoring & Alerts

- **Tailscale admin console**: See all connected devices, connection times
- **Instance monitoring**: Set up alerts for unusual CPU/memory usage
- **Request logging**: Log request counts to detect anomalies
- **Cost alerts**: Set budget alerts on cloud provider to catch runaway instances

### The Bottom Line

**Without privacy proxy:**
- Every MCP interaction sends raw data to external API
- You trust Anthropic completely with your most sensitive information
- Compliance is questionable, NDAs may be violated
- No audit trail of what was shared

**With privacy proxy:**
- Sensitive data stays local, only summaries/sanitized content reaches Claude
- You maintain data sovereignty and compliance
- Clear audit trail of filtering decisions
- Claude's capabilities preserved for reasoning and assistance

**The 1-hour setup protects unlimited future interactions.**

## Honest Trade-offs: Is This Worth It?

Before diving into implementation, consider whether this complexity is right for your situation.

### The Real Costs

| Cost | Details |
|------|---------|
| **Money** | $13-26/month for light use ($150-300/year) |
| **Time** | 1-2 hours initial setup, ongoing maintenance |
| **Latency** | 2-10 seconds added to every MCP call |
| **Quality** | Filtered data loses context Claude might need |
| **Complexity** | Another system to debug when things break |

### Quality Degradation is Real

Local LLMs are NOT as smart as Claude. Filtering **will lose information**:

```
Raw:      "John needs the Q3 report for the Acme meeting Thursday at 3pm"
Filtered: "[PERSON] needs [DOCUMENT] for [ORG] meeting [DATE]"
Problem:  Claude can't tell you WHEN the meeting is or WHO to contact
```

Over-filtering makes Claude less useful. You're trading privacy for capability.

### False Sense of Security

| Risk | Why It Matters |
|------|----------------|
| **Pattern matching misses** | Unusual formats, typos, new PII types slip through |
| **NER failures** | Foreign names, company names that look like common words |
| **LLM mistakes** | Might accidentally include sensitive info in "summary" |
| **Liability shifts to you** | If the filter fails, it's YOUR responsibility |

### Simpler Alternatives

| Alternative | When It's Better |
|-------------|------------------|
| **Don't connect sensitive MCPs** | Only occasionally need sensitive data access |
| **Manual copy-paste** | For rare sensitive queries, skip the MCP entirely |
| **Anthropic Enterprise** | Your company pays, they handle compliance/BAA |
| **Separate accounts** | Keep sensitive data in systems Claude doesn't touch |
| **Just be careful** | Anthropic's API data isn't used for training anyway |

### Anthropic's Actual Data Practices

Worth noting: Anthropic already has reasonable privacy practices:
- API data is **not used for model training** (per their policy)
- SOC 2 Type II certified
- HIPAA BAA available for enterprise customers
- Data retention policies are documented

For many users, Anthropic's existing policies may be sufficient.

### Who Should Actually Use This?

| User Type | Recommendation | Why |
|-----------|----------------|-----|
| **Solo dev, side projects** | **Skip it** | Overkill, no compliance need |
| **Personal productivity** | **Probably skip** | Unless handling others' PII |
| **Freelancer with client NDAs** | **Consider it** | Depends on contract language |
| **Agency/consultancy** | **Yes** | Client data = real liability |
| **Healthcare/Legal/Finance** | **Yes** | Compliance mandates it |
| **Enterprise teams** | **Maybe Enterprise instead** | Anthropic's offering may be simpler |

### The Honest Bottom Line

**Use this if:**
- You have contractual/legal obligations (NDAs, HIPAA, GDPR)
- Client data flows through your MCPs
- You'd be personally liable for data exposure
- The 2-10s latency is acceptable for your workflow

**Skip this if:**
- You're working on personal/open-source projects
- No compliance requirements apply
- Anthropic's standard privacy policy is sufficient
- Speed matters more than theoretical privacy gains

**This proposal exists for users who genuinely need it—not everyone does.**

---

## Quick Start Guide (RunPod + Tailscale)

Get a private Ollama instance running in ~15 minutes:

### Step 1: Create RunPod Account
1. Sign up at [runpod.io](https://runpod.io)
2. Add $10-25 credit (pay-as-you-go, no subscription)

### Step 2: Deploy Ollama Pod
1. Go to **Pods** → **+ Deploy**
2. Select GPU: **RTX 4090** ($0.34/hr) for most use cases
3. Select template: Search "Ollama" or use **RunPod Ollama**
4. Set container disk: **50GB** (for model storage)
5. Click **Deploy**

### Step 3: Install Tailscale on Pod
Open **Web Terminal** once pod is running:
```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate (opens a link - follow it)
tailscale up

# Note your Tailscale IP
tailscale ip -4
# Example: 100.100.100.100
```

### Step 4: Configure Ollama for Tailscale Only
```bash
# Stop default Ollama (listening on 0.0.0.0)
pkill ollama

# Restart bound to Tailscale IP only (not public)
OLLAMA_HOST=100.100.100.100:11434 ollama serve &

# Pull your model
ollama pull nemotron-3-nano:30b
```

### Step 5: Install Tailscale on Your Devices
- **Mac**: `brew install tailscale && tailscale up`
- **Windows/Linux**: [tailscale.com/download](https://tailscale.com/download)
- **iOS/Android**: App Store / Play Store

### Step 6: Test Connection
From your laptop:
```bash
# Verify Ollama is reachable
curl http://100.100.100.100:11434/api/tags

# Test inference
curl http://100.100.100.100:11434/api/generate -d '{
  "model": "nemotron-3-nano:30b",
  "prompt": "Summarize without names: Meeting with John about Acme deal for $500k",
  "stream": false
}'
```

### Step 7: Stop Pod When Done
- **Dashboard**: Pods → Stop
- **CLI**: `runpod pod stop <pod-id>`

GPU billing stops immediately. Storage continues (~$5/mo).

**Total setup time: ~15 minutes | Cost: ~$0.10**

---

## When NOT to Use This

This adds complexity. Skip it if:

| Scenario | Why Skip It |
|----------|-------------|
| **Non-sensitive data** | Public code, open-source, no PII involved |
| **Already anonymized** | Data pre-sanitized before it reaches you |
| **No compliance requirements** | No NDAs, no regulated industry |
| **Speed is critical** | Real-time apps where 2-10s latency breaks UX |
| **Anthropic Enterprise** | Your org has BAA/DPA with Anthropic already |

---

## Integrating with Claude Code

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          YOUR MACHINE                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────────────┐    ┌─────────────────────┐ │
│  │ Claude Code │───▶│   Privacy Proxy     │───▶│  Original MCPs      │ │
│  │             │    │   (MCP Server)      │    │  (Trello, Gmail...) │ │
│  │             │◀───│                     │◀───│                     │ │
│  └─────────────┘    └──────────┬──────────┘    └─────────────────────┘ │
│                                │                                        │
│                                │ Sensitive data via Tailscale          │
│                                ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    TAILSCALE NETWORK (encrypted)                  │  │
│  │    ┌─────────────────────────────────────────────────────────┐   │  │
│  │    │           Cloud GPU (RunPod/Vast.ai)                    │   │  │
│  │    │                                                         │   │  │
│  │    │    ┌─────────────┐                                      │   │  │
│  │    │    │   Ollama    │  ← Filters/summarizes locally        │   │  │
│  │    │    └─────────────┘                                      │   │  │
│  │    │                                                         │   │  │
│  │    └─────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                        │
│                                │ Only sanitized data                    │
│                                ▼                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │    Anthropic API    │  ← Sees filtered data only
                      │       (Claude)      │
                      └─────────────────────┘
```

### Claude Code Configuration

Add the privacy proxy as an MCP server:

```json
// ~/.config/claude-code/settings.json
{
  "mcpServers": {
    "privacy-proxy": {
      "command": "npx",
      "args": ["@anthropic-docs-local/privacy-proxy"],
      "env": {
        "OLLAMA_HOST": "http://100.100.100.100:11434",
        "OLLAMA_MODEL": "nemotron-3-nano:30b",
        "CONFIG_PATH": "~/.config/privacy-proxy/filters.yaml"
      }
    }
  }
}
```

### Example Flow

```
User: "What are my high-priority Trello cards?"

1. Claude Code → Privacy Proxy: trello_get_cards(list="To Do")
2. Privacy Proxy → Trello MCP: [fetches raw cards]

   Raw data from Trello:
   - "Call John Smith about Acme Corp deal - $500k"
   - "Review NDA from BigClient Inc"
   - "Email sarah@partner.com about merger timeline"

3. Privacy Proxy → Ollama (via Tailscale): [apply Level 2 filter]

   Filtered result:
   - "Call [PERSON] about [ORG] deal - [AMOUNT]"
   - "Review NDA from [ORG]"
   - "Email [EMAIL] about merger timeline"

4. Privacy Proxy → Claude Code: [returns filtered data]

5. Claude → User: "You have 3 high-priority cards:
   - A client call about a deal
   - An NDA to review
   - A partner email about merger timing"
```

Claude provides useful help **without seeing names, companies, or dollar amounts**.

---

## Why This Matters for This Repository

### 1. Natural Extension of the "Local-First" Philosophy

This repository embodies a **local-first approach** to Anthropic documentation—keeping valuable resources offline, version-controlled, and under user control. A privacy proxy extends this philosophy to **data interactions**, not just documentation.

| Current Repo | Proposed Extension |
|--------------|-------------------|
| Local docs (read) | Local data filtering (read/write) |
| Offline access to knowledge | Offline protection of sensitive data |
| Git-versioned content | Audit trail of what data was shared |

### 2. Enterprise & Professional Adoption Barrier

Many professionals and enterprises **cannot use Claude Code with MCPs** due to data governance requirements:

- **Legal/Compliance:** Law firms, healthcare, finance cannot send client data to external APIs
- **Competitive Sensitivity:** Business strategy in Trello/Notion boards
- **Personal Privacy:** Google Workspace contains emails, calendars, contacts
- **Contractual:** NDAs prohibit sharing project details with third parties

A privacy proxy **removes this barrier** while preserving Claude Code's utility.

### 3. Complements Existing Update Infrastructure

The repo already has infrastructure for:
- Fetching and processing external content (`manifest.json`, source types)
- Configurable data pipelines (github-raw, web-extracted, manual)
- Claude Code slash commands for automation

A privacy proxy fits naturally into this architecture as another **configurable data pipeline**.

### 4. Differentiation

No other Claude Code extension or MCP toolkit offers this capability. This would make the repository a unique resource for privacy-conscious Claude Code users.

## Technical Design

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                     PRIVACY MCP PROXY                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │ Trello MCP  │───▶│             │───▶│                     │  │
│  ├─────────────┤    │   Filter    │    │    Claude Code      │  │
│  │ Google MCP  │───▶│   Pipeline  │───▶│    (receives only   │  │
│  ├─────────────┤    │             │    │    filtered data)   │  │
│  │ Notion MCP  │───▶│             │    │                     │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│                    ┌─────────────┐                               │
│                    │ Local LLM   │                               │
│                    │ (Ollama)    │                               │
│                    └─────────────┘                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Filter Pipeline (Three Levels)

#### Level 1: Pattern-Based Filtering (No LLM, Fast)
Regex-based redaction for known PII patterns:

```python
PATTERNS = {
    'email': r'[\w\.-]+@[\w\.-]+\.\w+',
    'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
    'ssn': r'\b\d{3}-\d{2}-\d{4}\b',
    'credit_card': r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',
    'ip_address': r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b',
}
```

#### Level 2: Named Entity Recognition (Local, No External API)
Uses local NER models (spaCy, Presidio, or similar) for:
- Person names → `[PERSON_1]`, `[PERSON_2]`
- Organization names → `[ORG_1]`, `[ORG_2]`
- Locations → `[LOCATION]`
- Dates (optional) → `[DATE]`

#### Level 3: LLM-Based Summarization (Local via Ollama)
For complex content requiring semantic understanding:
- Email threads → Intent summary without specifics
- Documents → Topic/action extraction
- Conversations → Key points without identifiers

### Model-Agnostic Design

The proxy should work with **any Ollama-compatible model**. Different use cases benefit from different models:

| Model | Size | Best For | Tradeoffs |
|-------|------|----------|-----------|
| **nemotron:70b** | 70B | Complex reasoning, nuanced summarization | Slower, needs GPU |
| **nemotron:30b** | 30B | Good balance of quality/speed | Recommended default |
| **llama3.2** | 3B-90B | General purpose, fast | Various sizes available |
| **mistral** | 7B | Fast, good for simple filtering | Less nuanced |
| **phi3** | 3.8B | Very fast, edge deployment | Limited context |
| **qwen2.5** | 0.5B-72B | Multilingual support | Good for international data |
| **deepseek-r1** | Various | Reasoning tasks | Good for complex logic |

#### Configuration Example

```yaml
# privacy-config.yaml
llm:
  provider: ollama
  base_url: http://localhost:11434

  # Model selection per task
  models:
    summarization: nemotron:30b      # Complex content understanding
    classification: llama3.2:3b      # Fast categorization
    translation: qwen2.5:7b          # Multilingual content

  # Fallback chain if primary unavailable
  fallback_chain:
    - nemotron:30b
    - llama3.2:8b
    - mistral:7b
```

### Per-MCP Configuration

```yaml
# privacy-filters.yaml
filters:
  trello:
    enabled: true
    level: 2  # Pattern + NER
    redact:
      - emails
      - names
      - phone_numbers
    preserve:
      - card_titles
      - due_dates
      - labels
      - checklist_structure

  google-workspace:
    enabled: true
    gmail:
      level: 3  # Full LLM summarization
      model: nemotron:30b
      prompt: |
        Summarize this email thread. Include:
        - Main topic/request
        - Action items
        - Urgency level
        Do NOT include: names, emails, specific dates, company names

    drive:
      level: 1  # Metadata only
      expose:
        - filename_without_path
        - file_type
        - modified_date
      redact:
        - full_path
        - owner
        - shared_with

    calendar:
      level: 2
      redact:
        - attendees
        - location
        - meeting_links
      preserve:
        - time_slot
        - duration
        - event_category  # "meeting", "focus time", "travel"

  notion:
    enabled: true
    level: 2
    database_queries:
      mode: "aggregate"  # Return counts/summaries, not individual records
    pages:
      mode: "outline"    # Structure only, not content

  slack:
    enabled: true
    level: 3
    model: nemotron:30b
    prompt: |
      Summarize this Slack conversation:
      - Topic discussed
      - Decisions made
      - Open questions
      Replace all usernames with generic labels (User A, User B)

  # Catch-all for unknown MCPs
  default:
    enabled: true
    level: 1  # Conservative: pattern filtering only
    warn_user: true
```

### Audit & Transparency

```yaml
audit:
  enabled: true
  log_path: ~/.privacy-proxy/audit.log

  # What to log
  log_events:
    - mcp_calls           # Which MCP was called
    - filter_applied      # What filtering happened
    - data_redacted       # What was removed (hashed, not plaintext)
    - llm_invocations     # When local LLM was used

  # Optional: show user what was filtered
  transparency_mode: true  # Adds "[FILTERED: 3 emails, 2 names]" to output
```

## Directory Structure

```
anthropic-docs-local/
├── ... (existing structure)
└── privacy-proxy/
    ├── README.md
    ├── setup.py
    ├── requirements.txt
    ├── src/
    │   ├── __init__.py
    │   ├── filters/
    │   │   ├── __init__.py
    │   │   ├── pattern_filter.py    # Level 1: Regex
    │   │   ├── ner_filter.py        # Level 2: Named entities
    │   │   └── llm_filter.py        # Level 3: Ollama integration
    │   ├── proxy/
    │   │   ├── __init__.py
    │   │   ├── mcp_interceptor.py   # MCP call interception
    │   │   ├── router.py            # Routes to appropriate filter
    │   │   └── response_handler.py  # Handles bi-directional filtering
    │   ├── config/
    │   │   ├── __init__.py
    │   │   ├── loader.py
    │   │   └── schema.py
    │   ├── audit/
    │   │   ├── __init__.py
    │   │   └── logger.py
    │   └── cli.py                   # Command-line interface
    ├── config/
    │   ├── privacy-filters.yaml     # Default filter config
    │   └── models.yaml              # Model configurations
    ├── tests/
    │   ├── test_pattern_filter.py
    │   ├── test_ner_filter.py
    │   ├── test_llm_filter.py
    │   └── fixtures/
    └── docs/
        ├── setup.md
        ├── configuration.md
        └── model-recommendations.md
```

## Implementation Phases

### Phase 1: Core Infrastructure
- Pattern-based filtering (Level 1)
- Configuration system
- Basic CLI
- Single MCP support (Trello as pilot)

### Phase 2: Enhanced Filtering
- NER integration (Level 2)
- Ollama integration (Level 3)
- Multi-model support
- Audit logging

### Phase 3: Broad MCP Support
- Google Workspace MCP
- Notion MCP
- Slack MCP
- Generic MCP wrapper

### Phase 4: Advanced Features
- Bi-directional filtering (writes)
- Custom filter rules
- Web UI for configuration
- Filter rule sharing/templates

## Open Questions

1. **MCP Interception Method:** Should this be a wrapper MCP server, a Claude Code hook, or a standalone proxy?

2. **Write Operations:** How should we handle writes back to MCPs? Options:
   - Block all writes through proxy
   - Require explicit user confirmation
   - Reverse-map placeholders to original values (complex)

3. **Performance:** Should we cache filtered results? How to invalidate?

4. **Distribution:** Separate repo or subdirectory of this repo?

## Alternatives Considered

| Alternative | Why Not Sufficient |
|-------------|-------------------|
| Just don't use sensitive MCPs | Defeats purpose of Claude Code automation |
| Manual data sanitization | Time-consuming, error-prone, doesn't scale |
| Enterprise Claude deployment | Not available to individuals/small teams |
| Different AI assistant | Loses Claude's capabilities |

## Success Metrics

- Users can connect sensitive MCPs without data leaving local machine
- Filter configuration takes < 5 minutes
- Latency overhead < 3 seconds for Level 1-2, < 10 seconds for Level 3
- Zero sensitive data leakage in audit logs

## References

- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [MCP Specification](https://modelcontextprotocol.io/)
- [Microsoft Presidio (PII Detection)](https://github.com/microsoft/presidio)
- [spaCy NER](https://spacy.io/usage/linguistic-features#named-entities)

---

## Feedback Requested

We welcome feedback on:
1. Is this the right scope for this repository?
2. Which MCPs should be prioritized?
3. What filtering levels are most important?
4. Interest in contributing to implementation?

Please open an issue or comment on this proposal.
