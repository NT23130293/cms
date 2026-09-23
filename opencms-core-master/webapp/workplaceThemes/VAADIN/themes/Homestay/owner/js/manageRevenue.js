const DBManager = (function() {
    const dbName = "DashboardImagesDB";
    const storeName = "images";
    let db;

    const mockImages = [
        {
            id: 'dashboard-main-img',
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDIyYzIyIi8+PHBhdGggZD0iTTAgMjAwIEwxNTAgMTAwIEwzMDAgMTgwIEw1MDAgODAgTDgwMCAyNTAgTDgwMCA0MDAgTDAgNDAwIFoiIGZpbGw9IiMwNjRlM2IiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgdGV4dC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzJweCIgZmlsbD0iI2FhYWFhYSI+TUFJIENIw4JVIExBTkRTQ0FQRTwvdGV4dD48L3N2Zz4='
        },
        {
            id: 'room1-img',
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2JkNWUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwcHgiIGZpbGw9IiM0NzU1NjkiPlJPT00gMTwvdGV4dD48L3N2Zz4='
        },
        {
            id: 'room2-img',
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOTRjM2I4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwcHgiIGZpbGw9IiNmOGZhZmMiPlJPT00gMjwvdGV4dD48L3N2Zz4='
        }
    ];

    function initDB() {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: "id" });
            }
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            storeInitialData();
        };

        request.onerror = function(event) {
            console.error("Lỗi khi mở IndexedDB:", event.target.error);
        };
    }

    function storeInitialData() {
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);

        mockImages.forEach(img => {
            const request = objectStore.put(img);
            request.onerror = () => console.error("Lỗi khi lưu ảnh:", img.id);
        });

        transaction.oncomplete = function() {
            loadImagesToDOM();
        };
    }

    function loadImagesToDOM() {
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const results = event.target.result;
            results.forEach(imgData => {
                const imgElement = document.getElementById(imgData.id);
                if (imgElement) {
                    imgElement.src = imgData.src;
                }
            });
        };
    }

    return {
        init: initDB
    };
})();

// ===================== DỮ LIỆU & QUẢN LÝ GIAO DỊCH =====================
const transactionData = [
    {
        id: "#TX-8403",
        timestamp: "2026-09-28T09:35:00",
        timeDisplay: "28/09/2026<br>09:35",
        customer: "Hoàng Thu Thảo",
        detail: "Bungalow Ven Suối (2 đêm)",
        type: "Cọc booking 50%",
        typeClass: "border-blue-200 bg-sky-50 text-sky-700",
        channelIcon: "qr_code_scanner",
        channelIconClass: "text-secondary",
        channelName: "Chuyển khoản VietQR",
        amount: 2850000,
        amountDisplay: "+2.850.000đ",
        amountClass: "text-secondary",
        status: "Đã vào MB Bank",
        statusClass: "bg-secondary-container text-on-secondary-container",
        statusIcon: "check_circle"
    },
    {
        id: "#TX-8404",
        timestamp: "2026-09-27T20:15:00",
        timeDisplay: "27/09/2026<br>20:15",
        customer: "Đoàn Phượt Trần Vũ",
        detail: "Nhà Sàn + Mâm Lợn Bản",
        type: "Thanh toán tại quầy",
        typeClass: "border-blue-200 bg-sky-50 text-sky-700",
        channelIcon: "payments",
        channelIconClass: "text-amber-600",
        channelName: "Tiền mặt lễ tân",
        amount: 7420000,
        amountDisplay: "+7.420.000đ",
        amountClass: "text-secondary",
        status: "Thu ngân nộp két",
        statusClass: "bg-emerald-100 text-emerald-900",
        statusIcon: "check_circle"
    },
    {
        id: "#TX-8405",
        timestamp: "2026-09-27T14:00:00",
        timeDisplay: "27/09/2026<br>14:00",
        customer: "Booking.com Batch #44",
        detail: "Đối soát định kỳ sàn OTA",
        type: "Tiền hoàn sàn OTA",
        typeClass: "border-orange-200 bg-orange-50 text-orange-700",
        channelIcon: "account_balance",
        channelIconClass: "text-blue-600",
        channelName: "Ví Sàn Booking.com",
        amount: 18350000,
        amountDisplay: "+18.350.000đ",
        amountClass: "text-secondary",
        status: "Đã quyết toán MB Bank",
        statusClass: "bg-secondary-container text-on-secondary-container",
        statusIcon: "check_circle"
    },
    {
        id: "#TX-8402",
        timestamp: "2026-09-26T15:40:00",
        timeDisplay: "26/09/2026<br>15:40",
        customer: "Gia đình anh David Miller",
        detail: "Mountain View 201 + Tour suối",
        type: "Cọc booking 50%",
        typeClass: "border-blue-200 bg-sky-50 text-sky-700",
        channelIcon: "credit_card",
        channelIconClass: "text-on-surface-variant",
        channelName: "Agoda Virtual Card",
        amount: 3600000,
        amountDisplay: "+3.600.000đ",
        amountClass: "text-blue-600",
        status: "Chờ sao kê thẻ (Check-in)",
        statusClass: "bg-sky-100 text-sky-900",
        statusIcon: "schedule"
    },
    {
        id: "#TX-8406",
        timestamp: "2026-09-26T11:20:00",
        timeDisplay: "26/09/2026<br>11:20",
        customer: "Lê Quỳnh Mai",
        detail: "Garden View 102",
        type: "Thanh toán tại quầy",
        typeClass: "border-blue-200 bg-sky-50 text-sky-700",
        channelIcon: "qr_code_scanner",
        channelIconClass: "text-secondary",
        channelName: "Chuyển khoản VietQR",
        amount: 1650000,
        amountDisplay: "+1.650.000đ",
        amountClass: "text-secondary",
        status: "Đã vào MB Bank",
        statusClass: "bg-secondary-container text-on-secondary-container",
        statusIcon: "check_circle"
    }
];

let currentSortOption = "newest"; // "newest", "oldest", "highest", "lowest"
let searchQuery = "";

function renderTransactions() {
    const tbody = document.getElementById("transaction-tbody");
    if (!tbody) return;

    // Lọc theo ô tìm kiếm
    let filtered = transactionData.filter(tx => {
        const q = searchQuery.toLowerCase();
        return tx.id.toLowerCase().includes(q) ||
            tx.customer.toLowerCase().includes(q) ||
            tx.detail.toLowerCase().includes(q);
    });

    // Sắp xếp
    filtered.sort((a, b) => {
        if (currentSortOption === "newest") {
            return new Date(b.timestamp) - new Date(a.timestamp);
        } else if (currentSortOption === "oldest") {
            return new Date(a.timestamp) - new Date(b.timestamp);
        } else if (currentSortOption === "highest") {
            return b.amount - a.amount;
        } else if (currentSortOption === "lowest") {
            return a.amount - b.amount;
        }
        return 0;
    });

    tbody.innerHTML = filtered.map(tx => `
        <tr class="hover:bg-surface-container-low/50 transition-colors">
          <td class="py-3.5 px-4 font-bold text-primary">${tx.id}</td>
          <td class="py-3.5 px-4 font-body-sm text-on-surface-variant">${tx.timeDisplay}</td>
          <td class="py-3.5 px-4">
            <strong class="font-label-lg text-on-surface block">${tx.customer}</strong>
            <span class="font-body-sm text-on-surface-variant">${tx.detail}</span>
          </td>
          <td class="py-3.5 px-4">
            <span class="px-2 py-0.5 rounded border ${tx.typeClass} font-label-sm text-[11px]">${tx.type}</span>
          </td>
          <td class="py-3.5 px-4">
            <div class="flex items-center gap-1.5 font-body-sm">
              <span class="material-symbols-outlined ${tx.channelIconClass} text-[16px]">${tx.channelIcon}</span>
              <span>${tx.channelName}</span>
            </div>
          </td>
          <td class="py-3.5 px-4 ${tx.amountClass} font-bold">${tx.amountDisplay}</td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${tx.statusClass} font-label-md text-[11px]">
              <span class="material-symbols-outlined text-[14px]">${tx.statusIcon}</span> ${tx.status}
            </span>
          </td>
        </tr>
    `).join("");

    const countDisplay = document.getElementById("tx-count-display");
    if (countDisplay) countDisplay.innerText = filtered.length;
}

// ===================== BỘ LỌC THỜI GIAN (DYNAMICS) =====================
const FilterState = {
    mode: 'month_year', // 'month_year' | 'quarter_year' | 'calendar'
    month: 9,
    quarter: 3,
    year: 2026,
    customDate: ''
};

function initTimeFilterControls() {
    const btnToggleMonth = document.getElementById("btn-toggle-month");
    const btnToggleQuarter = document.getElementById("btn-toggle-quarter");
    const btnToggleYear = document.getElementById("btn-toggle-year");
    const btnToggleCalendar = document.getElementById("btn-toggle-calendar");

    const selectMonth = document.getElementById("select-month");
    const selectQuarter = document.getElementById("select-quarter");
    const selectYear = document.getElementById("select-year");
    const inputCustomDate = document.getElementById("input-custom-date");

    if (!btnToggleMonth || !selectMonth || !selectQuarter || !selectYear) return;

    // 1. Tạo danh sách 12 Tháng
    selectMonth.innerHTML = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1;
        const padStr = m < 10 ? `0${m}` : `${m}`;
        return `<option value="${m}" ${m === FilterState.month ? 'selected' : ''}>Tháng ${padStr}</option>`;
    }).join("");

    // 2. Tạo danh sách 10 Năm gần nhất
    const currentYear = new Date().getFullYear();
    let yearsHTML = "";
    for (let i = 0; i < 10; i++) {
        const y = currentYear - i;
        yearsHTML += `<option value="${y}" ${y === FilterState.year ? 'selected' : ''}>Năm ${y}</option>`;
    }
    selectYear.innerHTML = yearsHTML;

    // Cập nhật trạng thái giao diện Nút Bật/Tắt
    function updateUIState() {
        const parentMonth = btnToggleMonth.parentElement;
        const parentQuarter = btnToggleQuarter.parentElement;
        const parentYear = btnToggleYear.parentElement;

        if (FilterState.mode === 'month_year') {
            // Tháng & Năm
            btnToggleMonth.className = "px-3 py-1.5 text-label-md font-label-md bg-primary text-on-primary transition-colors flex items-center gap-1";
            parentMonth.classList.remove("opacity-60");
            selectMonth.disabled = false;

            btnToggleQuarter.className = "px-3 py-1.5 text-label-md font-label-md text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-1";
            parentQuarter.classList.add("opacity-60");
            selectQuarter.disabled = true;

            btnToggleYear.className = "px-3 py-1.5 text-label-md font-label-md bg-primary text-on-primary transition-colors flex items-center gap-1";
            parentYear.classList.remove("opacity-60");
            selectYear.disabled = false;

            btnToggleCalendar.className = "px-3 py-1.5 text-on-surface-variant rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center border border-outline-variant/40 bg-surface";
        }
        else if (FilterState.mode === 'quarter_year') {
            // Quý & Năm
            btnToggleMonth.className = "px-3 py-1.5 text-label-md font-label-md text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-1";
            parentMonth.classList.add("opacity-60");
            selectMonth.disabled = true;

            btnToggleQuarter.className = "px-3 py-1.5 text-label-md font-label-md bg-primary text-on-primary transition-colors flex items-center gap-1";
            parentQuarter.classList.remove("opacity-60");
            selectQuarter.disabled = false;

            btnToggleYear.className = "px-3 py-1.5 text-label-md font-label-md bg-primary text-on-primary transition-colors flex items-center gap-1";
            parentYear.classList.remove("opacity-60");
            selectYear.disabled = false;

            btnToggleCalendar.className = "px-3 py-1.5 text-on-surface-variant rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center border border-outline-variant/40 bg-surface";
        }
        else if (FilterState.mode === 'calendar') {
            // Bỏ hết Tháng/Quý/Năm
            btnToggleMonth.className = "px-3 py-1.5 text-label-md font-label-md text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-1";
            parentMonth.classList.add("opacity-60");
            selectMonth.disabled = true;

            btnToggleQuarter.className = "px-3 py-1.5 text-label-md font-label-md text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-1";
            parentQuarter.classList.add("opacity-60");
            selectQuarter.disabled = true;

            btnToggleYear.className = "px-3 py-1.5 text-label-md font-label-md text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-1";
            parentYear.classList.add("opacity-60");
            selectYear.disabled = true;

            btnToggleCalendar.className = "px-3 py-1.5 bg-primary text-on-primary rounded-lg transition-colors flex items-center justify-center shadow-sm";
        }

        applyFilterAndRefreshData();
    }

    // Sự kiện tương tác Nút
    btnToggleMonth.addEventListener("click", () => {
        FilterState.mode = 'month_year';
        updateUIState();
    });

    btnToggleQuarter.addEventListener("click", () => {
        FilterState.mode = 'quarter_year';
        updateUIState();
    });

    btnToggleYear.addEventListener("click", () => {
        if (FilterState.mode === 'calendar') {
            FilterState.mode = 'month_year';
        }
        updateUIState();
    });

    btnToggleCalendar.addEventListener("click", () => {
        FilterState.mode = 'calendar';
        updateUIState();
        if (inputCustomDate) {
            inputCustomDate.showPicker ? inputCustomDate.showPicker() : inputCustomDate.click();
        }
    });

    // Sự kiện Select Change
    selectMonth.addEventListener("change", (e) => {
        FilterState.month = parseInt(e.target.value);
        FilterState.mode = 'month_year';
        updateUIState();
    });

    selectQuarter.addEventListener("change", (e) => {
        FilterState.quarter = parseInt(e.target.value);
        FilterState.mode = 'quarter_year';
        updateUIState();
    });

    selectYear.addEventListener("change", (e) => {
        FilterState.year = parseInt(e.target.value);
        updateUIState();
    });

    if (inputCustomDate) {
        inputCustomDate.addEventListener("change", (e) => {
            FilterState.customDate = e.target.value;
            applyFilterAndRefreshData();
        });
    }

    updateUIState();
}

function applyFilterAndRefreshData() {
    let displayText = "";
    let chartTitle = "";

    if (FilterState.mode === 'month_year') {
        const mStr = FilterState.month < 10 ? `0${FilterState.month}` : FilterState.month;
        displayText = `Tháng ${mStr}/${FilterState.year}`;
        chartTitle = `Diễn biến doanh thu Tháng ${mStr}/${FilterState.year}`;
    } else if (FilterState.mode === 'quarter_year') {
        displayText = `Quý ${FilterState.quarter}/${FilterState.year}`;
        chartTitle = `Diễn biến doanh thu Quý ${FilterState.quarter}/${FilterState.year}`;
    } else if (FilterState.mode === 'calendar') {
        if (FilterState.customDate) {
            const parts = FilterState.customDate.split('-');
            const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            displayText = `Ngày ${formattedDate}`;
            chartTitle = `Diễn biến doanh thu ngày ${formattedDate}`;
        } else {
            displayText = `Thời gian tùy chỉnh (Lịch)`;
            chartTitle = `Diễn biến doanh thu theo lịch`;
        }
    }

    // Cập nhật tiêu đề báo cáo & đồ thị
    const filterDisplayTextEl = document.getElementById("filter-display-text");
    const chartMainTitleEl = document.getElementById("chart-main-title");
    if (filterDisplayTextEl) filterDisplayTextEl.innerText = displayText;
    if (chartMainTitleEl) chartMainTitleEl.innerText = chartTitle;

    // Giả lập cập nhật số liệu theo thời gian chọn
    const seed = (FilterState.month * 7) + (FilterState.quarter * 13) + (FilterState.year % 100);
    const mockTotal = (100 + (seed % 50)) * 1000000;
    const mockRoom = Math.round(mockTotal * 0.64);
    const mockService = mockTotal - mockRoom;

    const totalEl = document.getElementById("stat-total-revenue");
    const roomEl = document.getElementById("stat-room-revenue");
    const serviceEl = document.getElementById("stat-service-revenue");

    if (totalEl) totalEl.innerHTML = `${mockTotal.toLocaleString('vi-VN')}<span class="currency text-xl">đ</span>`;
    if (roomEl) roomEl.innerHTML = `${mockRoom.toLocaleString('vi-VN')}<span class="currency text-xl">đ</span>`;
    if (serviceEl) serviceEl.innerHTML = `${mockService.toLocaleString('vi-VN')}<span class="currency text-xl">đ</span>`;
}

// ===================== KHỞI TẠO BỘ LỌC BẢNG LỊCH SỬ GIAO DỊCH =====================
function initTransactionFilter() {
    const btnToggle = document.getElementById("btn-tx-filter-toggle");
    const dropdown = document.getElementById("tx-filter-dropdown");
    const filterLabel = document.getElementById("tx-filter-label");
    const searchInput = document.getElementById("input-search-tx");

    if (!btnToggle || !dropdown) return;

    btnToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
        dropdown.classList.add("hidden");
    });

    const labelsMap = {
        newest: "Gần nhất (thời gian)",
        oldest: "Lâu nhất (thời gian)",
        highest: "Nhiều nhất (giá trị tiền)",
        lowest: "Thấp nhất (giá trị tiền)"
    };

    const optButtons = dropdown.querySelectorAll(".tx-sort-opt");
    optButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const sortType = btn.getAttribute("data-sort");
            currentSortOption = sortType;
            if (filterLabel) filterLabel.innerText = labelsMap[sortType];

            // Cập nhật trạng thái active
            optButtons.forEach(b => {
                b.className = "tx-sort-opt w-full text-left px-4 py-2 text-label-md hover:bg-surface-container flex items-center justify-between text-on-surface";
                b.innerHTML = labelsMap[b.getAttribute("data-sort")];
            });

            btn.className = "tx-sort-opt w-full text-left px-4 py-2 text-label-md hover:bg-surface-container flex items-center justify-between text-primary font-bold";
            btn.innerHTML = `${labelsMap[sortType]} <span class="material-symbols-outlined text-[16px]">check</span>`;

            dropdown.classList.add("hidden");
            renderTransactions();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.trim();
            renderTransactions();
        });
    }
}

// Khởi chạy khi load DOM
document.addEventListener("DOMContentLoaded", function() {
    DBManager.init();
    initTimeFilterControls();
    initTransactionFilter();
    renderTransactions();
});
// ===================== XỬ LÝ HOVER HIỂN THỊ SỐ LIỆU TRÊN BIỂU ĐỒ =====================
function initChartHoverEffect() {
    const svg = document.getElementById('revenue-chart-svg');
    const hoverLine = document.getElementById('chart-hover-line');
    const hoverDot = document.getElementById('chart-hover-dot');
    const tooltip = document.getElementById('chart-tooltip');
    const tooltipValue = document.getElementById('tooltip-value');

    if (!svg || !hoverLine || !hoverDot || !tooltip) return;

    // Lấy đường path biểu đồ
    const path = svg.querySelectorAll('path')[1];
    const pathLength = path.getTotalLength();

    // Tính toán tọa độ Y và Giá trị tương ứng dựa vào vị trí X
    function getPointAtX(xTarget) {
        let start = 0;
        let end = pathLength;
        let targetPoint = path.getPointAtLength(0);

        // Binary search để tìm vị trí điểm trên Path tương ứng với X
        while (start <= end) {
            const mid = (start + end) / 2;
            const pt = path.getPointAtLength(mid);
            if (Math.abs(pt.x - xTarget) < 0.5) {
                targetPoint = pt;
                break;
            }
            if (pt.x < xTarget) start = mid + 1;
            else end = mid - 1;
        }

        // Qui đổi chiều cao Y (220px) ra số tiền tương ứng (0 - 10 triệu)
        const maxValue = 10000000;
        const chartHeight = 220;
        const calculatedValue = Math.round((1 - (targetPoint.y / chartHeight)) * maxValue);

        return {
            x: targetPoint.x,
            y: targetPoint.y,
            value: Math.max(0, calculatedValue)
        };
    }

    svg.addEventListener('mousemove', (e) => {
        const rect = svg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        // Qui đổi tọa độ pixel ra tọa độ viewBox (1000px)
        const svgX = (mouseX / rect.width) * 1000;

        if (svgX >= 0 && svgX <= 1000) {
            const point = getPointAtX(svgX);

            // Cập nhật vị trí đường dóng & chấm tròn
            hoverLine.setAttribute('x1', point.x);
            hoverLine.setAttribute('x2', point.x);
            hoverDot.setAttribute('cx', point.x);
            hoverDot.setAttribute('cy', point.y);

            // Cập nhật Tooltip
            const pixelX = (point.x / 1000) * rect.width;
            const pixelY = (point.y / 220) * rect.height;

            tooltip.style.left = `${pixelX}px`;
            tooltip.style.top = `${pixelY}px`;
            tooltipValue.innerText = `${point.value.toLocaleString('vi-VN')}đ`;

            // Hiển thị các phần tử
            hoverLine.classList.remove('opacity-0');
            hoverDot.classList.remove('opacity-0');
            tooltip.classList.remove('opacity-0');
        }
    });

    svg.addEventListener('mouseleave', () => {
        hoverLine.classList.add('opacity-0');
        hoverDot.classList.add('opacity-0');
        tooltip.classList.add('opacity-0');
    });
}

document.addEventListener("DOMContentLoaded", function() {
    initChartHoverEffect();
});