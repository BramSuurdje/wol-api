# Build stage
FROM oven/bun:latest AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install all dependencies (including dev dependencies for building)
RUN bun install --frozen-lockfile

# Copy source code
COPY src ./src

# Bundle the application for production
RUN bun build src/index.ts --outdir ./dist --target bun

# Optimized production stage using oven/bun Alpine
FROM oven/bun:1-alpine AS production

# Create a non-root user for security
RUN addgroup -g 1001 -S bunuser && \
    adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G bunuser -g bunuser bunuser

# Set working directory
WORKDIR /app

# Copy the bundled application from builder stage
COPY --from=builder /app/dist ./dist

# Copy only production dependencies
COPY --from=builder /app/package.json /app/bun.lock ./

# Install only production dependencies (this will be much smaller now)
RUN bun install --frozen-lockfile --production && \
    # Clean up everything we can to minimize size
    rm -rf /tmp/* /var/cache/apk/* /root/.bun/install-cache

# Change ownership to non-root user
RUN chown -R bunuser:bunuser /app
USER bunuser

# Expose port 3000
EXPOSE 3000

# Start the bundled application
CMD ["bun", "run", "./dist/index.js"]
