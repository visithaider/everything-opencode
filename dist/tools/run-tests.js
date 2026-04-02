import { tool } from "@opencode-ai/plugin";
import { execSync } from "child_process";
export const runTestsTool = tool({
    description: "Run the test suite with optional coverage analysis. Runs all tests and reports results.",
    args: {
        coverage: tool.schema.boolean().optional().describe("Include coverage analysis"),
        file: tool.schema.string().optional().describe("Specific test file to run"),
        watch: tool.schema.boolean().optional().describe("Run in watch mode"),
    },
    async execute(args, context) {
        const { directory } = context;
        let command = "npm test";
        if (args.file) {
            command = `npm test -- ${args.file}`;
        }
        if (args.coverage) {
            command = "npm run test:coverage";
        }
        if (args.watch) {
            command = "npm test -- --watch";
        }
        try {
            const result = execSync(command, { cwd: directory, encoding: "utf-8" });
            return result;
        }
        catch (error) {
            const err = error;
            return err.stdout || err.stderr || err.message || "Tests failed";
        }
    }
});
export const RunTestsPlugin = async (ctx) => {
    return {
        tool: {
            runTests: runTestsTool
        }
    };
};
export default RunTestsPlugin;
