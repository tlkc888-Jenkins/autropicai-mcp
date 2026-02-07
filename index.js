#!/usr/bin/env node
/**
 * AutropicAI MCP Server — Find MCP servers for any task
 * 
 * The discovery layer for AI agents. Ask what tool you need, get the answer.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const API_BASE = "https://www.tryautropic.com";

// Tool definitions
const tools = [
  {
    name: "find_mcp_server",
    description: "Find an MCP server for a specific task. Returns the best matching server with install instructions. Use this when you need a capability you don't have.",
    inputSchema: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "What you need to do, e.g. 'send an email', 'query a postgres database', 'search the web'"
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default: 3)"
        }
      },
      required: ["task"]
    }
  },
  {
    name: "list_mcp_servers",
    description: "List all available MCP servers, optionally filtered by category. Use this to explore what tools are available.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by category: data-files, developer-tools, communication, productivity, web-browser, ai-ml, finance, infrastructure, other"
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default: 10)"
        }
      }
    }
  },
  {
    name: "get_mcp_server_details",
    description: "Get detailed information about a specific MCP server including full install instructions.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "The server slug/identifier, e.g. 'postgres', 'slack', 'github'"
        }
      },
      required: ["slug"]
    }
  }
];

// Generate Claude Desktop config snippet
function generateConfig(server) {
  const name = server.slug || server.name.toLowerCase().replace(/\s+/g, '-');
  
  // Parse install command to extract command and args
  let command = "npx";
  let args = [server.install_command?.replace('npx ', '') || server.npm_package || name];
  
  if (server.install_command) {
    const parts = server.install_command.split(' ');
    command = parts[0];
    args = parts.slice(1);
  }
  
  return {
    [name]: {
      command: command,
      args: args
    }
  };
}

// Format server for response
function formatServer(server, includeConfig = true) {
  let response = `## ${server.name}
${server.description || 'No description'}

**Category:** ${server.category || 'other'}
**Install:** \`${server.install_command || 'npx ' + server.slug}\`
`;

  if (server.github_url) {
    response += `**GitHub:** ${server.github_url}\n`;
  }

  if (includeConfig) {
    response += `
**Claude Desktop Config** (add to claude_desktop_config.json):
\`\`\`json
${JSON.stringify(generateConfig(server), null, 2)}
\`\`\`
`;
  }

  return response;
}

// Handle tool calls
async function handleTool(name, args) {
  try {
    switch (name) {
      case "find_mcp_server": {
        const limit = args.limit || 3;
        const res = await fetch(`${API_BASE}/api/v1/servers?search=${encodeURIComponent(args.task)}&limit=${limit}`);
        const data = await res.json();
        
        if (!data.servers || data.servers.length === 0) {
          return `No MCP servers found for "${args.task}". Try a different search term or use list_mcp_servers to see all available servers.`;
        }
        
        let response = `# Found ${data.servers.length} MCP server(s) for "${args.task}"\n\n`;
        response += data.servers.map(s => formatServer(s, true)).join('\n---\n\n');
        response += `\n---\n*Search more at https://tryautropic.com*`;
        
        return response;
      }
      
      case "list_mcp_servers": {
        const limit = args.limit || 10;
        let url = `${API_BASE}/api/v1/servers?limit=${limit}`;
        if (args.category) {
          url += `&category=${encodeURIComponent(args.category)}`;
        }
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (!data.servers || data.servers.length === 0) {
          return `No servers found${args.category ? ` in category "${args.category}"` : ''}.`;
        }
        
        let response = `# Available MCP Servers${args.category ? ` (${args.category})` : ''}\n\n`;
        response += data.servers.map(s => `- **${s.name}** (${s.slug}): ${s.description || 'No description'}`).join('\n');
        response += `\n\n*Use get_mcp_server_details for install instructions*`;
        
        return response;
      }
      
      case "get_mcp_server_details": {
        const res = await fetch(`${API_BASE}/api/v1/servers/${encodeURIComponent(args.slug)}`);
        
        if (!res.ok) {
          return `Server "${args.slug}" not found. Use list_mcp_servers to see available servers.`;
        }
        
        const server = await res.json();
        return formatServer(server, true);
      }
      
      default:
        return `Unknown tool: ${name}`;
    }
  } catch (error) {
    return `Error: ${error.message}. Please try again.`;
  }
}

// Create and run server
const server = new Server(
  { name: "autropicai", version: "2.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const result = await handleTool(name, args || {});
  return {
    content: [{ type: "text", text: result }]
  };
});

// Connect
const transport = new StdioServerTransport();
await server.connect(transport);
