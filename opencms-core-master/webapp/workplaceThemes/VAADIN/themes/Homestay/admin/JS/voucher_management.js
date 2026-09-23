// ==========================================================================
// YÊN HOMESTAY ADMIN - DUYỆT MÃ GIẢM GIÁ TỪ CHỦ HOMESTAY JAVASCRIPT
// File: opencms-core-master/.../admin/JS/voucher_management.js
// Mục: Thẩm định và duyệt/từ chối mã giảm giá do chủ Homestay tạo
// ==========================================================================

// Danh sách dữ liệu yêu cầu Mã giảm giá từ các Chủ Homestay
let vouchersList = [
    {
        id: 1,
        code: 'DALAT200',
        homestayName: 'The Memory Valley Villa',
        hostName: 'Nguyễn Văn An',
        hostPhone: '0912.345.678',
        hostAvatar: 'A',
        region: 'Đà Lạt',
        name: 'Ưu đãi mùa thu thung lũng Đà Lạt',
        discountType: 'percent', // 'percent' hoặc 'fixed'
        discountVal: 20,
        maxDiscount: '200.000đ',
        minOrder: '1.000.000đ',
        totalLimit: 50,
        usedCount: 0,
        startDate: '01/10/2026',
        endDate: '31/10/2026',
        createdDate: '22/09/2026 14:30',
        status: 'pending', // 'pending', 'approved', 'rejected'
        statusText: 'Chờ duyệt',
        hostReason: 'Chúng tôi muốn chạy chương trình ưu đãi mùa thu tri ân khách lưu trú trên 2 đêm tại Đà Lạt. Chủ homestay tự tài trợ 100% kinh phí trợ giá.',
        adminNote: ''
    },
    {
        id: 2,
        code: 'SAPAWARM15',
        homestayName: 'Topas Ecolodge Sapa',
        hostName: 'Trần Thị Thu Hà',
        hostPhone: '0988.765.432',
        hostAvatar: 'H',
        region: 'Sa Pa',
        name: 'Mùa mây ấm áp Bungalow Sapa',
        discountType: 'percent',
        discountVal: 15,
        maxDiscount: '300.000đ',
        minOrder: '2.000.000đ',
        totalLimit: 30,
        usedCount: 0,
        startDate: '05/10/2026',
        endDate: '15/11/2026',
        createdDate: '22/09/2026 16:15',
        status: 'pending',
        statusText: 'Chờ duyệt',
        hostReason: 'Khuyến mãi mùa săn mây Tả Van cho các cặp đôi và gia đình đặt phòng trước 2 tuần.',
        adminNote: ''
    },
    {
        id: 3,
        code: 'HANRIVER100K',
        homestayName: 'Han River Glass House',
        hostName: 'Lê Hoàng Minh',
        hostPhone: '0905.123.987',
        hostAvatar: 'M',
        region: 'Đà Nẵng',
        name: 'Ngắm cảnh sông Hàn buổi tối',
        discountType: 'fixed',
        discountVal: 100000,
        maxDiscount: '100.000đ',
        minOrder: '800.000đ',
        totalLimit: 100,
        usedCount: 0,
        startDate: '01/10/2026',
        endDate: '30/11/2026',
        createdDate: '23/09/2026 09:10',
        status: 'pending',
        statusText: 'Chờ duyệt',
        hostReason: 'Kích cầu đặt phòng căn hộ kính view sông Hàn cho khách công tác & du lịch ngắn ngày.',
        adminNote: ''
    },
    {
        id: 4,
        code: 'PULUONGGREEN',
        homestayName: 'Pù Luông Eco Lodge',
        hostName: 'Phạm Văn Đức',
        hostPhone: '0945.888.999',
        hostAvatar: 'Đ',
        region: 'Pù Luông',
        name: 'Mùa lúa chín Pù Luông 2026',
        discountType: 'fixed',
        discountVal: 150000,
        maxDiscount: '150.000đ',
        minOrder: '1.200.000đ',
        totalLimit: 40,
        usedCount: 0,
        startDate: '10/10/2026',
        endDate: '05/11/2026',
        createdDate: '23/09/2026 10:05',
        status: 'pending',
        statusText: 'Chờ duyệt',
        hostReason: 'Chào đón du khách ngắm ruộng bậc thang mùa gặt bản Đôn Pù Luông.',
        adminNote: ''
    },
    {
        id: 5,
        code: 'HOIANVILLA10',
        homestayName: 'An Bang Beach Villa',
        hostName: 'Vũ Thị Ngọc',
        hostPhone: '0935.111.222',
        hostAvatar: 'N',
        region: 'Hội An',
        name: 'Nghỉ dưỡng biển An Bàng Hội An',
        discountType: 'percent',
        discountVal: 10,
        maxDiscount: '150.000đ',
        minOrder: '1.500.000đ',
        totalLimit: 60,
        usedCount: 18,
        startDate: '15/09/2026',
        endDate: '31/10/2026',
        createdDate: '14/09/2026 08:30',
        status: 'approved',
        statusText: 'Đã duyệt',
        hostReason: 'Khuyến mãi dịp đầu thu dành riêng cho du khách thích không gian yên tĩnh bãi biển An Bàng.',
        adminNote: 'Đã phê duyệt phát hành ngày 14/09/2026.'
    },
    {
        id: 6,
        code: 'NINHBINHCOZY',
        homestayName: 'Tràng An River Homestay',
        hostName: 'Bùi Quang Tuấn',
        hostPhone: '0977.333.444',
        hostAvatar: 'T',
        region: 'Ninh Bình',
        name: 'Khám phá di sản Tràng An',
        discountType: 'fixed',
        discountVal: 80000,
        maxDiscount: '80.000đ',
        minOrder: '600.000đ',
        totalLimit: 80,
        usedCount: 35,
        startDate: '01/09/2026',
        endDate: '31/10/2026',
        createdDate: '30/08/2026 11:20',
        status: 'approved',
        statusText: 'Đã duyệt',
        hostReason: 'Tăng lượng chốt phòng cuối tuần cho khách du lịch chèo thuyền Tràng An - Tam Cốc.',
        adminNote: 'Phê duyệt hợp lệ.'
    },
    {
        id: 7,
        code: 'HAGIANG500K',
        homestayName: 'Đồng Văn Plateau Lodge',
        hostName: 'Vàng A Lềnh',
        hostPhone: '0919.555.666',
        hostAvatar: 'L',
        region: 'Hà Giang',
        name: 'Mùa hoa tam giác mạch Hà Giang',
        discountType: 'fixed',
        discountVal: 500000,
        maxDiscount: '500.000đ',
        minOrder: '600.000đ',
        totalLimit: 200,
        usedCount: 0,
        startDate: '01/10/2026',
        endDate: '30/11/2026',
        createdDate: '20/09/2026 15:45',
        status: 'rejected',
        statusText: 'Đã từ chối',
        hostReason: 'Giảm 500.000đ cho khách phượt.',
        adminNote: 'Mức giảm giá quá cao, không phù hợp quy định hạn mức trợ giá của sàn YÊN.'
    }
];

let activeTabStatus = 'all';
let selectedRejectId = null;
let searchQuery = '';
let selectedRegion = 'all';
let selectedType = 'all';

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    initProfileDropdown();
    renderVouchersTable();
    updateStatCards();
    initFilters();
});

// Dropdown Profile Header Admin
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

// Khởi tạo bộ lọc tìm kiếm & Dropdown
function initFilters() {
    const searchInput = document.getElementById('voucherSearchInput');
    const regionSelect = document.getElementById('voucherRegionFilter');
    const typeSelect = document.getElementById('voucherTypeFilter');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            searchQuery = this.value.toLowerCase().trim();
            renderVouchersTable();
        });
    }

    if (regionSelect) {
        regionSelect.addEventListener('change', function () {
            selectedRegion = this.value;
            renderVouchersTable();
        });
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', function () {
            selectedType = this.value;
            renderVouchersTable();
        });
    }
}

// Cập nhật 4 thẻ KPI Thống kê
function updateStatCards() {
    const totalCount = vouchersList.length;
    const pendingCount = vouchersList.filter(v => v.status === 'pending').length;
    const approvedCount = vouchersList.filter(v => v.status === 'approved').length;
    const rejectedCount = vouchersList.filter(v => v.status === 'rejected').length;

    const statTotalElem = document.getElementById('statTotalRequests');
    const statPendingElem = document.getElementById('statPendingRequests');
    const statApprovedElem = document.getElementById('statApprovedRequests');
    const statRejectedElem = document.getElementById('statRejectedRequests');

    if (statTotalElem) statTotalElem.innerText = totalCount;
    if (statPendingElem) statPendingElem.innerText = pendingCount;
    if (statApprovedElem) statApprovedElem.innerText = approvedCount;
    if (statRejectedElem) statRejectedElem.innerText = rejectedCount;

    // Cập nhật số đếm trên các Tab
    const tabAll = document.getElementById('tabCntAll');
    const tabPending = document.getElementById('tabCntPending');
    const tabApproved = document.getElementById('tabCntApproved');
    const tabRejected = document.getElementById('tabCntRejected');

    if (tabAll) tabAll.innerText = totalCount;
    if (tabPending) tabPending.innerText = pendingCount;
    if (tabApproved) tabApproved.innerText = approvedCount;
    if (tabRejected) tabRejected.innerText = rejectedCount;
}

// Chuyển Tab trạng thái
function switchTab(status, btnElem) {
    activeTabStatus = status;

    const tabs = document.querySelectorAll('#statusTabs .content-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');

    renderVouchersTable();
}

function filterByStatus(status) {
    activeTabStatus = status;

    const tabs = document.querySelectorAll('#statusTabs .content-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));

    const targetTab = Array.from(tabs).find(t => t.getAttribute('onclick').includes(`'${status}'`));
    if (targetTab) targetTab.classList.add('active');

    renderVouchersTable();
}

// Render Bảng Danh Sách Yêu Cầu Duyệt Voucher
function renderVouchersTable() {
    const tbody = document.getElementById('voucherTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filtered = vouchersList.filter(item => {
        const matchSearch = item.code.toLowerCase().includes(searchQuery) ||
            item.name.toLowerCase().includes(searchQuery) ||
            item.homestayName.toLowerCase().includes(searchQuery) ||
            item.hostName.toLowerCase().includes(searchQuery);

        const matchStatus = activeTabStatus === 'all' || item.status === activeTabStatus;
        const matchRegion = selectedRegion === 'all' || item.region === selectedRegion;
        const matchType = selectedType === 'all' || item.discountType === selectedType;

        return matchSearch && matchStatus && matchRegion && matchType;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 36px;">Không tìm thấy yêu cầu tạo mã giảm giá nào trong mục này.</td></tr>`;
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
                <div class="discount-condition-sub">Trừ tiền mặt trực tiếp</div>
            `;
        }

        // Trạng thái Chip
        let statusChipHtml = '';
        if (item.status === 'pending') {
            statusChipHtml = `
                <span class="voucher-status-chip pending">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #D97706;"></span>
                    <span>Chờ Admin duyệt</span>
                </span>
            `;
        } else if (item.status === 'approved') {
            statusChipHtml = `
                <span class="voucher-status-chip approved">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #15803D;"></span>
                    <span>Đã phê duyệt</span>
                </span>
            `;
        } else {
            statusChipHtml = `
                <span class="voucher-status-chip rejected">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #DC2626;"></span>
                    <span>Đã từ chối</span>
                </span>
            `;
        }

        // Cột Thao Tác Phê Duyệt
        let actionButtonsHtml = '';
        if (item.status === 'pending') {
            actionButtonsHtml = `
                <div class="action-btn-group">
                    <button class="btn-approve-sm" onclick="approveVoucher(${item.id})" title="Duyệt phát hành ngay">
                        <span class="material-symbols-outlined" style="font-size: 16px;">check_circle</span>
                        <span>Duyệt</span>
                    </button>
                    <button class="btn-reject-sm" onclick="openRejectModal(${item.id})" title="Từ chối yêu cầu này">
                        <span class="material-symbols-outlined" style="font-size: 16px;">cancel</span>
                        <span>Từ chối</span>
                    </button>
                    <button class="action-icon-btn" onclick="openDetailModal(${item.id})" title="Xem hồ sơ chi tiết">
                        <span class="material-symbols-outlined" style="font-size: 18px;">visibility</span>
                    </button>
                </div>
            `;
        } else if (item.status === 'approved') {
            actionButtonsHtml = `
                <div class="action-btn-group">
                    <span class="approved-tag"><span class="material-symbols-outlined" style="font-size: 15px;">verified</span> Đã duyệt</span>
                    <button class="action-icon-btn" onclick="openDetailModal(${item.id})" title="Xem chi tiết">
                        <span class="material-symbols-outlined" style="font-size: 18px;">visibility</span>
                    </button>
                </div>
            `;
        } else {
            actionButtonsHtml = `
                <div class="action-btn-group">
                    <button class="btn-rejected-view-sm" onclick="openDetailModal(${item.id})" title="Xem lý do từ chối">
                        <span class="material-symbols-outlined" style="font-size: 16px;">info</span>
                        <span>Xem lý do</span>
                    </button>
                </div>
            `;
        }

        tr.innerHTML = `
            <td>
                <div class="voucher-code-badge" onclick="copyVoucherCode('${item.code}')" title="Sao chép mã">
                    <span>${item.code}</span>
                    <span class="material-symbols-outlined copy-icon">content_copy</span>
                </div>
                <div style="font-size: 11px; color: #64748B; margin-top: 3px;">
                    Gửi: ${item.createdDate}
                </div>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="host-mini-avatar">${item.hostAvatar}</div>
                    <div>
                        <strong style="color: var(--text-main); font-size: 13px;">${item.hostName}</strong>
                        <div style="font-size: 11.5px; color: #15803D; font-weight: 700; margin-top: 1px;">
                            ${item.homestayName}
                        </div>
                        <div style="font-size: 11px; color: #64748B;">Khu vực: ${item.region}</div>
                    </div>
                </div>
            </td>
            <td>
                <strong style="color: var(--text-main); font-size: 13px;">${item.name}</strong>
                ${discountDisplay}
            </td>
            <td>
                <div style="font-size: 12.5px; font-weight: 700; color: #0F172A;">${item.totalLimit} lượt phát hành</div>
                <div style="font-size: 11.5px; color: #64748B; margin-top: 2px;">Đơn từ: <strong>${item.minOrder}</strong></div>
            </td>
            <td style="font-size: 11.5px; color: #475569;">
                <div>Từ: <strong>${item.startDate}</strong></div>
                <div>Đến: <strong>${item.endDate}</strong></div>
            </td>
            <td>${statusChipHtml}</td>
            <td style="text-align: right; padding-right: 16px;">${actionButtonsHtml}</td>
        `;

        tbody.appendChild(tr);
    });
}

// -------------------------------------------------------------
// 1. PHÊ DUYỆT MÃ GIẢM GIÁ
// -------------------------------------------------------------
function approveVoucher(id) {
    const item = vouchersList.find(x => x.id === id);
    if (!item) return;

    if (confirm(`Bạn có chắc chắn muốn PHÊ DUYỆT mã giảm giá "${item.code}" cho Homestay ${item.homestayName} không?`)) {
        item.status = 'approved';
        item.statusText = 'Đã duyệt';
        item.adminNote = `Đã duyệt phát hành bởi Admin ngày ${new Date().toLocaleDateString('vi-VN')}`;

        showToast(`🎉 Đã phê duyệt phát hành mã giảm giá ${item.code}!`, 'success');
        renderVouchersTable();
        updateStatCards();

        if (document.getElementById('voucherDetailModal').classList.contains('open')) {
            closeModal('voucherDetailModal');
        }
    }
}

// -------------------------------------------------------------
// 2. TỪ CHỐI YÊU CẦU MÃ GIẢM GIÁ
// -------------------------------------------------------------
function openRejectModal(id) {
    const item = vouchersList.find(x => x.id === id);
    if (!item) return;

    selectedRejectId = id;
    document.getElementById('rejectCodeLabel').innerText = item.code;
    document.getElementById('rejectHsLabel').innerText = item.homestayName;

    // Reset form
    document.getElementById('rejectPresetReason').selectedIndex = 0;
    document.getElementById('rejectCustomReason').value = '';
    onRejectReasonChange();

    document.getElementById('voucherRejectModal').classList.add('open');
}

function onRejectReasonChange() {
    const select = document.getElementById('rejectPresetReason');
    const customArea = document.getElementById('rejectCustomReason');

    if (select.value === 'custom') {
        customArea.style.display = 'block';
        customArea.focus();
    } else {
        customArea.style.display = 'none';
    }
}

function submitRejectVoucher() {
    if (!selectedRejectId) return;

    const item = vouchersList.find(x => x.id === selectedRejectId);
    if (!item) return;

    const select = document.getElementById('rejectPresetReason');
    const customArea = document.getElementById('rejectCustomReason');

    let reasonText = select.value;
    if (select.value === 'custom') {
        reasonText = customArea.value.trim();
        if (!reasonText) {
            alert('Vui lòng nhập lý do từ chối cụ thể!');
            return;
        }
    }

    item.status = 'rejected';
    item.statusText = 'Đã từ chối';
    item.adminNote = reasonText;

    showToast(`Đã từ chối yêu cầu phát hành mã ${item.code}!`, 'info');
    closeModal('voucherRejectModal');

    if (document.getElementById('voucherDetailModal').classList.contains('open')) {
        closeModal('voucherDetailModal');
    }

    renderVouchersTable();
    updateStatCards();
}

// -------------------------------------------------------------
// 3. CHI TIẾT YÊU CẦU & THẨM ĐỊNH (DETAIL MODAL)
// -------------------------------------------------------------
function openDetailModal(id) {
    const item = vouchersList.find(x => x.id === id);
    if (!item) return;

    // 1. Host Info
    document.getElementById('dtHostAvatar').innerText = item.hostAvatar;
    document.getElementById('dtHostName').innerText = `${item.hostName} (SĐT: ${item.hostPhone})`;
    document.getElementById('dtHomestayName').innerText = item.homestayName;
    document.getElementById('dtRegion').innerText = item.region;
    document.getElementById('dtCreatedDate').innerText = `Gửi yêu cầu lúc: ${item.createdDate}`;

    // 2. Ticket Visual Preview
    const discountHero = item.discountType === 'percent'
        ? `GIẢM ${item.discountVal}% (Tối đa ${item.maxDiscount})`
        : `GIẢM ${item.maxDiscount}`;

    document.getElementById('dtTicketHomestay').innerText = item.homestayName.toUpperCase();
    document.getElementById('dtTicketDiscount').innerText = discountHero;
    document.getElementById('dtTicketName').innerText = item.name;
    document.getElementById('dtTicketCode').innerText = item.code;
    document.getElementById('dtTicketExpiry').innerText = `Hạn dùng: ${item.startDate} - ${item.endDate}`;
    document.getElementById('dtTicketMinOrder').innerText = `Đơn tối thiểu: ${item.minOrder}`;
    document.getElementById('dtTicketLimit').innerText = `Số lượng: ${item.totalLimit} lượt phát hành`;

    // 3. Host Note
    document.getElementById('dtHostReason').innerText = item.hostReason || 'Không có ghi chú thêm.';

    // 4. Admin Note (nếu bị từ chối hoặc đã duyệt)
    const adminNoteSec = document.getElementById('dtAdminNoteSection');
    const adminNoteCont = document.getElementById('dtAdminNoteContent');

    if (item.adminNote) {
        adminNoteSec.style.display = 'block';
        adminNoteCont.innerText = item.adminNote;
    } else {
        adminNoteSec.style.display = 'none';
    }

    // 5. Action Buttons Inside Modal
    const actionWrap = document.getElementById('dtActionButtons');
    actionWrap.innerHTML = '';

    if (item.status === 'pending') {
        actionWrap.innerHTML = `
            <button class="btn-admin-primary" style="background-color: #15803D;" onclick="approveVoucher(${item.id})">
                <span class="material-symbols-outlined">check_circle</span>
                <span>Phê Duyệt Phát Hành</span>
            </button>
            <button class="btn-admin-primary" style="background-color: #DC2626;" onclick="openRejectModal(${item.id})">
                <span class="material-symbols-outlined">cancel</span>
                <span>Từ Chối Yêu Cầu</span>
            </button>
        `;
    } else if (item.status === 'approved') {
        actionWrap.innerHTML = `
            <span class="badge bg-success-subtle text-success px-3 py-2 rounded-pill font-bold" style="background: #DCFCE7; color: #15803D; font-size: 13px;">
                <span class="material-symbols-outlined align-middle me-1">verified</span> Mã đã được phê duyệt
            </span>
        `;
    } else {
        actionWrap.innerHTML = `
            <span class="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill font-bold" style="background: #FEE2E2; color: #DC2626; font-size: 13px;">
                <span class="material-symbols-outlined align-middle me-1">cancel</span> Yêu cầu đã bị từ chối
            </span>
        `;
    }

    document.getElementById('voucherDetailModal').classList.add('open');
}

// -------------------------------------------------------------
// UTILS & TOAST
// -------------------------------------------------------------
function copyVoucherCode(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            showToast(`Đã sao chép mã ${code}!`, 'success');
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
    }, 3200);
}
