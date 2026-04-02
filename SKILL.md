# SKILL.md — eoc-opencode

Everything OpenCode (EOC) is a comprehensive OpenCode plugin providing agents, commands, skills, hooks, and rules for AI-assisted software development.

## What's Inside

### Agents (16+)
| Agent | Purpose |
|-------|---------|
| `planner` | Implementation planning and task breakdown |
| `architect` | System design and architecture decisions |
| `tdd-guide` | Test-driven development enforcement |
| `code-reviewer` | Code quality and security review |
| `security-reviewer` | Vulnerability analysis |
| `build-error-resolver` | Build/compilation error fixes |
| `e2e-runner` | End-to-end testing with Playwright |
| `refactor-cleaner` | Dead code removal |
| `doc-updater` | Documentation synchronization |
| `go-reviewer` | Go code review |
| `go-build-resolver` | Go build errors |
| `python-reviewer` | Python code review |
| `database-reviewer` | Database/Supabase review |
| `chief-of-staff` | Communication triage |
| `loop-operator` | Autonomous loop execution |
| `harness-optimizer` | Config tuning |

### Commands (40+)
All slash commands start with `/`:
- `/plan` — Create implementation plan
- `/tdd` — Test-driven development workflow
- `/code-review` — Review code changes
- `/build-fix` — Fix build errors
- `/e2e` — Generate E2E tests
- `/refactor-clean` — Remove dead code
- `/verify` — Run verification loop
- `/test-coverage` — Analyze coverage
- `/go-review` — Go code review
- `/python-review` — Python code review
- `/multi-*` — Multi-model workflows
- `/loop-*` — Agentic loop control
- And more...

### Custom Tools
- `run-tests` — Run test suite with optional coverage
- `check-coverage` — Verify 80%+ test coverage
- `security-audit` — Run security scan

### Hooks
- `session.created` — Session initialization
- `session.idle` — Idle detection
- `session.deleted` — Cleanup
- `tool.execute.before/after` — Tool lifecycle
- `file.edited` — File modification
- `message.updated` — Message updates

## Usage

### One-liner Install (Global)
```bash
bun x eoc-opencode@latest
```

### Project-level Install
```bash
npm install eoc-opencode
# or
bun add eoc-opencode
```

### Configuration
Add to your `opencode.json`:
```json
{
  "plugins": ["eoc-opencode"],
  "instructions": ["./instructions/INSTRUCTIONS.md"]
}
```

## Development

```bash
# Build
npm run build

# Test
npm test

# Install locally for development
bun x eoc-opencode@latest
```

## Requirements
- OpenCode 1.8.0+
- Node.js 18+