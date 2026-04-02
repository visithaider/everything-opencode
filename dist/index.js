import { tool } from "@opencode-ai/plugin";
import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";
const PLUGIN_NAME = "eoc-universal";
export const EOCPlugin = async ({ project, client, directory }) => {
    console.log(`[eoc-universal] Plugin initialized for ${directory}`);
    return {
        "session.created": async (input) => {
            await client.app.log({
                body: {
                    service: "eoc-universal",
                    level: "info",
                    message: "EOC Plugin session started",
                    extra: {
                        project: directory,
                        directory
                    }
                }
            });
            const welcomeMessage = `
## Welcome to Everything OpenCode!

This project uses the EOC (Everything Open Code) plugin.

**Available Commands:**
- /plan - Create implementation plan
- /tdd - Test-driven development  
- /code-review - Review code changes
- /build-fix - Fix build errors
- /e2e - Generate E2E tests
- /refactor-clean - Remove dead code

**Available Agents:**
- @planner - Planning specialist
- @architect - Architecture specialist
- @tdd-guide - TDD specialist
- @code-reviewer - Code review specialist
- @security-reviewer - Security specialist

**Skills:** Use the skill tool to discover available skills.

Type /help for more options.
`;
            // Use app log to display message since client.message may not exist
            await client.app.log({
                body: {
                    service: PLUGIN_NAME,
                    level: "info",
                    message: welcomeMessage
                }
            });
        },
        "session.idle": async (input) => {
            await client.app.log({
                body: {
                    service: PLUGIN_NAME,
                    level: "debug",
                    message: "Session idle"
                }
            });
        },
        "session.compacted": async (input) => {
            await client.app.log({
                body: {
                    service: PLUGIN_NAME,
                    level: "info",
                    message: "Session compacted"
                }
            });
        },
        "session.deleted": async (input) => {
            await client.app.log({
                body: {
                    service: PLUGIN_NAME,
                    level: "info",
                    message: "Session ended"
                }
            });
        },
        "tool.execute.before": async (input, output) => {
            const command = output.args.command || "";
            const filePath = output.args.filePath || "";
            if (input.tool === "bash") {
                if (command.includes("rm -rf /") || command.includes("rm -f /") || command.includes(":(){:|:&}:")) {
                    throw new Error("Dangerous command detected and blocked");
                }
                if (command.includes("git push")) {
                    await client.app.log({
                        body: {
                            service: PLUGIN_NAME,
                            level: "info",
                            message: `[${PLUGIN_NAME}] Reminder: Review your changes before pushing to git`
                        }
                    });
                }
                if (command.includes("npm install") || command.includes("pnpm install") || command.includes("yarn install")) {
                    await client.app.log({
                        body: {
                            service: PLUGIN_NAME,
                            level: "info",
                            message: "Dependency installation detected"
                        }
                    });
                }
            }
            if ((input.tool === "write" || input.tool === "edit") && filePath) {
                if (filePath.includes(".env") && !filePath.includes(".env.example")) {
                    await client.app.log({
                        body: {
                            service: PLUGIN_NAME,
                            level: "warn",
                            message: `Potential .env file modification: ${filePath}`
                        }
                    });
                }
            }
        },
        "tool.execute.after": async (input, output) => {
            if (input.tool === "bash") {
                // Check for failure indicators in output - the actual exit code may not be available
                const outputStr = output.output || "";
                if (outputStr.includes("error") || outputStr.includes("failed") || outputStr.includes("Error")) {
                    await client.app.log({
                        body: {
                            service: PLUGIN_NAME,
                            level: "warn",
                            message: `Bash command may have failed: ${outputStr.substring(0, 100)}`,
                            extra: { tool: input.tool, command: input.args?.command?.substring(0, 50) }
                        }
                    });
                }
            }
        },
        "file.edited": async (input) => {
            const filePath = input.filePath || "";
            if (filePath.endsWith(".ts") || filePath.endsWith(".tsx") ||
                filePath.endsWith(".js") || filePath.endsWith(".jsx")) {
                await client.app.log({
                    body: {
                        service: PLUGIN_NAME,
                        level: "debug",
                        message: "Source file edited",
                        extra: { filePath }
                    }
                });
            }
        },
        "message.updated": async (input) => {
            await client.app.log({
                body: {
                    service: PLUGIN_NAME,
                    level: "debug",
                    message: "Message updated"
                }
            });
        },
        "tui.toast.show": async (input) => {
            await client.app.log({
                body: {
                    service: PLUGIN_NAME,
                    level: "info",
                    message: `Toast: ${input.args?.message || ""}`
                }
            });
        },
        tool: {
            "run-tests": tool({
                description: "Run the project's test suite",
                args: {
                    coverage: tool.schema.boolean().optional(),
                    verbose: tool.schema.boolean().optional(),
                },
                async execute(args, context) {
                    const { directory } = context;
                    let cmd = "npm test";
                    if (args.verbose) {
                        cmd += " -- --verbose";
                    }
                    if (args.coverage) {
                        cmd += " -- --coverage";
                    }
                    try {
                        const result = execSync(cmd, { cwd: directory, encoding: "utf-8" });
                        return result;
                    }
                    catch (error) {
                        const err = error;
                        return err.stderr || err.message || "Tests failed";
                    }
                },
            }),
            "check-coverage": tool({
                description: "Check test coverage meets the 80% threshold",
                args: {
                    threshold: tool.schema.number().optional().default(80),
                },
                async execute(args, context) {
                    const { directory } = context;
                    try {
                        const hasCoverage = fs.existsSync(path.join(directory, "coverage")) ||
                            fs.existsSync(path.join(directory, ".nyc_output"));
                        if (!hasCoverage) {
                            return "No coverage report found. Run tests with --coverage first.";
                        }
                        const result = execSync("npm test -- --coverage 2>&1", { cwd: directory, encoding: "utf-8" });
                        const output = result;
                        const coverageMatch = output.match(/All files[^\d]*(\d+\.?\d*)%/);
                        if (coverageMatch) {
                            const coverage = parseFloat(coverageMatch[1]);
                            const meetsThreshold = coverage >= args.threshold;
                            return meetsThreshold
                                ? `Coverage ${coverage}% meets threshold ${args.threshold}%`
                                : `Coverage ${coverage}% is below threshold ${args.threshold}%`;
                        }
                        return "Could not parse coverage output";
                    }
                    catch (error) {
                        const err = error;
                        return err.message || "Coverage check failed";
                    }
                },
            }),
            "security-audit": tool({
                description: "Run security audit on dependencies",
                args: {
                    fix: tool.schema.boolean().optional(),
                },
                async execute(args, context) {
                    const { directory } = context;
                    let cmd = "npm audit --json";
                    if (args.fix) {
                        cmd += " --fix";
                    }
                    try {
                        const result = execSync(cmd, { cwd: directory, encoding: "utf-8" });
                        const output = result;
                        if (output.includes('"vulnerabilities":0') || output.includes('"found":0')) {
                            return "No security vulnerabilities found";
                        }
                        return output.substring(0, 1000) || "Security audit found vulnerabilities";
                    }
                    catch (error) {
                        const err = error;
                        const output = err.stdout || "";
                        if (output.includes('"vulnerabilities":0') || output.includes('"found":0')) {
                            return "No security vulnerabilities found";
                        }
                        return output.substring(0, 1000) || err.message || "Security audit failed";
                    }
                },
            }),
            "lint-check": tool({
                description: "Run linting on the project",
                args: {
                    fix: tool.schema.boolean().optional(),
                },
                async execute(args, context) {
                    const { directory } = context;
                    const hasEslint = fs.existsSync(path.join(directory, ".eslintrc")) ||
                        fs.existsSync(path.join(directory, "eslint.config.js"));
                    if (!hasEslint) {
                        return "No ESLint configuration found, skipping lint check";
                    }
                    let cmd = "npx eslint .";
                    if (args.fix) {
                        cmd += " --fix";
                    }
                    try {
                        const result = execSync(cmd, { cwd: directory, encoding: "utf-8" });
                        return result || "Lint check passed";
                    }
                    catch (error) {
                        const err = error;
                        return err.stdout || err.message || "Lint check failed";
                    }
                },
            }),
            "typecheck": tool({
                description: "Run TypeScript type checking",
                args: {},
                async execute(args, context) {
                    const { directory } = context;
                    const hasTypeScript = fs.existsSync(path.join(directory, "tsconfig.json"));
                    if (!hasTypeScript) {
                        return "No TypeScript configuration found, skipping type check";
                    }
                    try {
                        const result = execSync("npx tsc --noEmit 2>&1", { cwd: directory, encoding: "utf-8" });
                        return result || "Type check passed";
                    }
                    catch (error) {
                        const err = error;
                        return err.stdout || err.message || "Type check failed";
                    }
                },
            }),
            "skill-create": tool({
                description: "Generate skills from git history",
                args: {
                    instincts: tool.schema.boolean().optional(),
                },
                async execute(args, context) {
                    const { directory } = context;
                    try {
                        const result = execSync('git log --all --pretty=format:"%s" -n 100', { cwd: directory, encoding: "utf-8" });
                        const commits = result.split("\n").filter(Boolean);
                        if (commits.length === 0) {
                            return "No git history found to generate skills from";
                        }
                        const uniquePatterns = [...new Set(commits)];
                        return JSON.stringify({
                            success: true,
                            patterns: uniquePatterns.slice(0, 20),
                            commitsAnalyzed: commits.length,
                        });
                    }
                    catch (error) {
                        const err = error;
                        return err.message || "Failed to analyze git history";
                    }
                },
            }),
        },
    };
};
export default EOCPlugin;
