# Migration Guide: Claude Code to OpenCode

This guide helps you migrate from Claude Code to OpenCode with the Everything Claude Code (ECC) plugin.

## Overview

Everything Claude Code provides first-class support for OpenCode, including:
- 16 specialized agents
- 40+ commands
- Hook-based automation
- Custom tools
- Consolidated rules

## Key Differences

| Feature | Claude Code | OpenCode |
|---------|------------|----------|
| **Agents** | YAML frontmatter in `.claude/agents/` | JSON/markdown in `.opencode/agents/` |
| **Commands** | `.claude/commands/*.md` | `.opencode/commands/*.md` |
| **Rules** | `~/.claude/rules/` | `AGENTS.md` or `instructions` config |
| **Hooks** | `~/.claude/settings.json` | Plugin-based event system |
| **Skills** | `~/.claude/skills/` | `skills` in AGENTS.md |

## Migration Steps

### Step 1: Install OpenCode
```bash
npm install -g opencode
```

### Step 2: Install ECC Plugin

#### Option A: Direct Usage
```bash
cd everything-claude-code
opencode
```

#### Option B: NPM Package
```bash
npm install ecc-universal
```

Add to your `opencode.json`:
```json
{
  "plugin": ["ecc-universal"]
}
```

#### Option C: Copy Files
```bash
cp -r .opencode/ /path/to/project/.opencode/
```

### Step 3: Update Configuration

Create or update your `opencode.json`:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [".opencode/instructions/INSTRUCTIONS.md"]
}
```

### Step 4: Migrate Custom Settings

#### Convert Commands
Claude Code command:
```markdown
# .claude/commands/plan.md
---
description: Create implementation plan
---
# Plan Command content...
```

OpenCode command:
```json
// opencode.json
{
  "command": {
    "plan": {
      "template": "Restate requirements...",
      "description": "Create implementation plan",
      "agent": "planner"
    }
  }
}
```

#### Convert Agents
Claude Code agent:
```markdown
# .claude/agents/planner.md
---
name: planner
description: Expert planning specialist
tools: ["Read", "Grep", "Glob"]
model: opus
---
# Agent instructions...
```

OpenCode agent:
```json
// opencode.json
{
  "agent": {
    "planner": {
      "description": "Expert planning specialist",
      "mode": "subagent",
      "prompt": "{file:./prompts/planner.txt}",
      "model": "anthropic/claude-sonnet-4-20250514"
    }
  }
}
```

#### Convert Rules
Claude Code rules in `~/.claude/rules/` become OpenCode instructions:

```json
{
  "instructions": [
    "./instructions/INSTRUCTIONS.md",
    "./rules/common/coding-style.md"
  ]
}
```

### Step 5: Migrate Hooks

Claude Code hooks in `settings.json`:
```json
{
  "hooks": [{
    "matcher": "tool == \"Edit\"",
    "hooks": [{
      "type": "command",
      "command": "echo 'File edited'"
    }]
  }]
}
```

OpenCode plugin hooks:
```typescript
// .opencode/plugins/my-plugin.ts
export const MyPlugin = async ({ client }) => {
  return {
    "file.edited": async (input) => {
      await client.app.log({ body: { message: "File edited" } })
    }
  }
}
```

## Common Migrations

### Package Manager Detection
```bash
# Claude Code
./install.sh typescript

# OpenCode - Use /setup-pm command
/setup-pm
```

### Session Management
```bash
# Claude Code
/plugin sessions

# OpenCode - Use /sessions command
/sessions
```

### Continuous Learning
```bash
# Claude Code
/learn

# OpenCode
/learn
```

## Configuration Mapping

### Claude Code → OpenCode

| Claude Code | OpenCode |
|------------|----------|
| `CLAUDE.md` | `AGENTS.md` |
| `.claude/agents/` | `.opencode/agents/` |
| `.claude/commands/` | `.opencode/commands/` |
| `.claude/rules/` | `instructions` in config |
| `.claude/skills/` | Mention in AGENTS.md |
| `settings.json` hooks | Plugin event handlers |

## Feature Comparison

### Commands
| Claude Code | OpenCode |
|------------|----------|
| `/plan` | `/plan` |
| `/tdd` | `/tdd` |
| `/code-review` | `/code-review` |
| `/build-fix` | `/build-fix` |
| `/e2e` | `/e2e` |
| `/refactor-clean` | `/refactor-clean` |
| `/verify` | `/verify` |
| `/security-scan` | `/security-scan` |

### Agents
All 16 Claude Code agents are available in OpenCode:
- planner
- architect
- tdd-guide
- code-reviewer
- security-reviewer
- build-error-resolver
- e2e-runner
- refactor-cleaner
- doc-updater
- go-reviewer
- go-build-resolver
- python-reviewer
- database-reviewer
- chief-of-staff
- loop-operator
- harness-optimizer

## Troubleshooting

### Plugin Not Loading
1. Check `.opencode/` directory exists
2. Verify `opencode.json` is valid JSON
3. Run with debug: `opencode --debug`

### Commands Not Working
1. Verify command is in `opencode.json`
2. Check agent exists and is enabled
3. Try restarting OpenCode

### Hooks Not Firing
1. Verify plugin exports correctly
2. Check event names match OpenCode spec
3. Look at logs: `opencode logs`

## Advanced: Creating Custom Plugins

### Basic Plugin Structure
```typescript
// .opencode/plugins/my-plugin.ts
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ project, client, $, directory }) => {
  return {
    "session.created": async () => {
      console.log("Session started!")
    },
    "tool.execute.before": async (input, output) => {
      // Pre-tool logic
    }
  }
}
```

### Custom Tools
```typescript
import { tool } from "@opencode-ai/plugin"

export const myTool = tool({
  description: "My custom tool",
  args: {
    param: tool.schema.string()
  },
  async execute(args, context) {
    return { result: "success" }
  }
})
```

## Support

- [OpenCode Docs](https://opencode.ai/docs/)
- [ECC GitHub](https://github.com/affaan-m/everything-claude-code)
- [OpenCode Discord](https://opencode.ai/discord)
