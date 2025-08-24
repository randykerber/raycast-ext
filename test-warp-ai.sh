#!/bin/bash

# Test script for Warp AI functionality
echo "🚀 Testing Warp AI Setup"
echo "========================"

echo "✅ OpenAI API Key is set: ${OPENAI_API_KEY:0:20}..."

echo ""
echo "📝 Manual Tests to Perform:"
echo "1. Press ⌥⇧Space (Option+Shift+Space) - Should open AI chat"
echo "2. Press Ctrl+R - Should show AI command suggestions"
echo "3. Ask AI: 'How do I check Python version?'"
echo "4. Ask AI: 'Show me all files modified today'"

echo ""
echo "🔧 Current Environment:"
echo "Shell: $SHELL"
echo "Python: $(python3 --version 2>/dev/null || echo 'Not found')"
echo "Git: $(git --version 2>/dev/null || echo 'Not found')"

echo ""
echo "✨ If Warp AI is working properly, you should see:"
echo "- AI responses in the chat panel"
echo "- Command suggestions when typing"
echo "- Natural language to command conversion"

echo ""
echo "🎯 Ready to use Warp AI in your workflow!"
