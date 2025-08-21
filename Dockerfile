# Use the official Bun image as the base image
FROM oven/bun:latest AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY src ./src

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/index.ts"]
