FROM node:20.5.1-alpine As deps
WORKDIR /app
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --pure-lockfile
COPY --chown=node:node . .
USER node

FROM node:20.5.1-alpine As build
WORKDIR /app
COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN yarn build
ENV NODE_ENV production
RUN yarn install --pure-lockfile --production
USER node

FROM node:20.5.1-alpine As production
WORKDIR /app
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./
CMD [ "node", "main.js" ]
