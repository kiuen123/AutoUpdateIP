# Auto Update IP

Ứng dụng Node.js tự động cập nhật địa chỉ IP cho các domain thông qua Cloudflare DNS API.

## 📋 Tính năng

- Tự động kiểm tra và cập nhật địa chỉ IP public
- Hỗ trợ nhiều domain/subdomain cùng lúc
- WebSocket Server để theo dõi IP real-time
- Giao diện web đơn giản
- Hỗ trợ chạy trên Windows và Linux

## 📦 Yêu cầu

- Node.js (version 16 trở lên)
- npm hoặc yarn
- Tài khoản Cloudflare với API Token

## 🚀 Cài đặt và chạy bình thường

### 1. Clone repository

```bash
git clone https://github.com/kiuen123/autoupdateip.git
cd autoupdateip
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình

Chỉnh sửa file `asset/config/config.json` với thông tin của bạn:

```json
{
  "hostname": ["example.com", "subdomain.example.com", "api.example.com"],
  "UserAPIToken": "your_cloudflare_api_token",
  "ZoneID": "your_cloudflare_zone_id",
  "email": "your_cloudflare_email@example.com",
  "token": "your_cloudflare_global_api_key"
}
```

#### Lấy thông tin Cloudflare:

- **UserAPIToken**: Tạo tại [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
- **ZoneID**: Tìm trong Dashboard → Domain → Overview (bên phải)
- **email**: Email đăng nhập Cloudflare
- **token**: Global API Key tại [API Tokens](https://dash.cloudflare.com/profile/api-tokens)

### 4. Chạy ứng dụng

#### Chạy development mode (với nodemon):

```bash
npm start
```

#### Chạy production mode:

```bash
node index.js
```

#### Chạy trên Windows:

```cmd
AutoUpdateIP-Win.bat
```

#### Chạy trên Linux:

```bash
chmod +x AutoUpdateIP-Linux.sh
./AutoUpdateIP-Linux.sh
```

### 5. Kiểm tra hoạt động

- Ứng dụng sẽ chạy và hiển thị thông tin trong console
- WebSocket Server khởi động trên port 1500
- **Giao diện web**: Truy cập `http://localhost:1501` để xem trang web monitor IP
- WebSocket API: Kết nối `ws://localhost:1500` để nhận dữ liệu real-time
- IP sẽ được kiểm tra và cập nhật mỗi 5 phút

#### Tính năng giao diện web:

- Logo ứng dụng tùy chỉnh từ `asset/media/yourlogo.jpg`
- Hiển thị IP hiện tại real-time
- Trạng thái kết nối WebSocket với indicator động
- Số lượng domains được quản lý
- Thời gian cập nhật cuối cùng
- Tự động kết nối lại khi mất kết nối
- Responsive design cho mobile

## 🐳 Chạy với Docker

### Yêu cầu

- Docker
- Docker Compose

### Cách chạy với Docker Compose (Khuyến nghị)

```bash
# Build và chạy container
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng container
docker-compose down
```

### Chạy với Docker trực tiếp

```bash
# Build image
docker build -t autoupdateip .

# Chạy container
docker run -d \
  --name autoupdateip-app \
  -p 1500:1500 \
  -v $(pwd)/asset/config:/app/asset/config \
  autoupdateip
```

### Quản lý Docker container

```bash
# Xem trạng thái
docker-compose ps

# Restart container
docker-compose restart

# Xem logs real-time
docker-compose logs -f

# Vào bên trong container
docker-compose exec autoupdateip sh

# Cập nhật và rebuild
docker-compose down
docker-compose up --build -d
```

## 📁 Cấu trúc thư mục

```
autoupdateip/
├── index.js                     # File chính - Server Node.js
├── package.json                 # Dependencies và scripts
├── Dockerfile                   # Docker image configuration
├── docker-compose.yml           # Docker compose configuration
├── README.md                    # Hướng dẫn sử dụng chính
├── README-Docker.md             # Hướng dẫn sử dụng Docker
├── AutoUpdateIP-Win.bat         # Script chạy trên Windows
├── AutoUpdateIP-Linux.sh        # Script chạy trên Linux
├── .dockerignore               # Docker ignore file
├── public/                     # Static web files
│   ├── index.html              # Giao diện web monitor IP
│   ├── style.css               # CSS styling cho giao diện
│   └── script.js               # JavaScript logic cho giao diện
├── asset/                      # Assets và cấu hình
│   ├── config/
│   │   ├── config.json          # File cấu hình chính
│   │   └── config-template.json # Template cấu hình
│   └── media/
│       └── yourlogo.jpg         # Logo ứng dụng
└── components/                 # Core modules
    ├── CheckConnection.js       # Kiểm tra kết nối internet
    ├── GetConfig.js            # Đọc file cấu hình
    ├── GetNewIPAddress.js      # Lấy IP public hiện tại
    └── UpdateDNSRecord.js      # Cập nhật DNS record
```

## 🔧 Cấu hình nâng cao

### Thay đổi interval cập nhật

Chỉnh sửa trong `index.js`:

```javascript
let updateIntervalMinutes = 5; // Thời gian update IP (phút)
```

### Thay đổi port WebSocket và HTTP

Chỉnh sửa trong `index.js`:

```javascript
const wsPort = 1500; // Cổng WebSocket Server
const httpPort = 1501; // Cổng HTTP Server cho giao diện web
```

### Tùy chỉnh logo

Để thay đổi logo ứng dụng:

1. Thay thế file `asset/media/yourlogo.jpg` bằng logo của bạn
2. Đảm bảo file có tên `yourlogo.jpg` hoặc cập nhật đường dẫn trong `public/index.html`
3. Kích thước khuyến nghị: 80x80px hoặc tỷ lệ 1:1
4. Format hỗ trợ: JPG, PNG, SVG

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Cannot connect to Cloudflare API**

   - Kiểm tra API Token và Zone ID
   - Đảm bảo token có quyền Zone:Edit

2. **WebSocket connection failed**

   - Kiểm tra port 1500 có bị chặn không
   - Kiểm tra firewall settings

3. **IP không được cập nhật**
   - Kiểm tra kết nối internet
   - Xem logs để tìm lỗi cụ thể

### Xem logs chi tiết:

```bash
# Chạy bình thường
npm start

# Chạy với Docker
docker-compose logs -f
```

## 📄 License

ISC License - Xem file LICENSE để biết thêm chi tiết.

## 👨‍💻 Tác giả

KienNT - [GitHub](https://github.com/kiuen123)

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo Pull Request hoặc báo cáo Issues.
