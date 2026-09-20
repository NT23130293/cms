// ==========================================================================
// YÊN HOMESTAY ADMIN - COMPLAINTS & DISPUTE MANAGEMENT JAVASCRIPT
// File: opencms-core-master/.../admin/JS/complaints_management.js
// Chủ đề: Quản lý Báo cáo & Khiếu nại (2 Chiều: Khách -> Homestay & Homestay -> Khách)
// ==========================================================================

// Danh sách dữ liệu khiếu nại 2 chiều
let complaintsList = [
    {
        id: 1,
        code: '#KN-1048',
        direction: 'tourist_to_homestay', // Khách khiếu nại Homestay
        directionText: 'Khách ➔ Homestay',
        bookingCode: '#BK-8841',
        reporter: {
            name: 'Nguyễn Thảo Ly',
            role: 'Du khách (Tourist)',
            phone: '0988 765 432',
            avatar: 'T'
        },
        reported: {
            name: 'Hà Văn Dũng (Chủ nhà)',
            homestay: 'Nhà Sàn Mộc Mai Châu',
            phone: '0988 234 990',
            region: 'Mai Châu'
        },
        topic: 'Tiện nghi & Dịch vụ phòng',
        title: 'Phòng không có nước nóng và sàn nhà vệ sinh bị rò rỉ ẩm mốc',
        content: 'Tôi nhận phòng lúc 17h, trời vùng cao lạnh 16 độ nhưng bình nước nóng không hoạt động. Tôi đã báo với chủ nhà lúc 18h nhưng đến 22h vẫn không có thợ sửa. Sàn nhà vệ sinh bị rò rỉ nước gây mùi khó chịu.',
        reportedResponse: 'Do mạng lưới điện bản Lác bị sụt áp đột ngột lúc chiều tối nên bình nóng lạnh gặp sự cố. Chúng tôi đã khắc phục xong lúc 22h30 nhưng khách đã đóng cửa ngủ nên không vào kiểm tra được.',
        demands: 'Yêu cầu hoàn trả 40% tiền phòng đêm đầu tiên (520.000đ).',
        requestedAmount: 520000,
        bookingTotal: '1.300.000đ',
        dates: '26/09/2026 - 28/09/2026',
        severity: 'medium', // 'urgent', 'medium', 'low'
        severityText: 'Trung bình',
        status: 'investigating', // 'pending', 'investigating', 'resolved', 'rejected'
        statusText: 'Đang xác minh',
        createdAt: '20/09/2026 08:30',
        evidence: [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=400&q=80'
        ],
        timeline: [
            { time: '20/09 08:30', desc: 'Du khách Nguyễn Thảo Ly gửi đơn khiếu nại kèm 2 ảnh bằng chứng' },
            { time: '20/09 09:15', desc: 'Admin YÊN tiếp nhận hồ sơ, chuyển trạng thái sang Đang xác minh' },
            { time: '20/09 10:00', desc: 'Chủ nhà Hà Văn Dũng đã gửi biên bản giải trình sự cố điện' }
        ]
    },
    {
        id: 2,
        code: '#KN-1047',
        direction: 'homestay_to_tourist', // Homestay khiếu nại Khách
        directionText: 'Homestay ➔ Khách',
        bookingCode: '#BK-8840',
        reporter: {
            name: 'Vàng A Sáng (Chủ nhà)',
            homestay: 'Sa Pa Terraces Valley',
            phone: '0973 456 123',
            avatar: 'S'
        },
        reported: {
            name: 'Đỗ Minh Quân',
            role: 'Du khách (Tourist)',
            phone: '0903 112 233',
            region: 'Sa Pa'
        },
        topic: 'Hư hỏng tài sản & Gây mất trật tự',
        title: 'Khách mở nhạc loa kéo quá giờ quy định và làm gãy bàn trà gỗ pơ-mu',
        content: 'Đoàn khách của anh Quân gồm 6 người tổ chức ăn nhậu, mang loa kéo hát hò đến 1h15 sáng dù nội quy cấm sau 22h. Khi say rượu đã làm xô đổ và gãy chân bàn trà gỗ pơ-mu tự nhiên tại phòng sinh hoạt chung, sáng nay check-out vội và từ chối ký biên bản đền bù.',
        reportedResponse: 'Khách phản hồi rằng bàn trà đã có dấu hiệu lung lay từ trước, chỉ vô tình tì tay vào chứ không cố ý phá hoại, mức đền bù chủ nhà đưa ra 1.500.000đ là quá đắt.',
        demands: 'Yêu cầu trừ tiền cọc đền bù bàn gỗ 1.500.000đ và ghi nhận vi phạm quy tắc ứng xử.',
        requestedAmount: 1500000,
        bookingTotal: '2.850.000đ',
        dates: '18/09/2026 - 20/09/2026',
        severity: 'urgent',
        severityText: 'Khẩn cấp',
        status: 'investigating',
        statusText: 'Đang đối chất',
        createdAt: '20/09/2026 07:45',
        evidence: [
            'https://images.unsplash.com/photo-1540518614846-7ede433c4b13?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'
        ],
        timeline: [
            { time: '20/09 07:45', desc: 'Chủ nhà Vàng A Sáng nộp biên bản và video ghi nhận lúc 1h sáng' },
            { time: '20/09 08:30', desc: 'Admin YÊN liên hệ du khách Đỗ Minh Quân để đối chất' }
        ]
    },
    {
        id: 3,
        code: '#KN-1046',
        direction: 'tourist_to_homestay',
        directionText: 'Khách ➔ Homestay',
        bookingCode: '#BK-8839',
        reporter: {
            name: 'Trần Ánh Tuyết',
            role: 'Du khách (Tourist)',
            phone: '0977 445 566',
            avatar: 'A'
        },
        reported: {
            name: 'Triệu Văn Sản (Chủ nhà)',
            homestay: 'Pù Luông Eco Lodge',
            phone: '0984 123 789',
            region: 'Pù Luông'
        },
        topic: 'Sai lệch hạng phòng & Quảng cáo',
        title: 'Chủ nhà tự ý đổi sang phòng view đồi thay vì Bungalow view thung lũng',
        content: 'Tôi đặt và thanh toán hạng phòng Bungalow nhìn ra ruộng bậc thang, nhưng khi đến nơi chủ nhà thông báo phòng đó bị dột nên chuyển tôi sang phòng nhìn ra đồi phía sau không có ban công ngắm lúa, mà không báo trước hay giảm giá.',
        reportedResponse: 'Do trận mưa lớn đêm hôm trước làm thủng mái lá phòng Bungalow VIP nên chúng tôi buộc phải chuyển khách sang phòng phụ tiêu chuẩn tương đương để đảm bảo an toàn.',
        demands: 'Đòi bồi hoàn chênh lệch giá phòng 400.000đ và giải trình chính thức.',
        requestedAmount: 400000,
        bookingTotal: '1.700.000đ',
        dates: '19/09/2026 - 21/09/2026',
        severity: 'urgent',
        severityText: 'Khẩn cấp',
        status: 'pending',
        statusText: 'Chờ tiếp nhận',
        createdAt: '20/09/2026 10:15',
        evidence: [
            'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=400&q=80'
        ],
        timeline: [
            { time: '20/09 10:15', desc: 'Du khách Trần Ánh Tuyết tạo khiếu nại qua ứng dụng di động' }
        ]
    },
    {
        id: 4,
        code: '#KN-1044',
        direction: 'homestay_to_tourist',
        directionText: 'Homestay ➔ Khách',
        bookingCode: '#BK-8842',
        reporter: {
            name: 'Đinh Thị Hương (Chủ nhà)',
            homestay: 'Mộc Châu Bamboo Bungalow',
            phone: '0912 889 001',
            avatar: 'H'
        },
        reported: {
            name: 'Lê Hoàng Long',
            role: 'Du khách (Tourist)',
            phone: '0912 345 678',
            region: 'Mộc Châu'
        },
        topic: 'Vi phạm an toàn PCCC',
        title: 'Khách hút thuốc trong phòng tre kín làm thủng ga trải giường thổ cẩm',
        content: 'Homestay có bảng cấm hút thuốc bằng 2 thứ tiếng trong phòng tre vì nguy cơ cháy rất cao. Tuy nhiên khách vẫn hút thuốc và làm tàn thuốc rơi làm thủng ga đệm dệt thổ cẩm truyền thống bản địa.',
        reportedResponse: 'Khách thừa nhận có hút thuốc do trời mưa không ra ngoài được và sơ ý làm rớt tàn, đồng ý bồi thường tiền giặt hoặc may lại ga.',
        demands: 'Phạt vi phạm quy định PCCC 500.000đ và chi phí phục chế ga thổ cẩm 350.000đ.',
        requestedAmount: 850000,
        bookingTotal: '1.500.000đ',
        dates: '18/09/2026 - 19/09/2026',
        severity: 'medium',
        severityText: 'Trung bình',
        status: 'pending',
        statusText: 'Chờ tiếp nhận',
        createdAt: '19/09/2026 16:20',
        evidence: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'
        ],
        timeline: [
            { time: '19/09 16:20', desc: 'Chủ nhà nộp ảnh chụp tàn thuốc và ga giường bị cháy xém' }
        ]
    },
    {
        id: 5,
        code: '#KN-1040',
        direction: 'tourist_to_homestay',
        directionText: 'Khách ➔ Homestay',
        bookingCode: '#BK-8838',
        reporter: {
            name: 'Hoàng Quốc Việt',
            role: 'Du khách (Tourist)',
            phone: '0915 998 877',
            avatar: 'V'
        },
        reported: {
            name: 'Phạm Hoàng Nam (Chủ nhà)',
            homestay: 'Đà Lạt Cloud Valley',
            phone: '0905 112 334',
            region: 'Đà Lạt'
        },
        topic: 'Hủy phòng đột ngột (Overbooking)',
        title: 'Chủ nhà hủy phòng trước giờ nhận 2 tiếng khiến gia đình không có nơi ở',
        content: 'Gia đình tôi bay từ Hà Nội vào Đà Lạt, đến nơi chủ nhà báo hệ thống đặt phòng bị trùng nên không có phòng, đề nghị sang một nhà trọ bình dân khác cách đó 8km. Chúng tôi rất bức xúc.',
        reportedResponse: 'Chủ nhà nhận lỗi do nhân viên lễ tân mới không khóa phòng trên kênh OTA khác dẫn đến overbooking.',
        demands: 'Hoàn trả 100% tiền cọc 1.200.000đ và bồi thường chi phí di chuyển.',
        requestedAmount: 1200000,
        bookingTotal: '1.200.000đ',
        dates: '15/09/2026 - 17/09/2026',
        severity: 'urgent',
        severityText: 'Khẩn cấp',
        status: 'resolved',
        statusText: 'Đã giải quyết',
        createdAt: '15/09/2026 14:00',
        evidence: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80'
        ],
        timeline: [
            { time: '15/09 14:00', desc: 'Khách gọi hotline khẩn cấp của YÊN' },
            { time: '15/09 14:20', desc: 'Admin YÊN can thiệp: Hỗ trợ tìm homestay mới gần đó' },
            { time: '15/09 16:00', desc: 'Đã hoàn 100% tiền phòng cho khách và phạt 30% phí vi phạm đối với chủ nhà' }
        ]
    },
    {
        id: 6,
        code: '#KN-1039',
        direction: 'homestay_to_tourist',
        directionText: 'Homestay ➔ Khách',
        bookingCode: '#BK-8812',
        reporter: {
            name: 'Bùi Văn Nam (Chủ nhà)',
            homestay: 'Mai Châu Green Lodge',
            phone: '0915 667 889',
            avatar: 'N'
        },
        reported: {
            name: 'Vũ Thanh Thảo',
            role: 'Du khách (Tourist)',
            phone: '0933 221 100',
            region: 'Mai Châu'
        },
        topic: 'Quên thanh toán dịch vụ phát sinh',
        title: 'Khách sử dụng dịch vụ ăn tối gà đồi và đốt lửa trại nhưng quên thanh toán',
        content: 'Khách đặt 2 mâm cơm gà đồi nướng và dịch vụ giao lưu đốt lửa trại với bản địa tổng cộng 650.000đ, sáng hôm sau vội lên xe khách về Hà Nội nên chưa thanh toán dịch vụ này.',
        reportedResponse: 'Khách hàng xác nhận do sáng vội bắt chuyến xe sớm nên sơ ý quên, đồng ý chuyển khoản ngay.',
        demands: 'Nhờ Admin hỗ trợ nhắc nhở khách chuyển khoản 650.000đ.',
        requestedAmount: 650000,
        bookingTotal: '1.400.000đ',
        dates: '12/09/2026 - 13/09/2026',
        severity: 'low',
        severityText: 'Bình thường',
        status: 'resolved',
        statusText: 'Đã giải quyết',
        createdAt: '13/09/2026 10:00',
        evidence: [],
        timeline: [
            { time: '13/09 10:00', desc: 'Chủ nhà Bùi Văn Nam gửi hóa đơn ăn uống nhờ sàn can thiệp' },
            { time: '13/09 11:30', desc: 'Admin liên hệ khách qua Zalo/SĐT, khách đã chuyển khoản trực tiếp thành công' }
        ]
    }
];

// Biến bộ lọc hiện tại
let currentDirectionTab = 'all'; // 'all', 'tourist_to_homestay', 'homestay_to_tourist'
let currentStatusFilter = 'all';
let currentSeverityFilter = 'all';
let searchQuery = '';
let currentDisputeId = null;

document.addEventListener('DOMContentLoaded', () => {
    initProfileDropdown();
    initFilters();
    updateKpis();
    renderComplaintsTable();
});

// Profile Dropdown
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

// Bộ lọc
function initFilters() {
    const searchInput = document.getElementById('disputeSearchInput');
    const statusSelect = document.getElementById('disputeStatusFilter');
    const severitySelect = document.getElementById('disputeSeverityFilter');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            searchQuery = this.value.toLowerCase().trim();
            renderComplaintsTable();
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener('change', function () {
            currentStatusFilter = this.value;
            renderComplaintsTable();
        });
    }

    if (severitySelect) {
        severitySelect.addEventListener('change', function () {
            currentSeverityFilter = this.value;
            renderComplaintsTable();
        });
    }
}

// Chuyển tab 2 chiều
function switchDirectionTab(tab) {
    currentDirectionTab = tab;
    document.querySelectorAll('.content-tab-btn').forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('data-tab') === tab) {
            b.classList.add('active');
        }
    });
    renderComplaintsTable();
}

// Cập nhật 4 thẻ KPI trên đầu trang
function updateKpis() {
    const total = complaintsList.length;
    const pending = complaintsList.filter(x => x.status === 'pending' || x.status === 'investigating').length;
    const touristToHs = complaintsList.filter(x => x.direction === 'tourist_to_homestay').length;
    const hsToTourist = complaintsList.filter(x => x.direction === 'homestay_to_tourist').length;

    const statTotal = document.getElementById('statTotalDisputes');
    const statPending = document.getElementById('statPendingDisputes');
    const statTouristToHs = document.getElementById('statTouristToHs');
    const statHsToTourist = document.getElementById('statHsToTourist');

    if (statTotal) statTotal.innerText = total;
    if (statPending) statPending.innerText = pending;
    if (statTouristToHs) statTouristToHs.innerText = touristToHs;
    if (statHsToTourist) statHsToTourist.innerText = hsToTourist;
}

// Render bảng khiếu nại
function renderComplaintsTable() {
    const tbody = document.getElementById('disputesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filtered = complaintsList.filter(item => {
        const matchTab = currentDirectionTab === 'all' || item.direction === currentDirectionTab;
        const matchStatus = currentStatusFilter === 'all' || item.status === currentStatusFilter;
        const matchSeverity = currentSeverityFilter === 'all' || item.severity === currentSeverityFilter;

        const matchSearch = item.code.toLowerCase().includes(searchQuery) ||
            item.bookingCode.toLowerCase().includes(searchQuery) ||
            item.reporter.name.toLowerCase().includes(searchQuery) ||
            (item.reported.homestay && item.reported.homestay.toLowerCase().includes(searchQuery)) ||
            item.title.toLowerCase().includes(searchQuery);

        return matchTab && matchStatus && matchSeverity && matchSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 32px;">Không có khiếu nại nào phù hợp với bộ lọc hiện tại.</td></tr>`;
        return;
    }

    filtered.forEach(item => {
        const tr = document.createElement('tr');

        // Chiều khiếu nại Badge
        const dirBadge = item.direction === 'tourist_to_homestay'
            ? `<span class="dispute-direction-badge tourist-to-homestay"><span class="material-symbols-outlined" style="font-size: 15px;">person</span> Khách ➔ Homestay</span>`
            : `<span class="dispute-direction-badge homestay-to-tourist"><span class="material-symbols-outlined" style="font-size: 15px;">cottage</span> Homestay ➔ Khách</span>`;

        // Mức độ
        let severityClass = 'low';
        if (item.severity === 'urgent') severityClass = 'urgent';
        if (item.severity === 'medium') severityClass = 'medium';

        // Trạng thái
        const statusBadge = `
            <span class="dispute-status-badge ${item.status}">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                <span>${item.statusText}</span>
            </span>
        `;

        // Hiển thị 2 bên
        const reporterDisplay = item.direction === 'tourist_to_homestay'
            ? `<strong>${item.reporter.name}</strong> <span style="font-size: 11px; color: #64748B;">(Du khách)</span>`
            : `<strong>${item.reporter.homestay}</strong> <span style="font-size: 11px; color: #64748B;">(${item.reporter.name})</span>`;

        const reportedDisplay = item.direction === 'tourist_to_homestay'
            ? `<strong>${item.reported.homestay}</strong> <span style="font-size: 11px; color: #64748B;">(${item.reported.name})</span>`
            : `<strong>${item.reported.name}</strong> <span style="font-size: 11px; color: #64748B;">(Du khách)</span>`;

        tr.innerHTML = `
            <td>
                <div class="dispute-code-highlight">${item.code}</div>
                <div style="font-size: 11.5px; color: #64748B; margin-top: 2px;">Đơn: <strong style="color: #2563EB;">${item.bookingCode}</strong></div>
                <div style="font-size: 11px; color: #94A3B8;">${item.createdAt}</div>
            </td>
            <td>${dirBadge}</td>
            <td>
                <div class="dispute-parties-box">
                    <div class="party-item">
                        <span class="party-label reporter">Nguyên đơn</span>
                        <span>${reporterDisplay}</span>
                    </div>
                    <div class="party-item">
                        <span class="party-label reported">Bị đơn</span>
                        <span>${reportedDisplay}</span>
                    </div>
                </div>
            </td>
            <td>
                <div style="font-weight: 700; color: var(--text-main); font-size: 13px; max-width: 260px; line-height: 1.3;">${item.title}</div>
                <div style="font-size: 11.5px; color: #D97706; margin-top: 3px;">Yêu cầu: ${item.demands}</div>
            </td>
            <td>
                <span class="severity-badge ${severityClass}">
                    <span class="material-symbols-outlined" style="font-size: 14px;">${item.severity === 'urgent' ? 'priority_high' : 'flag'}</span>
                    ${item.severityText}
                </span>
            </td>
            <td>${statusBadge}</td>
            <td style="text-align: right;">
                <button class="btn-dash-action" style="padding: 6px 12px; font-size: 12px; font-weight: 700;" onclick="openDisputeModal(${item.id})">
                    <span class="material-symbols-outlined" style="font-size: 16px; color: #15803D;">gavel</span> Xử lý
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// -------------------------------------------------------------
// MODAL CHI TIẾT & HÒA GIẢI / PHÁN QUYẾT TRANH CHẤP
// -------------------------------------------------------------
function openDisputeModal(id) {
    currentDisputeId = id;
    const item = complaintsList.find(x => x.id === id);
    if (!item) return;

    document.getElementById('dtCode').innerText = item.code;
    document.getElementById('dtBookingCode').innerText = `Đơn đặt phòng: ${item.bookingCode} (${item.bookingTotal})`;
    document.getElementById('dtDates').innerText = `Thời gian lưu trú: ${item.dates}`;

    // Hướng khiếu nại
    const dirContainer = document.getElementById('dtDirectionBadge');
    if (item.direction === 'tourist_to_homestay') {
        dirContainer.innerHTML = `<span class="dispute-direction-badge tourist-to-homestay"><span class="material-symbols-outlined" style="font-size: 16px;">person</span> Khách khiếu nại Homestay</span>`;
    } else {
        dirContainer.innerHTML = `<span class="dispute-direction-badge homestay-to-tourist"><span class="material-symbols-outlined" style="font-size: 16px;">cottage</span> Homestay khiếu nại Khách du lịch</span>`;
    }

    // Bên khiếu nại
    document.getElementById('dtReporterName').innerText = item.direction === 'tourist_to_homestay'
        ? `${item.reporter.name} (Du khách - SĐT: ${item.reporter.phone})`
        : `${item.reporter.homestay} (Chủ: ${item.reporter.name} - SĐT: ${item.reporter.phone})`;
    document.getElementById('dtReportTitle').innerText = item.title;
    document.getElementById('dtReportContent').innerText = item.content;
    document.getElementById('dtDemands').innerText = item.demands;

    // Phản hồi của bên bị khiếu nại
    document.getElementById('dtReportedName').innerText = item.direction === 'tourist_to_homestay'
        ? `${item.reported.homestay} (Chủ: ${item.reported.name} - ${item.reported.region})`
        : `${item.reported.name} (Du khách - SĐT: ${item.reported.phone})`;
    document.getElementById('dtReportedResponse').innerText = item.reportedResponse;

    // Bằng chứng
    const evWrap = document.getElementById('dtEvidenceGallery');
    evWrap.innerHTML = '';
    if (item.evidence && item.evidence.length > 0) {
        item.evidence.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.className = 'evidence-thumb';
            img.onclick = () => window.open(url, '_blank');
            img.title = 'Nhấp để xem ảnh lớn';
            evWrap.appendChild(img);
        });
    } else {
        evWrap.innerHTML = `<span style="font-size: 12px; color: #94A3B8; font-style: italic;">Không có ảnh/video đính kèm.</span>`;
    }

    // Dòng thời gian
    const tlWrap = document.getElementById('dtTimeline');
    tlWrap.innerHTML = '';
    item.timeline.forEach(step => {
        const div = document.createElement('div');
        div.className = 'timeline-step';
        div.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-time">${step.time}</div>
            <div class="timeline-desc">${step.desc}</div>
        `;
        tlWrap.appendChild(div);
    });

    // Reset form phán quyết
    document.getElementById('dtResolutionAction').value = 'refund_guest';
    document.getElementById('dtResolutionAmount').value = item.requestedAmount || 0;
    document.getElementById('dtAdminNote').value = '';

    document.getElementById('disputeModal').classList.add('open');
}

// Ban hành phán quyết giải quyết vụ việc
function applyResolution() {
    if (!currentDisputeId) return;

    const item = complaintsList.find(x => x.id === currentDisputeId);
    if (!item) return;

    const action = document.getElementById('dtResolutionAction').value;
    const amount = document.getElementById('dtResolutionAmount').value;
    const note = document.getElementById('dtAdminNote').value.trim();

    let decisionText = '';
    if (action === 'refund_guest') {
        decisionText = `Hoàn trả ${parseInt(amount || 0).toLocaleString('vi-VN')}đ cho du khách từ ví tạm giữ của chủ nhà.`;
    } else if (action === 'charge_guest') {
        decisionText = `Khấu trừ ${parseInt(amount || 0).toLocaleString('vi-VN')}đ bồi thường cho chủ nhà homestay.`;
    } else if (action === 'mediate_ok') {
        decisionText = `Hòa giải thành công giữa 2 bên, không phát sinh chi phí phạt.`;
    } else if (action === 'reject') {
        decisionText = `Bác bỏ khiếu nại do không đủ căn cứ chứng minh thiệt hại.`;
    }

    item.status = action === 'reject' ? 'rejected' : 'resolved';
    item.statusText = action === 'reject' ? 'Đã bác bỏ' : 'Đã giải quyết';

    item.timeline.push({
        time: 'Vừa xong',
        desc: `Admin YÊN đã ban hành quyết định: ${decisionText} (Ghi chú: ${note || 'Không'})`
    });

    showDisputeToast(`Đã giải quyết vụ việc ${item.code} thành công!`, 'success');
    closeDisputeModal();
    renderComplaintsTable();
    updateKpis();
}

// Mở modal tạo khiếu nại mới (Admin ghi nhận qua hotline)
function openCreateDisputeModal() {
    document.getElementById('newDisputeDirection').value = 'tourist_to_homestay';
    document.getElementById('newBookingCode').value = '';
    document.getElementById('newReporterName').value = '';
    document.getElementById('newReportedName').value = '';
    document.getElementById('newTitle').value = '';
    document.getElementById('newContent').value = '';
    document.getElementById('newDemands').value = '';
    document.getElementById('newSeverity').value = 'medium';

    document.getElementById('createDisputeModal').classList.add('open');
}

// Lưu khiếu nại mới
function saveNewDispute() {
    const direction = document.getElementById('newDisputeDirection').value;
    const bookingCode = document.getElementById('newBookingCode').value.trim() || '#BK-8850';
    const reporterName = document.getElementById('newReporterName').value.trim();
    const reportedName = document.getElementById('newReportedName').value.trim();
    const title = document.getElementById('newTitle').value.trim();
    const content = document.getElementById('newContent').value.trim();
    const demands = document.getElementById('newDemands').value.trim();
    const severity = document.getElementById('newSeverity').value;

    if (!reporterName || !reportedName || !title || !content) {
        alert('Vui lòng nhập đầy đủ thông tin bên khiếu nại, bên bị khiếu nại và nội dung!');
        return;
    }

    const nextId = complaintsList.length > 0 ? Math.max(...complaintsList.map(x => x.id)) + 1 : 1;
    const newCode = `#KN-${1048 + nextId}`;

    let severityText = 'Trung bình';
    if (severity === 'urgent') severityText = 'Khẩn cấp';
    if (severity === 'low') severityText = 'Bình thường';

    const newObj = {
        id: nextId,
        code: newCode,
        direction: direction,
        directionText: direction === 'tourist_to_homestay' ? 'Khách ➔ Homestay' : 'Homestay ➔ Khách',
        bookingCode: bookingCode,
        reporter: {
            name: reporterName,
            role: direction === 'tourist_to_homestay' ? 'Du khách (Tourist)' : 'Chủ nhà Homestay',
            phone: '0912 888 999',
            homestay: direction === 'homestay_to_tourist' ? reporterName : undefined,
            avatar: reporterName.charAt(0).toUpperCase()
        },
        reported: {
            name: reportedName,
            homestay: direction === 'tourist_to_homestay' ? reportedName : undefined,
            phone: '0988 111 222',
            region: 'Khu vực sàn YÊN'
        },
        topic: 'Ghi nhận qua Hotline hỗ trợ Admin',
        title: title,
        content: content,
        reportedResponse: 'Đang chờ gửi thông báo yêu cầu giải trình cho bên bị khiếu nại.',
        demands: demands || 'Hòa giải theo quy chế sàn.',
        requestedAmount: 0,
        bookingTotal: '1.500.000đ',
        dates: '20/09/2026 - 22/09/2026',
        severity: severity,
        severityText: severityText,
        status: 'pending',
        statusText: 'Chờ tiếp nhận',
        createdAt: 'Vừa xong',
        evidence: [],
        timeline: [
            { time: 'Vừa xong', desc: 'Admin YÊN đã lập hồ sơ tiếp nhận khiếu nại' }
        ]
    };

    complaintsList.unshift(newObj);
    showDisputeToast(`Đã tạo hồ sơ khiếu nại mới ${newCode}!`, 'success');
    closeModal('createDisputeModal');
    renderComplaintsTable();
    updateKpis();
}

function closeDisputeModal() {
    closeModal('disputeModal');
}

function closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('open');
}

function showDisputeToast(message, type = 'success') {
    let toast = document.getElementById('adminDisputeToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'adminDisputeToast';
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
