# Use Node.js 22-slim image
FROM node:22-slim

# Enable corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package, lock file & prisma folder
COPY package.json pnpm-lock.yaml prisma ./ 

# Install dependencies
RUN pnpm install

# Copy rest of the project files
COPY . .

# Generate prisma  (Done in postinstall)
# RUN pnpm prisma generate

# Expose the port
EXPOSE 8080

# Run in dev mode (hot-reload via volumes)
CMD ["pnpm", "run", "dev"]
