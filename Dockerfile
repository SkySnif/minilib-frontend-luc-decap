########################################
# STAGE 1 — BUILD
########################################
FROM node:25.7.0-alpine AS builder

WORKDIR /app

# pnpm installer 
RUN npm install -g pnpm

# Copy necesary file for install modules
COPY package.json pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./
COPY index.html ./

# External lib ts
COPY .npmrc .npmrc

# Variables for registry
ARG HENDEC_NPM_REGISTERY_HOST
ARG HENDEC_NPM_REGISTERY_PORT

ENV HENDEC_NPM_REGISTERY_HOST=${HENDEC_NPM_REGISTERY_HOST}
ENV HENDEC_NPM_REGISTERY_PORT=${HENDEC_NPM_REGISTERY_PORT}

RUN --mount=type=secret,id=service_npm_token \
    export HENDEC_NPM_TOKEN=$(cat /run/secrets/service_npm_token) && \
    pnpm install --frozen-lockfile && \
    unset HENDEC_NPM_TOKEN && \
    rm -f .npmrc

# copy source code 
COPY src ./src

# Build TypeScript → dist/
RUN pnpm run build

########################################
# STAGE 2 — RUNTIME (NGINX)
########################################
FROM nginx:alpine

# Variable to tag the image for after runtime the service name and tag associated
# Not needed in the compose for the runtime
ARG SERVICE_PORT=80
ARG SERVICE_NAME=""
ARG SERVICE_TAG_VERSION=V0.0.0

ENV SERVICE_PORT=${SERVICE_PORT}
ENV SERVICE_NAME=${SERVICE_NAME}
ENV SERVICE_TAG_VERSION=${SERVICE_TAG_VERSION}

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Entrypoint and scripts copy
COPY ./entrypoint/ /usr/local/bin/entrypoint/
RUN chmod -R +rx /usr/local/bin/entrypoint/

# SQL associated to the service copy
COPY ./sql/ /usr/local/bin/entrypoint/sql/
RUN chmod -R +r /usr/local/bin/entrypoint/sql/

# Expose port
# Change according to PORT set the app listener
EXPOSE ${SERVICE_PORT:-80}

# Entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
