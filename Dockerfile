# Sử dụng Node.js LTS official image
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Tạo thư mục cho config nếu chưa có
RUN mkdir -p asset/config

# Expose port cho WebSocket Server và HTTP Server
EXPOSE 1500 1501

# Health check để kiểm tra container có hoạt động không
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const ws = require('ws'); const client = new ws('ws://localhost:1500'); client.on('open', () => { client.close(); process.exit(0); }); client.on('error', () => process.exit(1));" || exit 1

# Chạy ứng dụng
CMD ["npm", "start"]
