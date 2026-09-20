// ==========================================================================
// YÊN HOMESTAY ADMIN - VOUCHER & DISCOUNT MANAGEMENT JAVASCRIPT
// File: opencms-core-master/.../admin/JS/voucher_management.js
// Mục: 4.8 Quản lý mã giảm giá (Tạo, Sửa, Chi tiết, Lọc, Thao tác nhanh)
// ==========================================================================

// Danh sách dữ liệu mẫu Mã giảm giá
let vouchersList = [
    {
        id: 1,
        code: 'YENWELCOME',
        name: 'Chào mừng Du Khách Mới Đăng Ký',
        discountType: 'percent', // 'percent' hoặc 'fixed'
        discountVal: 15,
        maxDiscount: '150.000đ',
        minOrder: '500.000đ',
        usedCount: 1250,
        totalLimit: 2000,
        limitPerUser: 1,
        startDate: '01/09/2026',
        endDate: '31/12/2026',
        status: 'active', // 'active', 'scheduled', 'expired', 'paused'
        statusText: 'Đang hoạt động',
        targetAudience: 'Khách hàng mới',
        region: 'Tất cả khu vực',
        description: 'Ưu đãi dành cho thành viên mới lần đầu đặt phòng homestay trên hệ thống YÊN.',
        stats: {
            totalSubsidized: '142.500.000đ',
            totalGmv: '950.000.000đ',
            conversionRate: '88.4%'
        },
        redemptions: [
            { orderId: '#BK-8842', user: 'Lê Hoàng Long', homestay: 'Pù Luông Eco Lodge', total: '1.700.000đ', discount: '150.000đ', time: '5 phút trước' },
            { orderId: '#BK-8835', user: 'Phạm Thu Trang', homestay: 'Nhà Sàn Mộc Mai Châu', total: '1.200.000đ', discount: '150.000đ', time: '2 giờ trước' },
            { orderId: '#BK-8829', user: 'Bùi Hải Đăng', homestay: 'Mộc Châu Bamboo Bungalow', total: '850.000đ', discount: '127.500đ', time: '4 giờ trước' },
            { orderId: '#BK-8812', user: 'Vũ Thanh Thảo', homestay: 'Sa Pa Terraces Valley', total: '2.100.000đ', discount: '150.000đ', time: 'Hôm qua' },
            { orderId: '#BK-8798', user: 'Nguyễn Tấn Đạt', homestay: 'Đà Lạt Cloud Valley', total: '980.000đ', discount: '147.000đ', time: 'Hôm qua' }
        ]
    },
    {
        id: 2,
        code: 'PULUONG2026',
        name: 'Mùa Vàng Ruộng Bậc Thang Pù Luông',
        discountType: 'fixed',
        discountVal: 100000,
        maxDiscount: '100.000đ',
        minOrder: '700.000đ',
        usedCount: 480,
        totalLimit: 500,
        limitPerUser: 1,
        startDate: '15/09/2026',
        endDate: '30/10/2026',
        status: 'active',
        statusText: 'Đang hoạt động',
        targetAudience: 'Tất cả khách hàng',
        region: 'Pù Luông',
        description: 'Giảm trực tiếp 100.000đ cho tất cả homestay tại thung lũng bản Đôn, Pù Luông mùa lúa chín.',
        stats: {
            totalSubsidized: '48.000.000đ',
            totalGmv: '412.000.000đ',
            conversionRate: '96.0%'
        },
        redemptions: [
            { orderId: '#BK-8840', user: 'Đỗ Minh Quân', homestay: 'Pù Luông Eco Lodge', total: '1.450.000đ', discount: '100.000đ', time: '42 phút trước' },
            { orderId: '#BK-8818', user: 'Trần Văn Huy', homestay: 'Bản Đôn Retreat', total: '950.000đ', discount: '100.000đ', time: '3 giờ trước' },
            { orderId: '#BK-8790', user: 'Ngô Mỹ Linh', homestay: 'Pù Luông Treehouse', total: '1.800.000đ', discount: '100.000đ', time: 'Hôm qua' }
        ]
    },
    {
        id: 3,
        code: 'MAICHAU50K',
        name: 'Trải Nghiệm Văn Hóa Bản Lác Mai Châu',
        discountType: 'fixed',
        discountVal: 50000,
        maxDiscount: '50.000đ',
        minOrder: '400.000đ',
        usedCount: 310,
        totalLimit: 600,
        limitPerUser: 2,
        startDate: '01/09/2026',
        endDate: '15/11/2026',
        status: 'active',
        statusText: 'Đang hoạt động',
        targetAudience: 'Tất cả khách hàng',
        region: 'Mai Châu',
        description: 'Trợ giá phòng nghỉ nhà sàn truyền thống Thái trắng tại thung lũng Mai Châu.',
        stats: {
            totalSubsidized: '15.500.000đ',
            totalGmv: '198.000.000đ',
            conversionRate: '78.2%'
        },
        redemptions: [
            { orderId: '#BK-8841', user: 'Nguyễn Thảo Ly', homestay: 'Nhà Sàn Mộc Mai Châu', total: '650.000đ', discount: '50.000đ', time: '18 phút trước' },
            { orderId: '#BK-8822', user: 'Dương Tuấn Khang', homestay: 'Mai Châu Green Lodge', total: '800.000đ', discount: '50.000đ', time: 'Hôm qua' }
        ]
    },
    {
        id: 4,
        code: 'VIPSTAY',
        name: 'Tri Ân Khách Hàng VIP Thân Thiết',
        discountType: 'percent',
        discountVal: 20,
        maxDiscount: '300.000đ',
        minOrder: '1.000.000đ',
        usedCount: 85,
        totalLimit: 100,
        limitPerUser: 1,
        startDate: '01/08/2026',
        endDate: '31/12/2026',
        status: 'active',
        statusText: 'Đang hoạt động',
        targetAudience: 'Thành viên VIP',
        region: 'Tất cả khu vực',
        description: 'Dành riêng cho khách hàng đã đặt phòng từ 3 lần trở lên trên hệ sinh thái YÊN.',
        stats: {
            totalSubsidized: '23.800.000đ',
            totalGmv: '145.000.000đ',
            conversionRate: '94.5%'
        },
        redemptions: [
            { orderId: '#BK-8839', user: 'Trần Ánh Tuyết', homestay: 'Mộc Châu Bamboo Bungalow', total: '1.500.000đ', discount: '300.000đ', time: '1 giờ trước' },
            { orderId: '#BK-8805', user: 'Lâm Khánh Chi', homestay: 'Sa Pa Terraces Valley', total: '2.800.000đ', discount: '300.000đ', time: 'Hôm qua' }
        ]
    },
    {
        id: 5,
        code: 'WEEKENDYEN',
        name: 'Cuối Tuần Thảnh Thơi Cùng Bản Làng',
        discountType: 'percent',
        discountVal: 10,
        maxDiscount: '100.000đ',
        minOrder: '600.000đ',
        usedCount: 850,
        totalLimit: 1000,
        limitPerUser: 1,
        startDate: '01/09/2026',
        endDate: '30/09/2026',
        status: 'active',
        statusText: 'Đang hoạt động',
        targetAudience: 'Tất cả khách hàng',
        region: 'Tất cả khu vực',
        description: 'Áp dụng cho các lượt lưu trú nhận phòng vào Thứ 6, Thứ 7 & Chủ Nhật hàng tuần.',
        stats: {
            totalSubsidized: '78.500.000đ',
            totalGmv: '820.000.000đ',
            conversionRate: '85.0%'
        },
        redemptions: [
            { orderId: '#BK-8830', user: 'Trương Gia Huy', homestay: 'Đà Lạt Cloud Valley', total: '1.100.000đ', discount: '100.000đ', time: '2 giờ trước' }
        ]
    },
    {
        id: 6,
        code: 'DIFF2026',
        name: 'Đại Tiệc Pháo Hoa DIFF Quốc Tế',
        discountType: 'fixed',
        discountVal: 200000,
        maxDiscount: '200.000đ',
        minOrder: '1.500.000đ',
        usedCount: 500,
        totalLimit: 500,
        limitPerUser: 1,
        startDate: '01/06/2026',
        endDate: '15/07/2026',
        status: 'expired',
        statusText: 'Hết hạn / Hết lượt',
        targetAudience: 'Tất cả khách hàng',
        region: 'Đà Nẵng & Hội An',
        description: 'Chiến dịch mùa hè lễ hội quốc tế DIFF 2026 (Đã kết thúc).',
        stats: {
            totalSubsidized: '100.000.000đ',
            totalGmv: '920.000.000đ',
            conversionRate: '100%'
        },
        redemptions: []
    },
    {
        id: 7,
        code: 'SAPAWINTER',
        name: 'Săn Mây & Mùa Tuyết Sa Pa 2026',
        discountType: 'percent',
        discountVal: 12,
        maxDiscount: '180.000đ',
        minOrder: '800.000đ',
        usedCount: 0,
        totalLimit: 500,
        limitPerUser: 1,
        startDate: '01/11/2026',
        endDate: '31/12/2026',
        status: 'scheduled',
        statusText: 'Đã lên lịch',
        targetAudience: 'Tất cả khách hàng',
        region: 'Sa Pa',
        description: 'Chương trình kích cầu du lịch mùa đông Sa Pa ngắm tuyết và săn mây Tả Van.',
        stats: {
            totalSubsidized: '0đ',
            totalGmv: '0đ',
            conversionRate: '0%'
        },
        redemptions: []
    },
    {
        id: 8,
        code: 'AUTUMNDALAT',
        name: 'Thu Vàng Đồi Cỏ Hồng Đà Lạt',
        discountType: 'fixed',
        discountVal: 80000,
        maxDiscount: '80.000đ',
        minOrder: '500.000đ',
        usedCount: 120,
        totalLimit: 400,
        limitPerUser: 1,
        startDate: '01/09/2026',
        endDate: '31/10/2026',
        status: 'paused',
        statusText: 'Tạm dừng',
        targetAudience: 'Tất cả khách hàng',
        region: 'Đà Lạt',
        description: 'Tạm ngưng phát hành do cần điều chỉnh lại ngân sách trợ giá các homestay đối tác.',
        stats: {
            totalSubsidized: '9.600.000đ',
            totalGmv: '72.000.000đ',
            conversionRate: '30.0%'
        },
        redemptions: []
    }
];

// Biến trạng thái hiện tại
let editingVoucherId = null;
let currentTab = 'vouchers';
let filterStatus = 'all';
let filterType = 'all';
let searchQuery = '';

// Khởi chạy
document.addEventListener('DOMContentLoaded', () => {
    initProfileDropdown();
    renderVouchersTable();
    updateStatCards();
    initFilters();
});

// Dropdown Profile
function initProfileDropdown() {
    const btn = document.getElementById('adminProfileBtn');
    const dropdown = document.getElementById('adminProfileDropdown');

    if (btn && dropdown) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
                btn.classList.remove('active');
                dropdown.classList.remove('show');
            }
        });
    }
}

// Khởi tạo bộ lọc tìm kiếm & dropdown
function initFilters() {
    const searchInput = document.getElementById('voucherSearchInput');
    const statusSelect = document.getElementById('voucherStatusFilter');
    const typeSelect = document.getElementById('voucherTypeFilter');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            searchQuery = this.value.toLowerCase().trim();
            renderVouchersTable();
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener('change', function () {
            filterStatus = this.value;
            renderVouchersTable();
        });
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', function () {
            filterType = this.value;
            renderVouchersTable();
        });
    }
}

// Cập nhật 4 thẻ KPI thống kê trên đầu trang
function updateStatCards() {
    const totalCount = vouchersList.length;
    const activeCount = vouchersList.filter(v => v.status === 'active').length;
    const totalUsed = vouchersList.reduce((sum, v) => sum + v.usedCount, 0);

    const statTotalElem = document.getElementById('statTotalVouchers');
    const statActiveElem = document.getElementById('statActiveVouchers');
    const statUsedElem = document.getElementById('statTotalUsed');

    if (statTotalElem) statTotalElem.innerText = totalCount;
    if (statActiveElem) statActiveElem.innerText = activeCount;
    if (statUsedElem) statUsedElem.innerText = totalUsed.toLocaleString('vi-VN');
}

// Render bảng danh sách mã giảm giá
function renderVouchersTable() {
    const tbody = document.getElementById('voucherTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filtered = vouchersList.filter(item => {
        const matchSearch = item.code.toLowerCase().includes(searchQuery) ||
            item.name.toLowerCase().includes(searchQuery) ||
            item.region.toLowerCase().includes(searchQuery);

        const matchStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchType = filterType === 'all' || item.discountType === filterType;

        return matchSearch && matchStatus && matchType;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 32px;">Không tìm thấy mã giảm giá nào phù hợp với điều kiện tìm kiếm.</td></tr>`;
        return;
    }

    filtered.forEach(item => {
        const tr = document.createElement('tr');

        // Mức giảm hiển thị
        let discountDisplay = '';
        if (item.discountType === 'percent') {
            discountDisplay = `
                <div class="discount-val-badge">
                    <span class="material-symbols-outlined" style="font-size: 16px;">percent</span>
                    <span>Giảm ${item.discountVal}%</span>
                </div>
                <div class="discount-condition-sub">Tối đa: ${item.maxDiscount}</div>
            `;
        } else {
            discountDisplay = `
                <div class="discount-val-badge">
                    <span class="material-symbols-outlined" style="font-size: 16px;">payments</span>
                    <span>Giảm ${item.maxDiscount}</span>
                </div>
                <div class="discount-condition-sub">Cố định tiền mặt</div>
            `;
        }

        // Thanh tiến độ quota lượt dùng
        const pctUsed = Math.min(100, Math.round((item.usedCount / item.totalLimit) * 100));
        let barClass = '';
        if (pctUsed >= 90) barClass = 'full';
        else if (pctUsed >= 60) barClass = 'high';

        // Nút toggle trạng thái
        let toggleIcon = item.status === 'active' ? 'pause_circle' : 'play_circle';
        let toggleTitle = item.status === 'active' ? 'Tạm dừng mã này' : 'Kích hoạt mã này';

        tr.innerHTML = `
            <td>
                <div class="voucher-code-badge" onclick="copyVoucherCode('${item.code}')" title="Nhấp để sao chép mã">
                    <span>${item.code}</span>
                    <span class="material-symbols-outlined copy-icon">content_copy</span>
                </div>
            </td>
            <td>
                <strong style="color: var(--text-main); font-size: 13.5px;">${item.name}</strong>
                <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
                    Khu vực: <strong>${item.region}</strong> • Đơn tối thiểu: <strong>${item.minOrder}</strong>
                </div>
            </td>
            <td>${discountDisplay}</td>
            <td>
                <div class="quota-progress-wrap">
                    <div class="quota-labels">
                        <span>${item.usedCount.toLocaleString('vi-VN')} / ${item.totalLimit.toLocaleString('vi-VN')}</span>
                        <span style="color: ${pctUsed >= 90 ? '#DC2626' : '#64748B'};">${pctUsed}%</span>
                    </div>
                    <div class="quota-bar-track">
                        <div class="quota-bar-fill ${barClass}" style="width: ${pctUsed}%;"></div>
                    </div>
                </div>
            </td>
            <td style="font-size: 12px; color: #475569;">
                <div>Từ: ${item.startDate}</div>
                <div>Đến: ${item.endDate}</div>
            </td>
            <td>
                <span class="voucher-status-chip ${item.status}">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                    <span>${item.statusText}</span>
                </span>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <button class="action-icon-btn" onclick="openDetailModal(${item.id})" title="Xem chi tiết">
                        <span class="material-symbols-outlined" style="font-size: 18px;">visibility</span>
                    </button>
                    <button class="action-icon-btn" onclick="openEditModal(${item.id})" title="Chỉnh sửa">
                        <span class="material-symbols-outlined" style="font-size: 18px;">edit</span>
                    </button>
                    <button class="action-icon-btn toggle" onclick="toggleVoucherStatus(${item.id})" title="${toggleTitle}">
                        <span class="material-symbols-outlined" style="font-size: 18px;">${toggleIcon}</span>
                    </button>
                    <button class="action-icon-btn delete" onclick="deleteVoucher(${item.id})" title="Xóa mã">
                        <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// -------------------------------------------------------------
// 1. TẠO MÃ GIẢM GIÁ (CREATE MODAL)
// -------------------------------------------------------------
function openCreateModal() {
    editingVoucherId = null;

    document.getElementById('modalTitleText').innerText = 'Tạo Mã Giảm Giá Mới';
    document.getElementById('vFormCode').value = '';
    document.getElementById('vFormName').value = '';
    document.getElementById('vFormType').value = 'percent';
    document.getElementById('vFormVal').value = '';
    document.getElementById('vFormMax').value = '';
    document.getElementById('vFormMin').value = '500000';
    document.getElementById('vFormLimit').value = '500';
    document.getElementById('vFormPerUser').value = '1';
    document.getElementById('vFormRegion').value = 'all';
    document.getElementById('vFormAudience').value = 'all';
    document.getElementById('vFormStartDate').value = '20/09/2026';
    document.getElementById('vFormEndDate').value = '31/12/2026';
    document.getElementById('vFormStatus').value = 'active';
    document.getElementById('vFormDesc').value = '';

    onDiscountTypeChange();
    document.getElementById('voucherFormModal').classList.add('open');
}

// Tự động sinh mã ngẫu nhiên
function generateRandomCode() {
    const prefixes = ['YEN', 'STAY', 'HOMEY', 'SALE', 'DISC'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('vFormCode').value = `${randomPrefix}${randomNum}`;
}

// Xử lý ẩn hiện ô Giảm tối đa khi đổi loại giảm giá
function onDiscountTypeChange() {
    const type = document.getElementById('vFormType').value;
    const maxWrap = document.getElementById('vFormMaxWrap');
    const valLabel = document.getElementById('vFormValLabel');

    if (type === 'percent') {
        valLabel.innerText = 'Mức giảm (%) *';
        document.getElementById('vFormVal').placeholder = 'Ví dụ: 15';
        if (maxWrap) maxWrap.style.display = 'block';
    } else {
        valLabel.innerText = 'Số tiền giảm (VNĐ) *';
        document.getElementById('vFormVal').placeholder = 'Ví dụ: 100000';
        if (maxWrap) maxWrap.style.display = 'none';
    }
}

// -------------------------------------------------------------
// 2. CHỈNH SỬA MÃ GIẢM GIÁ (EDIT MODAL)
// -------------------------------------------------------------
function openEditModal(id) {
    const item = vouchersList.find(x => x.id === id);
    if (!item) return;

    editingVoucherId = id;

    document.getElementById('modalTitleText').innerText = `Chỉnh Sửa Mã Giảm Giá: ${item.code}`;
    document.getElementById('vFormCode').value = item.code;
    document.getElementById('vFormName').value = item.name;
    document.getElementById('vFormType').value = item.discountType;
    document.getElementById('vFormVal').value = item.discountVal;
    document.getElementById('vFormMax').value = item.maxDiscount ? item.maxDiscount.replace(/[^0-9]/g, '') : '';
    document.getElementById('vFormMin').value = item.minOrder ? item.minOrder.replace(/[^0-9]/g, '') : '';
    document.getElementById('vFormLimit').value = item.totalLimit;
    document.getElementById('vFormPerUser').value = item.limitPerUser;
    document.getElementById('vFormRegion').value = item.region === 'Tất cả khu vực' ? 'all' : item.region;
    document.getElementById('vFormAudience').value = item.targetAudience === 'Khách hàng mới' ? 'new' : (item.targetAudience === 'Thành viên VIP' ? 'vip' : 'all');
    document.getElementById('vFormStartDate').value = item.startDate;
    document.getElementById('vFormEndDate').value = item.endDate;
    document.getElementById('vFormStatus').value = item.status;
    document.getElementById('vFormDesc').value = item.description || '';

    onDiscountTypeChange();
    document.getElementById('voucherFormModal').classList.add('open');
}

// Lưu dữ liệu từ Modal Tạo / Sửa
function saveVoucherData() {
    const code = document.getElementById('vFormCode').value.trim().toUpperCase();
    const name = document.getElementById('vFormName').value.trim();
    const type = document.getElementById('vFormType').value;
    const val = parseFloat(document.getElementById('vFormVal').value);
    const maxVal = document.getElementById('vFormMax').value.trim();
    const minVal = document.getElementById('vFormMin').value.trim();
    const limit = parseInt(document.getElementById('vFormLimit').value) || 100;
    const perUser = parseInt(document.getElementById('vFormPerUser').value) || 1;
    const regionVal = document.getElementById('vFormRegion').value;
    const audienceVal = document.getElementById('vFormAudience').value;
    const startDate = document.getElementById('vFormStartDate').value.trim();
    const endDate = document.getElementById('vFormEndDate').value.trim();
    const status = document.getElementById('vFormStatus').value;
    const desc = document.getElementById('vFormDesc').value.trim();

    if (!code) {
        alert('Vui lòng nhập Mã giảm giá (Code)!');
        return;
    }
    if (!name) {
        alert('Vui lòng nhập Tên chương trình ưu đãi!');
        return;
    }
    if (isNaN(val) || val <= 0) {
        alert('Vui lòng nhập Mức giảm hợp lệ!');
        return;
    }

    const regionText = regionVal === 'all' ? 'Tất cả khu vực' : regionVal;
    let audienceText = 'Tất cả khách hàng';
    if (audienceVal === 'new') audienceText = 'Khách hàng mới';
    if (audienceVal === 'vip') audienceText = 'Thành viên VIP';

    let statusText = 'Đang hoạt động';
    if (status === 'scheduled') statusText = 'Đã lên lịch';
    if (status === 'paused') statusText = 'Tạm dừng';
    if (status === 'expired') statusText = 'Hết hạn';

    const formattedMax = type === 'percent'
        ? (maxVal ? parseInt(maxVal).toLocaleString('vi-VN') + 'đ' : 'Không giới hạn')
        : parseInt(val).toLocaleString('vi-VN') + 'đ';

    const formattedMin = minVal ? parseInt(minVal).toLocaleString('vi-VN') + 'đ' : '0đ';

    if (editingVoucherId) {
        // Cập nhật mã hiện có
        const item = vouchersList.find(x => x.id === editingVoucherId);
        if (item) {
            item.code = code;
            item.name = name;
            item.discountType = type;
            item.discountVal = val;
            item.maxDiscount = formattedMax;
            item.minOrder = formattedMin;
            item.totalLimit = limit;
            item.limitPerUser = perUser;
            item.region = regionText;
            item.targetAudience = audienceText;
            item.startDate = startDate;
            item.endDate = endDate;
            item.status = status;
            item.statusText = statusText;
            item.description = desc;
        }
        showToast(`Đã cập nhật thành công mã giảm giá ${code}`, 'success');
    } else {
        // Tạo mã mới
        const newId = vouchersList.length > 0 ? Math.max(...vouchersList.map(x => x.id)) + 1 : 1;
        const newVoucher = {
            id: newId,
            code: code,
            name: name,
            discountType: type,
            discountVal: val,
            maxDiscount: formattedMax,
            minOrder: formattedMin,
            usedCount: 0,
            totalLimit: limit,
            limitPerUser: perUser,
            startDate: startDate,
            endDate: endDate,
            status: status,
            statusText: statusText,
            targetAudience: audienceText,
            region: regionText,
            description: desc,
            stats: {
                totalSubsidized: '0đ',
                totalGmv: '0đ',
                conversionRate: '0%'
            },
            redemptions: []
        };
        vouchersList.unshift(newVoucher);
        showToast(`Đã tạo mới thành công mã giảm giá ${code}`, 'success');
    }

    closeModal('voucherFormModal');
    renderVouchersTable();
    updateStatCards();
}

// -------------------------------------------------------------
// 3. CHI TIẾT MÃ GIẢM GIÁ (DETAIL MODAL)
// -------------------------------------------------------------
function openDetailModal(id) {
    const item = vouchersList.find(x => x.id === id);
    if (!item) return;

    // 1. Thẻ Voucher Ticket Visual Preview
    const discountHero = item.discountType === 'percent'
        ? `GIẢM ${item.discountVal}% (Tối đa ${item.maxDiscount})`
        : `GIẢM ${item.maxDiscount}`;

    document.getElementById('dtTicketDiscount').innerText = discountHero;
    document.getElementById('dtTicketName').innerText = item.name;
    document.getElementById('dtTicketCode').innerText = item.code;
    document.getElementById('dtTicketExpiry').innerText = `Hạn dùng: ${item.startDate} - ${item.endDate}`;
    document.getElementById('dtTicketMinOrder').innerText = `Đơn tối thiểu: ${item.minOrder}`;
    document.getElementById('dtTicketRegion').innerText = `Áp dụng: ${item.region}`;

    // 2. Thông số thống kê KPI
    const pctUsed = Math.min(100, Math.round((item.usedCount / item.totalLimit) * 100));
    document.getElementById('dtQuotaNum').innerText = `${item.usedCount.toLocaleString('vi-VN')} / ${item.totalLimit.toLocaleString('vi-VN')} (${pctUsed}%)`;
    document.getElementById('dtSubsidizedVal').innerText = item.stats.totalSubsidized;
    document.getElementById('dtGmvVal').innerText = item.stats.totalGmv;

    // 3. Điều kiện chi tiết
    document.getElementById('dtDesc').innerText = item.description || 'Không có ghi chú thêm.';
    document.getElementById('dtAudience').innerText = item.targetAudience;
    document.getElementById('dtLimitPerUser').innerText = `${item.limitPerUser} lượt / tài khoản`;
    document.getElementById('dtStatusChip').innerHTML = `
        <span class="voucher-status-chip ${item.status}">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
            <span>${item.statusText}</span>
        </span>
    `;

    // 4. Bảng 5 đơn vừa quy đổi mã này
    const redempTbody = document.getElementById('dtRedemptionsBody');
    redempTbody.innerHTML = '';

    if (item.redemptions && item.redemptions.length > 0) {
        item.redemptions.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong style="color: #15803D; font-family: monospace;">${r.orderId}</strong></td>
                <td>${r.user}</td>
                <td>${r.homestay}</td>
                <td>${r.total}</td>
                <td><strong style="color: #EA580C;">-${r.discount}</strong></td>
                <td style="color: #64748B; font-size: 11.5px;">${r.time}</td>
            `;
            redempTbody.appendChild(tr);
        });
    } else {
        redempTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94A3B8; padding: 14px;">Chưa phát sinh đơn hàng nào sử dụng mã này.</td></tr>`;
    }

    // Nút chuyển sang sửa nhanh
    const editBtn = document.getElementById('dtEditBtn');
    if (editBtn) {
        editBtn.onclick = () => {
            closeModal('voucherDetailModal');
            openEditModal(item.id);
        };
    }

    document.getElementById('voucherDetailModal').classList.add('open');
}

// -------------------------------------------------------------
// 4. CÁC THAO TÁC NHANH (TOGGLE, DELETE, COPY, TOAST)
// -------------------------------------------------------------
function toggleVoucherStatus(id) {
    const item = vouchersList.find(x => x.id === id);
    if (!item) return;

    if (item.status === 'active') {
        item.status = 'paused';
        item.statusText = 'Tạm dừng';
        showToast(`Đã tạm dừng mã giảm giá ${item.code}`, 'info');
    } else {
        item.status = 'active';
        item.statusText = 'Đang hoạt động';
        showToast(`Đã kích hoạt lại mã giảm giá ${item.code}`, 'success');
    }

    renderVouchersTable();
    updateStatCards();
}

function deleteVoucher(id) {
    const item = vouchersList.find(x => x.id === id);
    if (!item) return;

    if (confirm(`Bạn có chắc chắn muốn xóa mã giảm giá "${item.code}" (${item.name}) không?`)) {
        vouchersList = vouchersList.filter(x => x.id !== id);
        showToast(`Đã xóa thành công mã giảm giá ${item.code}`, 'info');
        renderVouchersTable();
        updateStatCards();
    }
}

function copyVoucherCode(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            showToast(`Đã sao chép mã ${code} vào clipboard!`, 'success');
        });
    } else {
        showToast(`Mã: ${code}`, 'success');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
}

function showToast(message, type = 'success') {
    let toast = document.getElementById('adminToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'adminToast';
        toast.className = 'admin-toast';
        document.body.appendChild(toast);
    }

    toast.className = `admin-toast ${type} show`;
    toast.innerHTML = `
        <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'info'}</span>
        <span>${message}</span>
    `;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
