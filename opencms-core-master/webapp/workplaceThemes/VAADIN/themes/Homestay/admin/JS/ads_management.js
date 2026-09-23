/**
 * ==========================================================================
 * YÊN HOMESTAY ADMIN - BÁN & CUNG CẤP DỊCH VỤ QUẢNG CÁO JS
 * File: opencms-core-master/.../admin/JS/ads_management.js
 * Quản lý: Gói dịch vụ quảng cáo mở bán, Đơn đặt mua của Chủ Homestay & Slot hiển thị
 * ==========================================================================
 */

let editingId = null;
let currentAdsTab = 'packages'; // 'packages' | 'orders' | 'slots'

// 1. DANH SÁCH GÓI DỊCH VỤ QUẢNG CÁO & ĐẨY TOP ĐANG MỞ BÁN (Tương thích với owner addPackage)
let adPackages = [
    {
        id: 'pkg-1',
        name: 'Gói Đẩy Top Nhanh',
        category: 'short',
        categoryText: 'Ngắn hạn',
        badgeClass: 'standard',
        price: 150000,
        priceFormatted: '150.000đ',
        duration: '3 ngày',
        placement: 'top5',
        placementText: 'TOP 5 Trang Tìm Kiếm',
        desc: 'Phù hợp đẩy tin cuối tuần, tăng lượt đặt phòng khẩn cấp',
        features: [
            'Ưu tiên vị trí TOP 5 trang tìm kiếm',
            'Gắn nhãn "Nổi Bật" trên kết quả',
            'Hỗ trợ thống kê lượt click cơ bản'
        ],
        soldCount: 8,
        totalRevenue: '1.200.000đ',
        status: 'active',
        statusText: 'Đang mở bán'
    },
    {
        id: 'pkg-2',
        name: 'Gói Top 1 Chuyên Nghiệp',
        category: 'hot',
        categoryText: 'HOT Dài hạn',
        badgeClass: 'hot',
        price: 990000,
        priceFormatted: '990.000đ',
        duration: '30 ngày',
        placement: 'top5',
        placementText: 'Banner Đề Xuất Trang Chủ + Top 1',
        desc: 'Tối ưu cho cả tháng, tiếp cận tối đa du khách tiềm năng',
        features: [
            'Hiển thị Banner đề xuất Trang Chủ',
            'Báo cáo hiệu quả Realtime nâng cao',
            'Hỗ trợ tối ưu hình ảnh & bài viết'
        ],
        soldCount: 6,
        totalRevenue: '5.940.000đ',
        status: 'active',
        statusText: 'Đang mở bán'
    },
    {
        id: 'pkg-3',
        name: 'Gói Mùa Cao Điểm',
        category: 'seasonal',
        categoryText: 'Mùa Lễ Hội',
        badgeClass: 'seasonal',
        price: 550000,
        priceFormatted: '550.000đ',
        duration: '14 ngày',
        placement: 'festival',
        placementText: 'Chiến Dịch Lễ Hội & Mùa Du Lịch',
        desc: 'Đột phá doanh thu trong các dịp lễ, sự kiện lớn',
        features: [
            'Hiển thị ưu tiên chiến dịch Mùa Lúa Chín / Lễ Hội',
            'Gửi thông báo Push đến du khách tiềm năng',
            'Tặng 200 lượt Click tài trợ miễn phí'
        ],
        soldCount: 5,
        totalRevenue: '2.750.000đ',
        status: 'active',
        statusText: 'Đang mở bán'
    },
    {
        id: 'pkg-4',
        name: 'Gói Banner Hero Slider VIP',
        category: 'vip',
        categoryText: 'VIP Slider',
        badgeClass: 'vip',
        price: 5000000,
        priceFormatted: '5.000.000đ',
        duration: '30 ngày',
        placement: 'hero',
        placementText: 'Hero Slider Trang Chủ (1920x600)',
        desc: 'Vị trí banner lớn nhất toàn trang, tiếp cận 100% lượt truy cập',
        features: [
            'Banner kích thước 1920x600 tràn viền',
            'Đứng vị trí số 1 trong vòng lặp Hero Slider',
            'Báo cáo phân tích chuyên sâu độc quyền'
        ],
        soldCount: 3,
        totalRevenue: '15.000.000đ',
        status: 'active',
        statusText: 'Đang mở bán'
    },
    {
        id: 'pkg-5',
        name: 'Gói Combo Spotlight Tiết Kiệm',
        category: 'hot',
        categoryText: 'Combo Card',
        badgeClass: 'standard',
        price: 3500000,
        priceFormatted: '3.500.000đ',
        duration: '30 ngày',
        placement: 'combo',
        placementText: 'Thẻ Combo Giữa Trang Chủ (1200x400)',
        desc: 'Khối thẻ nổi bật dành riêng cho homestay có mức giá & trải nghiệm tốt',
        features: [
            'Banner kích thước 1200x400',
            'Gắn nhãn Giảm 25% kích cầu',
            'Đính kèm mã Voucher kích cầu đặt phòng'
        ],
        soldCount: 2,
        totalRevenue: '7.000.000đ',
        status: 'active',
        statusText: 'Đang mở bán'
    },
    {
        id: 'pkg-6',
        name: 'Gói Pop-up Voucher Khuyến Mãi',
        category: 'vip',
        categoryText: 'Pop-up VIP',
        badgeClass: 'vip',
        price: 4000000,
        priceFormatted: '4.000.000đ',
        duration: '30 ngày',
        placement: 'popup',
        placementText: 'Pop-up Khuyến Mãi (600x400)',
        desc: 'Cửa sổ nổi hiển thị khi khách truy cập, gắn liền với mã voucher',
        features: [
            'Pop-up kích thước 600x400',
            'Tỷ lệ click CTR trung bình >8.2%',
            'Nút nhận voucher & điều hướng trực tiếp'
        ],
        soldCount: 2,
        totalRevenue: '8.000.000đ',
        status: 'active',
        statusText: 'Đang mở bán'
    }
];

// 2. DANH SÁCH ĐƠN MUA DỊCH VỤ & CHIẾN DỊCH ĐANG CHẠY CỦA CHỦ HOMESTAY
let adOrders = [
    {
        id: 'ord-1',
        code: 'ORD-ADS-1082',
        homestay: 'Han River Glass House & Cozy Villa',
        host: 'Nguyễn Văn Minh',
        packageId: 'pkg-4',
        packageName: 'Gói Banner Hero Slider VIP',
        amount: '5.000.000đ',
        placement: 'hero',
        placementText: 'Hero Slider Trang Chủ',
        startDate: '01/05/2026',
        endDate: '31/05/2026',
        remaining: 'Còn 14 ngày',
        impressions: '58,420',
        clicks: '5,120',
        ctr: '8.76%',
        status: 'active',
        statusText: 'Đang chạy',
        img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        linkUrl: 'https://yenhomestay.com/homestay/han-river'
    },
    {
        id: 'ord-2',
        code: 'ORD-ADS-1079',
        homestay: 'The Memory Valley Villa Mai Châu',
        host: 'Hoàng Thị Mai',
        packageId: 'pkg-2',
        packageName: 'Gói Top 1 Chuyên Nghiệp',
        amount: '990.000đ',
        placement: 'top5',
        placementText: 'Đề Xuất + Top 1 Tìm Kiếm',
        startDate: '10/05/2026',
        endDate: '09/06/2026',
        remaining: 'Còn 4 ngày',
        impressions: '42,150',
        clicks: '3,890',
        ctr: '9.22%',
        status: 'active',
        statusText: 'Đang chạy',
        img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
        linkUrl: 'https://yenhomestay.com/homestay/memory-valley'
    },
    {
        id: 'ord-3',
        code: 'ORD-ADS-1075',
        homestay: 'Sapa Cloud Forest Lodge',
        host: 'Lò A Tủa',
        packageId: 'pkg-3',
        packageName: 'Gói Mùa Cao Điểm',
        amount: '550.000đ',
        placement: 'festival',
        placementText: 'Chiến Dịch Lễ Hội & Mùa Cao Điểm',
        startDate: '15/05/2026',
        endDate: '29/05/2026',
        remaining: 'Còn 6 ngày',
        impressions: '24,100',
        clicks: '1,950',
        ctr: '8.09%',
        status: 'active',
        statusText: 'Đang chạy',
        img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
        linkUrl: 'https://yenhomestay.com/homestay/sapa-cloud'
    },
    {
        id: 'ord-4',
        code: 'ORD-ADS-1068',
        homestay: 'Hội An Ancient Riverside Wooden Home',
        host: 'Trần Quốc Bảo',
        packageId: 'pkg-1',
        packageName: 'Gói Đẩy Top Nhanh',
        amount: '150.000đ',
        placement: 'top5',
        placementText: 'TOP 5 Trang Tìm Kiếm',
        startDate: '20/05/2026',
        endDate: '23/05/2026',
        remaining: 'Còn 2 ngày',
        impressions: '8,650',
        clicks: '720',
        ctr: '8.32%',
        status: 'active',
        statusText: 'Đang chạy',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        linkUrl: 'https://yenhomestay.com/homestay/hoian-riverside'
    },
    {
        id: 'ord-5',
        code: 'ORD-ADS-1060',
        homestay: 'Đà Lạt Pine Hill Wood Cabin',
        host: 'Lê Thu Trang',
        packageId: 'pkg-6',
        packageName: 'Gói Pop-up Voucher Khuyến Mãi',
        amount: '4.000.000đ',
        placement: 'popup',
        placementText: 'Pop-up Khuyến Mãi',
        startDate: '01/05/2026',
        endDate: '31/05/2026',
        remaining: 'Còn 10 ngày',
        impressions: '89,600',
        clicks: '7,430',
        ctr: '8.29%',
        status: 'active',
        statusText: 'Đang chạy',
        img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
        linkUrl: 'https://yenhomestay.com/voucher/newuser'
    },
    {
        id: 'ord-6',
        code: 'ORD-ADS-1052',
        homestay: 'Ba Bể Lakeview Eco Stilt House',
        host: 'Nông Văn Tuấn',
        packageId: 'pkg-1',
        packageName: 'Gói Đẩy Top Nhanh',
        amount: '150.000đ',
        placement: 'top5',
        placementText: 'TOP 5 Trang Tìm Kiếm',
        startDate: '01/05/2026',
        endDate: '04/05/2026',
        remaining: 'Đã hoàn thành',
        impressions: '12,300',
        clicks: '980',
        ctr: '7.96%',
        status: 'ended',
        statusText: 'Hoàn thành',
        img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        linkUrl: 'https://yenhomestay.com/homestay/babe-lake'
    }
];

// 3. VỊ TRÍ & KHUNG HIỂN THỊ QUẢNG CÁO (SLOTS)
let adSlots = [
    {
        id: 'slot-hero',
        name: 'Hero Slider Trang Chủ',
        dimension: '1920 x 600 px',
        activeAds: 3,
        maxAds: 5,
        avgCtr: '8.7%',
        pricePerMonth: '5.000.000đ/tháng',
        status: 'active'
    },
    {
        id: 'slot-top5',
        name: 'Vị Trí Đẩy Top 5 Tìm Kiếm',
        dimension: 'Card Đề Xuất Ưu Tiên',
        activeAds: 8,
        maxAds: 10,
        avgCtr: '9.4%',
        pricePerMonth: 'Theo gói 3-30 ngày',
        status: 'active'
    },
    {
        id: 'slot-combo',
        name: 'Banner Combo Tiết Kiệm',
        dimension: '1200 x 400 px',
        activeAds: 2,
        maxAds: 3,
        avgCtr: '9.2%',
        pricePerMonth: '3.500.000đ/tháng',
        status: 'active'
    },
    {
        id: 'slot-popup',
        name: 'Pop-up Khuyến Mãi Đầu Trang',
        dimension: '600 x 400 px',
        activeAds: 1,
        maxAds: 2,
        avgCtr: '8.3%',
        pricePerMonth: '4.000.000đ/tháng',
        status: 'active'
    },
    {
        id: 'slot-festival',
        name: 'Banner Khu Vực Lễ Hội',
        dimension: '1200 x 300 px',
        activeAds: 2,
        maxAds: 4,
        avgCtr: '8.9%',
        pricePerMonth: '3.000.000đ/tháng',
        status: 'active'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initAdsModule();
});

function initAdsModule() {
    updateAdsStatCards();
    renderAdsTable();
    setupAdsEventListeners();
}

function updateAdsStatCards() {
    const totalPackages = adPackages.length;
    const activeOrders = adOrders.filter(o => o.status === 'active').length;

    const totalPackagesEl = document.getElementById('statTotalPackages');
    const activeOrdersEl = document.getElementById('statActiveOrders');
    const revenueEl = document.getElementById('statRevenue');
    const renewalEl = document.getElementById('statRenewalRate');

    if (totalPackagesEl) totalPackagesEl.textContent = `${totalPackages} gói`;
    if (activeOrdersEl) activeOrdersEl.textContent = `${activeOrders} đơn`;
    if (revenueEl) revenueEl.textContent = '36.500.000đ';
    if (renewalEl) renewalEl.textContent = '84.5%';
}

function switchAdsTab(tabName) {
    currentAdsTab = tabName;
    const tabBtns = document.querySelectorAll('.content-tab-btn');
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const addBtnLabel = document.getElementById('addAdBtnLabel');
    const searchInput = document.getElementById('adsSearchInput');

    if (addBtnLabel) {
        if (tabName === 'packages') {
            addBtnLabel.textContent = '+ Tạo Gói Dịch Vụ Mới';
        } else if (tabName === 'orders') {
            addBtnLabel.textContent = '+ Tạo Đơn Dịch Vụ Mới';
        } else {
            addBtnLabel.textContent = '+ Thêm Vị Trí Slot Mới';
        }
    }

    if (searchInput) {
        if (tabName === 'packages') {
            searchInput.placeholder = 'Tìm tên gói dịch vụ, giá, vị trí...';
        } else if (tabName === 'orders') {
            searchInput.placeholder = 'Tìm mã đơn, tên homestay, chủ nhà...';
        } else {
            searchInput.placeholder = 'Tìm vị trí slot, kích thước...';
        }
    }

    renderAdsTable();
}

function renderAdsTable() {
    const container = document.getElementById('adsTableBody');
    const tableHeader = document.getElementById('adsTableHeader');
    if (!container || !tableHeader) return;

    const searchVal = (document.getElementById('adsSearchInput')?.value || '').toLowerCase();
    const statusVal = document.getElementById('adsStatusFilter')?.value || 'all';

    if (currentAdsTab === 'packages') {
        // --- TAB 1: GÓI DỊCH VỤ ĐANG BÁN ---
        tableHeader.innerHTML = `
            <tr>
                <th>Tên Gói Dịch Vụ & Phân Loại</th>
                <th>Vị Trí & Hình Thức Tiếp Thị</th>
                <th>Thời Hạn Gói</th>
                <th>Giá Niêm Yết</th>
                <th>Quyền Lợi Nổi Bật</th>
                <th>Đơn Đã Bán / Doanh Thu</th>
                <th>Trạng Thái</th>
                <th style="text-align: right;">Thao tác</th>
            </tr>
        `;

        let filtered = adPackages.filter(item => {
            const matchSearch = item.name.toLowerCase().includes(searchVal) ||
                                item.placementText.toLowerCase().includes(searchVal) ||
                                item.desc.toLowerCase().includes(searchVal);
            const matchStatus = statusVal === 'all' || item.status === statusVal;
            return matchSearch && matchStatus;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted);">Không tìm thấy gói dịch vụ quảng cáo phù hợp.</td></tr>`;
            return;
        }

        container.innerHTML = filtered.map(item => `
            <tr>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <strong style="font-size: 14px; color: var(--text-main);">${item.name}</strong>
                            <span class="package-badge ${item.badgeClass}">${item.categoryText}</span>
                        </div>
                        <span style="font-size: 12px; color: var(--text-muted);">${item.desc}</span>
                    </div>
                </td>
                <td>
                    <span class="placement-badge ${item.placement === 'top5' ? 'hero' : item.placement}">
                        <span class="material-symbols-outlined" style="font-size: 14px;">rocket_launch</span>
                        ${item.placementText}
                    </span>
                </td>
                <td>
                    <span style="font-size: 13px; font-weight: 700; color: #475569;">${item.duration}</span>
                </td>
                <td>
                    <span class="price-tag">${item.priceFormatted}</span>
                </td>
                <td>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px; max-width: 260px;">
                        ${item.features.map(f => `<span class="feature-pill">✓ ${f}</span>`).join('')}
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span style="font-size: 13px; font-weight: 700; color: var(--text-main);">${item.soldCount} đơn đã bán</span>
                        <span style="font-size: 11.5px; color: #15803D; font-weight: 600;">${item.totalRevenue}</span>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${item.status === 'active' ? 'active' : 'ended'}">
                        ${item.statusText}
                    </span>
                </td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon" title="Tạm ngưng / Mở bán" onclick="togglePackageStatus('${item.id}')">
                            <span class="material-symbols-outlined">${item.status === 'active' ? 'pause_circle' : 'play_circle'}</span>
                        </button>
                        <button class="btn-action-icon" title="Chỉnh sửa gói" onclick="editPackage('${item.id}')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-action-icon danger" title="Xóa gói" onclick="deletePackage('${item.id}')">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } else if (currentAdsTab === 'orders') {
        // --- TAB 2: ĐƠN MUA & ĐANG CHẠY CỦA CHỦ NHÀ ---
        tableHeader.innerHTML = `
            <tr>
                <th>Mã Đơn & Homestay</th>
                <th>Gói Dịch Vụ Mua</th>
                <th>Giá Trị Đơn</th>
                <th>Thời Gian & Hiệu Lực</th>
                <th>Lượt Tiếp Cận (Impressions / CTR)</th>
                <th>Trạng Thái Đơn</th>
                <th style="text-align: right;">Thao tác</th>
            </tr>
        `;

        let filtered = adOrders.filter(item => {
            const matchSearch = item.code.toLowerCase().includes(searchVal) ||
                                item.homestay.toLowerCase().includes(searchVal) ||
                                item.host.toLowerCase().includes(searchVal) ||
                                item.packageName.toLowerCase().includes(searchVal);
            const matchStatus = statusVal === 'all' || item.status === statusVal;
            return matchSearch && matchStatus;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted);">Không tìm thấy đơn hàng quảng cáo nào.</td></tr>`;
            return;
        }

        container.innerHTML = filtered.map(item => `
            <tr>
                <td>
                    <div class="cell-item-title">
                        <img src="${item.img}" alt="${item.homestay}" class="banner-thumb">
                        <div class="item-name-group">
                            <span class="order-code-badge">${item.code}</span>
                            <span class="item-name" style="margin-top: 2px;">${item.homestay}</span>
                            <div class="host-sub">
                                <span class="material-symbols-outlined" style="font-size: 14px;">person</span>
                                Chủ nhà: ${item.host}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <strong style="font-size: 13.5px; color: #15803D;">${item.packageName}</strong>
                        <span class="placement-badge ${item.placement === 'top5' ? 'hero' : item.placement}">
                            ${item.placementText}
                        </span>
                    </div>
                </td>
                <td>
                    <strong style="font-size: 14.5px; color: #0F172A;">${item.amount}</strong>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span style="font-size: 12.5px; font-weight: 600; color: #475569;">${item.startDate} - ${item.endDate}</span>
                        <span style="font-size: 11.5px; color: #0284C7; font-weight: 700;">${item.remaining}</span>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 3px;">
                        <div><strong style="font-size: 13.5px;">${item.impressions}</strong> <span style="font-size: 11px; color: #64748B;">lượt xem</span></div>
                        <span class="ctr-badge">
                            <span class="material-symbols-outlined" style="font-size: 14px;">trending_up</span>
                            ${item.clicks} clicks (${item.ctr})
                        </span>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${item.status === 'active' ? 'active' : (item.status === 'scheduled' ? 'upcoming' : 'ended')}">
                        ${item.statusText}
                    </span>
                </td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon" title="Tạm dừng / Tiếp tục" onclick="toggleOrderStatus('${item.id}')">
                            <span class="material-symbols-outlined">${item.status === 'active' ? 'pause_circle' : 'play_circle'}</span>
                        </button>
                        <button class="btn-action-icon" title="Chỉnh sửa đơn" onclick="editOrder('${item.id}')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-action-icon danger" title="Xóa đơn" onclick="deleteOrder('${item.id}')">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } else {
        // --- TAB 3: VỊ TRÍ & KHUNG HIỂN THỊ (SLOTS) ---
        tableHeader.innerHTML = `
            <tr>
                <th>Tên Vị Trí Slot</th>
                <th>Kích Thước & Loại Vị Trí</th>
                <th>Số Quảng Cáo Đang Chạy</th>
                <th>CTR Trung Bình</th>
                <th>Giá Bán Niêm Yết Đề Xuất</th>
                <th>Trạng Thái Khung</th>
                <th style="text-align: right;">Thao tác</th>
            </tr>
        `;

        container.innerHTML = adSlots.map(slot => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="material-symbols-outlined" style="color: #15803D; font-size: 24px;">ad_units</span>
                        <strong style="font-size: 14px;">${slot.name}</strong>
                    </div>
                </td>
                <td>
                    <span style="background: #F1F5F9; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 12px; color: #475569;">
                        ${slot.dimension}
                    </span>
                </td>
                <td>
                    <span class="status-badge active">${slot.activeAds} / ${slot.maxAds} Đang Active</span>
                </td>
                <td>
                    <span class="ctr-badge">★ ${slot.avgCtr}</span>
                </td>
                <td>
                    <strong style="color: #D97706; font-size: 14px;">${slot.pricePerMonth}</strong>
                </td>
                <td>
                    <span class="status-badge active">Sẵn sàng nhận Ads</span>
                </td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon" title="Cấu hình vị trí" onclick="alert('Cấu hình vị trí: ${slot.name}')">
                            <span class="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// ======================= MODAL CONTROLLERS =======================

function openCreateAdModal() {
    editingId = null;
    const modal = document.getElementById('adModalOverlay');
    const modalTitle = document.getElementById('adModalTitleText');
    const modalIcon = document.getElementById('adModalIcon');
    const pkgFields = document.getElementById('packageModalFields');
    const orderFields = document.getElementById('orderModalFields');

    if (!modal) return;

    if (currentAdsTab === 'packages' || currentAdsTab === 'slots') {
        if (modalTitle) modalTitle.textContent = 'Tạo Gói Dịch Vụ Quảng Cáo Mới';
        if (modalIcon) modalIcon.textContent = 'sell';
        if (pkgFields) pkgFields.style.display = 'block';
        if (orderFields) orderFields.style.display = 'none';

        document.getElementById('pkgNameInput').value = '';
        document.getElementById('pkgCategorySelect').value = 'hot';
        document.getElementById('pkgPriceInput').value = '';
        document.getElementById('pkgDurationInput').value = '30 ngày';
        document.getElementById('pkgPlacementSelect').value = 'top5';
        document.getElementById('pkgDescInput').value = '';
        document.getElementById('pkgFeaturesInput').value = '';
        document.getElementById('pkgStatusSelect').value = 'active';

    } else if (currentAdsTab === 'orders') {
        if (modalTitle) modalTitle.textContent = 'Tạo Đơn Dịch Vụ Quảng Cáo Mới';
        if (modalIcon) modalIcon.textContent = 'receipt_long';
        if (pkgFields) pkgFields.style.display = 'none';
        if (orderFields) orderFields.style.display = 'block';

        populatePackageSelect();

        document.getElementById('orderTargetInput').value = '';
        document.getElementById('orderTitleInput').value = '';
        document.getElementById('orderUrlInput').value = 'https://yenhomestay.com';
        document.getElementById('orderStartDateInput').value = 'Hôm nay';
        document.getElementById('orderEndDateInput').value = '30 ngày sau';
        document.getElementById('orderStatusSelect').value = 'active';
    }

    modal.classList.add('show');
}

function populatePackageSelect() {
    const select = document.getElementById('orderPackageSelect');
    if (!select) return;

    select.innerHTML = adPackages.map(pkg => `
        <option value="${pkg.id}" data-price="${pkg.priceFormatted}">${pkg.name} (${pkg.priceFormatted})</option>
    `).join('');

    syncOrderPackageDetails();
}

function syncOrderPackageDetails() {
    const select = document.getElementById('orderPackageSelect');
    const amountInput = document.getElementById('orderAmountInput');
    if (!select || !amountInput) return;

    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption) {
        amountInput.value = selectedOption.getAttribute('data-price') || '';
    }
}

function editPackage(id) {
    const item = adPackages.find(p => p.id === id);
    if (!item) return;

    editingId = id;
    const modal = document.getElementById('adModalOverlay');
    const modalTitle = document.getElementById('adModalTitleText');
    const modalIcon = document.getElementById('adModalIcon');
    const pkgFields = document.getElementById('packageModalFields');
    const orderFields = document.getElementById('orderModalFields');

    if (!modal) return;

    if (modalTitle) modalTitle.textContent = 'Chỉnh Sửa Gói Dịch Vụ Tiếp Thị';
    if (modalIcon) modalIcon.textContent = 'edit';
    if (pkgFields) pkgFields.style.display = 'block';
    if (orderFields) orderFields.style.display = 'none';

    document.getElementById('pkgNameInput').value = item.name;
    document.getElementById('pkgCategorySelect').value = item.category;
    document.getElementById('pkgPriceInput').value = item.priceFormatted;
    document.getElementById('pkgDurationInput').value = item.duration;
    document.getElementById('pkgPlacementSelect').value = item.placement;
    document.getElementById('pkgDescInput').value = item.desc;
    document.getElementById('pkgFeaturesInput').value = item.features.join('; ');
    document.getElementById('pkgStatusSelect').value = item.status;

    modal.classList.add('show');
}

function editOrder(id) {
    const item = adOrders.find(o => o.id === id);
    if (!item) return;

    editingId = id;
    const modal = document.getElementById('adModalOverlay');
    const modalTitle = document.getElementById('adModalTitleText');
    const modalIcon = document.getElementById('adModalIcon');
    const pkgFields = document.getElementById('packageModalFields');
    const orderFields = document.getElementById('orderModalFields');

    if (!modal) return;

    if (modalTitle) modalTitle.textContent = 'Chỉnh Sửa Đơn Dịch Vụ Quảng Cáo';
    if (modalIcon) modalIcon.textContent = 'edit_note';
    if (pkgFields) pkgFields.style.display = 'none';
    if (orderFields) orderFields.style.display = 'block';

    populatePackageSelect();

    document.getElementById('orderTargetInput').value = item.homestay;
    document.getElementById('orderPackageSelect').value = item.packageId;
    document.getElementById('orderAmountInput').value = item.amount;
    document.getElementById('orderTitleInput').value = item.packageName;
    document.getElementById('orderUrlInput').value = item.linkUrl;
    document.getElementById('orderStartDateInput').value = item.startDate;
    document.getElementById('orderEndDateInput').value = item.endDate;
    document.getElementById('orderStatusSelect').value = item.status;

    modal.classList.add('show');
}

function closeAdModal() {
    editingId = null;
    const modal = document.getElementById('adModalOverlay');
    if (modal) modal.classList.remove('show');
}

function saveCurrentData() {
    if (currentAdsTab === 'packages' || currentAdsTab === 'slots') {
        savePackageData();
    } else {
        saveOrderData();
    }
}

function savePackageData() {
    const name = document.getElementById('pkgNameInput').value.trim();
    const category = document.getElementById('pkgCategorySelect').value;
    const priceStr = document.getElementById('pkgPriceInput').value.trim();
    const duration = document.getElementById('pkgDurationInput').value.trim();
    const placement = document.getElementById('pkgPlacementSelect').value;
    const desc = document.getElementById('pkgDescInput').value.trim();
    const featuresRaw = document.getElementById('pkgFeaturesInput').value.trim();
    const status = document.getElementById('pkgStatusSelect').value;

    if (!name) {
        alert('Vui lòng nhập tên gói dịch vụ quảng cáo!');
        return;
    }

    const features = featuresRaw ? featuresRaw.split(';').map(f => f.trim()).filter(Boolean) : ['Hiển thị ưu tiên'];

    let badgeClass = 'standard';
    let categoryText = 'Ngắn hạn';
    if (category === 'hot') { badgeClass = 'hot'; categoryText = 'HOT Dài hạn'; }
    else if (category === 'vip') { badgeClass = 'vip'; categoryText = 'VIP Toàn Diện'; }
    else if (category === 'seasonal') { badgeClass = 'seasonal'; categoryText = 'Mùa Lễ Hội'; }

    let placementText = 'TOP 5 Trang Tìm Kiếm';
    if (placement === 'hero') placementText = 'Hero Slider Trang Chủ';
    else if (placement === 'combo') placementText = 'Thẻ Combo Giữa Trang Chủ';
    else if (placement === 'popup') placementText = 'Pop-up Chào Mừng Du Khách';
    else if (placement === 'festival') placementText = 'Chiến Dịch Mùa Lễ Hội';

    let formattedPrice = priceStr;
    if (!formattedPrice.includes('đ')) {
        formattedPrice = Number(priceStr.replace(/\D/g, '') || 500000).toLocaleString('vi-VN') + 'đ';
    }

    if (editingId) {
        const index = adPackages.findIndex(p => p.id === editingId);
        if (index !== -1) {
            adPackages[index].name = name;
            adPackages[index].category = category;
            adPackages[index].categoryText = categoryText;
            adPackages[index].badgeClass = badgeClass;
            adPackages[index].priceFormatted = formattedPrice;
            adPackages[index].duration = duration || '30 ngày';
            adPackages[index].placement = placement;
            adPackages[index].placementText = placementText;
            adPackages[index].desc = desc || adPackages[index].desc;
            adPackages[index].features = features;
            adPackages[index].status = status;
            adPackages[index].statusText = status === 'active' ? 'Đang mở bán' : 'Tạm ngưng';
        }
    } else {
        adPackages.unshift({
            id: 'pkg-' + Date.now(),
            name: name,
            category: category,
            categoryText: categoryText,
            badgeClass: badgeClass,
            price: 500000,
            priceFormatted: formattedPrice,
            duration: duration || '30 ngày',
            placement: placement,
            placementText: placementText,
            desc: desc || 'Gói dịch vụ tiếp thị mới cho Homestay',
            features: features,
            soldCount: 0,
            totalRevenue: '0đ',
            status: status,
            statusText: status === 'active' ? 'Đang mở bán' : 'Tạm ngưng'
        });
    }

    closeAdModal();
    updateAdsStatCards();
    renderAdsTable();
}

function saveOrderData() {
    const homestay = document.getElementById('orderTargetInput').value.trim();
    const pkgId = document.getElementById('orderPackageSelect').value;
    const amount = document.getElementById('orderAmountInput').value.trim();
    const title = document.getElementById('orderTitleInput').value.trim();
    const url = document.getElementById('orderUrlInput').value.trim();
    const startDate = document.getElementById('orderStartDateInput').value.trim() || 'Hôm nay';
    const endDate = document.getElementById('orderEndDateInput').value.trim() || '30 ngày sau';
    const status = document.getElementById('orderStatusSelect').value;

    if (!homestay) {
        alert('Vui lòng nhập tên Homestay hoặc đối tác!');
        return;
    }

    const pkg = adPackages.find(p => p.id === pkgId) || adPackages[0];

    let statusText = 'Đang chạy';
    if (status === 'scheduled') statusText = 'Đã lên lịch';
    if (status === 'ended') statusText = 'Hoàn thành';

    if (editingId) {
        const index = adOrders.findIndex(o => o.id === editingId);
        if (index !== -1) {
            adOrders[index].homestay = homestay;
            adOrders[index].packageId = pkg.id;
            adOrders[index].packageName = pkg.name;
            adOrders[index].amount = amount || pkg.priceFormatted;
            adOrders[index].linkUrl = url || adOrders[index].linkUrl;
            adOrders[index].startDate = startDate;
            adOrders[index].endDate = endDate;
            adOrders[index].status = status;
            adOrders[index].statusText = statusText;
        }
    } else {
        adOrders.unshift({
            id: 'ord-' + Date.now(),
            code: 'ORD-ADS-' + Math.floor(1000 + Math.random() * 9000),
            homestay: homestay,
            host: 'Đối tác mới',
            packageId: pkg.id,
            packageName: pkg.name,
            amount: amount || pkg.priceFormatted,
            placement: pkg.placement,
            placementText: pkg.placementText,
            startDate: startDate,
            endDate: endDate,
            remaining: 'Còn 30 ngày',
            impressions: '1,200',
            clicks: '85',
            ctr: '7.08%',
            status: status,
            statusText: statusText,
            img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
            linkUrl: url || 'https://yenhomestay.com'
        });
    }

    closeAdModal();
    updateAdsStatCards();
    renderAdsTable();
}

function togglePackageStatus(id) {
    const pkg = adPackages.find(p => p.id === id);
    if (!pkg) return;

    if (pkg.status === 'active') {
        pkg.status = 'ended';
        pkg.statusText = 'Tạm ngưng';
    } else {
        pkg.status = 'active';
        pkg.statusText = 'Đang mở bán';
    }

    updateAdsStatCards();
    renderAdsTable();
}

function toggleOrderStatus(id) {
    const order = adOrders.find(o => o.id === id);
    if (!order) return;

    if (order.status === 'active') {
        order.status = 'ended';
        order.statusText = 'Tạm dừng';
    } else {
        order.status = 'active';
        order.statusText = 'Đang chạy';
    }

    updateAdsStatCards();
    renderAdsTable();
}

function deletePackage(id) {
    if (confirm('Bạn có chắc chắn muốn xóa gói dịch vụ tiếp thị này?')) {
        adPackages = adPackages.filter(p => p.id !== id);
        updateAdsStatCards();
        renderAdsTable();
    }
}

function deleteOrder(id) {
    if (confirm('Bạn có chắc chắn muốn xóa đơn dịch vụ quảng cáo này?')) {
        adOrders = adOrders.filter(o => o.id !== id);
        updateAdsStatCards();
        renderAdsTable();
    }
}

function setupAdsEventListeners() {
    const searchInput = document.getElementById('adsSearchInput');
    const statusFilter = document.getElementById('adsStatusFilter');

    if (searchInput) searchInput.addEventListener('input', renderAdsTable);
    if (statusFilter) statusFilter.addEventListener('change', renderAdsTable);
}
