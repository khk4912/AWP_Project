FROM node:22-alpine

WORKDIR /app

ENV PORT=3001
ENV HOSTNAME=0.0.0.0

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN pnpm --filter project-g-frontend... install --frozen-lockfile

COPY frontend ./frontend

WORKDIR /app/frontend

RUN pnpm build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["pnpm", "start"]
