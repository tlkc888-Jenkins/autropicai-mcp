# AutropicAI — MCP Server Discovery

**One MCP server to find them all.**

Find and install MCP servers without leaving your AI assistant. Ask what tool you need, get the answer with ready-to-paste config.

## Why?

- **Token-efficient** — One tool call instead of loading 100 tool descriptions
- **Always current** — We index 100+ MCP servers and growing
- **One-click config** — Returns ready-to-paste Claude Desktop config

## Quick Install

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "autropicai": {
      "command": "npx",
      "args": ["-y", "github:tlkc888-Jenkins/autropicai-mcp"]
    }
  }
}
```

Restart Claude Desktop. Done.

## Usage

### For Agents

Just ask Claude:
- "I need to send emails, find me an MCP server"
- "What MCP servers are available for databases?"
- "How do I install the Slack MCP server?"

### Tools Available

#### `find_mcp_server`
Find an MCP server for a specific task.

```
Input: { "task": "send emails" }
Output: Server details + install config
```

#### `list_mcp_servers`
Browse available servers by category.

```
Input: { "category": "communication" }
Output: List of matching servers
```

#### `get_mcp_server_details`
Get full details for a specific server.

```
Input: { "slug": "slack" }
Output: Full details + install config
```

## Example

**You:** "I need to query a PostgreSQL database"

**Claude (using AutropicAI):**
```
## PostgreSQL
Read-only database access with schema inspection

**Install:** `npx @modelcontextprotocol/server-postgres`

**Claude Desktop Config:**
{
  "postgres": {
    "command": "npx",
    "args": ["@modelcontextprotocol/server-postgres"]
  }
}
```

## Categories

- `data-files` — Databases, file systems, cloud storage
- `developer-tools` — Git, CI/CD, code analysis
- `communication` — Email, Slack, Discord, messaging
- `productivity` — Calendar, notes, task management
- `web-browser` — Scraping, search, automation
- `ai-ml` — Model APIs, embeddings, inference
- `finance` — Payments, banking, crypto
- `infrastructure` — Cloud, containers, monitoring

## Links

- **Directory:** https://tryautropic.com
- **GitHub:** https://github.com/tlkc888-Jenkins/autropicai-mcp

## License

MIT — Autropic Pty Ltd
