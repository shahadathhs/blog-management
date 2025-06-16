# Use Node.js 22 base image
FROM node:22

# Enable corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package and lock file
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy rest of the project files
COPY . .

# Generate prisma client
RUN pnpm prisma generate

# Expose the port
EXPOSE 8080

# Run in dev mode (hot-reload via volumes)
CMD ["pnpm", "run", "dev"]
