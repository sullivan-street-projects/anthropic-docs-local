---
title: "Claude can design electronic prototypes from start to finish"
source_url: "https://www.anthropic.com/research/claude-electronics-design"
source_type: "web-extracted"
fetched_at: "2026-11-16T00:00:00Z"
category: "research"
---

# Claude can design electronic prototypes from start to finish

**Published:** Nov 9, 2026 | **Team:** Science | **Topics:** Reasoning, Benchmarks, Tool use, Partnerships, Discovery

**Contributors:** Mike Cretella, Connor Jennings, and Brent Yi (Anthropic), with Craig Chen and the Diode Computers team. Editorial support from Xander Balwit, Tom Chivers, Rebecca Hiscott, and Caitlin Love.

## Contents

| # | Section |
|---|---|
| — | Introduction |
| 01 | Reasoning through geometric problems |
| 02 | Revising designs |
| 03 | Using software and documentation |
| 04 | Keeping track of constraints and downstream effects |
| 05 | Designing for real-world manufacturing |
| 06 | Limitations and next steps |

## Introduction

- A little over a year earlier, Anthropic began testing Claude on basic circuit design together with **Diode Computers**, a company that designs and manufactures circuit boards. Anthropic has a commercial relationship with Diode.
- Earlier models couldn't reliably lay out a circuit board or design parts that fit together.
- **Claude Fable 5.2** was asked to design three devices, with minimal prompting from Diode:
  1. a speakerphone
  2. a voice-assistant hub
  3. a handheld virtual pet
- Claude produced specifications, schematics, PCB layouts and routing, 3D-printable enclosures, firmware, and parts lists. Diode assembled the boards under Claude's direction.
- All three prototypes still worked after weeks of use.
- Caveat: these are early prototypes, so their long-term reliability and their prospects for commercial certification are unknown.

## 01 Reasoning through geometric problems

- Fable 5.2 produced more compact and practical layouts than earlier models. It routed high-speed, high-current, and noise-sensitive connections first.
- On the hub, Claude routed the USB and Ethernet differential pairs, matched track lengths, added tuning patterns, and arranged the power supply for efficiency.

| Benchmark | Fable 5.2 | Comparison |
|---|---|---|
| PCB Gym (internal) | 69% | Fable 5: 25% |
| BenchCAD 2.1 (public) | 83.5% | Nearly double its predecessor, Fable 5.1 |

## 02 Revising designs

- Earlier models rarely revised their own work. Diode had ended up with many boards that were about **95% complete** but unusable.
- Fable 5.2 changed course without being prompted:
  - On the speakerphone's four-layer board, it reassigned chip pins so the touch-wheel tracks stayed on one layer.
  - When the hub's board got crowded, it swapped interchangeable pins and re-laid an entire corner instead of adding layer jumps.
  - It judged the hub's tracks "too tangled" to trace by eye, and deleted and rerouted them dozens of times.

## 03 Using software and documentation

- Claude consulted datasheets for part-specific decisions. Asked whether the pet would work without a battery, it predicted that it would run on USB power but that the charging light would flicker.
- KiCad's built-in router drew one track at a time, which was too slow for the hub's long tracks running from a 100-pin connector.
- Claude wrote its own **grid-based router in about half an hour**. The router could lay each long track in roughly **one second**.
- When an audio clock track ran too close to the Ethernet tracks, Claude changed the router to leave more clearance.

## 04 Keeping track of constraints and downstream effects

- Claude wrote code to check that the 3D model of the board fit inside its enclosure.
  - The speakerphone board couldn't drop straight in, because the mute switch hit the back wall. It is installed tilted at about **25 degrees**, and Claude added that step to the assembly instructions.
- On the hub, a **25 mm** microphone port would resonate near **3.4 kHz**, inside the voice band. A wedge-shaped enclosure shortened the port to about **10 mm**, which raised the resonance to about **8.9 kHz**.
- The speakerphone's firmware dims its LED ring as audio gets louder, which keeps the device under the current limit designed into the board.

## 05 Designing for real-world manufacturing

- Claude ran design-for-manufacturing checks (comparing the geometry against the factory's limits) and sourcing checks (whether parts were in stock). It then sorted the results into real problems to fix and flags that could be ignored.
  - Six solder mask slivers were too thin. Claude widened the openings without moving any parts.
  - A ground-to-ground connection was flagged as an error. Claude correctly reasoned that it was deliberate and didn't affect performance, and ignored the flag.
- Diode manufactured all three boards directly from Claude's files, with no rounds of adjustment.
- Figures show the four copper layers of the speakerphone and hub boards, plus a diagram of the tilted installation.

## 06 Limitations and next steps

- The devices have not gone through electrical validation, antenna tuning, thermal testing, or certification, and they weren't designed for mass production.
- Claude wasn't connected to test equipment or manufacturing machines. Diode engineers built and tested the prototypes.
- The post mentions OpenAI's similar work on a handheld device.
- **Next steps:** test whether Claude can design denser, faster, and more complex boards; verify designs in simulation; and learn from measurements of finished devices.

## Footnotes

1. Anthropic has a commercial relationship with Diode.
2. Diode's prompts were rare and brief, for example "Will it work if there is no battery?", "clean up the schematic," and "continue."
