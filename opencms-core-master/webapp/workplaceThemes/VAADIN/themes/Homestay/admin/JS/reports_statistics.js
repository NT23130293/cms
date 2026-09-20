// Quản lý logic trang Báo cáo & Thống kê - Admin YÊN System

let chartInstances = {};

document.addEventListener('DOMContentLoaded', () => {
    initProfileDropdown();
    initTabSwitcher();
    initGlobalDateFilter();

    // Mac dinh load tab Báo cáo doanh thu
    renderTabContent('revenue');
});

// Dropdown profile admin
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

// Chuyen tab giua 8 module thong ke
function initTabSwitcher() {
    const tabBtns = document.querySelectorAll('.reports-tabs-nav .tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.tab-panel-content').forEach(panel => {
                panel.classList.remove('active');
            });

            const activePanel = document.getElementById(`tab-${targetTab}`);
            if (activePanel) {
                activePanel.classList.add('active');
                renderTabContent(targetTab);
            }
        });
    });
}

// Render chart & data theo tung tab
function renderTabContent(tabKey) {
    switch (tabKey) {
        case 'revenue':
            renderRevenueTab();
            break;
        case 'booking':
            renderBookingTab();
            break;
        case 'tourist':
            renderTouristTab();
            break;
        case 'owner':
            renderOwnerTab();
            break;
        case 'homestay':
            renderHomestayTab();
            break;
        case 'transactions':
            renderTransactionsTab();
            break;
        case 'vouchers':
            renderVouchersTab();
            break;
        case 'ads':
            renderAdsTab();
            break;
    }
}

// Ham khoi tao / render lai Chart.js truoc khi ve
function createOrUpdateChart(canvasId, chartConfig) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }

    const ctx = canvas.getContext('2d');
    chartInstances[canvasId] = new Chart(ctx, chartConfig);
}

// 1. Thong ke Doanh thu
function renderRevenueTab() {
    createOrUpdateChart('chartRevenueTrend', {
        type: 'line',
        data: {
            labels: ['Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9'],
            datasets: [
                {
                    label: 'Tổng Doanh Thu (GMV)',
                    data: [1.2, 1.8, 2.4, 3.1, 2.9, 3.48],
                    borderColor: '#15803D',
                    backgroundColor: 'rgba(21, 128, 61, 0.08)',
                    fill: true,
                    tension: 0.35,
                    borderWidth: 3
                },
                {
                    label: 'Phí Sàn YÊN (8%)',
                    data: [0.096, 0.144, 0.192, 0.248, 0.232, 0.278],
                    borderColor: '#0284C7',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function (ctx) {
                            return `${ctx.dataset.label}: ${ctx.raw} Tỷ VNĐ`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Tỷ VNĐ' }
                }
            }
        }
    });

    createOrUpdateChart('chartRevenueRegion', {
        type: 'doughnut',
        data: {
            labels: ['Pù Luông', 'Mai Châu', 'Mộc Châu', 'Sa Pa', 'Đà Lạt', 'Khác'],
            datasets: [{
                data: [35, 22, 18, 15, 7, 3],
                backgroundColor: ['#15803D', '#0284C7', '#9333EA', '#D97706', '#EC4899', '#94A3B8']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
}

// 2. Thong ke Booking
function renderBookingTab() {
    createOrUpdateChart('chartBookingTrend', {
        type: 'bar',
        data: {
            labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
            datasets: [
                {
                    label: 'Booking Thành công',
                    data: [840, 920, 1050, 1080],
                    backgroundColor: '#16A34A'
                },
                {
                    label: 'Booking Hủy',
                    data: [95, 110, 102, 103],
                    backgroundColor: '#EF4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { stacked: true }, y: { stacked: true } }
        }
    });

    createOrUpdateChart('chartBookingSource', {
        type: 'pie',
        data: {
            labels: ['Direct Website', 'App Mobile', 'Affiliate', 'Google Search', 'Khác'],
            datasets: [{
                data: [48, 32, 12, 5, 3],
                backgroundColor: ['#059669', '#2563EB', '#7C3AED', '#EA580C', '#64748B']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 3. Thong ke Tourist
function renderTouristTab() {
    createOrUpdateChart('chartTouristGrowth', {
        type: 'line',
        data: {
            labels: ['T4', 'T5', 'T6', 'T7', 'T8', 'T9'],
            datasets: [
                {
                    label: 'Du khách mới',
                    data: [4200, 5800, 8900, 12400, 11200, 14500],
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true
                },
                {
                    label: 'Khách quay lại',
                    data: [1100, 1800, 3100, 4200, 3900, 4950],
                    borderColor: '#059669',
                    backgroundColor: 'transparent'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    createOrUpdateChart('chartTouristAge', {
        type: 'bar',
        data: {
            labels: ['18 - 24 tuổi', '25 - 34 tuổi', '35 - 44 tuổi', '45 - 54 tuổi', '55+ tuổi'],
            datasets: [{
                label: 'Tỷ lệ %',
                data: [28, 46, 16, 7, 3],
                backgroundColor: '#8B5CF6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y'
        }
    });
}

// 4. Thong ke Owner
function renderOwnerTab() {
    createOrUpdateChart('chartOwnerPerformance', {
        type: 'bar',
        data: {
            labels: ['Triệu Văn Sản', 'Vàng A Sáng', 'Đinh Thị Hương', 'Nguyễn Văn An', 'Bùi Văn Nam'],
            datasets: [
                {
                    label: 'Doanh thu (Triệu VNĐ)',
                    data: [385, 290, 245, 210, 180],
                    backgroundColor: '#15803D'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    createOrUpdateChart('chartOwnerRating', {
        type: 'doughnut',
        data: {
            labels: ['5 ⭐ Xuất sắc', '4 ⭐ Tốt', '3 ⭐ Trung bình', 'Dưới 3 ⭐'],
            datasets: [{
                data: [78, 17, 4, 1],
                backgroundColor: ['#16A34A', '#3B82F6', '#F59E0B', '#EF4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 5. Thong ke Homestay
function renderHomestayTab() {
    createOrUpdateChart('chartHomestayRegionCount', {
        type: 'bar',
        data: {
            labels: ['Pù Luông', 'Mai Châu', 'Mộc Châu', 'Sa Pa', 'Đà Lạt', 'Ninh Bình', 'Khác'],
            datasets: [{
                label: 'Số lượng Homestay',
                data: [128, 95, 82, 74, 45, 32, 24],
                backgroundColor: '#0EA5E9'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    createOrUpdateChart('chartHomestayStatus', {
        type: 'pie',
        data: {
            labels: ['Đang hoạt động', 'Chờ phê duyệt', 'Tạm khóa', 'Ngừng niêm yết'],
            datasets: [{
                data: [395, 25, 18, 12],
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#6B7280']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 6. Thong ke Giao dich
function renderTransactionsTab() {
    createOrUpdateChart('chartGatewayVolume', {
        type: 'doughnut',
        data: {
            labels: ['VNPay QR (45%)', 'Ví MoMo (32%)', 'VietQR (18%)', 'Thẻ Visa/Master (5%)'],
            datasets: [{
                data: [45, 32, 18, 5],
                backgroundColor: ['#0284C7', '#C026D3', '#16A34A', '#EA580C']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    createOrUpdateChart('chartTransactionTypes', {
        type: 'bar',
        data: {
            labels: ['Tiền cọc YÊN giữ', 'Giải ngân Owner', 'Duyệt Hoàn tiền', 'Thanh toán bổ sung'],
            datasets: [{
                label: 'Số lượng GD',
                data: [1420, 1180, 85, 210],
                backgroundColor: '#6366F1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 7. Thong ke Ma giam gia
function renderVouchersTab() {
    createOrUpdateChart('chartVoucherRedemption', {
        type: 'bar',
        data: {
            labels: ['YENNEW2026', 'PULUONGCHILL', 'SUMMERVIBE', 'MOCKHAUTRIP', 'VIPHOMESTAY'],
            datasets: [
                {
                    label: 'Lượt sử dụng',
                    data: [4850, 3200, 2150, 1420, 830],
                    backgroundColor: '#EC4899'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    createOrUpdateChart('chartVoucherRoi', {
        type: 'line',
        data: {
            labels: ['T5', 'T6', 'T7', 'T8', 'T9'],
            datasets: [{
                label: 'Tỷ lệ ROAS (x lần)',
                data: [4.2, 5.8, 7.1, 6.5, 8.4],
                borderColor: '#DB2777',
                backgroundColor: 'rgba(219, 39, 119, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 8. Thong ke Quang cao
function renderAdsTab() {
    createOrUpdateChart('chartAdsImpressions', {
        type: 'line',
        data: {
            labels: ['01/09', '05/09', '10/09', '15/09', '20/09'],
            datasets: [
                {
                    label: 'Hero Slider (Lượt xem)',
                    data: [18000, 24000, 35000, 42000, 58000],
                    borderColor: '#9333EA',
                    fill: false
                },
                {
                    label: 'Combo Tiết kiệm (Lượt xem)',
                    data: [12000, 16000, 22000, 29000, 34000],
                    borderColor: '#2563EB',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    createOrUpdateChart('chartAdsCtr', {
        type: 'bar',
        data: {
            labels: ['Hero Banner', 'Pop-up Khuyến mãi', 'Combo Tiết kiệm', 'Sidebar Detail'],
            datasets: [{
                label: 'CTR (%)',
                data: [9.4, 11.2, 7.8, 4.5],
                backgroundColor: '#8B5CF6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Loc theo thoi gian (Ca preset mac dinh & Tu ngay -> Den ngay Tuy chinh)
function initGlobalDateFilter() {
    const selector = document.getElementById('globalDateFilter');
    const customBox = document.getElementById('customDateBox');
    const btnApply = document.getElementById('btnApplyDate');
    const startInput = document.getElementById('startDateInput');
    const endInput = document.getElementById('endDateInput');

    if (selector) {
        selector.addEventListener('change', function () {
            const val = this.value;

            if (val === 'custom') {
                if (customBox) customBox.classList.add('show');
            } else {
                if (customBox) customBox.classList.remove('show');
                showToast(`Đã lọc dữ liệu theo: ${this.options[this.selectedIndex].text}`);
                refreshCurrentTab();
            }
        });
    }

    if (btnApply) {
        btnApply.addEventListener('click', () => {
            const startVal = startInput ? startInput.value : '';
            const endVal = endInput ? endInput.value : '';

            if (!startVal || !endVal) {
                showToast('Vui lòng chọn đầy đủ Từ ngày và Đến ngày!');
                return;
            }

            if (new Date(startVal) > new Date(endVal)) {
                showToast('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
                return;
            }

            const startFmt = formatDateVN(startVal);
            const endFmt = formatDateVN(endVal);

            showToast(`Đã lọc dữ liệu từ ${startFmt} đến ${endFmt}`);
            refreshCurrentTab();
        });
    }
}

function formatDateVN(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

function refreshCurrentTab() {
    const activeTab = document.querySelector('.reports-tabs-nav .tab-btn.active');
    if (activeTab) {
        renderTabContent(activeTab.getAttribute('data-tab'));
    }
}

// Xuat bao cao
function exportReportExcel() {
    showToast('Đang xuất file Excel...');
}

function exportReportPdf() {
    showToast('Đang chuẩn bị file in báo cáo...');
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #064E3B;
        color: #FFFFFF;
        padding: 10px 18px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        z-index: 9999;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
