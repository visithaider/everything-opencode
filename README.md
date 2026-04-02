# Everything OpenCode - OpenCode Plugin

> **Note:** This is a forked version of [everything-claude-code](https://github.com/affaan-m/everything-claude-code) specifically adapted for OpenCode.

![OpenCode](https://img.shields.io/badge/OpenCode-Plugin-blue)
![Version](https://img.shields.io/badge/Version-1.8.0-green)
![License](https://img.shields.io/badge/License-MIT-blue)

Everything OpenCode (EOC) provides a comprehensive plugin for OpenCode with agents, commands, skills, hooks, and rules for AI-assisted software development.

## Features

| Feature | Count | Description |
|---------|-------|-------------|
| **Agents** | 16 | Specialized subagents for delegation |
| **Commands** | 40+ | Slash commands for quick execution |
| **Hooks** | 11+ | Event-based automations |
| **Custom Tools** | 3 | Native tools for testing and security |
| **Instructions** | 1 | Consolidated rules and guidelines |

## Quick Start

### Installation

#### Option 1: One-liner (recommended)
```bash
# Global install (to ~/.config/opencode/)
bun x eoc-opencode@latest

# Local install (to project .opencode/ directory)
bun x eoc-opencode@latest --local

# npm/npx equivalent
npx eoc-opencode@latest
npx eoc-opencode@latest --local
```

This automatically installs to the correct location and activates.

### CLI Options
```bash
bun x eoc-opencode@latest           # Global install
bun x eoc-opencode@latest --local   # Project-level install
bun x eoc-opencode@latest --upgrade # Upgrade existing
bun x eoc-opencode@latest --uninstall    # Uninstall global
bun x eoc-opencode@latest --uninstall --local # Uninstall project
```

#### Option 2: Run directly in this repository
```bash
cd everything-opencode
opencode
```

#### Option 3: Local plugin
Copy `.opencode/` directory to your project:
```bash
cp -r .opencode/ /path/to/your/project/.opencode/
```

## Available Commands

| Command | Description | Agent |
|---------|-------------|-------|
| `/plan` | Create implementation plan | planner |
| `/tdd` | Test-driven development workflow | tdd-guide |
| `/code-review` | Review code changes | code-reviewer |
| `/build-fix` | Fix build errors | build-error-resolver |
| `/e2e` | Generate E2E tests | e2e-runner |
| `/refactor-clean` | Remove dead code | refactor-cleaner |
| `/security-scan` | Security audit | security-reviewer |
| `/verify` | Run verification loop | build |
| `/test-coverage` | Analyze coverage | tdd-guide |
| `/go-review` | Go code review | go-reviewer |
| `/python-review` | Python code review | python-reviewer |
| `/multi-plan` | Multi-model planning | planner |
| `/multi-execute` | Multi-model execution | architect |
| `/pm2` | PM2 service management | build |
| `/sessions` | Session history | general |
| `/skill-create` | Generate skills from git | doc-updater |
| `/harness-audit` | Audit harness reliability | harness-optimizer |
| `/loop-start` | Start agentic loop | loop-operator |

## Available Agents

### Planning & Architecture
- **planner** - Implementation planning
- **architect** - System design

### Development
- **tdd-guide** - Test-driven development
- **build-error-resolver** - Build error fixes

### Review & Quality
- **code-reviewer** - Code quality review
- **security-reviewer** - Security analysis
- **e2e-runner** - E2E testing
- **refactor-cleaner** - Dead code removal
- **doc-updater** - Documentation updates

### Language-Specific
- **go-reviewer** - Go code review
- **go-build-resolver** - Go build errors
- **python-reviewer** - Python code review
- **database-reviewer** - Database/Supabase review

### Operations
- **chief-of-staff** - Communication triage
- **loop-operator** - Autonomous loops
- **harness-optimizer** - Config optimization

## Custom Tools

### run-tests
Run the test suite with optional coverage:
```typescript
await runTests({ coverage: true, file: "src/auth.test.ts" })
```

### check-coverage
Verify 80%+ test coverage:
```typescript
await checkCoverage({ threshold: 80, reporter: "text" })
```

### security-audit
Run security audit scan:
```typescript
await securityAudit({ fix: true, deep: false })
```

## Hook Events

The plugin supports the following OpenCode events:

| Event | Description |
|-------|-------------|
| `session.created` | Session initialization |
| `session.idle` | Session idle detection |
| `session.deleted` | Session cleanup |
| `tool.execute.before` | Pre-tool execution |
| `tool.execute.after` | Post-tool execution |
| `file.edited` | File modification |
| `message.updated` | Message updates |

## Configuration

### Basic Configuration
```json
{
  "plugins": ["eoc-opencode"],
  "instructions": [".opencode/instructions/INSTRUCTIONS.md"]
}
```

### Full Configuration
```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [".opencode/instructions/INSTRUCTIONS.md"],
  "command": {
    "plan": {
      "template": "Restate requirements...",
      "description": "Create implementation plan",
      "agent": "planner"
    }
  },
  "agent": {
    "planner": {
      "description": "Expert planning specialist",
      "mode": "subagent",
      "prompt": "{file:./prompts/planner.txt}"
    }
  }
}
```

## File Structure

```
.opencode/
|-- index.ts              # Main plugin entry point
|-- opencode.json         # Configuration
|-- package.json          # Dependencies
|-- tsconfig.json         # TypeScript config
|-- plugins/              # Plugin hooks
|-- prompts/              # Agent prompts
|-- agents/               # Agent definitions
|-- commands/             # Command files
|-- instructions/         # Rules and guidelines
|-- tools/               # Custom tools
```

## Development

### Building the Plugin
```bash
# Install dependencies
cd .opencode
npm install

# Build (if needed)
npx tsc
```

### Testing
```bash
# Run tests
npm testc

# Run coverage
npm run coverage
```

## Documentation

- [MIGRATION.md](MIGRATION.md) - Guide for migrating from Claude Code
- [Full Documentation](../README.md) - Complete ECC documentation

## Requirements

- OpenCode 1.8.0 or later
- Node.js 18+

## License

MIT License - see [../LICENSE](../LICENSE)

## Credits

Created by [Affaan Mustafa](https://x.com/affaanmustafa)
