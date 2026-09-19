/**
 * ==========================================================================
 * YÊN HOMESTAY ADMIN - ADS MANAGEMENT JS
 * File: opencms-core-master/.../admin/JS/ads_management.js
 * Quản lý logic CRUD: Banner Quảng cáo, Vị trí hiển thị & Homestay Ads
 * ==========================================================================
 */

let editingAdId = null;

// Dữ liệu mẫu Chiến dịch / Banner Quảng cáo
let initialAds = [
    {
        id: 'ad-1',
        title: 'Hero Banner: Ưu Đãi Mùa Lễ Hội Pháo Hoa DIFF 2026',
        placement: 'hero',
        placementText: 'Hero Slider Trang Chủ',
        linkUrl: 'https://yenhomestay.com/festival/diff',
        targetHomestay: 'Han River Glass House & Cozy Villa',
        startDate: '01/05/2026',
        endDate: '15/07/2026',
        impressions: '58,420',
        clicks: '5,120',
        ctr: '8.76%',
        status: 'active',
        statusText: 'Đang chạy',
        img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'ad-2',
        title: 'Combo Banner: Homestay Tốt Nhất Hôm Nay - Giảm 25%',
        placement: 'combo',
        placementText: 'Banner Combo Tiết Kiệm',
        linkUrl: 'https://yenhomestay.com/combo/hot-today',
        targetHomestay: 'The Memory Valley Villa',
        startDate: '10/05/2026',
        endDate: '30/08/2026',
        impressions: '42,150',
        clicks: '3,890',
        ctr: '9.22%',
        status: 'active',
        statusText: 'Đang chạy',
        img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'ad-3',
        title: 'Sapa Cloud Lodge - Đặt Phòng Săn Mây Mùa Thu',
        placement: 'hero',
        placementText: 'Hero Slider Trang Chủ',
        linkUrl: 'https://yenhomestay.com/homestay/sapa-cloud',
        targetHomestay: 'Sapa Cloud Forest Lodge',
        startDate: '01/09/2026',
        endDate: '31/10/2026',
        impressions: '24,100',
        clicks: '1,950',
        ctr: '8.09%',
        status: 'scheduled',
        statusText: 'Đã lên lịch',
        img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'ad-4',
        title: 'Popup Khuyến Mãi: Tặng Mã YENNEW2026 Giảm 100k',
        placement: 'popup',
        placementText: 'Pop-up Khuyến Mãi',
        linkUrl: 'https://yenhomestay.com/voucher/newuser',
        targetHomestay: 'Tất cả Homestay hệ thống',
        startDate: '01/01/2026',
        endDate: '31/12/2026',
        impressions: '89,600',
        clicks: '7,430',
        ctr: '8.29%',
        status: 'active',
        statusText: 'Đang chạy',
        img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
    }
];

// Dữ liệu Vị trí Quảng cáo (Slots)
let adSlots = [
    {
        id: 'slot-hero',
        name: 'Hero Slider Trang Chủ',
        dimension: '1920 x 600 px',
        activeAds: 2,
        maxAds: 5,
        avgCtr: '8.4%',
        pricePerMonth: '5.000.000đ/tháng'
    },
    {
        id: 'slot-combo',
        name: 'Banner Combo Tiết Kiệm',
        dimension: '1200 x 400 px',
        activeAds: 1,
        maxAds: 3,
        avgCtr: '9.2%',
        pricePerMonth: '3.500.000đ/tháng'
    },
    {
        id: 'slot-popup',
        name: 'Pop-up Khuyến Mãi Đầu Trang',
        dimension: '600 x 400 px',
        activeAds: 1,
        maxAds: 2,
        avgCtr: '8.3%',
        pricePerMonth: '4.000.000đ/tháng'
    },
    {
        id: 'slot-festival',
        name: 'Banner Khu Vực Lễ Hội',
        dimension: '1200 x 300 px',
        activeAds: 1,
        maxAds: 4,
        avgCtr: '8.9%',
        pricePerMonth: '3.000.000đ/tháng'
    }
];

let currentAdsTab = 'banners'; // 'banners' | 'slots'

document.addEventListener('DOMContentLoaded', () => {
    initAdsModule();
});

function initAdsModule() {
    updateAdsStatCards();
    renderAdsTable();
    setupAdsEventListeners();
}

function updateAdsStatCards() {
    const totalAds = initialAds.length;
    const activeAds = initialAds.filter(a => a.status === 'active').length;
    
    let totalImpressions = 214.2; // K
    let avgCtr = '8.59%';

    const totalAdsEl = document.getElementById('statTotalAds');
    const activeAdsEl = document.getElementById('statActiveAds');
    const impressionsEl = document.getElementById('statTotalImpressions');
    const ctrEl = document.getElementById('statAvgCtr');

    if (totalAdsEl) totalAdsEl.textContent = totalAds;
    if (activeAdsEl) activeAdsEl.textContent = activeAds;
    if (impressionsEl) impressionsEl.textContent = `${totalImpressions}K`;
    if (ctrEl) ctrEl.textContent = avgCtr;
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
    if (addBtnLabel) {
        addBtnLabel.textContent = tabName === 'banners' ? 'Tạo Quảng cáo mới' : 'Thêm Vị trí Slot mới';
    }

    renderAdsTable();
}

function renderAdsTable() {
    const container = document.getElementById('adsTableBody');
    const tableHeader = document.getElementById('adsTableHeader');
    if (!container || !tableHeader) return;

    const searchVal = (document.getElementById('adsSearchInput')?.value || '').toLowerCase();
    const statusVal = document.getElementById('adsStatusFilter')?.value || 'all';

    if (currentAdsTab === 'banners') {
        tableHeader.innerHTML = `
            <tr>
                <th>Banner Quảng cáo</th>
                <th>Vị trí hiển thị (Slot)</th>
                <th>Homestay / Đích đến</th>
                <th>Thời gian chạy</th>
                <th>Lượt xem (Impressions)</th>
                <th>Tỷ lệ Click (CTR)</th>
                <th>Trạng thái</th>
                <th style="text-align: right;">Thao tác</th>
            </tr>
        `;

        let filtered = initialAds.filter(item => {
            const matchSearch = item.title.toLowerCase().includes(searchVal) || item.targetHomestay.toLowerCase().includes(searchVal);
            const matchStatus = statusVal === 'all' || item.status === statusVal;
            return matchSearch && matchStatus;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted);">Không tìm thấy quảng cáo phù hợp.</td></tr>`;
            return;
        }

        container.innerHTML = filtered.map(item => `
            <tr>
                <td>
                    <div class="cell-item-title">
                        <img src="${item.img}" alt="${item.title}" class="banner-thumb">
                        <div class="item-name-group">
                            <span class="item-name">${item.title}</span>
                            <a href="${item.linkUrl}" target="_blank" style="font-size: 11.5px; color: #0284C7; text-decoration: underline;">${item.linkUrl}</a>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="placement-badge ${item.placement}">
                        <span class="material-symbols-outlined" style="font-size: 14px;">view_carousel</span>
                        ${item.placementText}
                    </span>
                </td>
                <td><strong style="color: #15803D; font-size: 13px;">${item.targetHomestay}</strong></td>
                <td><span style="font-size: 12.5px; font-weight: 600; color: #475569;">${item.startDate} - ${item.endDate}</span></td>
                <td><strong style="font-size: 14px;">${item.impressions}</strong> <span style="font-size: 11px; color: #94A3B8;">lượt</span></td>
                <td>
                    <span class="ctr-badge">
                        <span class="material-symbols-outlined" style="font-size: 16px;">trending_up</span>
                        ${item.clicks} (${item.ctr})
                    </span>
                </td>
                <td>
                    <span class="status-badge ${item.status === 'active' ? 'active' : (item.status === 'scheduled' ? 'upcoming' : 'ended')}">
                        ${item.statusText}
                    </span>
                </td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon" title="Tạm dừng / Tiếp tục" onclick="toggleAdStatus('${item.id}')">
                            <span class="material-symbols-outlined">${item.status === 'active' ? 'pause_circle' : 'play_circle'}</span>
                        </button>
                        <button class="btn-action-icon" title="Chỉnh sửa" onclick="editAdCampaign('${item.id}')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-action-icon danger" title="Xóa" onclick="deleteAdCampaign('${item.id}')">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } else {
        // Tab Vị trí hiển thị (Slots)
        tableHeader.innerHTML = `
            <tr>
                <th>Tên Vị Trí Slot</th>
                <th>Kích thước đề xuất</th>
                <th>Số Quảng cáo Đang chạy</th>
                <th>CTR Trung bình</th>
                <th>Giá niêm yết Quảng cáo</th>
                <th>Trạng thái Slot</th>
                <th style="text-align: right;">Thao tác</th>
            </tr>
        `;

        container.innerHTML = adSlots.map(slot => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="material-symbols-outlined" style="color: #9333EA; font-size: 24px;">ad_units</span>
                        <strong style="font-size: 14px;">${slot.name}</strong>
                    </div>
                </td>
                <td><span style="background: #F1F5F9; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 12px; color: #475569;">${slot.dimension}</span></td>
                <td><span class="status-badge active">${slot.activeAds} / ${slot.maxAds} Banners Active</span></td>
                <td><span class="ctr-badge">★ ${slot.avgCtr}</span></td>
                <td><strong style="color: #D97706; font-size: 14px;">${slot.pricePerMonth}</strong></td>
                <td><span class="status-badge active">Sẵn sàng nhận Ads</span></td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon" title="Cấu hình vị trí" onclick="alert('Cấu hình slot: ${slot.name}')">
                            <span class="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

function updateAdPlacementHint() {
    const select = document.getElementById('adPlacementSelect');
    const hintText = document.getElementById('adPlacementHintText');
    if (!select || !hintText) return;

    const val = select.value;
    if (val === 'hero') {
        hintText.innerHTML = '🎯 <strong>Hero Slider Trang Chủ (1920x600px)</strong> — Banner chính tràn màn hình xuất hiện ngay đầu trang web.';
    } else if (val === 'combo') {
        hintText.innerHTML = '🏷️ <strong>Banner Combo Tiết Kiệm (1200x400px)</strong> — Banner thẻ combo ưu đãi nổi bật ở khu vực giữa trang chủ.';
    } else if (val === 'popup') {
        hintText.innerHTML = '💬 <strong>Pop-up Khuyến Mãi (600x400px)</strong> — Hộp quà/Voucher tự nổ ra khi du khách vừa truy cập trang.';
    } else if (val === 'festival') {
        hintText.innerHTML = '📍 <strong>Banner Khu Vực Lễ Hội (1200x300px)</strong> — Banner gắn ở khu vực sự kiện mùa lễ hội Đà Nẵng, Đà Lạt, Huế...';
    } else if (val === 'sidebar') {
        hintText.innerHTML = '📌 <strong>Sidebar Homestay Chi Tiết (300x450px)</strong> — Cột quảng cáo cố định ở trang danh sách & chi tiết Homestay.';
    }
}

function toggleAdStatus(id) {
    const ad = initialAds.find(a => a.id === id);
    if (!ad) return;

    if (ad.status === 'active') {
        ad.status = 'ended';
        ad.statusText = 'Tạm dừng';
    } else {
        ad.status = 'active';
        ad.statusText = 'Đang chạy';
    }

    updateAdsStatCards();
    renderAdsTable();
}

function openCreateAdModal() {
    editingAdId = null;
    const modal = document.getElementById('adModalOverlay');
    const modalTitle = document.getElementById('adModalTitleText');
    if (!modal) return;

    if (modalTitle) modalTitle.textContent = 'Tạo Chiến Dịch Quảng Cáo Mới';

    document.getElementById('adTitleInput').value = '';
    document.getElementById('adPlacementSelect').value = 'hero';
    document.getElementById('adTargetInput').value = '';
    document.getElementById('adUrlInput').value = '';
    document.getElementById('adStartDateInput').value = '';
    document.getElementById('adEndDateInput').value = '';
    document.getElementById('adStatusSelect').value = 'active';

    updateAdPlacementHint();
    modal.classList.add('show');
}

function editAdCampaign(id) {
    const ad = initialAds.find(a => a.id === id);
    if (!ad) return;

    editingAdId = id;
    const modal = document.getElementById('adModalOverlay');
    const modalTitle = document.getElementById('adModalTitleText');
    if (!modal) return;

    if (modalTitle) modalTitle.textContent = 'Chỉnh Sửa Chiến Dịch Quảng Cáo';

    document.getElementById('adTitleInput').value = ad.title;
    document.getElementById('adPlacementSelect').value = ad.placement;
    document.getElementById('adTargetInput').value = ad.targetHomestay;
    document.getElementById('adUrlInput').value = ad.linkUrl;
    document.getElementById('adStartDateInput').value = ad.startDate;
    document.getElementById('adEndDateInput').value = ad.endDate;
    document.getElementById('adStatusSelect').value = ad.status;

    updateAdPlacementHint();
    modal.classList.add('show');
}

function closeAdModal() {
    editingAdId = null;
    const modal = document.getElementById('adModalOverlay');
    if (modal) modal.classList.remove('show');
}

function getPlacementText(val) {
    if (val === 'hero') return 'Hero Slider Trang Chủ';
    if (val === 'combo') return 'Banner Combo Tiết Kiệm';
    if (val === 'popup') return 'Pop-up Khuyến Mãi';
    if (val === 'festival') return 'Banner Mùa Lễ Hội';
    if (val === 'sidebar') return 'Sidebar Trang Chi Tiết';
    return 'Hero Slider Trang Chủ';
}

function saveAdData() {
    const title = document.getElementById('adTitleInput').value.trim();
    const placement = document.getElementById('adPlacementSelect').value;
    const target = document.getElementById('adTargetInput').value.trim();
    const url = document.getElementById('adUrlInput').value.trim();
    const startDate = document.getElementById('adStartDateInput').value.trim() || 'Hôm nay';
    const endDate = document.getElementById('adEndDateInput').value.trim() || '30 ngày sau';
    const status = document.getElementById('adStatusSelect').value;

    if (!title) {
        alert('Vui lòng nhập tên chiến dịch quảng cáo!');
        return;
    }

    const placementText = getPlacementText(placement);

    let statusText = 'Đang chạy';
    if (status === 'scheduled') statusText = 'Đã lên lịch';
    if (status === 'ended') statusText = 'Tạm dừng';

    if (editingAdId !== null) {
        const index = initialAds.findIndex(a => a.id === editingAdId);
        if (index !== -1) {
            initialAds[index].title = title;
            initialAds[index].placement = placement;
            initialAds[index].placementText = placementText;
            initialAds[index].targetHomestay = target || initialAds[index].targetHomestay;
            initialAds[index].linkUrl = url || initialAds[index].linkUrl;
            initialAds[index].startDate = startDate;
            initialAds[index].endDate = endDate;
            initialAds[index].status = status;
            initialAds[index].statusText = statusText;
        }
    } else {
        initialAds.unshift({
            id: 'ad-' + Date.now(),
            title: title,
            placement: placement,
            placementText: placementText,
            linkUrl: url || 'https://yenhomestay.com/promo',
            targetHomestay: target || 'Khuyến mãi hệ thống YÊN',
            startDate: startDate,
            endDate: endDate,
            impressions: '1,200',
            clicks: '98',
            ctr: '8.17%',
            status: status,
            statusText: statusText,
            img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        });
    }

    closeAdModal();
    updateAdsStatCards();
    renderAdsTable();
}

function deleteAdCampaign(id) {
    if (confirm('Bạn có chắc chắn muốn xóa chiến dịch quảng cáo này?')) {
        initialAds = initialAds.filter(a => a.id !== id);
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
