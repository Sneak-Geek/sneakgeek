FROM node:10.19.0-alpine AS builder
WORKDIR /app
ENV PATH "/app/node_modules/.bin/:$PATH"
COPY . .
RUN yarn install --frozen-lock-files
RUN yarn build

FROM node:10.19.0-alpine
WORKDIR /app
RUN yarn global add serve
COPY --from=builder /app/build .
EXPOSE 5000
CMD ["serve", "-p", "5000", "-s", "."]
