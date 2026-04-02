import { tool } from "@opencode-ai/plugin"
import { type Plugin, type ToolContext } from "@opencode-ai/plugin"
import { execSync } from "child_process"

export const securityAuditTool = tool({
  description: "Run a security audit scan on the codebase. Checks for vulnerabilities, hardcoded secrets, and security misconfigurations.",
  args: {
    fix: tool.schema.boolean().optional().describe("Auto-fix safe issues"),
    deep: tool.schema.boolean().optional().describe("Run deep analysis with Opus model"),
    format: tool.schema.enum(["terminal", "json", "markdown"]).optional().describe("Output format"),
  },
  async execute(args, context): Promise<string> {
    const { directory } = context as unknown as { directory: string }
    
    let command = "npx ecc-agentshield scan"
    
    if (args.fix) {
      command += " --fix"
    }
    
    if (args.deep) {
      command += " --opus --stream"
    }
    
    const format = args.format ?? "terminal"
    
    try {
      const result = execSync(command, { cwd: directory, encoding: "utf-8" })
      
      return result
    } catch (error: unknown) {
      const err = error as { message?: string; stdout?: string }
      const output = err.stdout || ""
      
      return output || err.message || "Security audit failed"
    }
  }
})

export const SecurityAuditPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      securityAudit: securityAuditTool
    }
  }
}

export default SecurityAuditPlugin
