import { type Plugin, type ToolContext } from "@opencode-ai/plugin";
export declare const checkCoverageTool: {
    description: string;
    args: {
        threshold: import("zod").ZodOptional<import("zod").ZodNumber>;
        reporter: import("zod").ZodOptional<import("zod").ZodEnum<{
            text: "text";
            json: "json";
            lcov: "lcov";
        }>>;
    };
    execute(args: {
        threshold?: number | undefined;
        reporter?: "text" | "json" | "lcov" | undefined;
    }, context: ToolContext): Promise<string>;
};
export declare const CheckCoveragePlugin: Plugin;
export default CheckCoveragePlugin;
//# sourceMappingURL=check-coverage.d.ts.map