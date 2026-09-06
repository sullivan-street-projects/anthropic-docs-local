---
title: "Previewing the Model Hardware Standard"
source_url: "https://www.anthropic.com/news/model-hardware-standard-research-preview"
source_type: "web-extracted"
fetched_at: "2026-09-06T00:00:00Z"
category: "news"
published: "2026-08-27"
---

# Previewing the Model Hardware Standard

## Overview

Anthropic announced a research preview of the Model Hardware Standard (MHS), a specification enabling AI agents to safely operate physical laboratory and manufacturing devices. Developed collaboratively with HHMI Janelia Research Campus, MHS reduces hardware integration from weeks or months to hours or minutes.

## How MHS Works

MHS introduces a standardized driver translating between operating systems and hardware devices using simple primitives like "read" and "write" commands. The system:

- Makes devices discoverable in standard formats
- Provides natural language tags documenting device characteristics
- Automatically generates reference files with device specifications
- Enables orchestration across multiple devices via single commands
- Supports three control mechanisms: Model Context Protocol, command line interface, and code APIs

According to the announcement, Claude interacts with experiments and hardware in an exploratory manner, much as a scientist would, including adjusting parameters and analyzing results in real time.

## Key Partner Implementations

### Genentech

Automated the BCA protein assay coordinating a liquid handler, robotic arm, and plate reader. Claude independently optimized fluid dynamics parameters for different liquid types and recovered from errors autonomously, though required guidance understanding physical constraints like bubble formation.

### University of Washington Baker and Pinglay Labs

Implemented remote monitoring dashboards, AI-supervised qPCR with real-time curve analysis, and collision-free robotic plate handoffs. Integration took approximately one week versus months for traditional approaches.

### Carnegie Mellon University

Accelerated serial dilution dose-response experiments approximately threefold by orchestrating incompatible interfaces across three computers. Setup required eight hours versus typical weeks for vendor solutions.

### HHMI Janelia

Unified seven separate vendor programs into one interface for microscopy research. Integration time decreased from multi-day projects to minutes for new devices. Researchers now conduct closed-loop experiments with agent-directed parameter optimization.

### QuEra Computing

Developed laser frequency recovery for quantum computers achieving 99.3% success rates, reducing recovery time from 5-10 minutes to under 10 seconds. An iterative agent loop overnight improved performance from 58% to 96% success initially, then to 99.3%.

### Tetsuwan Scientific

Integrated MHS with ResearchOS automation platform for qPCR workflows. Computer vision error detection triggered automated recovery processes, including centrifuge intervention for bubble removal.

## Technical Capabilities

MHS enables:

- Real-time hardware monitoring and control
- Autonomous error recovery (with limitations)
- Hardware-agnostic protocol execution
- Online analysis and visualization
- Multi-device orchestration through unified interfaces
- Closed-loop experimentation with adaptive parameter adjustment

## Current Limitations

The announcement notes several constraints:

- AI models struggle with physical, chemical, and biological constraints, requiring expert guidance
- Limited spatial and physical reasoning capabilities
- Works only with programmable hardware interfaces
- Requires expert oversight for safety-critical applications
- Agent-supervised continuous monitoring has computational costs

## Industry Support

Hardware vendors integrating MHS include Amazon Web Services (via Strands Robots), Automata, Danaher, Doosan Robotics, MBF Bioscience, QIAGEN, Tecan, and Universal Robots. Early adopters include Hugging Face (LeRobot library) and Raspberry Pi.

## Safety and Future Development

Before open-sourcing, Anthropic plans to:

- Develop additional safety evaluations with partners
- Create physical safety roadmaps and guidance
- Extend support to non-programmable hardware
- Strengthen AI safeguards for physical world applications

Interested researchers and organizations can join the research preview waitlist at modelhardwarestandard.com.
