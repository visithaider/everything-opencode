#!/usr/bin/env node
/**
 * eoc-opencode CLI
 * 
 * Usage:
 *   bun x eoc-opencode@latest        - Install globally
 *   bun x eoc-opencode@latest --local  - Install to current project
 *   bun x eoc-opencode@latest --upgrade  - Upgrade existing installation
 *   bun x eoc-opencode@latest --uninstall - Remove from global config
 *   bun x eoc-opencode@latest --uninstall --local - Remove from project
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const PLUGIN_NAME = 'eoc-opencode';
const homeDir = process.env.HOME || process.env.USERPROFILE || os.homedir();
const srcDir = import.meta.dirname || __dirname;

// Parse arguments
const args = process.argv.slice(2);
const isLocal = args.includes('--local') || args.includes('-l');
const isUninstall = args.includes('--uninstall') || args.includes('-u');
const isUpgrade = args.includes('--upgrade') || args.includes('-U');

// Determine target directory
const ocConfigDir = isLocal 
  ? path.join(process.cwd(), '.opencode')
  : path.join(homeDir, '.config', 'opencode');

// Platform-specific old location (global only)
const oldDir = !isLocal && process.platform === 'win32'
  ? path.join(homeDir, 'AppData', 'Roaming', 'opencode', 'plugin')
  : null;

function install() {
  const targetDir = isLocal ? process.cwd() : homeDir;
  const location = isLocal ? 'project' : 'global';
  const isUpgradeCheck = fs.existsSync(path.join(ocConfigDir, 'plugins', `${PLUGIN_NAME}.mjs`)) ||
                   fs.existsSync(path.join(ocConfigDir, 'plugins', `${PLUGIN_NAME}-dist`));
  
  console.log(isUpgradeCheck ? `Upgrading ${PLUGIN_NAME} (${location})...` : `Installing ${PLUGIN_NAME} (${location})...`);

  try {
    // Ensure directories exist
    fs.mkdirSync(path.join(ocConfigDir, 'plugins'), { recursive: true });
    fs.mkdirSync(path.join(ocConfigDir, 'agents'), { recursive: true });
    fs.mkdirSync(path.join(ocConfigDir, 'commands'), { recursive: true });
    fs.mkdirSync(path.join(ocConfigDir, 'instructions'), { recursive: true });

    // Recursive copy function
    function copyRecursive(src, dst) {
      if (!fs.existsSync(src)) return;
      if (fs.statSync(src).isDirectory()) {
        fs.mkdirSync(dst, { recursive: true });
        fs.readdirSync(src).forEach(file => 
          copyRecursive(path.join(src, file), path.join(dst, file))
        );
      } else {
        fs.copyFileSync(src, dst);
      }
    }

    // Copy dist folder (plugin)
    if (fs.existsSync(path.join(srcDir, 'dist'))) {
      const distDest = path.join(ocConfigDir, 'plugins', `${PLUGIN_NAME}-dist`);
      if (fs.existsSync(distDest)) {
        fs.rmSync(distDest, { recursive: true, force: true });
      }
      copyRecursive(path.join(srcDir, 'dist'), distDest);
    }

    // Copy agents folder
    if (fs.existsSync(path.join(srcDir, 'agents'))) {
      copyRecursive(path.join(srcDir, 'agents'), path.join(ocConfigDir, 'agents'));
    }

    // Copy commands folder
    if (fs.existsSync(path.join(srcDir, 'commands'))) {
      copyRecursive(path.join(srcDir, 'commands'), path.join(ocConfigDir, 'commands'));
    }

    // Copy instructions
    if (fs.existsSync(path.join(srcDir, 'instructions'))) {
      copyRecursive(path.join(srcDir, 'instructions'), path.join(ocConfigDir, 'instructions'));
    }

    // Copy opencode.json config (contains agents and commands definitions)
    if (fs.existsSync(path.join(srcDir, 'opencode.json'))) {
      fs.copyFileSync(path.join(srcDir, 'opencode.json'), path.join(ocConfigDir, 'opencode.json'));
    }

    // Clean up old directory if exists (global Windows migration)
    if (oldDir && fs.existsSync(oldDir)) {
      try {
        fs.rmSync(oldDir, { recursive: true, force: true });
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    console.log(`✓ ${PLUGIN_NAME} ${isUpgradeCheck ? 'upgraded' : 'installed'} to ${isLocal ? 'project' : 'global'}`);
    console.log(isLocal ? `  Location: ${process.cwd()}/.opencode/` : `  Location: ${ocConfigDir}`);
    console.log('Restart OpenCode to activate.');
    return true;
  } catch (e) {
    console.error(`Installation failed: ${e.message}`);
    return false;
  }
}

function uninstall() {
  const location = isLocal ? 'project' : 'global';
  console.log(`Uninstalling ${PLUGIN_NAME} (${location})...`);
  
  try {
    const ocJsonPath = path.join(ocConfigDir, 'opencode.json');
    
    // Remove plugin from config
    if (fs.existsSync(ocJsonPath)) {
      let ocConfig = JSON.parse(fs.readFileSync(ocJsonPath, 'utf-8'));
      
      // Remove plugin paths
      if (ocConfig.plugin) {
        ocConfig.plugin = ocConfig.plugin.filter(p => !p.includes(PLUGIN_NAME));
      }
      
      // Remove eoc agents (starts with eoc- or from eoc-opencode)
      if (ocConfig.agent) {
        const agentKeys = Object.keys(ocConfig.agent);
        agentKeys.forEach(key => {
          if (key.includes('eoc') || key.includes('planner') || key.includes('architect') || 
              key.includes('tdd') || key.includes('code-reviewer') || key.includes('security') ||
              key.includes('build') || key.includes('e2e') || key.includes('refactor') ||
              key.includes('doc-updater') || key.includes('go-') || key.includes('python') ||
              key.includes('database') || key.includes('loop') || key.includes('harness') ||
              key.includes('chief')) {
            delete ocConfig.agent[key];
          }
        });
        if (Object.keys(ocConfig.agent).length === 0) {
          delete ocConfig.agent;
        }
      }
      
      // Remove eoc commands
      if (ocConfig.command) {
        const commandKeys = Object.keys(ocConfig.command);
        commandKeys.forEach(key => {
          if (key.includes('plan') || key.includes('tdd') || key.includes('code-review') ||
              key.includes('build-fix') || key.includes('e2e') || key.includes('refactor') ||
              key.includes('update-docs') || key.includes('go-') || key.includes('python') ||
              key.includes('multi-') || key.includes('pm2') || key.includes('sessions') ||
              key.includes('skill-create') || key.includes('instinct') || key.includes('evolve') ||
              key.includes('promote') || key.includes('projects') || key.includes('learn') ||
              key.includes('setup-pm') || key.includes('harness') || key.includes('loop') ||
              key.includes('quality-gate') || key.includes('model-route') || key.includes('checkpoint') ||
              key.includes('verify') || key.includes('eval') || key.includes('test-coverage') ||
              key.includes('update-codemaps') || key.includes('orchestrate')) {
            delete ocConfig.command[key];
          }
        });
        if (Object.keys(ocConfig.command).length === 0) {
          delete ocConfig.command;
        }
      }
      
      // Remove eoc skills paths
      if (ocConfig.skills && ocConfig.skills.paths) {
        ocConfig.skills.paths = ocConfig.skills.paths.filter(p => 
          !p.includes('eoc-opencode')
        );
      }
      
      // Remove eoc instructions
      if (ocConfig.instructions) {
        ocConfig.instructions = ocConfig.instructions.filter(i => 
          !i.includes('eoc-opencode') && !i.includes('instructions')
        );
      }
      
      fs.writeFileSync(ocJsonPath, JSON.stringify(ocConfig, null, 2) + '\n');
    }

    // Remove plugin files
    const pluginDir = path.join(ocConfigDir, 'plugins', `${PLUGIN_NAME}-dist`);
    if (fs.existsSync(pluginDir)) {
      fs.rmSync(pluginDir, { recursive: true, force: true });
    }

    // Remove agents folder
    const agentsDir = path.join(ocConfigDir, 'agents');
    if (fs.existsSync(agentsDir)) {
      fs.rmSync(agentsDir, { recursive: true, force: true });
    }

    // Remove commands folder
    const commandsDir = path.join(ocConfigDir, 'commands');
    if (fs.existsSync(commandsDir)) {
      fs.rmSync(commandsDir, { recursive: true, force: true });
    }

    console.log(`✓ ${PLUGIN_NAME} uninstalled from ${location}`);
    console.log('Restart OpenCode to deactivate.');
    return true;
  } catch (e) {
    console.error(`Uninstall failed: ${e.message}`);
    return false;
  }
}

// Main
if (isUninstall) {
  uninstall() ? process.exit(0) : process.exit(1);
} else if (isUpgrade) {
  install() ? process.exit(0) : process.exit(1);
} else {
  install() ? process.exit(0) : process.exit(1);
}
