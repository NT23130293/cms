/* =====================================================
   manageHomestayJs.js - Quản lý Homestay & Chuỗi cơ sở
   ===================================================== */

/* ---------- 0. CSS dự phòng cho popup ----------
   Đảm bảo popup luôn hiển thị đúng dù manageMission.css dùng cách bật/tắt khác
   (class .active/.show...) hoặc không tải được file CSS. Dùng :where() nên
   nếu manageMission.css tải bình thường thì style của nó vẫn được ưu tiên. */
(function injectModalFallbackCss() {
    if (document.getElementById('mission-modal-fallback')) return;
    const css = `
        [hidden] { display: none !important; }
        .mission-modal:not([hidden]) {
            display: flex !important;
            position: fixed !important;
            inset: 0 !important;
            z-index: 99999 !important;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: rgba(11, 28, 48, .55);
            opacity: 1 !important;
            visibility: visible !important;
            overflow-y: auto;
        }
        :where(.mission-modal-content) { background:#fff; border-radius:16px; width:100%; max-width:560px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 50px rgba(0,0,0,.3); }
        :where(.mission-modal-header) { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:20px 24px 12px; }
        :where(.mission-modal-close) { background:none; border:0; cursor:pointer; }
        :where(.mission-form) { padding:8px 24px 20px; }
        :where(.mission-form-grid) { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        :where(.mission-form-group) { display:flex; flex-direction:column; gap:6px; }
        :where(.mission-form-group.full) { grid-column:1 / -1; }
        :where(.mission-form-label) { font-size:12px; font-weight:600; }
        :where(.mission-form-input, .mission-form-select) { border:1px solid #c0c8c2; border-radius:8px; padding:8px 10px; width:100%; font:inherit; }
        :where(.mission-modal-footer) { display:flex; justify-content:flex-end; gap:8px; padding-top:16px; }
        :where(.mission-btn) { border:0; border-radius:8px; padding:9px 16px; font-weight:600; cursor:pointer; }
        :where(.mission-btn-cancel) { background:#eff4ff; color:#0b1c30; }
        :where(.mission-btn-save) { background:#115e43; color:#fff; }
        :where(.mission-btn-danger) { background:#ba1a1a; color:#fff; }
    `;
    const style = document.createElement('style');
    style.id = 'mission-modal-fallback';
    style.textContent = css;
    document.head.appendChild(style);
})();

/* ---------- 1. Hàm mở / đóng popup dùng chung ---------- */
const MODAL_OPEN_CLASSES = ['active', 'show', 'open', 'is-open'];

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) {
        console.error('[openModal] Không tìm thấy phần tử có id =', id);
        return;
    }
    modal.hidden = false;
    modal.removeAttribute('hidden');
    modal.classList.add(...MODAL_OPEN_CLASSES);
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = true;
    modal.classList.remove(...MODAL_OPEN_CLASSES);
    document.body.style.overflow = '';
}

// Bấm ra ngoài vùng popup hoặc nhấn ESC để đóng
document.addEventListener('click', function (e) {
    if (e.target.classList && e.target.classList.contains('mission-modal')) {
        closeModal(e.target.id);
    }
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.mission-modal:not([hidden])').forEach(m => closeModal(m.id));
    }
});

/* ---------- 2. Dữ liệu chuẩn 34 Tỉnh/Thành mới & Biến dùng chung ---------- */
const NEW_34_PROVINCES = [
    { id: "HN", name: "Thủ đô Hà Nội" },
    { id: "HUE", name: "Thành phố Huế" },
    { id: "HP", name: "Thành phố Hải Phòng (Hải Dương - Hải Phòng)" },
    { id: "DN", name: "Thành phố Đà Nẵng (Quảng Nam - Đà Nẵng)" },
    { id: "SG", name: "Thành phố Hồ Chí Minh (TPHCM - Bình Dương - Bà Rịa Vũng Tàu)" },
    { id: "CT", name: "Thành phố Cần Thơ (Cần Thơ - Sóc Trăng - Hậu Giang)" },
    { id: "AG", name: "Tỉnh An Giang (Kiên Giang - An Giang)" },
    { id: "BN", name: "Tỉnh Bắc Ninh (Bắc Giang - Bắc Ninh)" },
    { id: "CM", name: "Tỉnh Cà Mau (Bạc Liêu - Cà Mau)" },
    { id: "CB", name: "Tỉnh Cao Bằng" },
    { id: "DLK", name: "Tỉnh Đắk Lắk (Phú Yên - Đắk Lắk)" },
    { id: "DB", name: "Tỉnh Điện Biên" },
    { id: "DNA", name: "Tỉnh Đồng Nai (Bình Phước - Đồng Nai)" },
    { id: "DTP", name: "Tỉnh Đồng Tháp (Tiền Giang - Đồng Tháp)" },
    { id: "GL", name: "Tỉnh Gia Lai (Bình Định - Gia Lai)" },
    { id: "HT", name: "Tỉnh Hà Tĩnh" },
    { id: "HY", name: "Tỉnh Hưng Yên (Thái Bình - Hưng Yên)" },
    { id: "KH", name: "Tỉnh Khánh Hòa (Ninh Thuận - Khánh Hòa)" },
    { id: "LCZ", name: "Tỉnh Lai Châu" },
    { id: "LD", name: "Tỉnh Lâm Đồng (Đắk Nông - Bình Thuận - Lâm Đồng)" },
    { id: "LS", name: "Tỉnh Lạng Sơn" },
    { id: "LC", name: "Tỉnh Lào Cai (Yên Bái - Lào Cai)" },
    { id: "NA", name: "Tỉnh Nghệ An" },
    { id: "NB", name: "Tỉnh Ninh Bình (Hà Nam - Nam Định - Ninh Bình)" },
    { id: "PT", name: "Tỉnh Phú Thọ (Vĩnh Phúc - Hòa Bình - Phú Thọ)" },
    { id: "QNG", name: "Tỉnh Quảng Ngãi (Kon Tum - Quảng Ngãi)" },
    { id: "QN", name: "Tỉnh Quảng Ninh" },
    { id: "QT", name: "Tỉnh Quảng Trị (Quảng Bình - Quảng Trị)" },
    { id: "SL", name: "Tỉnh Sơn La" },
    { id: "TN", name: "Tỉnh Tây Ninh (Long An - Tây Ninh)" },
    { id: "TNG", name: "Tỉnh Thái Nguyên (Bắc Kạn - Thái Nguyên)" },
    { id: "TH", name: "Tỉnh Thanh Hóa" },
    { id: "TQ", name: "Tỉnh Tuyên Quang (Hà Giang - Tuyên Quang)" },
    { id: "VL", name: "Tỉnh Vĩnh Long (Bến Tre - Trà Vinh - Vĩnh Long)" }
];

const SAMPLE_WARDS = [
    "Xã Chiềng Châu", "Xã Mường Sang", "Xã Tả Van", "Xã Bản Đôn",
    "Phường Mộc Sơn", "Phường Bắc Sơn", "Xã Đông Sang", "Thị trấn Mai Châu"
];

const LOCKED_BADGE_CLASS =
    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error text-on-error font-label-sm text-label-sm shadow-sm font-semibold';
const ACTIVE_BADGE_CLASS =
    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm shadow-sm backdrop-blur-sm';

/* ---------- 3. Popup chỉnh sửa homestay ---------- */
let currentCard = null;
let editImageFiles = [];
let currentImageSrc = '';
let editCustomServices = [];

function loadEditHomestayProvinces(selectedName = '') {
    const provinceSelect = document.getElementById('editProvinceSelect');
    if (!provinceSelect) return;
    provinceSelect.innerHTML = '<option value="">-- Chọn Tỉnh/Thành --</option>' +
        NEW_34_PROVINCES.map(p => `<option value="${p.id}" data-name="${p.name}" ${p.name === selectedName ? 'selected' : ''}>${p.name}</option>`).join('');
}

function loadEditWardsByProvince(provinceId) {
    const wardSelect = document.getElementById('editWardSelect');
    if (!wardSelect) return;
    wardSelect.innerHTML = '<option value="">-- Chọn Phường/Xã --</option>' +
        SAMPLE_WARDS.map(w => `<option value="${w}">${w}</option>`).join('');
}

function openEditHomestay(btn) {
    currentCard = btn.closest('.group');
    if (!currentCard) return;

    const name = currentCard.querySelector('h2').textContent.trim();
    const address = currentCard.querySelector('h2 + p').lastChild.textContent.trim();
    const d = currentCard.dataset;
    const locked = d.locked === '1';

    document.getElementById('editHomestayName').value = name;
    document.getElementById('editSpecificAddress').value = address;

    loadEditHomestayProvinces();
    loadEditWardsByProvince('default');

    editCustomServices = ['Trekking bản làng', 'Hưởng trà Shan Tuyết'];
    renderEditCustomServices();

    document.getElementById('editLockToggle').checked = locked;
    document.getElementById('editLockReasonType').value = locked ? (d.lockType || '') : '';
    document.getElementById('editLockReasonNote').value = locked ? (d.lockNote || '') : '';
    document.getElementById('editLockUntil').value = locked ? (d.lockUntil || '') : '';

    currentImageSrc = currentCard.querySelector('img').src;
    editImageFiles = [];
    renderEditImages();
    toggleLockReason(locked);
    openModal('editHomestayModal');
}

function addEditCustomService() {
    const input = document.getElementById('editCustomServiceInput');
    const val = input.value.trim();
    if (!val) return;
    if (editCustomServices.includes(val)) {
        alert('Trải nghiệm này đã có trong danh sách!');
        return;
    }
    editCustomServices.push(val);
    input.value = '';
    renderEditCustomServices();
}

function removeEditCustomService(index) {
    editCustomServices.splice(index, 1);
    renderEditCustomServices();
}

function renderEditCustomServices() {
    const box = document.getElementById('editCustomServiceList');
    if (!box) return;
    if (editCustomServices.length === 0) {
        box.innerHTML = '';
        return;
    }
    box.innerHTML = editCustomServices.map((service, i) => `
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
            <span>✨ ${escapeHtml(service)}</span>
            <button type="button" onclick="removeEditCustomService(${i})" class="w-4 h-4 rounded-full hover:bg-black/10 flex items-center justify-center text-xs">×</button>
        </span>
    `).join('');
}

function toggleLockReason(show) {
    document.getElementById('lockReasonBox').hidden = !show;
}

function handleEditImages(input) {
    editImageFiles = editImageFiles.concat(Array.from(input.files));
    input.value = '';
    renderEditImages();
}

function removeEditImage(i) {
    editImageFiles.splice(i, 1);
    renderEditImages();
}

function renderEditImages() {
    const box = document.getElementById('editImagePreview');
    if (editImageFiles.length === 0) {
        box.innerHTML = `
            <div class="relative h-20 rounded-lg overflow-hidden">
                <img src="${currentImageSrc}" class="w-full h-full object-cover">
                <span class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center">Ảnh hiện tại</span>
            </div>`;
        return;
    }
    box.innerHTML = editImageFiles.map((f, i) => `
        <div class="relative h-20 rounded-lg overflow-hidden">
            <img src="${URL.createObjectURL(f)}" class="w-full h-full object-cover">
            <button type="button" onclick="removeEditImage(${i})"
                    class="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs">×</button>
        </div>`).join('');
}

function formatDate(iso) {
    return iso ? iso.split('-').reverse().join('/') : '';
}

function applyLockState(card, locked, type, note, until) {
    const badge = card.querySelector('.absolute.top-space-sm span');
    if (badge && !card.dataset.origBadgeClass) {
        badge.dataset.origBadgeClass = ACTIVE_BADGE_CLASS;
        badge.dataset.origBadgeHtml = '<span class="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span> Đang hoạt động';
    }

    const actionContainer = card.querySelector('.px-space-md.py-space-sm .flex.items-center.gap-space-xs');
    let reasonBtn = actionContainer ? actionContainer.querySelector('.lock-reason-btn') : null;

    if (locked) {
        card.dataset.locked = '1';
        card.dataset.lockType = type;
        card.dataset.lockNote = note;
        card.dataset.lockUntil = until;
        card.classList.add('opacity-90');

        if (badge) {
            badge.className = LOCKED_BADGE_CLASS;
            badge.innerHTML = '<span class="material-symbols-outlined text-[14px]">lock</span> Ngưng hoạt động';
        }

        if (!reasonBtn && actionContainer) {
            reasonBtn = document.createElement('button');
            reasonBtn.type = 'button';
            reasonBtn.className = 'flex items-center gap-1 px-3 py-2 rounded-lg bg-error-container/40 text-error hover:bg-error-container transition-colors font-label-md text-label-md shadow-sm lock-reason-btn';
            reasonBtn.title = 'Xem lý do khóa';
            reasonBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">info</span><span>Lý do khóa</span>';
            reasonBtn.onclick = function() { openLockReasonModal(this); };
            actionContainer.insertBefore(reasonBtn, actionContainer.firstChild);
        }
    } else {
        delete card.dataset.locked;
        delete card.dataset.lockType;
        delete card.dataset.lockNote;
        delete card.dataset.lockUntil;
        card.classList.remove('opacity-90');

        if (badge) {
            badge.className = ACTIVE_BADGE_CLASS;
            badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span> Đang hoạt động';
        }

        if (reasonBtn) reasonBtn.remove();
    }
}

function submitEditHomestay(e) {
    e.preventDefault();
    if (!currentCard) return;

    const name = document.getElementById('editHomestayName').value.trim();
    const address = document.getElementById('editSpecificAddress').value.trim();
    const locked = document.getElementById('editLockToggle').checked;
    let type = '', note = '', until = '';

    if (locked) {
        type = document.getElementById('editLockReasonType').value;
        note = document.getElementById('editLockReasonNote').value.trim();
        until = document.getElementById('editLockUntil').value;
        if (!type) return alert('Vui lòng chọn lý do khóa homestay!');
        if (note.length < 10) return alert('Vui lòng ghi rõ chi tiết lý do khóa (tối thiểu 10 ký tự)!');
    }

    const oldName = currentCard.querySelector('h2').textContent.trim();
    currentCard.querySelector('h2').textContent = name;
    syncStaffRowName(oldName, name);
    currentCard.querySelector('h2 + p').lastChild.textContent = ' ' + address;
    if (editImageFiles.length > 0) {
        currentCard.querySelector('img').src = URL.createObjectURL(editImageFiles[0]);
    }
    applyLockState(currentCard, locked, type, note, until);

    alert(locked ? 'Đã khóa cơ sở và lưu thay đổi!' : 'Đã cập nhật thông tin thành công!');
    closeModal('editHomestayModal');
}

/* ---------- 4. Popup xóa homestay ---------- */
let pendingDeleteCard = null;

function openDeleteModal(btn) {
    pendingDeleteCard = btn.closest('.group');
    const name = pendingDeleteCard ? pendingDeleteCard.querySelector('h2').textContent.trim() : 'cơ sở này';
    document.getElementById('deleteHomestayName').textContent = name;
    openModal('deleteHomestayModal');
}

function executeDeleteHomestay() {
    if (pendingDeleteCard) {
        pendingDeleteCard.remove();
        pendingDeleteCard = null;
    }
    closeModal('deleteHomestayModal');
}

/* ---------- 5. Popup Thêm Homestay Mới & Phường Xã ---------- */
let newHomestayImageFiles = [];
let customServices = [];

function loadNewHomestayProvinces() {
    const provinceSelect = document.getElementById('newProvinceSelect');
    if (!provinceSelect) return;
    provinceSelect.innerHTML = '<option value="">-- Chọn Tỉnh/Thành --</option>' +
        NEW_34_PROVINCES.map(p => `<option value="${p.id}" data-name="${p.name}">${p.name}</option>`).join('');
}

function loadNewWardsByProvince(provinceId) {
    const wardSelect = document.getElementById('newWardSelect');
    if (!wardSelect) return;
    wardSelect.innerHTML = '<option value="">-- Chọn Phường/Xã --</option>' +
        SAMPLE_WARDS.map(w => `<option value="${w}">${w}</option>`).join('');
}

function handleAddHomestayImages(input) {
    newHomestayImageFiles = newHomestayImageFiles.concat(Array.from(input.files));
    input.value = '';
    renderNewHomestayImages();
}

function removeNewHomestayImage(i) {
    newHomestayImageFiles.splice(i, 1);
    renderNewHomestayImages();
}

function renderNewHomestayImages() {
    const box = document.getElementById('newHomestayImagePreview');
    if (!box) return;
    if (newHomestayImageFiles.length === 0) {
        box.innerHTML = '<span class="text-on-surface-variant font-label-sm col-span-full">Chưa có ảnh nào được chọn.</span>';
        return;
    }
    box.innerHTML = newHomestayImageFiles.map((f, i) => `
        <div class="relative h-20 rounded-lg overflow-hidden border border-outline-variant">
            <img src="${URL.createObjectURL(f)}" class="w-full h-full object-cover">
            <button type="button" onclick="removeNewHomestayImage(${i})"
                    class="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
        </div>`).join('');
}

function addCustomService() {
    const input = document.getElementById('customServiceInput');
    const val = input.value.trim();
    if (!val) return;
    if (customServices.includes(val)) {
        alert('Trải nghiệm này đã có trong danh sách!');
        return;
    }
    customServices.push(val);
    input.value = '';
    renderCustomServices();
}

function removeCustomService(index) {
    customServices.splice(index, 1);
    renderCustomServices();
}

function renderCustomServices() {
    const box = document.getElementById('customServiceList');
    if (!box) return;
    if (customServices.length === 0) {
        box.innerHTML = '';
        return;
    }
    box.innerHTML = customServices.map((service, i) => `
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
            <span>✨ ${escapeHtml(service)}</span>
            <button type="button" onclick="removeCustomService(${i})" class="w-4 h-4 rounded-full hover:bg-black/10 flex items-center justify-center text-xs">×</button>
        </span>
    `).join('');
}

document.querySelector('[onclick*="addHomestayModal"]')?.addEventListener('click', () => {
    newHomestayImageFiles = [];
    customServices = [];
    const form = document.getElementById('addHomestayForm');
    if (form) form.reset();

    loadNewHomestayProvinces();
    renderNewHomestayImages();
    renderCustomServices();

    const errEl = document.getElementById('addHomestayError');
    if (errEl) errEl.hidden = true;
});

function submitAddHomestay(e) {
    e.preventDefault();
    const name = document.getElementById('newHomestayName').value.trim();
    const provinceSelect = document.getElementById('newProvinceSelect');
    const provinceName = provinceSelect.selectedOptions[0] ? provinceSelect.selectedOptions[0].getAttribute('data-name') : '';
    const ward = document.getElementById('newWardSelect').value;
    const specificAddress = document.getElementById('newHomestaySpecificAddress').value.trim();
    const rooms = document.getElementById('newHomestayRooms').value;

    const standardServices = Array.from(document.querySelectorAll('input[name="homestayService"]:checked')).map(i => i.value);
    const allServices = [...standardServices, ...customServices];

    const errEl = document.getElementById('addHomestayError');
    if (!name || !provinceName || !ward || !specificAddress) {
        if (errEl) {
            errEl.textContent = 'Vui lòng điền đầy đủ tên cơ sở, chọn Tỉnh/Thành, Phường/Xã và địa chỉ cụ thể.';
            errEl.hidden = false;
        }
        return;
    }

    const fullAddress = `${specificAddress}, ${ward}, ${provinceName}`;

    alert(`Đã khởi tạo cơ sở mới "${name}" tại ${fullAddress} thành công với ${rooms} phòng và ${allServices.length} tiện ích/trải nghiệm!`);
    closeModal('addHomestayModal');
}

/* ---------- 6. Popup Lý do khóa ---------- */
function openLockReasonModal(btn) {
    const card = btn.closest('.group');
    if (!card) return;

    const name = card.querySelector('h2').textContent.trim();
    const d = card.dataset;

    document.getElementById('lockModalHomestayName').textContent = 'Cơ sở: ' + name;
    document.getElementById('lockModalType').textContent = d.lockType || 'Không có phân loại';
    document.getElementById('lockModalNote').textContent = d.lockNote || 'Không có ghi chú chi tiết.';
    document.getElementById('lockModalUntil').textContent = d.lockUntil ? ('Đến ngày: ' + formatDate(d.lockUntil)) : 'Chưa xác định thời hạn mở lại';

    openModal('lockReasonModal');
}

/* ---------- 7. Phân quyền nhân viên & Bảng giám sát ---------- */
const STAFF_PERM_GROUPS = [
    { title: 'Đặt phòng & lưu trú', items: [
            ['booking_view',   'Xem danh sách đặt phòng'],
            ['booking_edit',   'Tạo / sửa đặt phòng'],
            ['booking_cancel', 'Hủy đặt phòng / hoàn tiền'],
            ['checkin',        'Check-in / Check-out khách']
        ]},
    { title: 'Tài chính', items: [
            ['fin_view',    'Xem doanh thu & báo cáo'],
            ['fin_cash',    'Thu tiền mặt'],
            ['fin_expense', 'Ghi nhận & duyệt chi']
        ]},
    { title: 'Vận hành cơ sở', items: [
            ['room_manage',  'Quản lý phòng & giá'],
            ['staff_manage', 'Quản lý nhân sự ca trực'],
            ['settings',     'Chỉnh sửa thông tin cơ sở']
        ]}
];

const ALL_STAFF_PERMS = STAFF_PERM_GROUPS.flatMap(g => g.items.map(i => i[0]));
const STAFF_PERM_REQUIRES = {
    booking_edit: 'booking_view',
    booking_cancel: 'booking_edit',
    fin_cash: 'fin_view',
    fin_expense: 'fin_view'
};

const STAFF_PRESETS = {
    full:      { label: 'Toàn quyền vận hành cơ sở',   perms: ALL_STAFF_PERMS },
    cash:      { label: 'Quyền xem & thu tiền mặt',    perms: ['booking_view', 'checkin', 'fin_view', 'fin_cash'] },
    frontdesk: { label: 'Chỉ tiếp tân & check-in phòng', perms: ['booking_view', 'booking_edit', 'checkin'] },
    viewonly:  { label: 'Chỉ xem',                     perms: ['booking_view'] },
    custom:    { label: 'Tùy chỉnh',                   perms: null }
};

const ROLE_DEFAULT_PRESET = {
    manager: 'full',
    receptionist: 'frontdesk',
    accountant: 'cash',
    housekeeping: 'viewonly'
};

const STAFF_NO_MANAGER = 'Chưa chỉ định';
const staffRecords = [];

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function staffPermBox(key) {
    return document.querySelector('#staffPermGrid input[value="' + key + '"]');
}

function getCheckedStaffPerms() {
    return Array.from(document.querySelectorAll('#staffPermGrid input:checked')).map(i => i.value);
}

function showStaffError(msg) {
    const el = document.getElementById('addStaffError');
    el.textContent = msg;
    el.hidden = false;
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function hideStaffError() {
    const el = document.getElementById('addStaffError');
    el.hidden = true;
    el.textContent = '';
}

function renderStaffPermissions() {
    document.getElementById('staffPreset').innerHTML = Object.entries(STAFF_PRESETS)
        .map(([key, p]) => '<option value="' + key + '">' + p.label + '</option>').join('');

    document.getElementById('staffPermGrid').innerHTML = STAFF_PERM_GROUPS.map(g => `
        <div class="bg-surface-container-low rounded-lg p-3">
            <p class="font-label-lg text-label-lg text-on-surface mb-2">${g.title}</p>
            <div class="flex flex-col gap-1.5">
                ${g.items.map(([key, label]) => `
                <label class="flex items-start gap-2 cursor-pointer font-body-md text-body-md">
                    <input type="checkbox" class="mt-1" value="${key}" onchange="onStaffPermChange(this)">
                    <span>${label}</span>
                </label>`).join('')}
            </div>
        </div>`).join('');
}

function renderStaffHomestays() {
    const cards = Array.from(document.querySelectorAll('button[onclick^="openEditHomestay"]'))
        .map(b => b.closest('.group')).filter(Boolean);
    const box = document.getElementById('staffHomestayList');

    if (cards.length === 0) {
        box.innerHTML = '<p class="font-body-md text-body-md text-on-surface-variant">Chưa có cơ sở nào để phân quyền.</p>';
        return;
    }
    box.innerHTML = cards.map(card => {
        const name = card.querySelector('h2').textContent.trim();
        const locked = card.dataset.locked === '1';
        return `
        <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-container-low font-body-md text-body-md">
            <input type="checkbox" name="staffHomestay" value="${escapeHtml(name)}">
            <span>${escapeHtml(name)}</span>
            ${locked ? '<span class="text-error font-label-sm text-label-sm">(đang khóa)</span>' : ''}
        </label>`;
    }).join('');
}

function openAddStaff() {
    document.getElementById('addStaffForm').reset();
    hideStaffError();
    renderStaffPermissions();
    renderStaffHomestays();
    applyStaffPreset(ROLE_DEFAULT_PRESET[document.getElementById('staffRole').value] || 'viewonly');
    openModal('addStaffModal');
}

function applyStaffPreset(key) {
    const preset = STAFF_PRESETS[key];
    if (!preset) return;
    document.getElementById('staffPreset').value = key;
    if (preset.perms) {
        document.querySelectorAll('#staffPermGrid input').forEach(i => {
            i.checked = preset.perms.includes(i.value);
        });
    }
}

function syncStaffPreset() {
    const current = getCheckedStaffPerms().sort().join(',');
    const match = Object.keys(STAFF_PRESETS).find(k =>
        STAFF_PRESETS[k].perms && STAFF_PRESETS[k].perms.slice().sort().join(',') === current);
    document.getElementById('staffPreset').value = match || 'custom';
}

function onStaffRoleChange(select) {
    applyStaffPreset(ROLE_DEFAULT_PRESET[select.value] || 'viewonly');
}

function onStaffPermChange(input) {
    if (input.checked) {
        let req = STAFF_PERM_REQUIRES[input.value];
        while (req) {
            const box = staffPermBox(req);
            if (box) box.checked = true;
            req = STAFF_PERM_REQUIRES[req];
        }
    } else {
        let changed = true;
        while (changed) {
            changed = false;
            Object.entries(STAFF_PERM_REQUIRES).forEach(([perm, req]) => {
                const bp = staffPermBox(perm), br = staffPermBox(req);
                if (bp && bp.checked && br && !br.checked) { bp.checked = false; changed = true; }
            });
        }
    }
    syncStaffPreset();
}

function maskPhone(phone) {
    const d = phone.replace(/\D/g, '');
    return d.length >= 9 ? d.slice(0, 4) + '.***.' + d.slice(-3) : d;
}

function financeLabel(perms) {
    if (perms.includes('fin_expense')) return 'Toàn quyền thu chi';
    if (perms.includes('fin_cash'))    return 'Quyền xem & thu tiền mặt';
    if (perms.includes('fin_view'))    return 'Chỉ xem báo cáo';
    return 'Không có quyền tài chính';
}

function findStaffRow(homestay) {
    return Array.from(document.querySelectorAll('#staffTableBody tr'))
        .find(r => r.dataset.homestay === homestay);
}

function createStaffRow(homestay) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-surface-container-low/50 transition-colors';
    tr.dataset.homestay = homestay;
    tr.innerHTML = `
        <td class="py-space-md px-space-md font-semibold"></td>
        <td class="py-space-md px-space-md">${STAFF_NO_MANAGER}</td>
        <td class="py-space-md px-space-md"><span class="px-2 py-0.5 rounded bg-surface-container font-label-sm">0 Nhân sự</span></td>
        <td class="py-space-md px-space-md text-on-surface-variant font-label-sm">Chưa thiết lập</td>
        <td class="py-space-md px-space-md text-right"><button onclick="openModal('permissionModal')" class="px-2.5 py-1 rounded bg-surface-container-low text-primary-container font-label-sm font-semibold" type="button">Đổi quyền</button></td>`;
    tr.cells[0].textContent = homestay;
    document.getElementById('staffTableBody').appendChild(tr);
    return tr;
}

function syncStaffRowName(oldName, newName) {
    const row = findStaffRow(oldName);
    if (!row || oldName === newName) return;
    row.dataset.homestay = newName;
    row.cells[0].textContent = newName;
}

function submitAddStaff(e) {
    e.preventDefault();
    hideStaffError();

    const name  = document.getElementById('staffName').value.trim();
    const phone = document.getElementById('staffPhone').value.replace(/[\s.\-]/g, '');
    const email = document.getElementById('staffEmail').value.trim();
    const roleSel = document.getElementById('staffRole');
    const role = roleSel.value;
    const roleLabel = roleSel.options[roleSel.selectedIndex].text;
    const presetKey = document.getElementById('staffPreset').value;
    const invite = document.getElementById('staffInvite').checked;
    const homestays = Array.from(document.querySelectorAll('#staffHomestayList input:checked')).map(i => i.value);
    const perms = getCheckedStaffPerms();

    if (name.length < 2) return showStaffError('Vui lòng nhập họ và tên nhân viên.');
    if (!/^(0\d{9}|\+84\d{9})$/.test(phone)) return showStaffError('Số điện thoại không hợp lệ.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showStaffError('Email không hợp lệ.');
    if (homestays.length === 0) return showStaffError('Vui lòng chọn ít nhất một cơ sở phụ trách.');
    if (perms.length === 0) return showStaffError('Vui lòng cấp ít nhất một quyền cho nhân viên.');

    staffRecords.push({ id: Date.now(), name, phone, email, role, roleLabel, homestays, permissions: perms });

    let lastRow = null;
    homestays.forEach(h => {
        let row = findStaffRow(h) || createStaffRow(h);
        if (role === 'manager') {
            row.cells[1].textContent = name + ' (' + maskPhone(phone) + ')';
        } else {
            const badge = row.cells[2].querySelector('span');
            badge.textContent = ((parseInt(badge.textContent, 10) || 0) + 1) + ' Nhân sự';
        }
        row.cells[3].className = 'py-space-md px-space-md text-secondary font-label-sm';
        row.cells[3].textContent = financeLabel(perms);

        row.classList.add('bg-secondary-container/40');
        setTimeout(() => row.classList.remove('bg-secondary-container/40'), 2500);
        lastRow = row;
    });

    alert('Đã thêm nhân viên ' + name + ' (' + roleLabel + ') và phân quyền thành công!');
    closeModal('addStaffModal');
    if (lastRow) lastRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
}