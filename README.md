# Weather Calculator MCP Server

[![smithery badge](https://smithery.ai/badge/@nisa439/weather-calculator-mcp)](https://smithery.ai/server/@nisa439/weather-calculator-mcp)

A comprehensive Model Context Protocol (MCP) server that provides weather information, exchange rates, and calculator functionality.

## Features

🌤️ **Weather Information**
- Get current weather for any city
- Temperature, humidity, wind speed
- Feels-like temperature

💱 **Exchange Rates**
- Current USD exchange rates 
- Popular currencies (EUR, GBP, JPY, TRY, etc.)
- Real-time data

🧮 **Calculator**
- Basic arithmetic operations
- Safe expression evaluation

## Tools

### `get_weather`
Get current weather information for a city.

**Parameters:**
- `city` (string, required): City name (e.g., "Istanbul", "London")

**Example:**
```
Get weather for Istanbul
```

### `get_exchange_rates`
Get current USD exchange rates.

**Parameters:**
- `base` (string, optional): Base currency (default: USD)

**Example:**
```
Show current exchange rates
```

### `calculate`
Perform basic arithmetic calculations.

**Parameters:**
- `expression` (string, required): Mathematical expression (e.g., "2 + 2", "10 * 5")

**Example:**
```
Calculate 15 * 8
```

## Installation

### Installing via Smithery

To install weather-calculator-mcp for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@nisa439/weather-calculator-mcp):

```bash
npx -y @smithery/cli install @nisa439/weather-calculator-mcp --client claude
```

### Via NPM (Coming Soon)
```bash
npm install -g weather-calculator-mcp
```

### Manual Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Run: `node index.js`

## Configuration

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "weather-calculator": {
      "command": "npx",
      "args": ["weather-calculator-mcp"]
    }
  }
}
```

## API Sources

- **Weather**: wttr.in (Free, no API key required)
- **Exchange Rates**: exchangerate-api.com (Free, no API key required)

## License

MIT License

## Author

Created for demonstration of MCP capabilities.

## Version History

- **1.0.0**: Initial release with weather, exchange rates, and calculator tools
