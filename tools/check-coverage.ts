import { tool } from "@opencode-ai/plugin"
import { type Plugin, type ToolContext } from "@opencode-ai/plugin"
import { execSync } from "child_process"
import * as path from "path"
import * as fs from "fs"

export const checkCoverageTool = tool({
  description: "Check test coverage and verify it meets the 80% threshold requirement",
  args: {
    threshold: tool.schema.number().optional().describe("Minimum coverage threshold (default: 80)"),
    reporter: tool.schema.enum(["text", "json", "lcov"]).optional().describe("Coverage reporter format"),
  },
  async execute(args, context): Promise<string> {
    const { directory } = context as unknown as { directory: string }
    
    const threshold = args.threshold ?? 80
    const reporter = args.reporter ?? "text"
    
    const command = `npx c8 --all --check-coverage --lines ${threshold} --functions ${threshold} --branches ${threshold} --statements ${threshold} --reporter=${reporter}`
    
    try {
      const result = execSync(command, { cwd: directory, encoding: "utf-8" })
      
      return result
    } catch (error: unknown) {
      const err = error as { message?: string; stdout?: string }
      return err.stdout || err.message || "Coverage below threshold"
    }
  }
})

export const CheckCoveragePlugin: Plugin = async (ctx) => {
  return {
    tool: {
      checkCoverage: checkCoverageTool
    }
  }
}

export default CheckCoveragePlugin
