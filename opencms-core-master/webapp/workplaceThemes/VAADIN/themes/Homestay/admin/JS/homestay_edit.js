// homestay_edit.js — Admin YÊN: Homestay detail/edit page controller
'use strict';

const STORAGE_KEY = 'yen_admin_homestays';

const defaultList = [
    {
        id: 1,
        code: "#HS-1042",
        name: "Homestay Nhà Trình Tường Hà Giang",
        host: "Nguyễn Văn Minh",
        hostId: "USR001",
        phone: "0912 345 678",
        email: "nguyenvanminh@email.com",
        region: "Hà Giang",
        province: "Hà Giang",
        district: "Đồng Văn",
        ward: "Phố Cáo",
        address: "Xã Phố Cáo, Đồng Văn, Hà Giang",
        price: "450.000đ",
        priceNum: 450000,
        date: "15/01/2026",
        status: "active",
        statusText: "Đang hoạt động",
        rooms: 5,
        maxGuests: 12,
        amenities: ["wifi", "bep", "giunhe", "dieukhoa"],
        description: "Homestay truyền thống nhà trình tường đặc trưng vùng cao Hà Giang, không gian yên bình giữa thiên nhiên hùng vĩ.",
        checkIn: "14:00",
        checkOut: "12:00",
        policy: "Không hút thuốc trong phòng. Không mang thú nuôi.",
        refund: "moderate",
        bizLicense: "GPKD-HA-2025-001",
        taxCode: "0123456789",
        rating: 4.8,
        reviewCount: 124,
        totalRevenue: "32.400.000đ",
        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
        adminNotes: "",
        approvedDate: "20/01/2026",
        suspendReason: "",
        kycLicense: true,
        kycOwnership: true,
        kycCCCD: true
    },
    {
        id: 2,
        code: "#HS-2073",
        name: "Sapa Valley Retreat",
        host: "Trần Thị Lan",
        hostId: "USR002",
        phone: "0934 567 890",
        email: "tranthilan@email.com",
        region: "Sapa",
        province: "Lào Cai",
        district: "Sa Pa",
        ward: "Tả Phìn",
        address: "Bản Tả Phìn, Sa Pa, Lào Cai",
        price: "680.000đ",
        priceNum: 680000,
        date: "03/03/2026",
        status: "pending",
        statusText: "Chờ duyệt",
        rooms: 8,
        maxGuests: 20,
        amenities: ["wifi", "bep", "congdoan", "view"],
        description: "Retreat yên tĩnh giữa thung lũng Sapa, view ruộng bậc thang tuyệt đẹp, gần bản Tả Phìn.",
        checkIn: "14:00",
        checkOut: "12:00",
        policy: "Không mang đồ ăn ngoài vào. Trẻ em dưới 5 tuổi miễn phí.",
        refund: "flexible",
        bizLicense: "",
        taxCode: "",
        rating: 0,
        reviewCount: 0,
        totalRevenue: "0đ",
        img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",
        adminNotes: "Chờ kiểm tra giấy tờ chủ nhà.",
        approvedDate: "",
        suspendReason: "",
        kycLicense: false,
        kycOwnership: false,
        kycCCCD: false
    },
    {
        id: 3,
        code: "#HS-3018",
        name: "Đà Lạt Pine Garden",
        host: "Lê Quang Huy",
        hostId: "USR003",
        phone: "0901 234 567",
        email: "lequanghuy@email.com",
        region: "Đà Lạt",
        province: "Lâm Đồng",
        district: "Đà Lạt",
        ward: "Phường 5",
        address: "12 Nguyễn Trãi, Phường 5, Đà Lạt, Lâm Đồng",
        price: "750.000đ",
        priceNum: 750000,
        date: "10/02/2026",
        status: "active",
        statusText: "Đang hoạt động",
        rooms: 6,
        maxGuests: 15,
        amenities: ["wifi", "bep", "sanchuyen", "losuoi"],
        description: "Homestay phong cách châu Âu giữa vườn thông Đà Lạt, lò sưởi ấm áp, view thung lũng.",
        checkIn: "15:00",
        checkOut: "11:00",
        policy: "Không tổ chức tiệc ồn ào sau 22h. Vui lòng giữ gìn vệ sinh chung.",
        refund: "strict",
        bizLicense: "GPKD-LĐ-2025-088",
        taxCode: "0567891234",
        rating: 4.9,
        reviewCount: 87,
        totalRevenue: "45.750.000đ",
        img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80",
        adminNotes: "",
        approvedDate: "15/02/2026",
        suspendReason: "",
        kycLicense: true,
        kycOwnership: true,
        kycCCCD: true
    },
    {
        id: 4,
        code: "#HS-4055",
        name: "Hội An River House",
        host: "Phạm Thị Thu",
        hostId: "USR004",
        phone: "0978 654 321",
        email: "phamthithu@email.com",
        region: "Hội An",
        province: "Quảng Nam",
        district: "Hội An",
        ward: "Phường Cẩm Nam",
        address: "45 Nguyễn Phúc Tần, Cẩm Nam, Hội An, Quảng Nam",
        price: "890.000đ",
        priceNum: 890000,
        date: "20/04/2026",
        status: "pending",
        statusText: "Chờ duyệt",
        rooms: 10,
        maxGuests: 24,
        amenities: ["wifi", "bep", "hotub", "canghe"],
        description: "Nhà ven sông Thu Bồn, kiến trúc Hội An cổ kính, bơi thuyền tham quan phố cổ.",
        checkIn: "14:00",
        checkOut: "12:00",
        policy: "Cần đặt trước ít nhất 2 ngày. Không hút thuốc trong phòng.",
        refund: "moderate",
        bizLicense: "",
        taxCode: "",
        rating: 0,
        reviewCount: 0,
        totalRevenue: "0đ",
        img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80",
        adminNotes: "Đang chờ bổ sung giấy phép kinh doanh.",
        approvedDate: "",
        suspendReason: "",
        kycLicense: false,
        kycOwnership: false,
        kycCCCD: false
    },
    {
        id: 5,
        code: "#HS-4821",
        name: "Mộc Châu Cloud Farm",
        host: "Hoàng Đức Anh",
        hostId: "USR005",
        phone: "0856 789 012",
        email: "hoanganh@email.com",
        region: "Mai Châu",
        province: "Sơn La",
        district: "Mộc Châu",
        ward: "Thị trấn Mộc Châu",
        address: "Trang trại Mộc Châu, Sơn La",
        price: "420.000đ",
        priceNum: 420000,
        date: "28/04/2026",
        status: "active",
        statusText: "Đang hoạt động",
        rooms: 7,
        maxGuests: 18,
        amenities: ["wifi", "bep", "bbq", "view"],
        description: "Trang trại trên mây, vườn mận & hoa cải, trải nghiệm nông nghiệp, BBQ dưới trăng.",
        checkIn: "14:00",
        checkOut: "12:00",
        policy: "Hạn chế ồn ào sau 21h. Không xả rác bừa bãi.",
        refund: "flexible",
        bizLicense: "GPKD-SL-2025-044",
        taxCode: "0334455667",
        rating: 4.7,
        reviewCount: 63,
        totalRevenue: "19.320.000đ",
        img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80",
        adminNotes: "",
        approvedDate: "02/05/2026",
        suspendReason: "",
        kycLicense: true,
        kycOwnership: true,
        kycCCCD: false
    },
    {
        id: 6,
        code: "#HS-5109",
        name: "Mai Châu Green Lodge",
        host: "Bùi Văn Nam",
        hostId: "USR006",
        phone: "0915 667 889",
        email: "buivannam@email.com",
        region: "Mai Châu",
        province: "Hòa Bình",
        district: "Mai Châu",
        ward: "Bản Pom Coọng",
        address: "Bản Pom Coọng, Hòa Bình",
        price: "550.000đ",
        priceNum: 550000,
        date: "01/05/2026",
        status: "suspended",
        statusText: "Tạm khóa",
        rooms: 4,
        maxGuests: 10,
        amenities: ["wifi", "bep"],
        description: "Nhà sàn truyền thống dân tộc Thái, hòa mình vào cuộc sống bản làng Mai Châu.",
        checkIn: "14:00",
        checkOut: "12:00",
        policy: "",
        refund: "moderate",
        bizLicense: "GPKD-HB-2025-012",
        taxCode: "0987654321",
        rating: 3.2,
        reviewCount: 18,
        totalRevenue: "5.940.000đ",
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
        adminNotes: "Tạm khóa do vi phạm chính sách giá (overpricing mùa cao điểm).",
        approvedDate: "08/05/2026",
        suspendReason: "Vi phạm chính sách niêm yết giá mùa cao điểm",
        kycLicense: true,
        kycOwnership: true,
        kycCCCD: true
    }
];

// ─── State ───────────────────────────────────────────────
let allHomestays = [];
let currentHomestay = null;
let isNew = false;

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    allHomestays = loadAllHomestays();
    loadFromParams();
    initKycState();
});

function loadAllHomestays() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultList));
    return JSON.parse(JSON.stringify(defaultList));
}

function saveAllHomestays() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allHomestays));
}

function loadFromParams() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');

    if (idParam === 'new') {
        isNew = true;
        currentHomestay = {
            id: Date.now(),
            code: '#HS-' + Math.floor(1000 + Math.random() * 8999),
            name: '',
            host: '',
            hostId: '',
            phone: '',
            email: '',
            region: '',
            province: '',
            district: '',
            ward: '',
            address: '',
            price: '',
            priceNum: 0,
            date: new Date().toLocaleDateString('vi-VN'),
            status: 'pending',
            statusText: 'Chờ duyệt',
            rooms: 1,
            maxGuests: 2,
            amenities: [],
            description: '',
            checkIn: '14:00',
            checkOut: '12:00',
            policy: '',
            refund: 'moderate',
            bizLicense: '',
            taxCode: '',
            rating: 0,
            reviewCount: 0,
            totalRevenue: '0đ',
            img: '',
            adminNotes: '',
            approvedDate: '',
            suspendReason: '',
            kycLicense: false,
            kycOwnership: false,
            kycCCCD: false
        };
        document.getElementById('bcCurrent').textContent = 'Thêm Homestay Mới';
        document.getElementById('saveBarInfo').textContent = 'Điền đầy đủ thông tin homestay mới';
        populateForm(currentHomestay);
    } else {
        const id = parseInt(idParam);
        currentHomestay = allHomestays.find(h => h.id === id) || null;
        if (!currentHomestay) {
            showToast('Không tìm thấy homestay!', 'error');
            setTimeout(() => window.location.href = 'manage_homestay.html', 1500);
            return;
        }
        document.getElementById('bcCurrent').textContent = currentHomestay.name || 'Chi tiết Homestay';
        document.getElementById('saveBarInfo').textContent = 'Chỉnh sửa: ' + currentHomestay.name;
        populateForm(currentHomestay);
    }
}

function populateForm(hs) {
    // Meta sidebar
    setVal('metaCode', hs.code || '—');
    setVal('metaDate', hs.date || '—');
    setVal('metaApproved', hs.approvedDate || '—');
    setVal('metaRating', hs.rating ? hs.rating + ' ★' : '—');
    setVal('metaReviews', hs.reviewCount ? hs.reviewCount + ' đánh giá' : '—');
    setVal('metaRevenue', hs.totalRevenue || '0đ');

    // Thumb
    if (hs.img) {
        document.getElementById('thumbImg').src = hs.img;
    }

    // Status
    setSelect('fStatus', hs.status);
    handleStatusChange();

    // Admin notes & suspend reason
    setTextarea('fAdminNotes', hs.adminNotes || '');
    setTextarea('fSuspendReason', hs.suspendReason || '');

    // Host info
    setVal('hostNameDisplay', hs.host || '—');
    setVal('hostPhoneDisplay', hs.phone || '—');
    const initials = (hs.host || 'CN').split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
    setVal('hostAvatarSm', initials);
    const link = document.getElementById('hostProfileLink');
    if (link && hs.hostId) link.href = 'account_edit.html?id=' + hs.hostId;

    // Card 1 basic info
    setInput('fName', hs.name || '');
    setInput('fPrice', hs.priceNum || '');
    setInput('fRooms', hs.rooms || '');
    setInput('fMaxGuests', hs.maxGuests || '');
    setInput('fCheckIn', hs.checkIn || '14:00');
    setInput('fCheckOut', hs.checkOut || '12:00');
    setTextarea('fDescription', hs.description || '');
    setInput('fImgUrl', hs.img || '');

    // Card 2 address
    setInput('fAddress', hs.address || '');
    setInput('fWard', hs.ward || '');
    setInput('fDistrict', hs.district || '');
    setInput('fProvince', hs.province || '');
    setSelect('fRegion', hs.region || '');

    // Card 3 amenities
    const amenities = hs.amenities || [];
    document.querySelectorAll('#amenityGrid input[type="checkbox"]').forEach(cb => {
        cb.checked = amenities.includes(cb.value);
    });

    // Card 4 policy
    setTextarea('fPolicy', hs.policy || '');
    setSelect('fRefund', hs.refund || 'moderate');

    // Card 5 docs
    setInput('fBizLicense', hs.bizLicense || '');
    setInput('fTaxCode', hs.taxCode || '');

    // KYC
    renderKycItem('kycLicense', hs.kycLicense, 'Giấy phép kinh doanh');
    renderKycItem('kycOwnership', hs.kycOwnership, 'Giấy tờ sở hữu / thuê nhà');
    renderKycItem('kycCCCD', hs.kycCCCD, 'CCCD / Hộ chiếu Chủ nhà');
}

// ─── Helpers ──────────────────────────────────────────────
function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}
function setInput(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}
function setSelect(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}
function setTextarea(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

// ─── Status handling ──────────────────────────────────────
function handleStatusChange() {
    const status = document.getElementById('fStatus').value;
    const group = document.getElementById('suspendReasonGroup');
    if (status === 'suspended' || status === 'rejected') {
        group.style.display = 'block';
    } else {
        group.style.display = 'none';
    }
}

function approveHomestay() {
    setSelect('fStatus', 'active');
    handleStatusChange();
    showToast('Đã đặt trạng thái: Duyệt hoạt động');
}

function suspendHomestay() {
    setSelect('fStatus', 'suspended');
    handleStatusChange();
    showToast('Đã đặt trạng thái: Tạm khóa');
}

// ─── Thumb preview ────────────────────────────────────────
function previewThumb() {
    const url = document.getElementById('fImgUrl').value.trim();
    if (url) {
        const img = document.getElementById('thumbImg');
        img.src = url;
        img.onerror = () => img.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80';
    }
}

// ─── KYC ──────────────────────────────────────────────────
function initKycState() {
    // state is set by populateForm
}

function renderKycItem(id, verified, label) {
    const el = document.getElementById(id);
    if (!el) return;
    const icon = el.querySelector('.kyc-icon');
    const sub = el.querySelector('.kyc-sub');
    const btn = el.querySelector('.btn-kyc-verify');

    if (verified) {
        icon.textContent = 'check_circle';
        icon.classList.remove('unverified');
        icon.classList.add('verified');
        sub.textContent = 'Đã xác minh';
        sub.style.color = '#15803D';
        btn.textContent = 'Hủy xác minh';
        btn.classList.add('revoke');
    } else {
        icon.textContent = 'radio_button_unchecked';
        icon.classList.add('unverified');
        icon.classList.remove('verified');
        sub.textContent = 'Chưa xác minh';
        sub.style.color = '#94A3B8';
        btn.textContent = 'Xác minh';
        btn.classList.remove('revoke');
    }
}

function verifyDoc(id, btn) {
    const isRevoke = btn.classList.contains('revoke');
    const verified = !isRevoke;
    renderKycItem(id, verified, id);
    // Store change in currentHomestay state
    if (id === 'kycLicense') currentHomestay.kycLicense = verified;
    if (id === 'kycOwnership') currentHomestay.kycOwnership = verified;
    if (id === 'kycCCCD') currentHomestay.kycCCCD = verified;
    showToast(verified ? 'Đã xác minh tài liệu' : 'Đã hủy xác minh tài liệu');
}

// ─── Save ─────────────────────────────────────────────────
function saveHomestay() {
    const name = document.getElementById('fName').value.trim();
    if (!name) {
        showToast('Vui lòng nhập tên Homestay!', 'error');
        document.getElementById('fName').focus();
        return;
    }

    const priceNum = parseInt(document.getElementById('fPrice').value) || 0;
    const status = document.getElementById('fStatus').value;
    const statusMap = {
        active: 'Đang hoạt động',
        pending: 'Chờ duyệt',
        suspended: 'Tạm khóa',
        rejected: 'Bị từ chối'
    };

    const checkedAmenities = [];
    document.querySelectorAll('#amenityGrid input[type="checkbox"]:checked').forEach(cb => {
        checkedAmenities.push(cb.value);
    });

    const updated = {
        ...currentHomestay,
        name: name,
        priceNum: priceNum,
        price: priceNum.toLocaleString('vi-VN') + 'đ',
        rooms: parseInt(document.getElementById('fRooms').value) || 1,
        maxGuests: parseInt(document.getElementById('fMaxGuests').value) || 2,
        checkIn: document.getElementById('fCheckIn').value,
        checkOut: document.getElementById('fCheckOut').value,
        description: document.getElementById('fDescription').value.trim(),
        img: document.getElementById('fImgUrl').value.trim() || currentHomestay.img,
        address: document.getElementById('fAddress').value.trim(),
        ward: document.getElementById('fWard').value.trim(),
        district: document.getElementById('fDistrict').value.trim(),
        province: document.getElementById('fProvince').value.trim(),
        region: document.getElementById('fRegion').value,
        amenities: checkedAmenities,
        policy: document.getElementById('fPolicy').value.trim(),
        refund: document.getElementById('fRefund').value,
        bizLicense: document.getElementById('fBizLicense').value.trim(),
        taxCode: document.getElementById('fTaxCode').value.trim(),
        status: status,
        statusText: statusMap[status] || status,
        adminNotes: document.getElementById('fAdminNotes').value.trim(),
        suspendReason: document.getElementById('fSuspendReason').value.trim()
    };

    if (status === 'active' && !updated.approvedDate) {
        updated.approvedDate = new Date().toLocaleDateString('vi-VN');
    }

    if (isNew) {
        allHomestays.unshift(updated);
    } else {
        const idx = allHomestays.findIndex(h => h.id === updated.id);
        if (idx >= 0) allHomestays[idx] = updated;
    }

    saveAllHomestays();
    currentHomestay = updated;
    isNew = false;

    showToast('Đã lưu thông tin Homestay thành công!');
    document.getElementById('bcCurrent').textContent = updated.name;
    document.getElementById('saveBarInfo').textContent = 'Chỉnh sửa: ' + updated.name;

    setTimeout(() => {
        window.location.href = 'manage_homestay.html';
    }, 1400);
}

// ─── Toast ────────────────────────────────────────────────
function showToast(msg, type) {
    const toast = document.getElementById('toastNotif');
    const msgEl = document.getElementById('toastMsg');
    msgEl.textContent = msg;

    if (type === 'error') {
        toast.style.background = '#EF4444';
    } else {
        toast.style.background = '#15803D';
    }

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}
