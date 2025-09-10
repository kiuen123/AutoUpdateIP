let ws = null;
let reconnectInterval = null;
let currentIP = null;

function connectWebSocket() {
    try {
        ws = new WebSocket("ws://localhost:1500");

        ws.onopen = function () {
            // console.log("WebSocket connected");
            updateConnectionStatus(true);
            clearInterval(reconnectInterval);
        };

        ws.onmessage = function (event) {
            try {
                const data = JSON.parse(event.data);
                if (data.IP) {
                    currentIP = data.IP;
                    updateIP(data.IP);
                    updateLastUpdate();
                }
            } catch (error) {
                console.error("Error parsing WebSocket data:", error);
            }
        };

        ws.onclose = function () {
            // console.log("WebSocket disconnected");
            updateConnectionStatus(false);
            // Tự động kết nối lại sau 5 giây
            reconnectInterval = setInterval(connectWebSocket, 5000);
        };

        ws.onerror = function (error) {
            console.error("WebSocket error:", error);
            updateConnectionStatus(false);
        };
    } catch (error) {
        console.error("Failed to connect WebSocket:", error);
        updateConnectionStatus(false);
        reconnectInterval = setInterval(connectWebSocket, 5000);
    }
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
    if (ws) {
        ws.close();
    }
    clearInterval(reconnectInterval);

    // Hiển thị trạng thái đang kết nối
    const statusElement = document.getElementById("connection-status");
    statusElement.className = "status disconnected";
    statusElement.innerHTML = '<div class="status-dot"></div><span>Đang kết nối lại...</span>';

    setTimeout(connectWebSocket, 1000);
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

// Khởi tạo kết nối khi trang load
window.addEventListener("load", function () {
    connectWebSocket();
    loadDomainCount();
});

// Xử lý khi tab/window bị ẩn và hiện lại
document.addEventListener("visibilitychange", function () {
    if (!document.hidden && (!ws || ws.readyState !== WebSocket.OPEN)) {
        refreshConnection();
    }
});
