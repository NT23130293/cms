const DB_NAME = "HomestayDB";
const DB_VERSION = 1;
let db;

// ==========================================
// 1. CÁC HÀM XỬ LÝ INDEXEDDB
// ==========================================
function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function (event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains("bookings")) {
                db.createObjectStore("bookings", { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = function (event) {
            reject(event.target.errorCode);
        };
    });
}

function addData(storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.add(data);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

function getAllData(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

// Khởi tạo dữ liệu mẫu với ngày tháng thực tế để lọc
async function seedInitialData() {
    const bookings = await getAllData("bookings");
    if (bookings.length === 0) {
        const initialBookings = [
            { customerName: "Nguyễn Thị Mai", avatar: "https://i.pravatar.cc/80?img=47", room: "Garden View", checkIn: "2026-09-17", checkOut: "2026-09-20", status: "Đã đặt", statusClass: "status-blue", price: 2850000 },
            { customerName: "Lê Văn Hiếu", avatar: "https://i.pravatar.cc/80?img=12", room: "Lake View", checkIn: "2026-09-16", checkOut: "2026-09-18", status: "Đang ở", statusClass: "status-green", price: 2200000 },
            { customerName: "Phạm Thị Lan", avatar: "https://i.pravatar.cc/80?img=33", room: "Mountain View", checkIn: "2026-09-20", checkOut: "2026-09-22", status: "Đã đặt", statusClass: "status-blue", price: 3100000 },
            { customerName: "Trần Quốc Bảo", avatar: "https://i.pravatar.cc/80?img=15", room: "Garden View", checkIn: "2026-09-13", checkOut: "2026-09-15", status: "Đã trả", statusClass: "status-orange", price: 2650000 },
            { customerName: "Hoàng Minh Anh", avatar: "https://i.pravatar.cc/80?img=5", room: "Lake View", checkIn: "2026-09-12", checkOut: "2026-09-14", status: "Đã trả", statusClass: "status-orange", price: 2400000 },
            { customerName: "Vũ Thị Yến", avatar: "https://i.pravatar.cc/80?img=9", room: "Mountain View", checkIn: "2026-09-25", checkOut: "2026-09-27", status: "Đã đặt", statusClass: "status-blue", price: 3500000 }
        ];

        for (const b of initialBookings) {
            await addData("bookings", b);
        }
    }
}

// ==========================================
// 2. CÁC HÀM TIỆN ÍCH & RENDER DỮ LIỆU
// ==========================================
function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

// Chuyển đổi YYYY-MM-DD sang định dạng DD/MM - DD/MM
function formatDateRange(checkIn, checkOut) {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    const inStr = `${String(inDate.getDate()).padStart(2, '0')}/${String(inDate.getMonth() + 1).padStart(2, '0')}`;
    const outStr = `${String(outDate.getDate()).padStart(2, '0')}/${String(outDate.getMonth() + 1).padStart(2, '0')}`;

    return `${inStr} - ${outStr}`;
}

function renderBookings(bookings) {
    const tbody = document.querySelector(".booking-table tbody");
    if (!tbody) return;
    tbody.innerHTML = ""; // Xóa dữ liệu cũ

    if (bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 15px;">Không có dữ liệu trong khoảng thời gian này.</td></tr>`;
        return;
    }

    bookings.forEach(booking => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div class="customer">
                    <img src="${booking.avatar}" alt="avatar">
                    ${booking.customerName}
                </div>
            </td>
            <td>${booking.room}</td>
            <td>${formatDateRange(booking.checkIn, booking.checkOut)}</td>
            <td><span class="status ${booking.statusClass}">${booking.status}</span></td>
            <td class="price">${formatCurrency(booking.price)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderUpcoming(bookings) {
    const container = document.querySelector(".upcoming-list");
    if (!container) return;
    container.innerHTML = "";

    // Chỉ lấy những người "Đã đặt" (sắp tới) để hiển thị ở cột giữa
    const upcomingBookings = bookings.filter(b => b.status === "Đã đặt" || b.status === "Đang ở");

    upcomingBookings.slice(0, 4).forEach(booking => {
        const div = document.createElement("div");
        div.className = "upcoming-item";
        div.innerHTML = `
            <img src="${booking.avatar.replace('80', '150')}">
            <div class="upcoming-info">
                <strong>${booking.customerName}</strong>
                <span>Phòng ${booking.room}</span>
                <small>${formatDateRange(booking.checkIn, booking.checkOut)}</small>
            </div>
            <div class="upcoming-right">
                <span class="status ${booking.statusClass}">${booking.status}</span>
                <strong>${formatCurrency(booking.price)}</strong>
            </div>
        `;
        container.appendChild(div);
    });
}

// ==========================================
// 3. LOGIC LỌC DỮ LIỆU THEO NGÀY
// ==========================================
function initDateFilter() {
    const dateInput = document.getElementById("bookingDateFilter");
    const resetBtn = document.getElementById("resetFilterBtn");

    if (!dateInput) return;

    // Lọc khi người dùng đổi ngày
    dateInput.addEventListener("change", async function() {
        const selectedDate = this.value; // YYYY-MM-DD
        const allBookings = await getAllData("bookings");

        if (!selectedDate) {
            renderBookings(allBookings);
            return;
        }

        // Lọc những booking mà ngày được chọn nằm trong khoảng CheckIn - CheckOut
        const filtered = allBookings.filter(b => {
            const checkIn = new Date(b.checkIn);
            const checkOut = new Date(b.checkOut);
            const selected = new Date(selectedDate);

            // Xóa giờ để so sánh ngày chính xác
            checkIn.setHours(0,0,0,0);
            checkOut.setHours(0,0,0,0);
            selected.setHours(0,0,0,0);

            return selected >= checkIn && selected <= checkOut;
        });

        renderBookings(filtered);
    });

    // Reset lại toàn bộ danh sách khi nhấn nút "Tất cả"
    if (resetBtn) {
        resetBtn.addEventListener("click", async function() {
            dateInput.value = "";
            const allBookings = await getAllData("bookings");
            renderBookings(allBookings);
        });
    }
}

// ==========================================
// 4. CÁC HÀM GỐC TỪ GIAO DIỆN
// ==========================================
function initRevenueChart() {
    const canvas = document.getElementById("revenueChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(21, 139, 102, 0.25)");
    gradient.addColorStop(1, "rgba(21, 139, 102, 0.02)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["11/09", "12/09", "13/09", "14/09", "15/09", "16/09", "17/09"],
            datasets: [{
                label: "Doanh thu",
                data: [3500000, 7000000, 5800000, 8200000, 11200000, 10500000, 15000000],
                borderColor: "#168B66",
                backgroundColor: gradient,
                borderWidth: 2,
                pointBackgroundColor: "#168B66",
                pointBorderColor: "#FFFFFF",
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: "index" },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "rgba(12, 76, 59, 0.95)",
                    titleColor: "#FFFFFF",
                    bodyColor: "#FFFFFF",
                    displayColors: false,
                    padding: 10,
                    cornerRadius: 7,
                    callbacks: {
                        label: function (context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, border: { display: false }, ticks: { color: "#8B9994", font: { size: 9 } } },
                y: {
                    beginAtZero: true, suggestedMax: 20000000, border: { display: false }, grid: { color: "#EDF2F0" },
                    ticks: {
                        stepSize: 5000000, color: "#8B9994", font: { size: 9 },
                        callback: function (value) {
                            if (value === 0) return "0";
                            return (value / 1000000) + "tr";
                        }
                    }
                }
            }
        }
    });
}

function initPagination() {
    const buttons = document.querySelectorAll(".pagination button");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const value = this.textContent.trim();
            if (value === "" || this.querySelector(".material-symbols-outlined")) return;
            buttons.forEach(item => item.classList.remove("active"));
            this.classList.add("active");
        });
    });
}

function initQuickActions() {
    const buttons = document.querySelectorAll(".quick-actions button");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const action = this.textContent.trim();
            if (action.includes("Thêm phòng")) window.location.href = "manageRoom.html";
            else if (action.includes("Thêm dịch vụ")) window.location.href = "managaService.html";
            else if (action.includes("Tạo mã giảm giá")) window.location.href = "manageDiscount.html";
            else if (action.includes("Thêm nhiệm vụ")) window.location.href = "manageMission.html";
        });
    });
}

// ==========================================
// 5. CHẠY KHI TẢI TRANG
// ==========================================
document.addEventListener("DOMContentLoaded", async function () {
    // 1. Khởi tạo DB & Load dữ liệu mẫu
    await initIndexedDB();
    await seedInitialData();

    // 2. Lấy dữ liệu và hiển thị lên UI
    const allBookings = await getAllData("bookings");
    renderBookings(allBookings);
    renderUpcoming(allBookings);

    // 3. Kích hoạt bộ lọc theo ngày
    initDateFilter();

    // 4. Kích hoạt các UI khác
    initRevenueChart();
    initPagination();
    initQuickActions();
});