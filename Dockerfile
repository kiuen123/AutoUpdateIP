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

# Expose port cho HTTP Server
EXPOSE 1499

# Health check để kiểm tra container có hoạt động không
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost:1499/api/ip || exit 1

# Chạy ứng dụng
CMD ["npm", "start"]
