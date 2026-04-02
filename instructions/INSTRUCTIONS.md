# Everything OpenCode - OpenCode Plugin

This file contains the rules and guidelines that apply to the EOC (Everything Open Code) plugin for OpenCode.

## Core Principles

### 1. Agent-First
Delegate specialized tasks to subagents:
- Use `planner` for implementation planning
- Use `code-reviewer` for quality reviews
- Use `security-reviewer` for vulnerability scanning
- Use `tdd-guide` for test-driven development

### 2. Test-Driven Development (TDD)
**Minimum coverage: 80%**

Test types required:
1. **Unit tests** — Individual functions, utilities, components
2. **Integration tests** — API endpoints, database operations
3. **E2E tests** — Critical user flows (Playwright)

TDD workflow:
1. Write failing test (RED)
2. Write minimal implementation (GREEN)
3. Refactor (IMPROVE)
4. Verify 80%+ coverage

### 3. Security-First
**Never compromise on security:**
- No hardcoded secrets (API keys, passwords, tokens)
- All user inputs validated
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized HTML)
- CSRF protection enabled
- Authentication/authorization verified
- Rate limiting on all endpoints

### 4. Immutability
Always create new objects, never mutate existing ones.

### 5. Plan Before Execute
For complex features, plan before implementation:
1. Use `/plan` command
2. Wait for user confirmation
3. Execute in phases

## Code Quality Checklist

- [ ] Functions small (< 50 lines)
- [ ] Files focused (< 800 lines)
- [ ] No deep nesting (> 4 levels)
- [ ] Proper error handling
- [ ] No hardcoded values
- [ ] Readable, well-named identifiers
- [ ] Tests cover edge cases

## Error Handling

- Handle errors at every level
- Provide user-friendly messages in UI code
- Log detailed context server-side
- Never silently swallow errors

## Input Validation

- Validate all user input at system boundaries
- Use schema-based validation
- Fail fast with clear messages
- Never trust external data

## Git Workflow

### Commit Format
`<type>: <description>`

Types: feat, fix, refactor, docs, test, chore, perf, ci

### PR Process
- Analyze full commit history
- Draft comprehensive summary
- Include test plan
- Push with `-u` flag

## Performance Guidelines

- Context management: Avoid last 20% of context window for large refactoring
- Use faster models (Haiku) for read-only tasks
- Use capable models (Sonnet/Opus) for complex tasks
- Route tasks to appropriate models

## Communication

When using commands:
- Wait for user confirmation before making changes
- Ask clarifying questions when needed
- Provide status updates for long-running tasks

## Using Agents and Commands

### Available Commands
- `/plan` - Create implementation plan
- `/tdd` - Test-driven development workflow
- `/code-review` - Review code changes
- `/build-fix` - Fix build errors
- `/e2e` - Generate E2E tests
- `/refactor-clean` - Remove dead code
- `/security-scan` - Run security audit
- `/verify` - Run verification loop

### Available Agents
- `planner` - Planning specialist
- `architect` - System design
- `tdd-guide` - TDD enforcement
- `code-reviewer` - Code quality
- `security-reviewer` - Security analysis
- `build-error-resolver` - Build fixes
- `e2e-runner` - E2E testing
- `refactor-cleaner` - Dead code removal
- `doc-updater` - Documentation
- `go-reviewer` - Go code review
- `python-reviewer` - Python code review
- `database-reviewer` - Database/Supabase review
- `chief-of-staff` - Communication triage
- `loop-operator` - Autonomous loops
- `harness-optimizer` - Config optimization

## Important Notes

- Always verify 80%+ test coverage
- Run lint and typecheck before commits
- Security checks are mandatory
- Document decisions in code comments or ADRs
