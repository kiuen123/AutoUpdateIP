# Auto Update IP - Docker Setup

## Yêu cầu

- Docker
- Docker Compose

## Cách chạy

### 1. Cấu hình

Trước khi chạy, hãy đảm bảo file `asset/config/config.json` đã được cấu hình đúng với thông tin Cloudflare của bạn:

```json
{
  "hostname": ["example.com", "subdomain.example.com"],
  "UserAPIToken": "your_cloudflare_api_token",
  "ZoneID": "your_zone_id",
  "email": "your_email@example.com",
  "token": "your_global_api_key"
}
```

### 2. Chạy ứng dụng

#### Sử dụng Docker Compose (Khuyến nghị)

```bash
# Build và chạy container
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng container
docker-compose down
```

#### Sử dụng Docker trực tiếp

```bash
# Build image
docker build -t autoupdateip .

# Chạy container
docker run -d \
  --name autoupdateip-app \
  -p 1499:1499 \
  -v $(pwd)/asset/config:/app/asset/config \
  autoupdateip
```

### 3. Kiểm tra hoạt động

- HTTP Server sẽ chạy trên port 1499
- Truy cập `http://localhost:1499` để xem giao diện web
- API endpoints: `http://localhost:1499/api/ip` và `http://localhost:1499/api/config`
- Kiểm tra logs: `docker-compose logs -f autoupdateip`

### 4. Quản lý container

```bash
# Xem trạng thái
docker-compose ps

# Restart container
docker-compose restart

# Xem logs real-time
docker-compose logs -f autoupdateip

# Vào bên trong container
docker-compose exec autoupdateip sh

# Cập nhật và rebuild
docker-compose down
docker-compose up --build -d
```

## Lưu ý

- Container sẽ tự động restart nếu bị crash
- Config file được mount từ host, có thể chỉnh sửa mà không cần rebuild image
- Logs được lưu trong thư mục `logs/` (nếu có)
- Health check sẽ kiểm tra HTTP server mỗi 30 giây
- Giao diện web có logo từ thư mục `asset/media/`
- Static files được phục vụ từ thư mục `public/`
- Web UI sử dụng HTTP polling để cập nhật IP realtime

## 📁 Cấu trúc project

```
autoupdateip/
├── Dockerfile                   # Docker image configuration
├── docker-compose.yml           # Docker compose configuration
├── index.js                     # Main server file
├── package.json                 # Dependencies
├── public/                     # Web interface files
│   ├── index.html              # Main HTML page
│   ├── style.css               # Styling
│   └── script.js               # JavaScript logic
├── asset/                      # Configuration & media
│   ├── config/
│   │   └── config.json          # Cloudflare configuration
│   └── media/
│       └── yourlogo.jpg         # Application logo
└── components/                 # Core modules
    ├── CheckConnection.js
    ├── GetConfig.js
    ├── GetNewIPAddress.js
    └── UpdateDNSRecord.js
```
