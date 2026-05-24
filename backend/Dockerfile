FROM node:22-alpine

WORKDIR /app

ENV PORT=3000

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN pnpm --filter sns-backend-mongoose-merged... install --frozen-lockfile

COPY backend ./backend

WORKDIR /app/backend

RUN pnpm build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start:prod"]
