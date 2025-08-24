# Claude & Gemini CLI Operational Guide

## Installation Check

### Global Installation Verification
Check if CLIs are globally installed:
```bash
npm list -g --depth=0
```

Expected output should include:
- `@anthropic-ai/claude-code@x.x.x`
- `@google/gemini-cli@x.x.x`

### PATH Configuration
Verify binaries are in PATH:
```bash
which claude
which gemini
```

If not found, add npm global bin to PATH:
```bash
# Get npm global bin path
npm config get prefix

# Add to your shell profile (.bashrc, .zshrc, etc.)
export PATH="$(npm config get prefix)/bin:$PATH"
```

### Local vs Global Installation
- **Empty `npm list -g`**: Means you have local binaries only
- **Solution**: Either install globally or use local binaries with `npx`

## Usage Patterns

### Claude CLI

#### Basic Usage
```bash
# Simple prompt (streams output)
claude -p "summarize"

# Prompt with input
claude -p "Explain this code" < input.txt

# Interactive mode
claude
```

#### Advanced Options
```bash
# Specify model
claude -p "analyze this function" --model claude-3-sonnet

# Output to file
claude -p "generate documentation" > output.md

# Verbose output
claude -p "debug this issue" --verbose
```

### Gemini CLI

#### Chat Mode
```bash
# Basic chat with model specification
gemini chat --model gemini-1.5 "draft k8s manifest"

# Pro model
gemini chat --model gemini-1.5-pro "complex analysis task"

# Flash model for quick tasks
gemini chat --model gemini-1.5-flash "quick question"
```

#### Generate Mode
```bash
# Generate content
gemini generate "write a python function"

# With specific parameters
gemini generate --temperature 0.7 --max-tokens 1000 "creative writing"
```

## Code Piping Templates

### Claude Code Processing

#### Basic Code Analysis
```bash
# Add JSDoc comments
cat server.js | claude -p "add JSDoc comments" > server_annotated.js

# Code review
cat main.py | claude -p "review this code and suggest improvements" > review.md

# Refactor code
cat legacy.js | claude -p "refactor this to modern ES6+" > modern.js
```

#### Multiple File Processing
```bash
# Process multiple files
for file in *.py; do
  cat "$file" | claude -p "add type hints" > "typed_$file"
done

# Combine and analyze
cat src/*.js | claude -p "find potential bugs and security issues" > analysis.md
```

### Gemini Code Processing

#### Code Generation
```bash
# Generate unit tests
cat calculator.py | gemini chat --model gemini-1.5 "generate comprehensive unit tests" > test_calculator.py

# Create documentation
cat api.js | gemini chat --model gemini-1.5-pro "create detailed API documentation" > api_docs.md
```

#### Code Translation
```bash
# Convert between languages
cat script.py | gemini chat --model gemini-1.5 "convert this Python to JavaScript" > script.js

# Modernize syntax
cat old_code.js | gemini chat --model gemini-1.5 "update to latest JavaScript standards" > modern_code.js
```

## Advanced Piping Workflows

### Chained Processing
```bash
# Claude analysis → Gemini implementation
cat requirements.txt | claude -p "analyze dependencies" | gemini chat --model gemini-1.5 "create deployment strategy"

# Multi-step code improvement
cat messy.js | claude -p "clean up code" | gemini chat --model gemini-1.5 "optimize performance" > optimized.js
```

### Error Handling & Debugging
```bash
# Debug with context
cat error.log | claude -p "analyze this error and suggest fixes" > debug_report.md

# Code fixing pipeline
cat broken.py | claude -p "fix syntax errors" | gemini chat --model gemini-1.5 "add error handling" > fixed.py
```

### Batch Processing
```bash
# Process directory of files
find ./src -name "*.js" -exec sh -c 'cat "{}" | claude -p "add error handling" > "./processed/$(basename "{}")"' \;

# Generate tests for all modules
for module in src/*.py; do
  cat "$module" | gemini chat --model gemini-1.5 "generate pytest tests" > "tests/test_$(basename "$module")"
done
```

## Configuration & Environment

### Claude Configuration
```bash
# Set API key (if needed)
export ANTHROPIC_API_KEY="your-api-key"

# Default model
export CLAUDE_MODEL="claude-3-sonnet"
```

### Gemini Configuration
```bash
# Set API key
export GOOGLE_API_KEY="your-api-key"

# Default model
export GEMINI_MODEL="gemini-1.5-pro"
```

## Best Practices

### Performance Tips
- Use `gemini-1.5-flash` for simple tasks
- Use `gemini-1.5-pro` for complex analysis
- Use `claude-3-sonnet` for balanced performance
- Pipe large files in chunks for better processing

### Error Handling
```bash
# Check exit codes
if cat input.js | claude -p "validate syntax"; then
  echo "Validation passed"
else
  echo "Validation failed"
fi

# Timeout for long operations
timeout 300 cat large_file.py | gemini chat --model gemini-1.5 "comprehensive analysis"
```

### Security Considerations
- Never pipe sensitive data through CLI tools
- Use environment variables for API keys
- Validate output before using in production
- Be cautious with generated code execution

## Troubleshooting

### Common Issues
1. **Command not found**: Check PATH configuration
2. **API errors**: Verify API keys and quotas
3. **Large file processing**: Use chunking or streaming
4. **Timeout errors**: Increase timeout or reduce input size

### Debug Commands
```bash
# Check CLI versions
claude --version
gemini --version

# Test connectivity
claude -p "test" --debug
gemini chat "test connection"
```

## Examples Repository

Create a directory structure for common patterns:
```
cli-templates/
├── code-review/
│   ├── review.sh
│   └── security-check.sh
├── documentation/
│   ├── generate-docs.sh
│   └── api-docs.sh
└── refactoring/
    ├── modernize.sh
    └── optimize.sh
```

This guide provides a comprehensive reference for using Claude and Gemini CLIs effectively in your development workflow.
