# WOL-API

A simple and efficient Wake-on-LAN API built with Hono and Bun. This API allows you to wake up devices on your local network using Wake-on-LAN functionality.

## Features

- 🚀 **Fast Performance** - Built with Bun runtime for optimal speed
- 🔧 **Simple API** - Single endpoint for Wake-on-LAN functionality
- 🐳 **Docker Support** - Easy deployment with Docker and Docker Compose
- 🔒 **API Key Authentication** - Secure access with API key validation
- 📡 **Network Broadcasting** - Configurable IP address and MAC address targeting
- ⚡ **Hot Reload** - Development mode with hot reloading support

## Prerequisites

- [Bun](https://bun.sh/) (for local development)
- [Docker](https://docker.com/) (for containerized deployment)
- [Docker Compose](https://docs.docker.com/compose/) (for orchestrating containers)

## Quick Start

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/BramSuurdje/wol-api.git
   cd wol-api
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Start the development server**

   ```bash
   bun run dev
   ```

4. **Access the API**
   Open your browser to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build and start with Docker Compose**

   ```bash
   docker-compose up -d
   ```

2. **View logs**

   ```bash
   docker-compose logs -f
   ```

3. **Stop the application**

   ```bash
   docker-compose down
   ```

4. **Rebuild after changes**
   ```bash
   docker-compose up --build -d
   ```

## API Documentation

### Wake Device

**POST** `/wake`

Wakes up a device using Wake-on-LAN magic packet.

**Headers:**

- `x-api-key`: Your API key (required)
- `Content-Type`: `application/json`

**Example Request:**

```bash
curl -X POST http://localhost:3000/wake \
  -H "x-api-key: jBqqNSgG2gYiGfYDI9dmyLL8nT5E9PnQDwpFbbZM4b" \
  -H "Content-Type: application/json"
```

**Success Response (200):**

```json
{
  "message": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (401 - Invalid API Key):**

```json
{
  "error": "Invalid API key"
}
```

**Error Response (500 - Wake Failure):**

```json
{
  "error": "Failed to wake up"
}
```

## Project Structure

```
WOL-API/
├── src/
│   └── index.ts          # Main application file
├── Dockerfile            # Docker image definition
├── docker-compose.yml    # Docker Compose configuration
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## Deployment

### Docker Production Deployment

1. Ensure Docker and Docker Compose are installed
2. Run `docker-compose up -d` in the project root
3. Your API will be available at `http://localhost:3000`

### Manual Deployment

1. Install Bun on your target system
2. Install dependencies: `bun install --production`
3. Start the server: `bun run src/index.ts`
4. Configure your reverse proxy (nginx, Apache, etc.) to forward requests to port 3000

## License

This project is licensed under the MIT License - see the LICENSE file for details.
