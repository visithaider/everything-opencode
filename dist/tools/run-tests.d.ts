import { type Plugin, type ToolContext } from "@opencode-ai/plugin";
export declare const runTestsTool: {
    description: string;
    args: {
        coverage: import("zod").ZodOptional<import("zod").ZodBoolean>;
        file: import("zod").ZodOptional<import("zod").ZodString>;
        watch: import("zod").ZodOptional<import("zod").ZodBoolean>;
    };
    execute(args: {
        coverage?: boolean | undefined;
        file?: string | undefined;
        watch?: boolean | undefined;
    }, context: ToolContext): Promise<string>;
};
export declare const RunTestsPlugin: Plugin;
export default RunTestsPlugin;
//# sourceMappingURL=run-tests.d.ts.map