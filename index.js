#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

const server = new Server(
  {
    name: 'weather-calculator',
    version: '0.2.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'calculate',
        description: 'Perform basic arithmetic calculations',
        inputSchema: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: 'Mathematical expression to evaluate (e.g., "2 + 2", "10 * 5")',
            },
          },
          required: ['expression'],
        },
      },
      {
        name: 'get_weather',
        description: 'Get current weather information for a city',
        inputSchema: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              description: 'City name (e.g., "Istanbul", "London", "New York")',
            },
          },
          required: ['city'],
        },
      },
      {
        name: 'get_exchange_rates',
        description: 'Get current USD exchange rates',
        inputSchema: {
          type: 'object',
          properties: {
            base: {
              type: 'string',
              description: 'Base currency (default: USD)',
              default: 'USD'
            },
          },
        },
      },
    ],
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'calculate') {
    try {
      const expression = args.expression;
      
      // Simple and safe evaluation for basic arithmetic
      const sanitizedExpression = expression.replace(/[^0-9+\-*/.() ]/g, '');
      
      if (sanitizedExpression !== expression) {
        throw new Error('Invalid characters in expression');
      }
      
      const result = Function('"use strict"; return (' + sanitizedExpression + ')')();
      
      return {
        content: [
          {
            type: 'text',
            text: `Result: ${expression} = ${result}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  if (name === 'get_weather') {
    try {
      const city = args.city;
      
      // Free weather API (no key required)
      const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      const current = data.current_condition[0];
      const location = data.nearest_area[0];
      
      const weatherInfo = {
        location: `${location.areaName[0].value}, ${location.country[0].value}`,
        temperature: `${current.temp_C}°C (${current.temp_F}°F)`,
        description: current.weatherDesc[0].value,
        humidity: `${current.humidity}%`,
        windSpeed: `${current.windspeedKmph} km/h`,
        feelsLike: `${current.FeelsLikeC}°C (${current.FeelsLikeF}°F)`
      };
      
      return {
        content: [
          {
            type: 'text',
            text: `🌤️ Weather in ${weatherInfo.location}:
📍 Location: ${weatherInfo.location}
🌡️ Temperature: ${weatherInfo.temperature}
🌈 Condition: ${weatherInfo.description}
💧 Humidity: ${weatherInfo.humidity}
💨 Wind Speed: ${weatherInfo.windSpeed}
🤔 Feels Like: ${weatherInfo.feelsLike}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Weather Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  if (name === 'get_exchange_rates') {
    try {
      const base = args.base || 'USD';
      
      // Free exchange rate API (no key required)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
      
      if (!response.ok) {
        throw new Error(`Exchange rate API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Popular currencies
      const popularCurrencies = ['EUR', 'GBP', 'JPY', 'TRY', 'CAD', 'AUD', 'CHF'];
      const rates = {};
      
      popularCurrencies.forEach(currency => {
        if (data.rates[currency]) {
          rates[currency] = data.rates[currency];
        }
      });
      
      let rateText = `💱 Exchange Rates (Base: ${base})\n\n`;
      Object.entries(rates).forEach(([currency, rate]) => {
        rateText += `${currency}: ${rate.toFixed(4)}\n`;
      });
      
      rateText += `\n📅 Last Updated: ${data.date}`;
      
      return {
        content: [
          {
            type: 'text',
            text: rateText,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Exchange Rate Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Weather & Calculator MCP server running on stdio');
}

runServer().catch(console.error);