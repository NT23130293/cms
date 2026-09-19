/**
 * ==========================================================================
 * YÊN HOMESTAY ADMIN - LOCAL CONTENT MANAGEMENT JS
 * File: opencms-core-master/.../admin/JS/local_content.js
 * Quản lý logic CRUD: Lễ hội, Điểm đến du lịch & Trải nghiệm gắn với Homestay
 * ==========================================================================
 */

let editingId = null; // null: Thêm mới | String/Number: Chỉnh sửa

const availableCityHomestays = {
    'Đà Nẵng': [
        { name: 'Han River Glass House', distance: '450m' },
        { name: 'Danang Riverside Cozy Villa', distance: '700m' },
        { name: 'My Khe & Sun Wheel Studio', distance: '900m' },
        { name: 'Sơn Trà Sunset Infinity Villa', distance: '1.2km' }
    ],
    'Đà Lạt': [
        { name: 'Dalat Blooming Garden Homestay', distance: '400m' },
        { name: 'Xuan Huong Lake View House', distance: '250m' },
        { name: 'Rustic Pine Hill Cabin', distance: '1.1km' },
        { name: 'The Memory Valley Villa', distance: '1.5km' }
    ],
    'Huế': [
        { name: 'Nhà Rường Cổ Cố Đô Homestay', distance: '350m' },
        { name: 'Sông Hương Lotus Villa', distance: '500m' },
        { name: 'Vỹ Dạ Ancient Green Haven', distance: '900m' },
        { name: 'Imperial Citadel Garden Villa', distance: '400m' }
    ],
    'Ninh Bình': [
        { name: 'Tràng An Valley Cloud Retreat', distance: '350m' },
        { name: 'Ninh Bình Mountain Eco Cabin', distance: '600m' },
        { name: 'Tam Cốc Golden Rice Homestay', distance: '1km' },
        { name: 'Hang Múa Lotus View Ecolodge', distance: '800m' }
    ],
    'Hội An': [
        { name: 'Lạc Vào Phố Cổ Heritage', distance: '300m' },
        { name: 'An Bàng Seaside Haven', distance: '50m' }
    ],
    'Sapa': [
        { name: 'Sapa Cloud Forest Lodge', distance: '100m' },
        { name: 'Mây Lang Thang Eco Lodge', distance: '500m' }
    ]
};

// Dữ liệu mẫu Lễ hội kèm danh sách Homestay liên kết
let initialFestivals = [
    {
        id: 'diff',
        name: 'Lễ Hội Pháo Hoa Quốc Tế Đà Nẵng (DIFF)',
        city: 'Đà Nẵng',
        location: 'Sân khấu bờ sông Hàn, TP. Đà Nẵng',
        date: '08/06 - 13/07/2026',
        status: 'upcoming',
        statusText: 'Sắp diễn ra',
        autoLoad: true, // Tự động quét theo vị trí & khoảng cách
        homestays: [
            { name: 'Han River Glass House', distance: '450m' },
            { name: 'Danang Riverside Cozy Villa', distance: '700m' },
            { name: 'My Khe & Sun Wheel Studio', distance: '900m' },
            { name: 'Sơn Trà Sunset Infinity Villa', distance: '1.2km' }
        ],
        homestayCount: 4,
        img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'dalat-flower',
        name: 'Festival Hoa Đà Lạt Sắc Màu Xứ Ngàn Hoa',
        city: 'Đà Lạt',
        location: 'Quảng trường Lâm Viên & Hồ Xuân Hương, Đà Lạt',
        date: '18/12 - 31/12/2026',
        status: 'upcoming',
        statusText: 'Sắp diễn ra',
        autoLoad: true,
        homestays: [
            { name: 'Dalat Blooming Garden Homestay', distance: '400m' },
            { name: 'Xuan Huong Lake View House', distance: '250m' },
            { name: 'Rustic Pine Hill Cabin', distance: '1.1km' },
            { name: 'The Memory Valley Villa', distance: '1.5km' }
        ],
        homestayCount: 4,
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'hue-fest',
        name: 'Festival Cố Đô Huế - Di Sản Văn Hóa Tỏa Sáng',
        city: 'Huế',
        location: 'Quần thể Di tích Cố đô & Đại Nội Huế',
        date: '25/04 - 02/05/2026',
        status: 'active',
        statusText: 'Đang diễn ra',
        autoLoad: true,
        homestays: [
            { name: 'Nhà Rường Cổ Cố Đô Homestay', distance: '350m' },
            { name: 'Sông Hương Lotus Villa', distance: '500m' },
            { name: 'Vỹ Dạ Ancient Green Haven', distance: '900m' },
            { name: 'Imperial Citadel Garden Villa', distance: '400m' }
        ],
        homestayCount: 4,
        img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'ninh-binh',
        name: 'Lễ Hội Khinh Khí Cầu Quốc Tế Tràng An',
        city: 'Ninh Bình',
        location: 'Quần thể danh thắng Tràng An, Ninh Bình',
        date: '10/05 - 18/05/2026',
        status: 'upcoming',
        statusText: 'Sắp diễn ra',
        autoLoad: true,
        homestays: [
            { name: 'Tràng An Valley Cloud Retreat', distance: '350m' },
            { name: 'Ninh Bình Mountain Eco Cabin', distance: '600m' },
            { name: 'Tam Cốc Golden Rice Homestay', distance: '1km' },
            { name: 'Hang Múa Lotus View Ecolodge', distance: '800m' }
        ],
        homestayCount: 4,
        img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'
    }
];

// Dữ liệu mẫu Trải nghiệm ĐẶC BIỆT GẮN VỚI HOMESTAY
let initialExperiences = [
    {
        id: 1,
        title: 'Săn mây ban mai & Thưởng trà thông',
        homestay: 'The Pine Hill Retreat',
        city: 'Đà Lạt',
        category: 'Thiên nhiên',
        perk: 'Phục vụ trà củi nóng tận sân ban công homestay',
        rating: '4.96',
        reviews: 230,
        status: 'featured',
        img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 2,
        title: 'Tắm lá thuốc người Dao Đỏ bản địa',
        homestay: 'Sapa Cloud Forest Lodge',
        city: 'Sapa',
        category: 'Văn hóa bản địa',
        perk: 'Đặt bồn tắm thuốc trực tiếp tại Homestay',
        rating: '4.91',
        reviews: 154,
        status: 'featured',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 3,
        title: 'Chèo thuyền Kayak đầm sen Tràng An',
        homestay: 'Tràng An Valley Cloud Retreat',
        city: 'Ninh Bình',
        category: 'Giải trí',
        perk: 'Miễn phí mượn thuyền Kayak cho khách lưu trú',
        rating: '4.93',
        reviews: 164,
        status: 'active',
        img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 4,
        title: 'Trà sen Cung đình & Áo dài Cố đô',
        homestay: 'Nhà Rường Cổ Cố Đô Homestay',
        city: 'Huế',
        category: 'Ẩm thực & Văn hóa',
        perk: 'Miễn phí mượn áo dài Cung đình chụp ảnh',
        rating: '4.94',
        reviews: 167,
        status: 'active',
        img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
    }
];

let currentTab = 'festivals'; // 'festivals' | 'experiences'

document.addEventListener('DOMContentLoaded', () => {
    initLocalContentModule();
});

function initLocalContentModule() {
    updateStatCards();
    renderActiveTabTable();
    setupEventListeners();
}

// Cập nhật 4 thẻ thống kê
function updateStatCards() {
    const totalFestivals = initialFestivals.length;
    const totalExp = initialExperiences.length;
    const cities = new Set([...initialFestivals.map(f => f.city), ...initialExperiences.map(e => e.city)]);
    
    const festStatEl = document.getElementById('statTotalFestivals');
    const cityStatEl = document.getElementById('statTotalCities');
    const expStatEl = document.getElementById('statTotalExperiences');
    const homestayStatEl = document.getElementById('statTotalMappedHomestays');

    if (festStatEl) festStatEl.textContent = totalFestivals;
    if (cityStatEl) cityStatEl.textContent = cities.size;
    if (expStatEl) expStatEl.textContent = totalExp;
    if (homestayStatEl) homestayStatEl.textContent = totalFestivals * 4 + totalExp;
}

// Chuyển tab giữa "Lễ hội" và "Điểm đến & Trải nghiệm"
function switchTab(tabName) {
    currentTab = tabName;
    const tabBtns = document.querySelectorAll('.content-tab-btn');
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const addBtnText = document.getElementById('addBtnLabel');
    if (addBtnText) {
        addBtnText.textContent = tabName === 'festivals' ? 'Thêm Lễ hội mới' : 'Thêm Trải nghiệm Homestay';
    }

    renderActiveTabTable();
}

function getStatusBadgeHtml(status, statusText) {
    let text = statusText;
    if (!text) {
        if (status === 'upcoming') text = 'Sắp diễn ra';
        else if (status === 'active') text = 'Đang diễn ra';
        else if (status === 'featured') text = 'Nổi bật';
        else if (status === 'ended') text = 'Đã kết thúc';
        else text = 'Hoạt động';
    }
    return `<span class="status-badge ${status}">${text}</span>`;
}

// Render bảng dữ liệu
function renderActiveTabTable() {
    const container = document.getElementById('localContentTableBody');
    const tableHeader = document.getElementById('localContentTableHeader');
    if (!container || !tableHeader) return;

    const searchVal = (document.getElementById('localSearchInput')?.value || '').toLowerCase();
    const statusVal = document.getElementById('localStatusFilter')?.value || 'all';

    if (currentTab === 'festivals') {
        tableHeader.innerHTML = `
            <tr>
                <th>Lễ hội / Sự kiện</th>
                <th>Tỉnh / Thành phố</th>
                <th>Thời gian diễn ra</th>
                <th>Cơ chế hiển thị Homestay</th>
                <th>Trạng thái</th>
                <th style="text-align: right;">Thao tác</th>
            </tr>
        `;

        let filtered = initialFestivals.filter(item => {
            const matchSearch = item.name.toLowerCase().includes(searchVal) || item.location.toLowerCase().includes(searchVal);
            const matchStatus = statusVal === 'all' || item.status === statusVal;
            return matchSearch && matchStatus;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 32px; color: var(--text-muted);">Không tìm thấy lễ hội phù hợp.</td></tr>`;
            return;
        }

        container.innerHTML = filtered.map(item => `
            <tr>
                <td>
                    <div class="cell-item-title">
                        <img src="${item.img}" alt="${item.name}" class="item-thumb">
                        <div class="item-name-group">
                            <span class="item-name">${item.name}</span>
                            <span class="item-location"><span class="material-symbols-outlined" style="font-size: 14px; color: #15803D;">location_on</span> ${item.location}</span>
                        </div>
                    </div>
                </td>
                <td><strong>${item.city}</strong></td>
                <td><span style="font-weight: 600; color: #475569;">${item.date}</span></td>
                <td>
                    <button class="status-badge active" style="cursor: pointer; border: 1px solid #BBF7D0; transition: transform 0.2s;" onclick="viewLinkedHomestays('${item.id}')" title="Bấm để xem & chọn Homestay">
                        🏡 ${item.homestays ? item.homestays.length : 4} Homestay (Tự động + Tùy chỉnh)
                    </button>
                </td>
                <td>${getStatusBadgeHtml(item.status, item.statusText)}</td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon" title="Cấu hình Homestay" onclick="viewLinkedHomestays('${item.id}')">
                            <span class="material-symbols-outlined">cottage</span>
                        </button>
                        <button class="btn-action-icon" title="Chỉnh sửa" onclick="editFestival('${item.id}')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-action-icon danger" title="Xóa" onclick="deleteFestival('${item.id}')">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } else {
        // Tab Trải nghiệm liên quan đến Homestay
        tableHeader.innerHTML = `
            <tr>
                <th>Tên Trải nghiệm</th>
                <th>Homestay Cung Cấp / Liên Kết</th>
                <th>Thành phố</th>
                <th>Ưu đãi / Tiện ích Homestay</th>
                <th>Đánh giá</th>
                <th>Trạng thái</th>
                <th style="text-align: right;">Thao tác</th>
            </tr>
        `;

        let filtered = initialExperiences.filter(item => {
            const matchSearch = item.title.toLowerCase().includes(searchVal) || 
                                item.homestay.toLowerCase().includes(searchVal) || 
                                item.city.toLowerCase().includes(searchVal);
            const matchStatus = statusVal === 'all' || item.status === statusVal;
            return matchSearch && matchStatus;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted);">Không tìm thấy trải nghiệm phù hợp.</td></tr>`;
            return;
        }

        container.innerHTML = filtered.map(item => `
            <tr>
                <td>
                    <div class="cell-item-title">
                        <img src="${item.img}" alt="${item.title}" class="item-thumb">
                        <div class="item-name-group">
                            <span class="item-name">${item.title}</span>
                            <span style="font-size: 11.5px; color: var(--text-muted); font-weight: 600;">Loại hình: ${item.category}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="material-symbols-outlined" style="font-size: 18px; color: #15803D;">cottage</span>
                        <strong style="color: #15803D; font-size: 13.5px;">${item.homestay}</strong>
                    </div>
                </td>
                <td><strong>${item.city}</strong></td>
                <td>
                    <span style="background: #F0FDF4; border: 1px solid #BBF7D0; color: #166534; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 12px; display: inline-block;">
                        ✨ ${item.perk}
                    </span>
                </td>
                <td><span style="font-weight: 700; color: #D97706;">★ ${item.rating}</span> <span style="font-size: 12px; color: #94A3B8;">(${item.reviews})</span></td>
                <td>
                    <span class="status-badge ${item.status === 'featured' ? 'featured' : 'active'}">
                        ${item.status === 'featured' ? 'Gói độc quyền' : (item.status === 'ended' ? 'Tạm ẩn' : 'Đang hỗ trợ')}
                    </span>
                </td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon" title="Chỉnh sửa" onclick="editExperience(${item.id})">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-action-icon danger" title="Xóa" onclick="deleteExperience(${item.id})">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Render danh sách Homestay gợi ý tự động cho Modal
function renderHomestayChecklist(city, selectedNames = []) {
    const container = document.getElementById('suggestedHomestayChecklist');
    if (!container) return;

    const list = availableCityHomestays[city] || [
        { name: `Homestay 1 gần ${city}`, distance: '300m' },
        { name: `Homestay 2 gần ${city}`, distance: '600m' }
    ];

    container.innerHTML = list.map((h, i) => {
        const isChecked = selectedNames.length === 0 || selectedNames.includes(h.name);
        return `
            <label style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 600; color: #1E293B; cursor: pointer; padding: 4px 0;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" class="fest-homestay-checkbox" value="${h.name}" data-distance="${h.distance}" ${isChecked ? 'checked' : ''} style="accent-color: #15803D; width: 16px; height: 16px;">
                    <span>🏡 ${h.name}</span>
                </div>
                <span style="font-size: 11px; background: #DCFCE7; color: #15803D; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Cách ${h.distance}</span>
            </label>
        `;
    }).join('');
}

// Xem & Cấu hình danh sách Homestay lân cận Lễ hội
function viewLinkedHomestays(festivalId) {
    editFestival(festivalId);
}

// Bật Modal Thêm mới
function openCreateModal() {
    editingId = null;
    const modal = document.getElementById('localModalOverlay');
    const modalTitle = document.getElementById('modalTitleText');
    const homestayField = document.getElementById('homestayFieldGroup');
    const festSuggestGroup = document.getElementById('festivalHomestaysSuggestGroup');

    if (!modal) return;

    if (modalTitle) {
        modalTitle.textContent = currentTab === 'festivals' ? 'Thêm Lễ hội / Sự kiện mới' : 'Thêm Trải nghiệm gắn liền với Homestay';
    }

    if (homestayField) {
        homestayField.style.display = currentTab === 'experiences' ? 'flex' : 'none';
    }

    if (festSuggestGroup) {
        festSuggestGroup.style.display = currentTab === 'festivals' ? 'flex' : 'none';
    }

    // Reset Form
    document.getElementById('modalItemName').value = '';
    document.getElementById('modalItemHomestay').value = '';
    document.getElementById('modalItemCity').value = 'Đà Nẵng';
    document.getElementById('modalItemLocation').value = '';
    document.getElementById('modalItemDate').value = '';
    document.getElementById('modalItemStatus').value = 'upcoming';

    renderHomestayChecklist('Đà Nẵng');

    modal.classList.add('show');
}

// Bật Modal Chỉnh Sửa Lễ Hội
function editFestival(id) {
    const festival = initialFestivals.find(f => f.id === id || f.id == id);
    if (!festival) return;

    editingId = id;
    const modal = document.getElementById('localModalOverlay');
    const modalTitle = document.getElementById('modalTitleText');
    const homestayField = document.getElementById('homestayFieldGroup');
    const festSuggestGroup = document.getElementById('festivalHomestaysSuggestGroup');

    if (!modal) return;

    if (modalTitle) modalTitle.textContent = 'Chỉnh sửa Lễ hội / Gán Homestay lân cận';
    if (homestayField) homestayField.style.display = 'none';
    if (festSuggestGroup) festSuggestGroup.style.display = 'flex';

    // Đổ dữ liệu hiện tại vào Form
    document.getElementById('modalItemName').value = festival.name;
    document.getElementById('modalItemCity').value = festival.city;
    document.getElementById('modalItemLocation').value = festival.location;
    document.getElementById('modalItemDate').value = festival.date;
    document.getElementById('modalItemStatus').value = festival.status;

    const selectedNames = festival.homestays ? festival.homestays.map(h => h.name) : [];
    renderHomestayChecklist(festival.city, selectedNames);

    modal.classList.add('show');
}

// Bật Modal Chỉnh Sửa Trải Nghiệm Homestay
function editExperience(id) {
    const exp = initialExperiences.find(e => e.id === id || e.id == id);
    if (!exp) return;

    editingId = id;
    const modal = document.getElementById('localModalOverlay');
    const modalTitle = document.getElementById('modalTitleText');
    const homestayField = document.getElementById('homestayFieldGroup');
    const festSuggestGroup = document.getElementById('festivalHomestaysSuggestGroup');

    if (!modal) return;

    if (modalTitle) modalTitle.textContent = 'Chỉnh sửa Trải nghiệm Homestay';
    if (homestayField) homestayField.style.display = 'flex';
    if (festSuggestGroup) festSuggestGroup.style.display = 'none';

    // Đổ dữ liệu hiện tại vào Form
    document.getElementById('modalItemName').value = exp.title;
    document.getElementById('modalItemHomestay').value = exp.homestay;
    document.getElementById('modalItemCity').value = exp.city;
    document.getElementById('modalItemLocation').value = exp.perk;
    document.getElementById('modalItemDate').value = '';
    document.getElementById('modalItemStatus').value = exp.status;

    modal.classList.add('show');
}

function closeModal() {
    editingId = null;
    const modal = document.getElementById('localModalOverlay');
    if (modal) modal.classList.remove('show');
}

function getStatusTextLabel(status) {
    if (status === 'active') return 'Đang diễn ra';
    if (status === 'upcoming') return 'Sắp diễn ra';
    if (status === 'featured') return 'Nổi bật';
    if (status === 'ended') return 'Đã kết thúc';
    return 'Hoạt động';
}

// Lưu dữ liệu từ Modal (Thêm mới HOẶC Chỉnh sửa)
function saveModalData() {
    const name = document.getElementById('modalItemName').value.trim();
    const homestay = document.getElementById('modalItemHomestay').value.trim();
    const city = document.getElementById('modalItemCity').value;
    const location = document.getElementById('modalItemLocation').value.trim();
    const date = document.getElementById('modalItemDate').value.trim() || 'Sắp diễn ra năm 2026';
    const status = document.getElementById('modalItemStatus').value;

    if (!name) {
        alert('Vui lòng nhập tên Lễ hội / Trải nghiệm!');
        return;
    }

    if (currentTab === 'festivals') {
        // Lấy danh sách Homestay đã tick chọn
        const checkedBoxes = document.querySelectorAll('.fest-homestay-checkbox:checked');
        const selectedHomestays = Array.from(checkedBoxes).map(cb => ({
            name: cb.value,
            distance: cb.getAttribute('data-distance') || '500m'
        }));

        if (editingId !== null) {
            // Cập nhật Lễ hội hiện tại
            const festIndex = initialFestivals.findIndex(f => f.id === editingId || f.id == editingId);
            if (festIndex !== -1) {
                initialFestivals[festIndex].name = name;
                initialFestivals[festIndex].city = city;
                initialFestivals[festIndex].location = location || initialFestivals[festIndex].location;
                initialFestivals[festIndex].date = date;
                initialFestivals[festIndex].status = status;
                initialFestivals[festIndex].statusText = getStatusTextLabel(status);
                initialFestivals[festIndex].homestays = selectedHomestays;
                initialFestivals[festIndex].homestayCount = selectedHomestays.length;
            }
        } else {
            // Thêm mới Lễ hội
            const newId = 'fest-' + Date.now();
            initialFestivals.unshift({
                id: newId,
                name: name,
                city: city,
                location: location || (`Khu vực trung tâm TP. ${city}`),
                date: date,
                status: status,
                statusText: getStatusTextLabel(status),
                autoLoad: true,
                homestays: selectedHomestays.length > 0 ? selectedHomestays : [
                    { name: `Homestay 1 gần ${city}`, distance: '300m' },
                    { name: `Homestay 2 gần ${city}`, distance: '600m' }
                ],
                homestayCount: selectedHomestays.length || 2,
                img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
            });
        }
    } else {
        if (!homestay) {
            alert('Vui lòng nhập tên Homestay cung cấp trải nghiệm!');
            return;
        }

        if (editingId !== null) {
            // Cập nhật Trải nghiệm hiện tại
            const expIndex = initialExperiences.findIndex(e => e.id === editingId || e.id == editingId);
            if (expIndex !== -1) {
                initialExperiences[expIndex].title = name;
                initialExperiences[expIndex].homestay = homestay;
                initialExperiences[expIndex].city = city;
                initialExperiences[expIndex].perk = location || initialExperiences[expIndex].perk;
                initialExperiences[expIndex].status = status;
            }
        } else {
            // Thêm mới Trải nghiệm
            initialExperiences.unshift({
                id: Date.now(),
                title: name,
                homestay: homestay,
                city: city,
                category: 'Trải nghiệm bản địa',
                perk: location || 'Dịch vụ kèm theo phòng lưu trú',
                rating: '5.0',
                reviews: 1,
                status: status,
                img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
            });
        }
    }

    closeModal();
    updateStatCards();
    renderActiveTabTable();
}

function deleteFestival(id) {
    if (confirm('Bạn có chắc chắn muốn xóa Lễ hội này khỏi hệ thống?')) {
        initialFestivals = initialFestivals.filter(f => f.id !== id && f.id != id);
        updateStatCards();
        renderActiveTabTable();
    }
}

function deleteExperience(id) {
    if (confirm('Bạn có chắc chắn muốn xóa Trải nghiệm này khỏi hệ thống?')) {
        initialExperiences = initialExperiences.filter(e => e.id !== id && e.id != id);
        updateStatCards();
        renderActiveTabTable();
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('localSearchInput');
    const statusFilter = document.getElementById('localStatusFilter');
    const citySelect = document.getElementById('modalItemCity');

    if (searchInput) searchInput.addEventListener('input', renderActiveTabTable);
    if (statusFilter) statusFilter.addEventListener('change', renderActiveTabTable);
    if (citySelect) {
        citySelect.addEventListener('change', (e) => {
            renderHomestayChecklist(e.target.value);
        });
    }
}
