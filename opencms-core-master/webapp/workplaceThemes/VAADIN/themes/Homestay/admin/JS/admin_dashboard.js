// ============================================================
// ADMIN DASHBOARD JAVASCRIPT - YÊN HOMESTAY MANAGEMENT
// ============================================================

// Dữ liệu chỉ số 9 metrics theo các mốc thời gian
const dashboardMetricsData = {
    today: {
        tourist: { val: '142', trend: '+8.4%', trendType: 'up', sub: '28 đăng ký mới hôm nay' },
        owner: { val: '12', trend: '+2.1%', trendType: 'up', sub: '3 chủ nhà nộp hồ sơ' },
        homestay: { val: '128', trend: '0%', trendType: 'neutral', sub: '112 đang đón khách' },
        booking: { val: '46', trend: '+15.2%', trendType: 'up', sub: '38 phòng đã xác nhận' },
        trans: { val: '58', trend: '+12.0%', trendType: 'up', sub: 'Tổng 58 GD phát sinh' },
        revenue: { val: '38.500.000đ', trend: '+18.6%', trendType: 'up', sub: 'Hoa hồng sàn: 3.850.000đ' },
        posts: { val: '4', trend: '+1 mới', trendType: 'up', sub: 'Cẩm nang du lịch mùa lúa' },
        ads: { val: '18', trend: '0%', trendType: 'neutral', sub: '12 banner đang phát' },
        voucher: { val: '6', trend: 'Hoạt động', trendType: 'neutral', sub: '145 lượt áp dụng' }
    },
    '7days': {
        tourist: { val: '980', trend: '+11.5%', trendType: 'up', sub: '184 tài khoản mới' },
        owner: { val: '86', trend: '+4.8%', trendType: 'up', sub: '14 hồ sơ đang xét duyệt' },
        homestay: { val: '128', trend: '+3', trendType: 'up', sub: '112 hoạt động, 8 tạm khóa' },
        booking: { val: '312', trend: '+9.4%', trendType: 'up', sub: '285 phòng hoàn tất' },
        trans: { val: '390', trend: '+14.1%', trendType: 'up', sub: 'Tỷ lệ thanh toán 96.8%' },
        revenue: { val: '265.400.000đ', trend: '+16.2%', trendType: 'up', sub: 'Hoa hồng sàn: 26.540.000đ' },
        posts: { val: '24', trend: '+5 mới', trendType: 'up', sub: '5 bài viết được duyệt' },
        ads: { val: '22', trend: '+2', trendType: 'up', sub: '15 chiến dịch hoạt động' },
        voucher: { val: '12', trend: 'Hoạt động', trendType: 'neutral', sub: '890 lượt áp dụng' }
    },
    month: {
        tourist: { val: '14.280', trend: '+14.8%', trendType: 'up', sub: '1.450 tài khoản mới tháng này' },
        owner: { val: '482', trend: '+6.2%', trendType: 'up', sub: '32 hồ sơ chờ phê duyệt' },
        homestay: { val: '128', trend: '+8', trendType: 'up', sub: '112 hoạt động, 8 chờ duyệt' },
        booking: { val: '1.420', trend: '+12.5%', trendType: 'up', sub: '1.290 đặt phòng thành công' },
        trans: { val: '1.860', trend: '+15.3%', trendType: 'up', sub: 'Tỷ lệ giao dịch thành công 98.2%' },
        revenue: { val: '1.248.000.000đ', trend: '+17.4%', trendType: 'up', sub: 'Phí dịch vụ sàn: 124.800.000đ' },
        posts: { val: '86', trend: '+12 mới', trendType: 'up', sub: '18 bài viết địa phương mới' },
        ads: { val: '28', trend: '+4', trendType: 'up', sub: '18 chiến dịch đang chạy' },
        voucher: { val: '16', trend: 'Đang áp dụng', trendType: 'neutral', sub: '3.420 lượt mã đã dùng' }
    },
    year: {
        tourist: { val: '156.400', trend: '+34.2%', trendType: 'up', sub: 'Khách nội địa & quốc tế' },
        owner: { val: '1.850', trend: '+28.0%', trendType: 'up', sub: 'Đối tác phủ khắp 12 tỉnh miền núi' },
        homestay: { val: '640', trend: '+45.0%', trendType: 'up', sub: '580 homestay đang đón khách' },
        booking: { val: '18.650', trend: '+38.5%', trendType: 'up', sub: 'Tổng lượt đặt phòng cả năm' },
        trans: { val: '24.120', trend: '+41.2%', trendType: 'up', sub: 'Tổng số giao dịch thanh toán' },
        revenue: { val: '14.850.000.000đ', trend: '+32.8%', trendType: 'up', sub: 'Tổng giá trị giao dịch GMV' },
        posts: { val: '412', trend: '+68 mới', trendType: 'up', sub: 'Cẩm nang & bản sắc bản địa' },
        ads: { val: '142', trend: '+24', trendType: 'up', sub: 'Chiến dịch mùa cao điểm' },
        voucher: { val: '64', trend: 'Tất cả đợt', trendType: 'neutral', sub: '42.800 lượt quy đổi' }
    }
};

// Chi tiết mở rộng khi click xem thông tin 9 metrics
const metricDetailsMeta = {
    tourist: {
        title: 'Chi tiết Thống kê Tourist (Khách du lịch)',
        icon: 'person',
        accentColor: '#2563EB',
        rows: [
            { label: 'Tổng tài khoản Tourist đăng ký:', val: '14.280 thành viên' },
            { label: 'Tài khoản hoạt động trong tháng:', val: '9.650 khách (67.5%)' },
            { label: 'Tài khoản đã xác thực (eKYC / SĐT):', val: '12.840 (89.9%)' },
            { label: 'Khách du lịch quay lại (Retention):', val: '41.2%' },
            { label: 'Khách quốc tế (Inbound):', val: '1.820 khách (12.7%)' },
            { label: 'Trạng thái tài khoản:', val: '14.195 bình thường / 85 bị khóa tạm thời' }
        ],
        actionLink: 'account_management.html',
        actionText: 'Đi đến Quản lý tài khoản Tourist'
    },
    owner: {
        title: 'Chi tiết Thống kê Homestay Owner (Chủ nhà)',
        icon: 'cottage',
        accentColor: '#15803D',
        rows: [
            { label: 'Tổng số chủ nhà đối tác:', val: '482 đối tác' },
            { label: 'Chủ nhà đã ký cam kết bản địa:', val: '468 đối tác (97.1%)' },
            { label: 'Hồ sơ chờ thẩm định / phê duyệt:', val: '14 hồ sơ mới' },
            { label: 'Đánh giá trung bình từ du khách:', val: '4.85 / 5.0 ⭐' },
            { label: 'Chủ nhà đạt danh hiệu Super Host:', val: '124 chủ nhà' },
            { label: 'Thời gian phản hồi khách trung bình:', val: '< 15 phút' }
        ],
        actionLink: 'account_management.html',
        actionText: 'Xem danh sách Chủ nhà Homestay'
    },
    homestay: {
        title: 'Chi tiết Quản lý Homestay trên sàn YÊN',
        icon: 'home_work',
        accentColor: '#0D9488',
        rows: [
            { label: 'Tổng số cơ sở Homestay:', val: '128 cơ sở' },
            { label: 'Đang hoạt động đón khách:', val: '112 homestay (87.5%)' },
            { label: 'Hồ sơ mới chờ duyệt niêm yết:', val: '8 homestay' },
            { label: 'Bị tạm dừng / đang sửa chữa:', val: '8 homestay' },
            { label: 'Khu vực tập trung nhiều nhất:', val: 'Pù Luông (42), Mai Châu (35)' },
            { label: 'Tỷ lệ lấp đầy phòng trung bình:', val: '72.4%' }
        ],
        actionLink: 'manage_homestay.html',
        actionText: 'Đi đến Quản lý Homestay'
    },
    booking: {
        title: 'Chi tiết Quản lý Đặt phòng (Booking)',
        icon: 'calendar_month',
        accentColor: '#D97706',
        rows: [
            { label: 'Tổng lượt đặt phòng tháng này:', val: '1.420 booking' },
            { label: 'Đã hoàn tất lưu trú (Check-out):', val: '1.140 đơn' },
            { label: 'Đang có khách lưu trú:', val: '150 đơn' },
            { label: 'Đặt phòng sắp tới (Upcoming):', val: '95 đơn' },
            { label: 'Tỷ lệ hủy phòng (Cancellation):', val: '2.5% (Rất thấp)' },
            { label: 'Thời gian lưu trú trung bình:', val: '2.4 đêm / booking' }
        ],
        actionLink: 'manage_transactions.html',
        actionText: 'Xem danh sách Đơn đặt phòng'
    },
    trans: {
        title: 'Chi tiết Tổng Giao dịch Thanh toán',
        icon: 'receipt_long',
        accentColor: '#7C3AED',
        rows: [
            { label: 'Tổng số lượng giao dịch phát sinh:', val: '1.860 giao dịch' },
            { label: 'Giao dịch thành công:', val: '1.828 (98.2%)' },
            { label: 'Giao dịch đang chờ xác nhận ngân hàng:', val: '24 giao dịch' },
            { label: 'Giao dịch hoàn tiền (Refund):', val: '8 giao dịch' },
            { label: 'Cổng thanh toán chính:', val: 'VNPay QR (54%), MoMo (32%), Thẻ (14%)' },
            { label: 'Số tiền giải ngân cho chủ nhà:', val: '1.123.200.000đ' }
        ],
        actionLink: 'manage_transactions.html',
        actionText: 'Đi đến Quản lý Giao dịch'
    },
    revenue: {
        title: 'Chi tiết Báo cáo Doanh thu Hệ thống',
        icon: 'payments',
        accentColor: '#059669',
        rows: [
            { label: 'Tổng giá trị giao dịch đặt phòng (GMV):', val: '1.248.000.000đ' },
            { label: 'Doanh thu phí dịch vụ sàn (Take Rate 10%):', val: '124.800.000đ' },
            { label: 'Doanh thu dịch vụ quảng cáo & tài trợ:', val: '36.500.000đ' },
            { label: 'Khấu trừ mã giảm giá sàn tài trợ:', val: '- 18.200.000đ' },
            { label: 'Doanh thu ròng thực nhận của sàn:', val: '143.100.000đ' },
            { label: 'Tăng trưởng so với cùng kỳ:', val: '+17.4%' }
        ],
        actionLink: 'reports_statistics.html',
        actionText: 'Xem Báo cáo Tài chính chi tiết'
    },
    posts: {
        title: 'Chi tiết Quản lý Bài viết & Nội dung Địa phương',
        icon: 'article',
        accentColor: '#0284C7',
        rows: [
            { label: 'Tổng số bài viết cẩm nang du lịch:', val: '86 bài viết' },
            { label: 'Đã xuất bản & đang hiển thị:', val: '78 bài' },
            { label: 'Bài viết chờ biên tập viên duyệt:', val: '5 bài' },
            { label: 'Bản nháp / Lưu tạm:', val: '3 bài' },
            { label: 'Lượt xem bài viết trong tháng:', val: '45.200 lượt đọc' },
            { label: 'Chủ đề xem nhiều nhất:', val: 'Mùa lúa chín Pù Luông, Ẩm thực Mường Mai Châu' }
        ],
        actionLink: 'local_content.html',
        actionText: 'Đi đến Quản lý Nội dung địa phương'
    },
    ads: {
        title: 'Chi tiết Quản lý Quảng cáo & Tiếp thị',
        icon: 'campaign',
        accentColor: '#E11D48',
        rows: [
            { label: 'Tổng chiến dịch quảng cáo:', val: '28 chiến dịch' },
            { label: 'Chiến dịch đang phát hành (Active):', val: '18 banner' },
            { label: 'Chiến dịch chờ duyệt hiển thị:', val: '4 banner' },
            { label: 'Chiến dịch đã kết thúc:', val: '6 banner' },
            { label: 'Tổng lượt hiển thị (Impressions):', val: '285.000 lượt' },
            { label: 'Tỷ lệ nhấp chuột trung bình (CTR):', val: '4.65%' }
        ],
        actionLink: 'ads_management.html',
        actionText: 'Đi đến Quản lý Quảng cáo'
    },
    voucher: {
        title: 'Chi tiết Quản lý Mã giảm giá (Vouchers)',
        icon: 'local_offer',
        accentColor: '#EA580C',
        rows: [
            { label: 'Tổng số chương trình Voucher:', val: '16 mã khuyến mãi' },
            { label: 'Mã đang có hiệu lực áp dụng:', val: '10 mã' },
            { label: 'Mã đã hết lượt / hết hạn:', val: '6 mã' },
            { label: 'Số lượt du khách đã áp dụng:', val: '3.420 lượt' },
            { label: 'Mã được áp dụng nhiều nhất:', val: 'YENWELCOME (-15%), PULUONG2026 (-100K)' },
            { label: 'Tỷ lệ chuyển đổi đơn khi có Voucher:', val: '86.4%' }
        ],
        actionLink: 'voucher_management.html',
        actionText: 'Đi đến Quản lý Mã giảm giá'
    }
};

// Danh sách Hoạt động Đặt phòng & Giao dịch mới nhất
const recentActivities = [
    {
        id: 1,
        code: '#BK-8842',
        user: 'Lê Hoàng Long',
        avatar: 'L',
        homestay: 'Pù Luông Eco Lodge',
        amount: '1.700.000đ',
        time: '5 phút trước',
        status: 'paid',
        statusText: 'Đã thanh toán',
        gateway: 'VNPay QR',
        details: {
            dates: '22/09/2026 - 24/09/2026 (2 đêm)',
            room: 'Bungalow nhìn ra thung lũng',
            phone: '0912 345 678',
            host: 'Triệu Văn Sản'
        }
    },
    {
        id: 2,
        code: '#BK-8841',
        user: 'Nguyễn Thảo Ly',
        avatar: 'T',
        homestay: 'Nhà Sàn Mộc Mai Châu',
        amount: '1.300.000đ',
        time: '18 phút trước',
        status: 'pending',
        statusText: 'Chờ xác nhận',
        gateway: 'Chuyển khoản',
        details: {
            dates: '26/09/2026 - 28/09/2026 (2 đêm)',
            room: 'Phòng riêng nhà sàn truyền thống',
            phone: '0988 765 432',
            host: 'Hà Văn Dũng'
        }
    },
    {
        id: 3,
        code: '#BK-8840',
        user: 'Đỗ Minh Quân',
        avatar: 'M',
        homestay: 'Sa Pa Terraces Valley',
        amount: '2.850.000đ',
        time: '42 phút trước',
        status: 'paid',
        statusText: 'Đã thanh toán',
        gateway: 'MoMo E-Wallet',
        details: {
            dates: '01/10/2026 - 04/10/2026 (3 đêm)',
            room: 'Villa view ruộng bậc thang',
            phone: '0903 112 233',
            host: 'Vàng A Sáng'
        }
    },
    {
        id: 4,
        code: '#BK-8839',
        user: 'Trần Ánh Tuyết',
        avatar: 'A',
        homestay: 'Mộc Châu Bamboo Bungalow',
        amount: '1.500.000đ',
        time: '1 giờ trước',
        status: 'paid',
        statusText: 'Đã thanh toán',
        gateway: 'Thẻ ATM / Visa',
        details: {
            dates: '25/09/2026 - 27/09/2026 (2 đêm)',
            room: 'Bungalow tre tự nhiên',
            phone: '0977 445 566',
            host: 'Đinh Thị Hương'
        }
    },
    {
        id: 5,
        code: '#BK-8838',
        user: 'Hoàng Quốc Việt',
        avatar: 'V',
        homestay: 'Đà Lạt Cloud Valley',
        amount: '1.200.000đ',
        time: '3 giờ trước',
        status: 'refunded',
        statusText: 'Đã hoàn tiền',
        gateway: 'VNPay QR',
        details: {
            dates: '20/09/2026 - 21/09/2026',
            room: 'Phòng hướng đồi thông',
            phone: '0915 998 877',
            host: 'Phạm Hoàng Nam'
        }
    }
];

// Biến lưu các instance của Chart.js
let growthChartInstance = null;
let distributionChartInstance = null;
let currentPeriod = 'month';
let currentActivityFilter = 'all';

// Khởi chạy khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    initProfileDropdown();
    initDateFilter();
    initActivityTabs();
    renderMetrics(currentPeriod);
    renderActivitiesTable();
    initCharts();
    initModalEvents();
});

// 1. Quản lý dropdown profile admin
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

// 2. Quản lý bộ lọc thời gian (Hôm nay / 7 ngày / Tháng này / Năm nay)
function initDateFilter() {
    const filterBtns = document.querySelectorAll('.date-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentPeriod = this.getAttribute('data-period');
            renderMetrics(currentPeriod);
            updateChartsPeriod(currentPeriod);
        });
    });
}

// 3. Render 9 thẻ chỉ số theo mốc thời gian
function renderMetrics(period) {
    const data = dashboardMetricsData[period] || dashboardMetricsData.month;

    const metricKeys = ['tourist', 'owner', 'homestay', 'booking', 'trans', 'revenue', 'posts', 'ads', 'voucher'];

    metricKeys.forEach(key => {
        const item = data[key];
        if (!item) return;

        const valElem = document.getElementById(`metric-val-${key}`);
        const trendElem = document.getElementById(`metric-trend-${key}`);
        const subElem = document.getElementById(`metric-sub-${key}`);

        if (valElem) valElem.innerText = item.val;
        if (subElem) subElem.innerText = item.sub;
        if (trendElem) {
            trendElem.className = `metric-trend ${item.trendType}`;
            const icon = item.trendType === 'up' ? 'trending_up' : (item.trendType === 'down' ? 'trending_down' : 'remove');
            trendElem.innerHTML = `<span class="material-symbols-outlined" style="font-size: 15px;">${icon}</span> ${item.trend}`;
        }
    });
}

// 4. Khởi tạo 2 biểu đồ Chart.js
function initCharts() {
    // Biểu đồ tăng trưởng Doanh thu & Booking
    const ctxGrowth = document.getElementById('growthChart');
    if (ctxGrowth) {
        const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const revenueData = [520, 680, 740, 890, 1120, 1380, 1540, 1420, 1248, 1310, 1450, 1680];
        const bookingData = [620, 780, 890, 1050, 1280, 1520, 1690, 1580, 1420, 1490, 1610, 1850];

        growthChartInstance = new Chart(ctxGrowth.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Doanh thu (Triệu VNĐ)',
                        data: revenueData,
                        backgroundColor: 'rgba(21, 128, 61, 0.85)',
                        borderColor: '#15803D',
                        borderRadius: 6,
                        order: 2,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Lượt Booking',
                        data: bookingData,
                        type: 'line',
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        pointBackgroundColor: '#F59E0B',
                        pointBorderColor: '#FFFFFF',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        tension: 0.35,
                        fill: false,
                        order: 1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1E293B',
                        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: '700' },
                        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
                        padding: 10,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Plus Jakarta Sans', size: 11.5, weight: '600' }, color: '#64748B' }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: '#F1F5F9' },
                        ticks: {
                            font: { family: 'Plus Jakarta Sans', size: 11 },
                            color: '#64748B',
                            callback: value => value + 'M'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: {
                            font: { family: 'Plus Jakarta Sans', size: 11 },
                            color: '#F59E0B',
                            callback: value => value + ' đơn'
                        }
                    }
                }
            }
        });
    }

    // Biểu đồ phân bổ Homestay theo khu vực
    const ctxDist = document.getElementById('distributionChart');
    if (ctxDist) {
        distributionChartInstance = new Chart(ctxDist.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Pù Luông', 'Mai Châu', 'Mộc Châu', 'Sa Pa', 'Đà Lạt'],
                datasets: [{
                    data: [42, 35, 24, 18, 9],
                    backgroundColor: [
                        '#15803D',
                        '#0D9488',
                        '#0284C7',
                        '#F59E0B',
                        '#8B5CF6'
                    ],
                    borderWidth: 2,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '68%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1E293B',
                        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: '700' },
                        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.raw || 0;
                                const pct = Math.round((value / total) * 100);
                                return ` ${context.label}: ${value} Homestay (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Cập nhật dữ liệu biểu đồ khi đổi bộ lọc thời gian
function updateChartsPeriod(period) {
    if (!growthChartInstance) return;

    if (period === 'today') {
        growthChartInstance.data.labels = ['6h', '9h', '12h', '15h', '18h', '21h'];
        growthChartInstance.data.datasets[0].data = [3.2, 8.5, 12.4, 7.8, 4.5, 2.1];
        growthChartInstance.data.datasets[1].data = [4, 10, 15, 9, 5, 3];
    } else if (period === '7days') {
        growthChartInstance.data.labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
        growthChartInstance.data.datasets[0].data = [28.4, 32.1, 29.5, 36.8, 45.2, 52.4, 41.0];
        growthChartInstance.data.datasets[1].data = [34, 38, 35, 42, 55, 62, 46];
    } else if (period === 'year') {
        growthChartInstance.data.labels = ['2023', '2024', '2025', '2026'];
        growthChartInstance.data.datasets[0].data = [4200, 7800, 11400, 14850];
        growthChartInstance.data.datasets[1].data = [5100, 9400, 14200, 18650];
    } else {
        growthChartInstance.data.labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        growthChartInstance.data.datasets[0].data = [520, 680, 740, 890, 1120, 1380, 1540, 1420, 1248, 1310, 1450, 1680];
        growthChartInstance.data.datasets[1].data = [620, 780, 890, 1050, 1280, 1520, 1690, 1580, 1420, 1490, 1610, 1850];
    }

    growthChartInstance.update();
}

// 5. Quản lý tab bảng Hoạt động gần đây
function initActivityTabs() {
    const tabBtns = document.querySelectorAll('.panel-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentActivityFilter = this.getAttribute('data-tab');
            renderActivitiesTable();
        });
    });
}

// 6. Render bảng Hoạt động Đặt phòng & Giao dịch mới nhất
function renderActivitiesTable() {
    const tbody = document.getElementById('recentActivitiesBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filtered = recentActivities.filter(item => {
        if (currentActivityFilter === 'all') return true;
        return item.status === currentActivityFilter;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94A3B8; padding: 24px;">Không có hoạt động nào phù hợp với bộ lọc.</td></tr>`;
        return;
    }

    filtered.forEach(item => {
        const tr = document.createElement('tr');

        let badgeClass = 'success';
        if (item.status === 'pending') badgeClass = 'warning';
        if (item.status === 'refunded') badgeClass = 'danger';

        tr.innerHTML = `
            <td><span class="cell-code">${item.code}</span></td>
            <td>
                <div class="cell-user">
                    <div class="cell-avatar">${item.avatar}</div>
                    <div>
                        <div class="cell-name-main">${item.user}</div>
                        <div class="cell-name-sub">${item.gateway}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="cell-name-main">${item.homestay}</div>
                <div class="cell-name-sub">${item.time}</div>
            </td>
            <td><strong style="color: #15803D;">${item.amount}</strong></td>
            <td>
                <span class="dash-badge ${badgeClass}">${item.statusText}</span>
            </td>
            <td>
                <button class="btn-dash-action" style="padding: 4px 10px; font-size: 12px;" onclick="openActivityDetail(${item.id})">
                    <span class="material-symbols-outlined" style="font-size: 15px;">visibility</span> Xem
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 7. Modal & Events
function initModalEvents() {
    const modal = document.getElementById('dashModal');
    const closeBtn = document.getElementById('dashModalCloseBtn');
    const okBtn = document.getElementById('dashModalOkBtn');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (okBtn) okBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Gắn sự kiện click vào từng thẻ trong 9 Metric cards để mở xem chi tiết
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            const metricKey = this.getAttribute('data-metric');
            if (metricKey) {
                openMetricDetailModal(metricKey);
            }
        });
    });
}

// Mở modal chi tiết 1 trong 9 chỉ số
function openMetricDetailModal(metricKey) {
    const meta = metricDetailsMeta[metricKey];
    if (!meta) return;

    const modal = document.getElementById('dashModal');
    const modalTitle = document.getElementById('dashModalTitle');
    const modalBody = document.getElementById('dashModalBody');
    const modalActionBtn = document.getElementById('dashModalActionBtn');

    if (modalTitle) {
        modalTitle.innerHTML = `
            <span class="material-symbols-outlined" style="color: ${meta.accentColor}; font-size: 22px;">${meta.icon}</span>
            <span>${meta.title}</span>
        `;
    }

    if (modalBody) {
        let rowsHtml = meta.rows.map(row => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px;">
                <span style="color: #64748B;">${row.label}</span>
                <strong style="color: #1E293B;">${row.val}</strong>
            </div>
        `).join('');

        modalBody.innerHTML = `
            <div style="background: #F8FAFC; border-radius: 10px; padding: 14px; margin-bottom: 16px; border: 1px solid #E2E8F0;">
                <div style="font-size: 12px; color: #64748B; margin-bottom: 4px;">Chỉ số thống kê kỳ: <strong>${getPeriodLabel(currentPeriod)}</strong></div>
                <div style="font-size: 22px; font-weight: 800; color: ${meta.accentColor};">
                    ${document.getElementById(`metric-val-${metricKey}`) ? document.getElementById(`metric-val-${metricKey}`).innerText : ''}
                </div>
            </div>
            <div style="display: flex; flex-direction: column;">
                ${rowsHtml}
            </div>
        `;
    }

    if (modalActionBtn) {
        modalActionBtn.style.display = 'inline-flex';
        modalActionBtn.href = meta.actionLink;
        modalActionBtn.innerHTML = `<span>${meta.actionText}</span> <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>`;
    }

    if (modal) modal.classList.add('show');
}

// Mở modal chi tiết hoạt động đặt phòng
function openActivityDetail(id) {
    const item = recentActivities.find(x => x.id === id);
    if (!item) return;

    const modal = document.getElementById('dashModal');
    const modalTitle = document.getElementById('dashModalTitle');
    const modalBody = document.getElementById('dashModalBody');
    const modalActionBtn = document.getElementById('dashModalActionBtn');

    if (modalTitle) {
        modalTitle.innerHTML = `
            <span class="material-symbols-outlined" style="color: #15803D; font-size: 22px;">receipt</span>
            <span>Chi tiết Đơn đặt phòng ${item.code}</span>
        `;
    }

    if (modalBody) {
        modalBody.innerHTML = `
            <div style="background: #F0FDF4; border-radius: 10px; padding: 14px; margin-bottom: 16px; border: 1px solid #BBF7D0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 12px; color: #166534;">Tổng số tiền thanh toán</div>
                    <div style="font-size: 22px; font-weight: 800; color: #15803D;">${item.amount}</div>
                </div>
                <span class="dash-badge success">${item.statusText}</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #F1F5F9; padding-bottom: 8px;">
                    <span style="color: #64748B;">Khách hàng:</span>
                    <strong>${item.user} (${item.details.phone})</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #F1F5F9; padding-bottom: 8px;">
                    <span style="color: #64748B;">Homestay đặt chỗ:</span>
                    <strong>${item.homestay}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #F1F5F9; padding-bottom: 8px;">
                    <span style="color: #64748B;">Chủ nhà (Host):</span>
                    <strong>${item.details.host}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #F1F5F9; padding-bottom: 8px;">
                    <span style="color: #64748B;">Hạng phòng:</span>
                    <strong>${item.details.room}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #F1F5F9; padding-bottom: 8px;">
                    <span style="color: #64748B;">Thời gian lưu trú:</span>
                    <strong>${item.details.dates}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #F1F5F9; padding-bottom: 8px;">
                    <span style="color: #64748B;">Phương thức giao dịch:</span>
                    <strong>${item.gateway}</strong>
                </div>
            </div>
        `;
    }

    if (modalActionBtn) {
        modalActionBtn.style.display = 'inline-flex';
        modalActionBtn.href = 'manage_transactions.html';
        modalActionBtn.innerHTML = `<span>Xem trong Quản lý giao dịch</span> <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>`;
    }

    if (modal) modal.classList.add('show');
}

// Đóng modal
function closeModal() {
    const modal = document.getElementById('dashModal');
    if (modal) modal.classList.remove('show');
}

// Tiện ích lấy tên nhãn kỳ thời gian
function getPeriodLabel(period) {
    switch (period) {
        case 'today': return 'Hôm nay';
        case '7days': return '7 ngày qua';
        case 'month': return 'Tháng này (Tháng 9/2026)';
        case 'year': return 'Năm 2026';
        default: return 'Tháng này';
    }
}
