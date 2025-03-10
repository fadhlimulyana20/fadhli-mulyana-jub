FROM node:22-alpine AS deps
# https://github.com/nodejs/docker-node?tab=readme-ov-file#nodealpine
RUN apk add --no-cache gcompat
WORKDIR /app
COPY package.json ./
RUN npm install

FROM node:22-alpine AS builder
ARG APP_ENV
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /usr/app
ARG APP_ENV
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Exposing server port
EXPOSE 5500

USER node
ENV NODE_ENV="production"
CMD ["npm", "start"]