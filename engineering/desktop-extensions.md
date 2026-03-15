---
title: "Claude Desktop Extensions: One-click MCP Server Installation"
source_url: "https://www.anthropic.com/engineering/desktop-extensions"
source_type: "web-extracted"
fetched_at: "2026-03-15T00:00:00Z"
category: "engineering"
---

# Claude Desktop Extensions: One-click MCP Server Installation

## Overview

Anthropic has introduced Desktop Extensions—a new packaging format that simplifies installing Model Context Protocol (MCP) servers for Claude Desktop users. The system addresses longstanding friction points in MCP deployment by bundling servers and dependencies into single `.mcpb` files.

## The Problem Being Solved

Previous MCP installation required users to:
- Install external runtimes like Node.js or Python
- Manually edit JSON configuration files
- Resolve dependency conflicts independently
- Search GitHub to discover available servers
- Reinstall manually when updates became available

These barriers made powerful local MCP servers inaccessible to non-technical users despite their capability to interact with local applications and private data.

## Desktop Extensions Solution

The new `.mcpb` format (updated from `.dxt` as of September 2025) simplifies installation to three steps:

1. Download a `.mcpb` file
2. Double-click to open with Claude Desktop
3. Click "Install"

## Architecture

A Desktop Extension is a ZIP archive containing:
- `manifest.json` (required) - metadata and configuration
- Server implementation files
- Bundled dependencies
- Optional icon and assets

Claude Desktop provides built-in Node.js runtime, automatic updates, and secure keychain storage for sensitive credentials.

## Manifest Structure

The minimal manifest requires:
- MCPB version specification
- Extension name, version, and author information
- Server configuration with type (Node.js, Python, or binary)
- Entry point specification

Developers can declare user configuration fields, feature capabilities, and platform-specific overrides using template literals like `${__dirname}` and `${user_config.key}`.

## Development Process

Developers can:
1. Run `npx @anthropic-ai/mcpb init` to generate a manifest interactively
2. Define user configuration requirements with type validation
3. Execute `npx @anthropic-ai/mcpb pack` to create the `.mcpb` archive
4. Test locally by dragging the file into Claude Desktop Settings

## Enterprise Features

Organizations can:
- Manage extensions via Group Policy (Windows) or MDM (macOS)
- Pre-install approved extensions
- Blocklist specific extensions or publishers
- Disable the extension directory entirely
- Deploy private extension directories

## Open Ecosystem Commitment

Anthropic is open-sourcing the complete MCPB specification, packaging tools, reference implementations, and TypeScript schemas to enable adoption across multiple AI applications.

## Getting Started Resources

- Developer documentation available on GitHub
- Extension examples in the MCPB repository
- Claude Code integration support for building extensions
- Curated extension directory built into Claude Desktop for discovery and one-click installation
- Enterprise documentation for organizational deployment

Users can submit extensions for review through an official form; the team evaluates submissions for quality and security before featuring them in the directory.
