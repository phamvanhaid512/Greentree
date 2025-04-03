# Sử dụng Node.js 16 làm môi trường build
FROM node:18 AS build

WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code và build
COPY . .
RUN npm run build:dev

# Sử dụng Nginx để chạy ứng dụng
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
