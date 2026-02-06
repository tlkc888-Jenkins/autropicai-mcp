#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
const API = "https://www.tryautropic.com";
const tools = [{ name: "get_cheapest_model", description: "Find cheapest LLM", inputSchema: { type: "object", properties: { tier: { type: "string" } }, required: ["tier"] } }];
async function handle(name, args) { const r = await fetch(API+"/v1/cheapest?tier="+args.tier); const d = await r.json(); return d.recommendations.map(m => m.provider+"/"+m.model).join("
"); }
const server = new Server({ name: "autropicai", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, async (req) => ({ content: [{ type: "text", text: await handle(req.params.name, req.params.arguments) }] }));
await server.connect(new StdioServerTransport());
