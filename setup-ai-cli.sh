#!/bin/bash

# Setup script for AI CLI tools used by Raycast extension

echo "🤖 Setting up AI CLI tools for Raycast extension..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Claude CLI
if command_exists claude; then
    echo "✅ Claude CLI is already installed"
else
    echo "❌ Claude CLI not found"
    echo "To install Claude CLI, visit: https://claude.ai/docs/cli"
    echo "Or install via npm: npm install -g @anthropic-ai/claude-cli"
fi

# Check for Gemini CLI
if command_exists gemini; then
    echo "✅ Gemini CLI is already installed"
else
    echo "❌ Gemini CLI not found"
    echo "To install Gemini CLI, visit: https://ai.google.dev/gemini-api/docs/cli"
    echo "Or install via npm: npm install -g @google-ai/generative-ai-cli"
fi

# Check if at least one AI CLI is available
if command_exists claude || command_exists gemini; then
    echo "✅ At least one AI CLI is available"
else
    echo "⚠️  No AI CLI found. Please install at least one:"
    echo "   - Claude CLI: npm install -g @anthropic-ai/claude-cli"
    echo "   - Gemini CLI: npm install -g @google-ai/generative-ai-cli"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Open Raycast preferences (⌘,)"
echo "2. Go to Extensions and enable the RK Utilities extension"
echo "3. Go to AI section and configure your preferred provider"
echo "4. Set up the AI keyboard shortcut (⌘⇧Space)"
echo "5. Try the new AI commands:"
echo "   - 'Explain Selection' - Explain selected text"
echo "   - 'Generate Unit Test' - Generate tests for selected code"
echo "   - 'Regex Helper' - Get regex patterns and explanations"
echo "   - 'AI Code Automation' - Advanced code analysis and refactoring"
echo ""
echo "📋 Usage:"
echo "1. Select text/code in any application"
echo "2. Launch Raycast (⌘Space)"
echo "3. Type the command name and press Enter"
echo "4. View the AI-generated results"
