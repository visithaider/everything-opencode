#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const PLUGIN_NAME = 'eoc-opencode';
const homeDir = process.env.HOME || process.env.USERPROFILE || os.homedir();
const srcDir = import.meta.dirname || __dirname;

// OpenCode config directory
const ocConfigDir = path.join(homeDir, '.config', 'opencode');

// Platform-specific old location cleanup
const oldDir = process.platform === 'win32'
  ? path.join(homeDir, 'AppData', 'Roaming', 'opencode', 'plugin')
  : null;

const isUpgrade = fs.existsSync(path.join(ocConfigDir, 'plugins', `${PLUGIN_NAME}.mjs`));

console.log(isUpgrade ? `Upgrading ${PLUGIN_NAME}...` : `Installing ${PLUGIN_NAME}...`);

try {
  // Ensure directories exist
  fs.mkdirSync(path.join(ocConfigDir, 'plugins'), { recursive: true });
  fs.mkdirSync(path.join(ocConfigDir, 'prompts'), { recursive: true });
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

  // Copy main plugin files
  const pluginMjsPath = path.join(ocConfigDir, 'plugins', `${PLUGIN_NAME}.mjs`);
  
  // Create a wrapper that loads the dist/index.js
  const wrapperContent = `// Auto-generated wrapper for ${PLUGIN_NAME}
// This loads the compiled TypeScript plugin
import plugin from './../../${PLUGIN_NAME}/dist/index.js';
export default plugin;
`;

  // For now, copy the dist folder
  if (fs.existsSync(path.join(srcDir, 'dist'))) {
    copyRecursive(path.join(srcDir, 'dist'), path.join(ocConfigDir, 'plugins', 'eoc-opencode-dist'));
  }

  // Copy prompts
  if (fs.existsSync(path.join(srcDir, 'prompts'))) {
    copyRecursive(path.join(srcDir, 'prompts'), path.join(ocConfigDir, 'prompts'));
  }

  // Copy instructions
  if (fs.existsSync(path.join(srcDir, 'instructions'))) {
    copyRecursive(path.join(srcDir, 'instructions'), path.join(ocConfigDir, 'instructions'));
  }

  // Copy opencode.json config
  if (fs.existsSync(path.join(srcDir, 'opencode.json'))) {
    fs.copyFileSync(path.join(srcDir, 'opencode.json'), path.join(ocConfigDir, 'opencode.json'));
  }

  // Update opencode.json to include the plugin
  const ocJsonPath = path.join(ocConfigDir, 'opencode.json');
  let ocConfig = {};
  try {
    ocConfig = JSON.parse(fs.readFileSync(ocJsonPath, 'utf-8'));
  } catch (e) {
    // File doesn't exist or is invalid, start fresh
  }

  // Ensure required fields exist
  if (!ocConfig.plugin) ocConfig.plugin = [];
  if (!ocConfig.instructions) ocConfig.instructions = [];

  // Add plugin reference
  const pluginPath = path.join(ocConfigDir, 'plugins', 'eoc-opencode-dist', 'index.js');
  if (!ocConfig.plugin.includes(pluginPath)) {
    ocConfig.plugin.push(pluginPath);
  }

  // Add instructions path
  const instructionsPath = path.join(ocConfigDir, 'instructions', 'INSTRUCTIONS.md');
  if (!ocConfig.instructions.includes(instructionsPath)) {
    ocConfig.instructions.push(instructionsPath);
  }

  // Ensure skills path
  if (!ocConfig.skills) ocConfig.skills = {};
  if (!ocConfig.skills.paths) ocConfig.skills.paths = [];
  const skillsPath = path.join(ocConfigDir, 'prompts');
  if (!ocConfig.skills.paths.includes(skillsPath)) {
    ocConfig.skills.paths.push(skillsPath);
  }

  // Write updated config
  fs.writeFileSync(ocJsonPath, JSON.stringify(ocConfig, null, 2) + '\n');

  // Clean up old directory if exists (Windows migration)
  if (oldDir && fs.existsSync(oldDir)) {
    try {
      fs.rmSync(oldDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }

  console.log(`✓ ${PLUGIN_NAME} ${isUpgrade ? 'upgraded' : 'installed'} to ${ocConfigDir}`);
  console.log('Restart OpenCode to activate.');
  process.exit(0);
} catch (e) {
  console.error(`Installation failed: ${e.message}`);
  console.error(e.stack);
  process.exit(1);
}
