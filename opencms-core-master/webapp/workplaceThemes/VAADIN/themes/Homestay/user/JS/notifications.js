/**
 * YÊN HOMESTAY USER - NOTIFICATION CENTER LOGIC
 * Manages user notifications, categories, detail popup modal, and copy functions.
 */

let userNotifications = [
    {
        id: 'noti-101',
        category: 'trip',
        title: 'Nhắc lịch check-in: Sapa Cloud Forest Lodge ngày mai',
        desc: 'Chuyến đi Sapa của bạn sắp bắt đầu! Thời gian nhận phòng là 14:00 ngày mai (21/09/2026). Phòng Bungalow view thung lũng Mường Hoa & bồn tắm lá thuốc Dao Đỏ đã sẵn sàng đón bạn.',
        timestamp: '5 phút trước',
        unread: true,
        iconClass: 'trip',
        icon: 'bi-calendar-event-fill',
        statusBadge: 'Sắp nhận phòng',
        statusClass: 'trip',
        meta: [
            { icon: 'bi-geo-alt-fill', text: 'Bản Tả Van, Sapa' },
            { icon: 'bi-hash', text: 'Mã booking #BK-8102' },
            { icon: 'bi-clock-fill', text: 'Nhận phòng: 14:00 (21/09)' }
        ],
        details: [
            { label: 'Homestay:', val: 'Sapa Cloud Forest Lodge' },
            { label: 'Địa chỉ:', val: 'Bản Tả Van, Huyện Sa Pa, Lào Cai' },
            { label: 'Mã đặt phòng:', val: '#BK-8102', copyable: true },
            { label: 'Thời gian ở:', val: '21/09/2026 - 23/09/2026 (2 đêm)' },
            { label: 'Trạng thái cọc:', val: 'Đã thanh toán cọc 100%' }
        ],
        mainActionText: 'Xem lịch trình chuyến đi',
        mainActionUrl: 'personal-account.html'
    },
    {
        id: 'noti-102',
        category: 'booking',
        title: 'Xác nhận đặt phòng & giữ cọc thành công #BK-9042',
        desc: 'Đơn đặt phòng tại Pù Luông Eco Lodge cho 2 đêm (24/09 - 26/09/2026) đã được xác nhận thành công. Số tiền cọc 850.000đ được sàn YÊN giữ an toàn theo chính sách Bảo Vệ Khách Hàng.',
        timestamp: '30 phút trước',
        unread: true,
        iconClass: 'booking',
        icon: 'bi-check-circle-fill',
        statusBadge: 'Đã xác nhận phòng',
        statusClass: 'booking',
        meta: [
            { icon: 'bi-house-heart-fill', text: 'Pù Luông Eco Lodge' },
            { icon: 'bi-shield-check', text: 'Cọc YÊN bảo đảm 50%' },
            { icon: 'bi-credit-card-2-front', text: 'VNPay QR (850.000đ)' }
        ],
        details: [
            { label: 'Tên Homestay:', val: 'Pù Luông Eco Lodge' },
            { label: 'Khu vực:', val: 'Bản Đôn, Thanh Hóa' },
            { label: 'Mã Booking:', val: '#BK-9042', copyable: true },
            { label: 'Tiền cọc đã giữ:', val: '850.000đ (50% giá phòng)' },
            { label: 'Tiền thanh toán tại nơi:', val: '850.000đ (Trả khi check-in)' }
        ],
        mainActionText: 'Xem phiếu đặt phòng',
        mainActionUrl: 'personal-account.html'
    },
    {
        id: 'noti-103',
        category: 'promo',
        title: 'Tặng riêng bạn voucher YENAUTUMN2026 giảm 15%',
        desc: 'Sắc thu Đà Lạt rực rỡ đang chờ đón bạn! Tặng riêng bạn mã giảm giá 15% (tối đa 200.000đ) khi đặt phòng tại các biệt thự & bungalow đồi thông Đà Lạt.',
        timestamp: '2 giờ trước',
        unread: true,
        iconClass: 'promo',
        icon: 'bi-gift-fill',
        statusBadge: 'Ưu đãi có hiệu lực',
        statusClass: 'promo',
        meta: [
            { icon: 'bi-tag-fill', text: 'Mã: YENAUTUMN2026' },
            { icon: 'bi-clock-history', text: 'Hạn dùng: 31/10/2026' },
            { icon: 'bi-ticket-perforated', text: 'Áp dụng đơn từ 800k' }
        ],
        details: [
            { label: 'Mã ưu đãi:', val: 'YENAUTUMN2026', copyable: true },
            { label: 'Mức giảm:', val: 'Giảm 15% (Tối đa 200.000đ)' },
            { label: 'Điều kiện áp dụng:', val: 'Đơn từ 800.000đ tại Homestay Đà Lạt' },
            { label: 'Hạn sử dụng:', val: '31/10/2026 (Còn 40 ngày)' }
        ],
        mainActionText: 'Áp dụng mã & Đặt Đà Lạt',
        mainActionUrl: 'homepage.html'
    },
    {
        id: 'noti-104',
        category: 'payment',
        title: 'Hoàn tiền thành công 1.500.000đ về Ví MoMo',
        desc: 'Giao dịch hoàn tiền #GD-88198 đã hoàn tất thành công. Số tiền 1.500.000đ đã được chuyển trực tiếp về ví MoMo của bạn do đơn hủy phòng Mộc Châu đáp ứng đúng điều kiện hủy trước 48h.',
        timestamp: 'Hôm qua',
        unread: false,
        iconClass: 'payment',
        icon: 'bi-wallet2',
        statusBadge: 'Đã hoàn tiền',
        statusClass: 'payment',
        meta: [
            { icon: 'bi-receipt', text: 'Mã GD: #GD-88198' },
            { icon: 'bi-currency-exchange', text: 'Số tiền: 1.500.000đ' },
            { icon: 'bi-patch-check', text: 'MoMo Trace ID: MOMO-77281049' }
        ],
        details: [
            { label: 'Loại giao dịch:', val: 'Hoàn tiền cọc hủy phòng' },
            { label: 'Mã Giao Dịch:', val: '#GD-88198', copyable: true },
            { label: 'Số tiền hoàn lại:', val: '1.500.000đ' },
            { label: 'Kênh nhận tiền:', val: 'Ví Điện Tử MoMo' },
            { label: 'Trace Reference ID:', val: 'MOMO-77281049' }
        ],
        mainActionText: 'Xem sao kê tài chính',
        mainActionUrl: 'personal-account.html'
    },
    {
        id: 'noti-105',
        category: 'promo',
        title: 'Tặng 50.000 YÊN Point khi viết đánh giá chuyến đi',
        desc: 'Bạn vừa hoàn thành chuyến đi 3N2Đ tại Nhà Sàn Mộc Mai Châu! Hãy chia sẻ cảm nhận & 1 bức ảnh trải nghiệm thực tế để nhận ngay 50.000 YÊN Point tích lũy.',
        timestamp: '3 ngày trước',
        unread: false,
        iconClass: 'review',
        icon: 'bi-star-fill',
        statusBadge: 'Nhận điểm thưởng',
        statusClass: 'review',
        meta: [
            { icon: 'bi-house-check', text: 'Nhà Sàn Mộc Mai Châu' },
            { icon: 'bi-coin', text: '+50.000 YÊN Point' }
        ],
        details: [
            { label: 'Chuyến đi vừa qua:', val: 'Nhà Sàn Mộc Mai Châu (3N2Đ)' },
            { label: 'Quà tặng đánh giá:', val: '+50.000 YÊN Point (Đổi 50k khi đặt đơn sau)' },
            { label: 'Yêu cầu:', val: 'Viết từ 20 từ & Kèm 1 ảnh thực tế' }
        ],
        mainActionText: 'Viết đánh giá ngay',
        mainActionUrl: 'javascript:void(0)',
        mainActionClick: "showToast('Đang mở form viết đánh giá chuyến đi...')"
    }
];

let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadExternalHeader === 'function') {
        loadExternalHeader('header-placeholder', 'header.html', 'Thông báo');
    }
    initNotifications();
});

function initNotifications() {
    renderNotificationsList();
    bindCategoryTabs();

    // Backdrop click to close modal
    const overlay = document.getElementById('notiModalOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeNotificationModal();
        });
    }
}

function renderNotificationsList() {
    const listContainer = document.getElementById('notiListContainer');
    if (!listContainer) return;

    let filtered = userNotifications.filter(item => {
        if (activeCategory === 'all') return true;
        return item.category === activeCategory;
    });

    updateHeaderAndTabBadges();

    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-noti-box">
                <div class="empty-noti-icon"><i class="bi bi-bell-slash"></i></div>
                <h3>Không có thông báo nào</h3>
                <p>Bạn đã xem hết thông báo trong chuyên mục này.</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = filtered.map(item => `
        <div class="noti-card-item ${item.unread ? 'unread' : ''}" id="${item.id}" onclick="openNotificationDetail('${item.id}')">
            <div class="noti-type-icon ${item.iconClass}">
                <i class="bi ${item.icon}"></i>
            </div>

            <div class="noti-item-content">
                <div class="noti-item-header">
                    <div class="noti-item-title-wrap">
                        ${item.unread ? '<span class="unread-dot" title="Chưa đọc"></span>' : ''}
                        <span class="noti-item-title">${item.title}</span>
                    </div>
                    <span class="noti-item-timestamp">${item.timestamp}</span>
                </div>

                <div class="noti-item-desc">${item.desc}</div>

                ${item.meta && item.meta.length > 0 ? `
                    <div class="noti-meta-box">
                        ${item.meta.map(m => `<span><i class="bi ${m.icon}"></i> ${m.text}</span>`).join('')}
                    </div>
                ` : ''}

                <div class="noti-item-footer">
                    <div class="noti-action-btns">
                        ${item.mainActionText ? `
                            <a href="${item.mainActionUrl || 'javascript:void(0)'}" 
                               class="btn-noti-link-main" 
                               onclick="event.stopPropagation(); ${item.mainActionClick || ''}">
                                ${item.mainActionText} <i class="bi bi-arrow-right"></i>
                            </a>
                        ` : ''}
                    </div>

                    <button class="btn-item-dismiss" 
                            title="Xóa thông báo" 
                            onclick="event.stopPropagation(); deleteNotification('${item.id}')">
                        <i class="bi bi-x-lg"></i> Xóa
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function bindCategoryTabs() {
    const tabBtns = document.querySelectorAll('.noti-tabs-bar .noti-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            activeCategory = this.getAttribute('data-category');
            renderNotificationsList();
        });
    });
}

function updateHeaderAndTabBadges() {
    const unreadCount = userNotifications.filter(n => n.unread).length;

    const headerBadge = document.getElementById('unreadHeaderBadge');
    if (headerBadge) {
        if (unreadCount > 0) {
            headerBadge.textContent = `${unreadCount} thông báo mới`;
            headerBadge.style.display = 'inline-block';
        } else {
            headerBadge.style.display = 'none';
        }
    }

    const headerNotiCount = document.getElementById('headerNotiCount');
    if (headerNotiCount) {
        if (unreadCount > 0) {
            headerNotiCount.textContent = unreadCount;
            headerNotiCount.style.display = 'inline-block';
        } else {
            headerNotiCount.style.display = 'none';
        }
    }

    const setTagCount = (id, count) => {
        const tag = document.getElementById(id);
        if (tag) tag.textContent = count;
    };

    setTagCount('countAll', userNotifications.length);
    setTagCount('countTrip', userNotifications.filter(n => n.category === 'trip' || n.category === 'booking').length);
    setTagCount('countPromo', userNotifications.filter(n => n.category === 'promo').length);
    setTagCount('countPayment', userNotifications.filter(n => n.category === 'payment').length);
}

// Mo modal chi tiet thong bao
function openNotificationDetail(id) {
    const item = userNotifications.find(n => n.id === id);
    if (!item) return;

    // Danh dau da doc
    if (item.unread) {
        item.unread = false;
        renderNotificationsList();
    }

    const overlay = document.getElementById('notiModalOverlay');
    const modalIcon = document.getElementById('modalTypeIcon');
    const modalTitle = document.getElementById('modalTitleText');
    const modalTime = document.getElementById('modalTimeText');
    const modalDesc = document.getElementById('modalDescText');
    const modalDetailsGrid = document.getElementById('modalDetailsGrid');
    const modalActionBtn = document.getElementById('modalActionBtn');

    if (modalIcon) {
        modalIcon.className = `modal-type-icon ${item.iconClass}`;
        modalIcon.innerHTML = `<i class="bi ${item.icon}"></i>`;
    }

    if (modalTitle) modalTitle.textContent = item.title;
    if (modalTime) modalTime.textContent = item.timestamp;
    if (modalDesc) modalDesc.textContent = item.desc;

    if (modalDetailsGrid) {
        modalDetailsGrid.innerHTML = item.details.map(d => `
            <div class="detail-info-row">
                <span class="lbl"><i class="bi bi-chevron-right" style="font-size: 11px; color: var(--eco-primary);"></i> ${d.label}</span>
                ${d.copyable ? `
                    <span class="copy-badge-code" onclick="copyToClipboard('${d.val}')" title="Bấm để sao chép">
                        ${d.val} <i class="bi bi-copy" style="font-size: 12px;"></i>
                    </span>
                ` : `<span class="val">${d.val}</span>`}
            </div>
        `).join('');
    }

    if (modalActionBtn) {
        modalActionBtn.textContent = item.mainActionText || 'Trở về';
        modalActionBtn.href = item.mainActionUrl || 'javascript:void(0)';
        modalActionBtn.onclick = () => {
            if (item.mainActionClick) eval(item.mainActionClick);
            closeNotificationModal();
        };
    }

    if (overlay) overlay.classList.add('show');
}

function closeNotificationModal() {
    const overlay = document.getElementById('notiModalOverlay');
    if (overlay) overlay.classList.remove('show');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Đã sao chép: "${text}" vào bộ nhớ tạm!`);
    }).catch(() => {
        showToast(`Mã: ${text}`);
    });
}

function markAllNotificationsRead() {
    const hasUnread = userNotifications.some(n => n.unread);
    if (!hasUnread) {
        showToast('Tất cả thông báo đã được đọc!');
        return;
    }

    userNotifications.forEach(n => n.unread = false);
    renderNotificationsList();
    showToast('Đã đánh dấu tất cả thông báo là đã đọc!');
}

function deleteNotification(id) {
    userNotifications = userNotifications.filter(n => n.id !== id);
    renderNotificationsList();
    showToast('Đã xóa thông báo.');
}

function showToast(message) {
    const existing = document.getElementById('userNotiToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'userNotiToast';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: #0F172A;
        color: #FFFFFF;
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 13.5px;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    toast.innerHTML = `<i class="bi bi-info-circle-fill" style="color: #A7F3D0; font-size: 16px;"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}
