# Define the platform variable
ARG PLATFORM=linux/amd64

FROM --platform=${PLATFORM} node:22.14 AS builder

WORKDIR /app

COPY package*.json ./

RUN yarn install

ADD ./ ./

RUN yarn build

FROM --platform=${PLATFORM} nginx:1.26.3-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder /app/nginx /etc/nginx/conf.d

WORKDIR /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
