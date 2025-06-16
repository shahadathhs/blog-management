FROM node:22

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .

EXPOSE 8080

CMD ["pnpm", "run", "dev"]