#!/bin/bash
# Installation script for Mac Privacy Tool

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         MAC PRIVACY TOOL - INSTALLATION                   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${YELLOW}[ERROR]${NC} This tool only works on macOS"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}[ERROR]${NC} Node.js is not installed"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}[1/4]${NC} Installing dependencies..."
npm install

echo -e "${GREEN}[2/4]${NC} Building TypeScript..."
npm run build

echo -e "${GREEN}[3/4]${NC} Making scripts executable..."
chmod +x scripts/*.sh
chmod +x dist/index.js

echo -e "${GREEN}[4/4]${NC} Setting up global command..."
echo ""
echo "To install globally, run:"
echo "  ${BLUE}sudo npm link${NC}"
echo ""
echo "Or to run locally, use:"
echo "  ${BLUE}./dist/index.js${NC}"
echo ""

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            INSTALLATION COMPLETE! 🎉                      ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Quick start:"
echo "  1. Run 'sudo npm link' to install globally as 'privacy-tool'"
echo "  2. Run 'privacy-tool' to see all commands"
echo "  3. Run 'privacy-tool serial audit' to check your privacy status"
echo "  4. Run 'sudo privacy-tool mac randomize en0' to randomize WiFi MAC"
echo ""
echo "For full documentation, see README.md"
