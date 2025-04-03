# Sử dụng Node.js phiên bản 16 LTS
FROM node:18.17-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json vào container
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

ENV NODE_ENV=$DOCKER_ENV
# Expose cổng 5000
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm","start"]
