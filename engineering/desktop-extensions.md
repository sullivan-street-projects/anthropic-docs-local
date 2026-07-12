---
title: "Claude Desktop Extensions: One-click MCP Server Installation"
source_url: "https://www.anthropic.com/engineering/desktop-extensions"
source_type: "web-extracted"
fetched_at: "2026-07-12T00:00:00Z"
category: "engineering"
---

# Claude Desktop Extensions: One-click MCP Server Installation

## Overview

Anthropic has introduced Desktop Extensions, a new packaging format that simplifies installing Model Context Protocol (MCP) servers for Claude Desktop users. The system addresses longstanding friction points in MCP server installation.

## The Problem

Previously, users needed to:

- Install developer tools (Node.js, Python, etc.)
- Manually edit JSON configuration files
- Resolve dependency conflicts
- Search GitHub to discover servers
- Manually reinstall for updates

## The Solution: Desktop Extensions (.mcpb files)

Desktop Extensions bundle an entire MCP server with all dependencies into a single installable package. Users now simply:

1. Download a `.mcpb` file
2. Double-click to open with Claude Desktop
3. Click "Install"

**Note:** The file extension changed from `.dxt` to `.mcpb` (MCP Bundle) as of September 11, 2025. Legacy `.dxt` files remain functional.

## Architecture

A Desktop Extension is a ZIP archive containing:

```
extension.mcpb (ZIP archive)
├── manifest.json         # Extension metadata (required)
├── server/               # MCP server implementation
├── dependencies/         # All required packages
└── icon.png             # Optional: Extension icon
```

### Node.js Example Structure

```
extension.mcpb
├── manifest.json
├── server/
│   └── index.js
├── node_modules/         # Bundled dependencies
├── package.json
└── icon.png
```

### Python Example Structure

```
extension.mcpb
├── manifest.json
├── server/
│   ├── main.py
│   └── utils.py
├── lib/                  # Bundled Python packages
├── requirements.txt
└── icon.png
```

## Manifest.json Specification

### Minimal Required Structure

```json
{
  "mcpb_version": "0.1",
  "name": "my-extension",
  "version": "1.0.0",
  "description": "A simple MCP extension",
  "author": {
    "name": "Extension Author"
  },
  "server": {
    "type": "node",
    "entry_point": "server/index.js",
    "mcp_config": {
      "command": "node",
      "args": ["${__dirname}/server/index.js"]
    }
  }
}
```

### Extended Manifest Example

```json
{
  "mcpb_version": "0.1",
  "name": "My MCP Extension",
  "display_name": "My Awesome MCP Extension",
  "version": "1.0.0",
  "description": "Brief description",
  "long_description": "Detailed description with markdown support",
  "author": {
    "name": "Your Name",
    "email": "email@example.com",
    "url": "https://website.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/extension"
  },
  "homepage": "https://example.com/extension",
  "documentation": "https://docs.example.com",
  "support": "https://github.com/username/extension/issues",
  "icon": "icon.png",
  "screenshots": ["assets/screenshots/screenshot1.png"],
  "server": {
    "type": "node",
    "entry_point": "server/index.js",
    "mcp_config": {
      "command": "node",
      "args": ["${__dirname}/server/index.js"],
      "env": {
        "ALLOWED_DIRECTORIES": "${user_config.allowed_directories}"
      }
    }
  },
  "tools": [
    {
      "name": "search_files",
      "description": "Search for files in directory"
    }
  ],
  "prompts": [
    {
      "name": "poetry",
      "description": "Have the LLM write poetry",
      "arguments": ["topic"],
      "text": "Write a poem about: ${arguments.topic}"
    }
  ],
  "tools_generated": true,
  "keywords": ["api", "automation"],
  "license": "MIT",
  "compatibility": {
    "claude_desktop": ">=1.0.0",
    "platforms": ["darwin", "win32", "linux"],
    "runtimes": {
      "node": ">=16.0.0"
    }
  },
  "user_config": {
    "allowed_directories": {
      "type": "directory",
      "title": "Allowed Directories",
      "description": "Directories the server can access",
      "multiple": true,
      "required": true,
      "default": ["${HOME}/Desktop"]
    },
    "api_key": {
      "type": "string",
      "title": "API Key",
      "description": "Your API key",
      "sensitive": true,
      "required": false
    },
    "max_file_size": {
      "type": "number",
      "title": "Maximum File Size (MB)",
      "default": 10,
      "min": 1,
      "max": 100
    }
  }
}
```

## User Configuration

Extensions can request user input for configuration:

```json
"user_config": {
  "api_key": {
    "type": "string",
    "title": "API Key",
    "description": "Your API key for authentication",
    "sensitive": true,
    "required": true
  }
}
```

Claude Desktop:

- Displays user-friendly configuration UI
- Validates inputs before enabling extensions
- Securely stores sensitive values in OS keychain
- Passes configuration as arguments or environment variables

## Template Literals

Extensions support dynamic values at runtime:

- `${__dirname}`: Extension's installation directory
- `${user_config.key}`: User-provided configuration
- `${HOME}`, `${TEMP}`: System environment variables

Example:

```json
"mcp_config": {
  "command": "node",
  "args": ["${__dirname}/server/index.js"],
  "env": {
    "API_KEY": "${user_config.api_key}"
  }
}
```

## Cross-Platform Support

Extensions can adapt to different operating systems:

```json
"server": {
  "type": "node",
  "entry_point": "server/index.js",
  "mcp_config": {
    "command": "node",
    "args": ["${__dirname}/server/index.js"],
    "platforms": {
      "win32": {
        "command": "node.exe",
        "env": {
          "TEMP_DIR": "${TEMP}"
        }
      },
      "darwin": {
        "env": {
          "TEMP_DIR": "${TMPDIR}"
        }
      }
    }
  }
}
```

## Building Your First Extension

### Step 1: Create Manifest

```bash
npx @anthropic-ai/mcpb init
```

Or use quick mode:

```bash
npx @anthropic-ai/mcpb init --yes
```

### Step 2: Declare Configuration

Add user configuration requirements to manifest.json if needed.

### Step 3: Package Extension

```bash
npx @anthropic-ai/mcpb pack
```

This command:

- Validates manifest
- Generates `.mcpb` archive

### Step 4: Test Locally

Drag `.mcpb` file into Claude Desktop Settings to test installation.

## Extension Directory

Anthropic maintains a curated directory of extensions built into Claude Desktop. Users can:

- Browse and search extensions
- Install with one click
- Discover useful MCP servers

### Submission Process

1. Follow submission form guidelines
2. Test across Windows and macOS
3. Submit via official form
4. Anthropic team reviews for quality and security

## Security and Enterprise Features

### User Protections

- Sensitive data stored in OS keychain
- Automatic extension updates
- Ability to audit installed extensions

### Enterprise Support

- Group Policy (Windows) and MDM (macOS) support
- Pre-install approved extensions
- Blocklist specific extensions or publishers
- Disable extension directory
- Deploy private extension directories

Enterprise documentation available at: https://support.anthropic.com/en/articles/10949351-getting-started-with-model-context-protocol-mcp-on-claude-for-desktop

## Key Features

- **No external dependencies**: Node.js ships with Claude Desktop
- **Automatic updates**: Extensions update automatically
- **Secure secrets**: API keys stored in OS keychain
- **Cross-platform**: Support for macOS, Windows, Linux
- **Feature declaration**: Users see capabilities upfront
- **Open ecosystem**: Specification is open-source and versioned as 0.1

## Open Source Components

Anthropic is open-sourcing:

- Complete MCPB specification
- Packaging and validation tools
- Reference implementation code
- TypeScript types and schemas

This enables:

- MCP developers to package once, run anywhere
- App developers to add extension support without building from scratch
- Users to get consistent experience across MCP-enabled applications

## Building with Claude Code

When using Claude Code to build extensions, provide this context:

```
I want to build this as a Desktop Extension (MCPB).

1. Read specifications:
   - MCPB architecture overview
   - Complete manifest structure
   - Reference implementations

2. Create proper extension structure:
   - Valid manifest.json
   - MCP server using @modelcontextprotocol/sdk
   - Proper error handling

3. Follow best practices:
   - MCP protocol via stdio transport
   - Clear tool schemas and validation
   - Proper logging and debugging

4. Test considerations:
   - Validate tool responses
   - Verify manifest loads correctly
```

## Resources

- **Developer docs**: https://platform.claude.com/docs
- **MCPB Repository**: https://github.com/anthropics/dxt
- **Specification**: https://github.com/anthropics/mcpb/blob/main/MANIFEST.md
- **Examples**: https://github.com/anthropics/mcpb/tree/main/examples
- **Submit extension**: https://forms.gle/tyiAZvch1kDADKoP9
