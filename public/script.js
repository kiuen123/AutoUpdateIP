let currentIP = null;
let pollingInterval = null;

async function fetchIP() {
    try {
        const response = await fetch("/api/ip");
        const data = await response.json();
        if (data.IP) {
            currentIP = data.IP;
            updateIP(data.IP);
            updateLastUpdate();
            updateConnectionStatus(true);
        }
    } catch (error) {
        console.error("Error fetching IP:", error);
        updateConnectionStatus(false);
    }
}

function startPolling() {
    // Lấy IP ngay lập tức
    fetchIP();
    // Sau đó poll mỗi 5 giây
    pollingInterval = setInterval(fetchIP, 5000);
}

function updateIP(ip) {
    document.getElementById("current-ip").textContent = ip || "Không xác định";
    document.getElementById("update-status").textContent = ip ? "Hoạt động" : "Chờ dữ liệu";
}

function updateConnectionStatus(connected) {
    const statusElement = document.getElementById("connection-status");
    if (connected) {
        statusElement.className = "status connected";
        statusElement.innerHTML = '<div class="status-dot"></div><span>Đã kết nối</span>';
    } else {
        statusElement.className = "status disconnected";
        statusElement.innerHTML = '<div class="status-dot"></div><span>Mất kết nối</span>';
    }
}

function updateLastUpdate() {
    const now = new Date();
    const timeString = now.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    document.getElementById("last-update").textContent = `Cập nhật lần cuối: ${timeString}`;
}

function refreshConnection() {
    clearInterval(pollingInterval);

    // Hiển thị trạng thái đang kết nối
    const statusElement = document.getElementById("connection-status");
    statusElement.className = "status disconnected";
    statusElement.innerHTML = '<div class="status-dot"></div><span>Đang kết nối lại...</span>';

    setTimeout(startPolling, 1000);
}

// Lấy thông tin config để hiển thị số domains
async function loadDomainCount() {
    try {
        const response = await fetch("/api/config");
        const config = await response.json();
        if (config.hostname && Array.isArray(config.hostname)) {
            document.getElementById("domain-count").textContent = config.hostname.length;
        }
    } catch (error) {
        console.error("Failed to load config:", error);
        document.getElementById("domain-count").textContent = "-";
    }
}

// Khởi tạo khi trang load
window.addEventListener("load", function () {
    startPolling();
    loadDomainCount();
});

// Xử lý khi tab/window bị ẩn và hiện lại
document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
        refreshConnection();
    }
});
