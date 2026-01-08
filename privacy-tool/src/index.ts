#!/usr/bin/env node
/**
 * Mac Privacy Tool - CLI Interface
 * Protects your MAC address and hardware serial number privacy
 */

import { execSync, spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper functions for colored output
const log = {
  info: (msg: string) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  privacy: (msg: string) => console.log(`${colors.magenta}[PRIVACY]${colors.reset} ${msg}`),
};

// Get script directory
const scriptsDir = path.join(__dirname, '../scripts');

// Check if running on macOS
function checkMacOS(): void {
  if (process.platform !== 'darwin') {
    log.error('This tool only works on macOS');
    process.exit(1);
  }
}

// Execute shell script
function executeScript(scriptName: string, args: string[] = []): void {
  const scriptPath = path.join(scriptsDir, scriptName);

  if (!fs.existsSync(scriptPath)) {
    log.error(`Script not found: ${scriptPath}`);
    process.exit(1);
  }

  // Make script executable
  try {
    fs.chmodSync(scriptPath, '755');
  } catch (err) {
    log.warning(`Could not set script permissions: ${err}`);
  }

  // Execute script
  const child = spawn(scriptPath, args, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

// Show main menu
function showMainMenu(): void {
  console.log(`
${colors.cyan}${colors.bright}╔═══════════════════════════════════════════════════════════╗
║           MAC PRIVACY TOOL FOR MACOS                      ║
║     Protect Your MAC Address & Hardware Serial Number    ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}

${colors.bright}Available Commands:${colors.reset}

${colors.green}MAC Address Privacy:${colors.reset}
  ${colors.cyan}mac status${colors.reset}              Show all network interfaces and MAC addresses
  ${colors.cyan}mac randomize <iface>${colors.reset}   Generate random MAC address for interface
  ${colors.cyan}mac change <iface> <mac>${colors.reset} Change MAC to specific address
  ${colors.cyan}mac restore <iface>${colors.reset}     Restore original hardware MAC address
  ${colors.cyan}mac list${colors.reset}                List all available network interfaces

${colors.green}Hardware Serial Privacy:${colors.reset}
  ${colors.cyan}serial info${colors.reset}             Show serial numbers and access information
  ${colors.cyan}serial show${colors.reset}             Display hardware serial numbers
  ${colors.cyan}serial monitor${colors.reset}          Monitor serial number access (requires sudo)
  ${colors.cyan}serial tips${colors.reset}             Show privacy recommendations
  ${colors.cyan}serial audit${colors.reset}            Run comprehensive privacy audit
  ${colors.cyan}serial wrappers${colors.reset}         Create CLI wrappers to redact serials (sudo)

${colors.green}General:${colors.reset}
  ${colors.cyan}quick-privacy${colors.reset}           Quick privacy setup (randomize MAC + audit)
  ${colors.cyan}help${colors.reset}                    Show this help message

${colors.yellow}Examples:${colors.reset}
  privacy-tool mac status
  sudo privacy-tool mac randomize en0
  privacy-tool serial audit
  sudo privacy-tool quick-privacy

${colors.yellow}Note:${colors.reset} MAC address changes require sudo privileges
`);
}

// Quick privacy setup
function quickPrivacy(): void {
  console.log(`
${colors.magenta}${colors.bright}╔═══════════════════════════════════════════════════════════╗
║              QUICK PRIVACY SETUP                          ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}
`);

  // Check if running with sudo
  if (process.getuid && process.getuid() !== 0) {
    log.error('Quick privacy setup requires sudo privileges');
    console.log('\nRun: sudo privacy-tool quick-privacy');
    process.exit(1);
  }

  log.info('Step 1: Running privacy audit...');
  executeScript('serial-privacy.sh', ['audit']);

  // Note: The script will exit after the first executeScript,
  // so we can't chain commands here. Users should run them separately.
}

// Main CLI handler
function main(): void {
  checkMacOS();

  const args = process.argv.slice(2);

  if (args.length === 0) {
    showMainMenu();
    return;
  }

  const command = args[0];
  const subCommand = args[1];
  const extraArgs = args.slice(2);

  switch (command) {
    case 'mac':
      if (!subCommand) {
        executeScript('mac-spoof.sh', ['status']);
      } else {
        executeScript('mac-spoof.sh', [subCommand, ...extraArgs]);
      }
      break;

    case 'serial':
      if (!subCommand) {
        executeScript('serial-privacy.sh', ['info']);
      } else if (subCommand === 'tips' || subCommand === 'recommendations') {
        executeScript('serial-privacy.sh', ['recommendations']);
      } else if (subCommand === 'wrappers') {
        executeScript('serial-privacy.sh', ['create-wrappers']);
      } else {
        executeScript('serial-privacy.sh', [subCommand, ...extraArgs]);
      }
      break;

    case 'quick-privacy':
      quickPrivacy();
      break;

    case 'help':
    case '--help':
    case '-h':
      showMainMenu();
      break;

    default:
      log.error(`Unknown command: ${command}`);
      console.log('\nRun "privacy-tool help" for usage information');
      process.exit(1);
  }
}

// Run CLI
main();
