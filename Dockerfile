# Stage 1: Build the app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Stage 2: Serve the app with a lightweight web server
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["yarn", "start"]
