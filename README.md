# AutropicAI MCP Server

Find the cheapest LLM for any task. **800+ models. Zero signup. Just works.**

## Install (Claude Desktop)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "autropicai": {
      "command": "npx",
      "args": ["github:tlkc888-Jenkins/autropicai-mcp"]
    }
  }
}
```

**That's it. No API key needed.**

## What You Get

Ask Claude: *"What's the cheapest model for a simple extraction task?"*

Claude uses the tool and returns:
```
1. OPENROUTER/llama-3.2-1b — $0.005/$0.01 per 1M tokens
2. GROQ/llama-3.1-8b — $0.05/$0.08 per 1M tokens
3. DEEPSEEK/deepseek-chat — $0.014/$0.028 per 1M tokens
```

Compare to GPT-4o at $5/$15 per 1M. **That's 1000x cheaper.**

## Tiers

| Tier | Use Case | Max Cost |
|------|----------|----------|
| simple | Q&A, extraction, formatting | $1/1M |
| standard | Chat, summarization | $5/1M |
| complex | Coding, analysis | $20/1M |
| max | Best available | Unlimited |

## Links

- **API**: https://tryautropic.com (free, no signup)
- **Company**: https://autropic.com

MIT — Autropic Pty Ltd
