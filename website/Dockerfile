#FROM node:18-alpine as builder
FROM registry.cn-shanghai.aliyuncs.com/node_service_space/node_18_alpha:0.0.3 AS builder
WORKDIR /app

COPY package*.json ./

#RUN npm config set -g registry https://registry.npmmirror.com/
#ENV PNPM_REGISTRY=https://registry.npmmirror.com/

RUN npm i -g pnpm

COPY . .

RUN pnpm install
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]  