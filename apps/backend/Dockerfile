FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

WORKDIR /app/apps/backend

COPY . .

RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/main.js"]
