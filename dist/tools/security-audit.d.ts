import { type Plugin, type ToolContext } from "@opencode-ai/plugin";
export declare const securityAuditTool: {
    description: string;
    args: {
        fix: import("zod").ZodOptional<import("zod").ZodBoolean>;
        deep: import("zod").ZodOptional<import("zod").ZodBoolean>;
        format: import("zod").ZodOptional<import("zod").ZodEnum<{
            json: "json";
            terminal: "terminal";
            markdown: "markdown";
        }>>;
    };
    execute(args: {
        fix?: boolean | undefined;
        deep?: boolean | undefined;
        format?: "json" | "terminal" | "markdown" | undefined;
    }, context: ToolContext): Promise<string>;
};
export declare const SecurityAuditPlugin: Plugin;
export default SecurityAuditPlugin;
//# sourceMappingURL=security-audit.d.ts.map