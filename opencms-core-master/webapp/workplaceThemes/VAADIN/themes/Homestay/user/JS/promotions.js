/**
 * YÊN Homestay - Kho Mã Giảm Giá Homestay Gọn Gàng
 * File: user/JS/promotions.js
 * Quản lý danh sách voucher từng Homestay cụ thể, tối ưu chiều cao card gọn gàng, vừa vặn
 */

// Danh sách mã giảm giá dành riêng cho từng Homestay
let homestayVouchers = [
  // --- MỤC 1: VOUCHER HOT NHẤT HÔM NAY ---
  {
    id: 'VCH-HS-001',
    homestayName: 'Han River Glass House',
    homestayImg: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    location: 'Bờ sông Hàn, Đà Nẵng',
    city: 'danang',
    rating: '4.95',
    reviews: '184',
    originalPrice: '1.150.000đ',
    code: 'HANRIVER200',
    section: 'hot',
    collectionBadge: '🔥 HOT NHẤT',
    tagClass: 'tag-red',
    tag: 'Bờ sông Hàn',
    discountVal: 'Giảm 200K',
    discountType: 'Giảm tiền mặt',
    title: 'Han River Glass House',
    condition: 'Đơn từ 1.5tr · Đặt từ 2 đêm',
    minSpend: 1500000,
    maxDiscount: 200000,
    expiryText: 'Hạn: 31/12/2026',
    isUrgent: false,
    usedPercent: 88,
    isSaved: true,
    status: 'active',
    terms: [
      'Áp dụng tại Han River Glass House (Đà Nẵng).',
      'Đơn hàng tối thiểu từ 1.500.000đ trở lên.',
      'Mỗi tài khoản được lưu và sử dụng tối đa 1 lần.'
    ]
  },
  {
    id: 'VCH-HS-002',
    homestayName: 'The Memory Valley Villa',
    homestayImg: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
    location: 'Hồ Tuyền Lâm, Đà Lạt',
    city: 'dalat',
    rating: '4.96',
    reviews: '340',
    originalPrice: '1.450.000đ',
    code: 'MEMORY180',
    section: 'hot',
    collectionBadge: '🔥 HOT NHẤT',
    tagClass: 'tag-orange',
    tag: 'Săn Mây Đà Lạt',
    discountVal: 'Giảm 180K',
    discountType: 'Giảm trực tiếp',
    title: 'The Memory Valley Villa',
    condition: 'Đơn từ 1.2tr · Bể bơi nước ấm',
    minSpend: 1200000,
    maxDiscount: 180000,
    expiryText: 'Hạn: 18/12/2026',
    isUrgent: false,
    usedPercent: 91,
    isSaved: false,
    status: 'active',
    terms: [
      'Áp dụng tại căn Villa thung lũng Hồ Tuyền Lâm (Đà Lạt).',
      'Tự do sử dụng bể bơi nước ấm 24/7.'
    ]
  },
  {
    id: 'VCH-HS-003',
    homestayName: 'Tràng An Valley Retreat',
    homestayImg: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
    location: 'Tràng An, Ninh Bình',
    city: 'ninhbinh',
    rating: '4.96',
    reviews: '175',
    originalPrice: '1.050.000đ',
    code: 'TRANGAN120',
    section: 'hot',
    collectionBadge: '🔥 HOT NHẤT',
    tagClass: 'tag-teal',
    tag: 'Khinh Khí Cầu',
    discountVal: 'Giảm 120K',
    discountType: 'Giảm trực tiếp',
    title: 'Tràng An Valley Retreat',
    condition: 'Đơn từ 1.0tr · View núi đá vôi',
    minSpend: 1000000,
    maxDiscount: 120000,
    expiryText: 'Hạn: 30/10/2026',
    isUrgent: false,
    usedPercent: 74,
    isSaved: false,
    status: 'active',
    terms: [
      'Áp dụng khi đặt phòng dịp Lễ hội Khinh khí cầu Tràng An.',
      'Miễn phí mượn xe đạp dạo quanh đầm sen.'
    ]
  },
  {
    id: 'VCH-HS-004',
    homestayName: 'Topas Ecolodge Sapa',
    homestayImg: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    location: 'Mường Hoa, Sapa',
    city: 'sapa',
    rating: '4.98',
    reviews: '310',
    originalPrice: '4.590.000đ',
    code: 'TOPASHOT500',
    section: 'hot',
    collectionBadge: '🔥 HOT NHẤT',
    tagClass: 'tag-green',
    tag: 'Săn mây Sapa',
    discountVal: 'Giảm 500K',
    discountType: 'Giảm tiền mặt',
    title: 'Topas Ecolodge Sapa',
    condition: 'Đơn từ 3.8tr · Bể bơi vô cực',
    minSpend: 3800000,
    maxDiscount: 500000,
    expiryText: 'Còn 2 ngày',
    isUrgent: true,
    usedPercent: 96,
    isSaved: true,
    status: 'active',
    terms: [
      'Áp dụng cho Bungalow view thung lũng Mường Hoa Sapa.',
      'Miễn phí xe đưa đón Limousine từ trung tâm Sapa.'
    ]
  },

  // --- MỤC 2: MÃ GIẢM GIÁ MỚI PHÁT HÀNH ---
  {
    id: 'VCH-HS-005',
    homestayName: 'Dalat Blooming Garden',
    homestayImg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    location: 'Hồ Xuân Hương, Đà Lạt',
    city: 'dalat',
    rating: '4.97',
    reviews: '230',
    originalPrice: '950.000đ',
    code: 'BLOOMING100',
    section: 'new',
    collectionBadge: '✨ MỚI',
    tagClass: 'tag-green',
    tag: 'Vườn Cẩm Tú Cầu',
    discountVal: 'Giảm 100K',
    discountType: 'Giảm trực tiếp',
    title: 'Dalat Blooming Garden',
    condition: 'Đơn từ 900k · Trà chiều miễn phí',
    minSpend: 900000,
    maxDiscount: 100000,
    expiryText: 'Hạn: 20/11/2026',
    isUrgent: false,
    usedPercent: 22,
    isSaved: false,
    status: 'active',
    terms: [
      'Voucher áp dụng cho tất cả phòng tại Dalat Blooming Garden.',
      'Tặng 01 set trà chiều ngắm sương.'
    ]
  },
  {
    id: 'VCH-HS-006',
    homestayName: 'Nhà Rường Cổ Cố Đô',
    homestayImg: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80',
    location: 'Đoàn Thị Điểm, TP. Huế',
    city: 'hue',
    rating: '4.94',
    reviews: '167',
    originalPrice: '890.000đ',
    code: 'NHARUONG80',
    section: 'new',
    collectionBadge: '✨ MỚI',
    tagClass: 'tag-teal',
    tag: 'Văn hóa Cố Đô',
    discountVal: 'Giảm 80K',
    discountType: 'Giảm tiền mặt',
    title: 'Nhà Rường Cổ Cố Đô',
    condition: 'Đơn từ 800k · Thưởng Trà Sen',
    minSpend: 800000,
    maxDiscount: 80000,
    expiryText: 'Hạn: 25/11/2026',
    isUrgent: false,
    usedPercent: 18,
    isSaved: true,
    status: 'active',
    terms: [
      'Áp dụng tại Nhà Rường Cổ Cố Đô cách Đại Nội 350m.',
      'Miễn phí thử Áo dài check-in sân vườn.'
    ]
  },
  {
    id: 'VCH-HS-007',
    homestayName: 'Ninh Bình Eco Cabin',
    homestayImg: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    location: 'Hoa Lư, Ninh Bình',
    city: 'ninhbinh',
    rating: '4.91',
    reviews: '138',
    originalPrice: '860.000đ',
    code: 'NINHBINH70',
    section: 'new',
    collectionBadge: '✨ MỚI',
    tagClass: 'tag-orange',
    tag: 'Cabin Giữa Núi',
    discountVal: 'Giảm 70K',
    discountType: 'Giảm trực tiếp',
    title: 'Ninh Bình Eco Cabin',
    condition: 'Đơn từ 750k · Chèo Kayak miễn phí',
    minSpend: 750000,
    maxDiscount: 70000,
    expiryText: 'Hạn: 05/11/2026',
    isUrgent: false,
    usedPercent: 15,
    isSaved: false,
    status: 'active',
    terms: [
      'Voucher áp dụng cho các Cabin gỗ giữa núi đá Hoa Lư.',
      'Tặng 01 lượt chèo thuyền Kayak đầm sen.'
    ]
  },
  {
    id: 'VCH-HS-008',
    homestayName: 'Rustic Pine Hill Cabin',
    homestayImg: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    location: 'Bắc Sơn, Đà Lạt',
    city: 'dalat',
    rating: '4.88',
    reviews: '124',
    originalPrice: '790.000đ',
    code: 'PINEHILL60',
    section: 'new',
    collectionBadge: '✨ MỚI',
    tagClass: 'tag-green',
    tag: 'Nhà Gỗ Mái Dốc',
    discountVal: 'Giảm 60K',
    discountType: 'Giảm trực tiếp',
    title: 'Rustic Pine Hill Cabin',
    condition: 'Đơn từ 700k · Lửa trại nướng khoai',
    minSpend: 700000,
    maxDiscount: 60000,
    expiryText: 'Hạn: 10/12/2026',
    isUrgent: false,
    usedPercent: 30,
    isSaved: false,
    status: 'active',
    terms: [
      'Áp dụng cho căn nhà gỗ dốc săn mây tại Khởi Nghĩa Bắc Sơn.'
    ]
  },

  // --- MỤC 3: VOUCHER DÙNG NHIỀU NHẤT ---
  {
    id: 'VCH-HS-009',
    homestayName: 'Danang Riverside Cozy Villa',
    homestayImg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    location: 'Trần Hưng Đạo, Đà Nẵng',
    city: 'danang',
    rating: '4.92',
    reviews: '142',
    originalPrice: '1.450.000đ',
    code: 'COZYDANANG150',
    section: 'most_used',
    collectionBadge: '⚡ DÙNG NHIỀU',
    tagClass: 'tag-orange',
    tag: 'Bờ Sông Hàn',
    discountVal: 'Giảm 150K',
    discountType: 'Giảm trực tiếp',
    title: 'Danang Riverside Villa',
    condition: 'Đơn từ 1.3tr · Gần bờ sông Hàn',
    minSpend: 1300000,
    maxDiscount: 150000,
    expiryText: 'Hạn: 10/11/2026',
    isUrgent: false,
    usedPercent: 89,
    isSaved: false,
    status: 'active',
    terms: [
      'Áp dụng cho căn biệt thự Danang Riverside Cozy Villa.',
      'Tối đa 6 khách/căn, phù hợp cho nhóm bạn.'
    ]
  },
  {
    id: 'VCH-HS-010',
    homestayName: 'Sông Hương Lotus Villa',
    homestayImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    location: 'Lê Lợi, TP. Huế',
    city: 'hue',
    rating: '4.90',
    reviews: '115',
    originalPrice: '1.180.000đ',
    code: 'SONGHUONG100',
    section: 'most_used',
    collectionBadge: '⚡ DÙNG NHIỀU',
    tagClass: 'tag-teal',
    tag: 'View Sông Hương',
    discountVal: 'Giảm 100K',
    discountType: 'Giảm tiền mặt',
    title: 'Sông Hương Lotus Villa',
    condition: 'Đơn từ 1.0tr · Ban công ngắm sông',
    minSpend: 1000000,
    maxDiscount: 100000,
    expiryText: 'Hạn: 12/11/2026',
    isUrgent: false,
    usedPercent: 85,
    isSaved: false,
    status: 'active',
    terms: [
      'Áp dụng tại Villa view bờ sông Hương gần Cầu Trường Tiền.',
      'Phục vụ bữa sáng món Huế truyền thống.'
    ]
  },
  {
    id: 'VCH-HS-011',
    homestayName: 'My Khe Studio Đà Nẵng',
    homestayImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    location: 'Quận Sơn Trà, Đà Nẵng',
    city: 'danang',
    rating: '4.89',
    reviews: '96',
    originalPrice: '850.000đ',
    code: 'MYKHE50',
    section: 'most_used',
    collectionBadge: '⚡ DÙNG NHIỀU',
    tagClass: 'tag-green',
    tag: 'Gần Biển Mỹ Khê',
    discountVal: 'Giảm 50K',
    discountType: 'Giảm trực tiếp',
    title: 'My Khe Studio Đà Nẵng',
    condition: 'Đơn từ 700k · Xe máy miễn phí',
    minSpend: 700000,
    maxDiscount: 50000,
    expiryText: 'Hạn: 15/12/2026',
    isUrgent: false,
    usedPercent: 92,
    isSaved: true,
    status: 'active',
    terms: [
      'Áp dụng cho căn hộ Studio cách biển Mỹ Khê 300m.'
    ]
  },
  {
    id: 'VCH-HS-012',
    homestayName: 'Tam Cốc Golden Rice',
    homestayImg: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
    location: 'Tam Cốc, Ninh Bình',
    city: 'ninhbinh',
    rating: '4.89',
    reviews: '112',
    originalPrice: '790.000đ',
    code: 'TAMCOC80',
    section: 'most_used',
    collectionBadge: '⚡ DÙNG NHIỀU',
    tagClass: 'tag-orange',
    tag: 'Cánh Đồng Lúa',
    discountVal: 'Giảm 80K',
    discountType: 'Giảm trực tiếp',
    title: 'Tam Cốc Golden Rice',
    condition: 'Đơn từ 700k · View đồng lúa chín',
    minSpend: 700000,
    maxDiscount: 80000,
    expiryText: 'Hạn: 01/12/2026',
    isUrgent: false,
    usedPercent: 80,
    isSaved: false,
    status: 'active',
    terms: [
      'Áp dụng khi đặt phòng tại Tam Cốc Golden Rice Homestay.'
    ]
  },

  // --- MỤC 4: ĐẶC QUYỀN VIP & VILLA NGUYÊN CĂN ---
  {
    id: 'VCH-HS-013',
    homestayName: 'Sơn Trà Sunset Infinity Villa',
    homestayImg: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    location: 'Sơn Trà, Đà Nẵng',
    city: 'danang',
    rating: '4.94',
    reviews: '215',
    originalPrice: '2.750.000đ',
    code: 'SONTRA250',
    section: 'vip',
    collectionBadge: '🎁 ĐẶC QUYỀN VIP',
    tagClass: 'tag-red',
    tag: 'Bể Bơi Vô Cực',
    discountVal: 'Giảm 250K',
    discountType: 'Giảm trực tiếp',
    title: 'Sơn Trà Sunset Villa',
    condition: 'Đơn từ 2.2tr · Hồ bơi vô cực view biển',
    minSpend: 2200000,
    maxDiscount: 250000,
    expiryText: 'Hạn: 28/12/2026',
    isUrgent: false,
    usedPercent: 45,
    isSaved: true,
    status: 'active',
    terms: [
      'Dành riêng cho Villa bể bơi vô cực view biển Sơn Trà.',
      'Miễn phí nướng BBQ sân vườn ngoài trời.'
    ]
  },
  {
    id: 'VCH-HS-014',
    homestayName: 'Ana Mandara Villas Đà Lạt',
    homestayImg: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    location: 'Lê Lai, TP. Đà Lạt',
    city: 'dalat',
    rating: '4.96',
    reviews: '195',
    originalPrice: '2.890.000đ',
    code: 'ANAMANDARA300',
    section: 'vip',
    collectionBadge: '🎁 ĐẶC QUYỀN VIP',
    tagClass: 'tag-teal',
    tag: 'Biệt thự Pháp cổ',
    discountVal: 'Giảm 300K',
    discountType: 'Giảm tiền mặt',
    title: 'Ana Mandara Villas Đà Lạt',
    condition: 'Đơn từ 2.5tr · Ăn sáng tại phòng',
    minSpend: 2500000,
    maxDiscount: 300000,
    expiryText: 'Hạn: 15/10/2026',
    isUrgent: false,
    usedPercent: 60,
    isSaved: true,
    status: 'active',
    terms: [
      'Áp dụng cho biệt thự cổ Pháp tại Ana Mandara Đà Lạt.',
      'Miễn phí dịch vụ ăn sáng tại phòng.'
    ]
  },
  {
    id: 'VCH-HS-015',
    homestayName: 'Hang Múa Lotus View Ecolodge',
    homestayImg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    location: 'Khê Hạ, Ninh Bình',
    city: 'ninhbinh',
    rating: '4.93',
    reviews: '164',
    originalPrice: '1.980.000đ',
    code: 'HANGMUA200',
    section: 'vip',
    collectionBadge: '🎁 ĐẶC QUYỀN VIP',
    tagClass: 'tag-orange',
    tag: 'View Đỉnh Hang Múa',
    discountVal: 'Giảm 200K',
    discountType: 'Giảm trực tiếp',
    title: 'Hang Múa Lotus View Ecolodge',
    condition: 'Đơn từ 1.8tr · View đỉnh Hang Múa',
    minSpend: 1800000,
    maxDiscount: 200000,
    expiryText: 'Hạn: 20/12/2026',
    isUrgent: false,
    usedPercent: 52,
    isSaved: false,
    status: 'active',
    terms: [
      'Dành riêng cho khu Ecolodge view đỉnh Hang Múa Ninh Bình.'
    ]
  },
  {
    id: 'VCH-HS-016',
    homestayName: 'Imperial Citadel Garden Villa',
    homestayImg: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    location: 'Thuận Thành, TP. Huế',
    city: 'hue',
    rating: '4.92',
    reviews: '148',
    originalPrice: '1.650.000đ',
    code: 'CITADEL150',
    section: 'vip',
    collectionBadge: '🎁 ĐẶC QUYỀN VIP',
    tagClass: 'tag-green',
    tag: 'Sân Vườn Ngự Hà',
    discountVal: 'Giảm 150K',
    discountType: 'Giảm trực tiếp',
    title: 'Imperial Citadel Villa',
    condition: 'Đơn từ 1.5tr · Thưởng trà Ngự Hà',
    minSpend: 1500000,
    maxDiscount: 150000,
    expiryText: 'Hạn: 15/12/2026',
    isUrgent: false,
    usedPercent: 38,
    isSaved: false,
    status: 'active',
    terms: [
      'Áp dụng khi lưu trú tại Imperial Citadel Garden Villa Huế.'
    ]
  }
];

let currentMode = 'hub'; // 'hub', 'wallet', 'expired'
let currentCity = 'all'; // 'all', 'danang', 'dalat', 'sapa', 'ninhbinh', 'hue'
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  // Nạp Header & Footer
  if (typeof loadExternalHeader === 'function') {
    loadExternalHeader('header-placeholder', 'header.html', 'Khuyến mãi');
  }
  if (typeof loadExternalFooter === 'function') {
    loadExternalFooter('footer-placeholder', 'footer.html');
  }

  // Khởi tạo hiển thị
  renderAllVoucherSections();
  updateStatsCounters();

  const searchInput = document.getElementById('searchHomestayInput');
  const clearBtn = document.getElementById('searchClearBtn');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        if (searchQuery.length > 0) clearBtn.classList.add('show');
        else clearBtn.classList.remove('show');
      }
      renderAllVoucherSections();
    });
  }

  const redeemInput = document.getElementById('redeemCodeInput');
  if (redeemInput) {
    redeemInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitRedeemCode();
    });
  }
});

/**
 * Xóa từ khóa tìm kiếm
 */
function clearSearchInput() {
  const input = document.getElementById('searchHomestayInput');
  const clearBtn = document.getElementById('searchClearBtn');
  if (input) {
    input.value = '';
    searchQuery = '';
    if (clearBtn) clearBtn.classList.remove('show');
    renderAllVoucherSections();
    input.focus();
  }
}

/**
 * Cập nhật số đếm thống kê
 */
function updateStatsCounters() {
  const savedList = homestayVouchers.filter(v => v.isSaved && v.status === 'active');
  const activeHubList = homestayVouchers.filter(v => v.status === 'active');

  const statSavedCount = document.getElementById('statSavedCount');
  if (statSavedCount) statSavedCount.textContent = `${savedList.length} mã`;

  const statUrgentCount = document.getElementById('statUrgentCount');
  const urgentCount = savedList.filter(v => v.isUrgent).length;
  if (statUrgentCount) statUrgentCount.textContent = `${urgentCount} mã`;

  const countHub = document.getElementById('countHub');
  if (countHub) countHub.textContent = activeHubList.length;

  const countWallet = document.getElementById('countWallet');
  if (countWallet) countWallet.textContent = savedList.length;
}

/**
 * Chuyển đổi mode xem (Kho mã vs Ví cá nhân vs Hết hạn)
 */
function switchModeTab(mode, btnEl) {
  currentMode = mode;

  const modeBtns = document.querySelectorAll('.mode-tab-box .btn-mode-tab');
  modeBtns.forEach(b => b.classList.remove('active'));
  if (btnEl) {
    btnEl.classList.add('active');
  } else if (modeBtns.length > 0) {
    modeBtns[0].classList.add('active');
  }

  renderAllVoucherSections();
}



/**
 * Render toàn bộ 4 Section theo bố cục dọc gọn gàng
 */
function renderAllVoucherSections() {
  renderSectionGrid('gridHot', 'hot');
  renderSectionGrid('gridNew', 'new');
  renderSectionGrid('gridMostUsed', 'most_used');
  renderSectionGrid('gridVip', 'vip');
}

/**
 * Render 1 lưới Section cụ thể với thẻ nearby-card nhỏ gọn, vừa vặn
 */
function renderSectionGrid(gridId, sectionType) {
  const container = document.getElementById(gridId);
  if (!container) return;

  // Lọc thẻ cho từng Section
  let items = homestayVouchers.filter(v => v.section === sectionType);

  // Lọc theo Mode
  items = items.filter(v => {
    if (currentMode === 'hub') return v.status === 'active';
    if (currentMode === 'wallet') return v.isSaved && v.status === 'active';
    if (currentMode === 'expired') return v.status === 'expired';
    return true;
  });

  // Lọc theo Thành phố
  if (currentCity !== 'all') {
    items = items.filter(v => v.city === currentCity);
  }

  // Lọc theo từ khóa tìm kiếm
  if (searchQuery) {
    items = items.filter(v => {
      const matchName = v.homestayName.toLowerCase().includes(searchQuery);
      const matchCode = v.code.toLowerCase().includes(searchQuery);
      const matchLoc = v.location.toLowerCase().includes(searchQuery);
      return matchName || matchCode || matchLoc;
    });
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-section-card">
        <p><i class="bi bi-info-circle me-1"></i> Chưa có voucher phù hợp trong mục này.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    const isSaved = item.isSaved;
    const isExpired = item.status === 'expired';

    let actionBtnHtml = '';
    if (isExpired) {
      actionBtnHtml = `<button class="btn-voucher-action btn-saved" disabled>Hết hạn</button>`;
    } else if (isSaved) {
      actionBtnHtml = `
        <button class="btn-voucher-action btn-use" onclick="copyVoucherCode('${item.code}')" title="Sao chép mã">
          Copy
        </button>
      `;
    } else {
      actionBtnHtml = `
        <button class="btn-voucher-action btn-save" onclick="saveVoucherToWallet('${item.id}')">
          Lưu
        </button>
      `;
    }

    return `
      <div class="nearby-card compact-card">
        <!-- Ảnh & Thẻ Tag Gọn Gàng -->
        <div class="nearby-img-box compact-img-box">
          <span class="nearby-tag ${item.tagClass}">${item.collectionBadge}</span>
          <button class="nearby-heart-btn ${isSaved ? 'active text-danger' : ''}" onclick="toggleSaveVoucher('${item.id}')" title="Lưu voucher">
            <i class="bi ${isSaved ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
          </button>
          <img src="${item.homestayImg}" alt="${item.homestayName}">
        </div>

        <div class="nearby-body compact-body">
          <div class="nearby-meta-row">
            <span class="nearby-location"><i class="bi bi-geo-alt-fill text-danger"></i> ${item.location}</span>
            <span class="nearby-rating"><i class="bi bi-star-fill text-warning"></i> ${item.rating}</span>
          </div>

          <h3 class="nearby-name compact-name" title="${item.homestayName}">${item.homestayName}</h3>
          
          <!-- Thanh Coupon Mã Giảm Giá Ngang Gọn Gàng -->
          <div class="compact-voucher-strip">
            <div class="strip-left-val">${item.discountVal}</div>
            <div class="strip-right-code">
              <span class="code-pill">${item.code}</span>
              <span class="cond-text">${item.condition}</span>
            </div>
          </div>

          <!-- Footer Card Row -->
          <div class="nearby-footer-row compact-footer">
            <button class="btn-terms-link" onclick="openVoucherTermsModal('${item.id}')">Điều kiện</button>
            <div class="d-flex align-items-center gap-1.5">
              ${actionBtnHtml}
              <button class="btn-room-detail" onclick="goToHomestay('${item.homestayName}')">Xem phòng</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Toggle lưu voucher từ nút tim
 */
function toggleSaveVoucher(voucherId) {
  const item = homestayVouchers.find(v => v.id === voucherId);
  if (!item) return;

  item.isSaved = !item.isSaved;
  if (item.isSaved) {
    showToast(`Đã lưu voucher "${item.code}" vào ví của bạn!`);
  } else {
    showToast(`Đã bỏ lưu voucher "${item.code}".`);
  }

  updateStatsCounters();
  renderAllVoucherSections();
}

/**
 * Lưu mã vào ví
 */
function saveVoucherToWallet(voucherId) {
  const item = homestayVouchers.find(v => v.id === voucherId);
  if (!item) return;

  item.isSaved = true;
  showToast(`Đã lưu voucher "${item.code}" cho ${item.homestayName}!`);
  updateStatsCounters();
  renderAllVoucherSections();
}

/**
 * Sao chép mã
 */
function copyVoucherCode(code) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`Đã sao chép mã "${code}". Dán tại bước thanh toán để nhận ưu đãi!`);
    }).catch(() => fallbackCopy(code));
  } else {
    fallbackCopy(code);
  }
}

function fallbackCopy(code) {
  const input = document.createElement('input');
  input.value = code;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  showToast(`Đã sao chép mã "${code}".`);
}

/**
 * Nhập mã thủ công
 */
function submitRedeemCode() {
  const inputEl = document.getElementById('redeemCodeInput');
  if (!inputEl) return;

  const rawCode = inputEl.value.trim().toUpperCase();
  if (!rawCode) {
    showToast('Vui lòng nhập mã ưu đãi (Ví dụ: HANRIVER200)!');
    inputEl.focus();
    return;
  }

  const existing = homestayVouchers.find(v => v.code === rawCode);
  if (existing) {
    if (existing.isSaved) {
      showToast(`Mã "${rawCode}" đã có sẵn trong ví của bạn!`);
    } else {
      existing.isSaved = true;
      showToast(`Kích hoạt thành công mã "${rawCode}" cho ${existing.homestayName}.`);
      updateStatsCounters();
      renderAllVoucherSections();
    }
  } else {
    showToast(`Mã "${rawCode}" không tồn tại hoặc đã hết thời gian áp dụng.`);
  }

  inputEl.value = '';
}

/**
 * Mở popup điều kiện mã
 */
function openVoucherTermsModal(voucherId) {
  const item = homestayVouchers.find(v => v.id === voucherId);
  if (!item) return;

  const overlay = document.getElementById('voucherTermsModalOverlay');
  if (!overlay) return;

  document.getElementById('mTitleCode').textContent = `${item.code} - ${item.homestayName}`;
  document.getElementById('mTitleDesc').textContent = item.title;

  const listEl = document.getElementById('mTermsList');
  if (listEl && item.terms) {
    listEl.innerHTML = item.terms.map(t => `<li>${t}</li>`).join('');
  }

  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeVoucherTermsModal() {
  const overlay = document.getElementById('voucherTermsModalOverlay');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
}

/**
 * Chuyển hướng xem phòng Homestay
 */
function goToHomestay(name) {
  showToast(`Đang mở thông tin homestay "${name}"...`);
  setTimeout(() => {
    window.location.href = `homestayDetail.html?name=${encodeURIComponent(name)}`;
  }, 350);
}

/**
 * Hiển thị Toast
 */
function showToast(message) {
  const toast = document.getElementById('promoToast');
  const msgEl = document.getElementById('promoToastMsg');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
