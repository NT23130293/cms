/**
 * ==========================================================================
 * YÊN HOMESTAY ADMIN - ACCOUNT MANAGEMENT JS
 * File: opencms-core-master/.../admin/JS/account_management.js
 * Quản lý logic CRUD: Khách hàng, Chủ Homestay Owner, Admin Phân Quyền & Lock/Unlock
 * ==========================================================================
 */

const STORAGE_KEY = 'yen_admin_users';

let editingUserId = null;
let lockingUserId = null;

// Dữ liệu mẫu ban đầu đầy đủ trường như trang cá nhân
const defaultInitialUsers = [
    {
        id: 'usr-1',
        name: 'Nguyễn Văn An',
        nickname: 'An Nguyễn Homestay',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        email: 'nguyenvanan@gmail.com',
        emailVerified: true,
        phone: '0905 123 456',
        phoneVerified: true,
        cccd: '048092001234',
        dobDay: '15',
        dobMonth: '05',
        dobYear: '1988',
        gender: 'nam',
        nationality: 'Việt Nam',
        street: '128 Đường Bạch Đằng',
        province: 'Thành phố Đà Nẵng',
        ward: 'Phường Hải Châu 1',
        taxCode: '0401892831',
        bizCode: '48A8019284',
        role: 'host',
        roleText: 'Chủ Homestay (Owner)',
        permission: 'Đối Tác Kinh Doanh',
        kycStatus: 'verified',
        kycText: 'Đã xác minh KYC',
        homestays: ['Han River Glass House', 'Danang Riverside Cozy Villa', 'Sơn Trà Sunset Infinity Villa'],
        homestayCount: 3,
        bookingsCount: 42,
        joinDate: '12/01/2025',
        lastLogin: 'Hôm nay 14:20',
        status: 'active',
        statusText: 'Đang hoạt động',
        lockReason: '',
        memberTier: 'Host Uy Tín (SuperHost)',
        adminNotes: 'Chủ chuỗi homestay view sông Hàn, đánh giá 4.9/5 sao.',
        avatarBg: 'linear-gradient(135deg, #15803D 0%, #166534 100%)'
    },
    {
        id: 'usr-2',
        name: 'Trần Thị Thu Hà',
        nickname: 'Thu Hà Đà Lạt',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        email: 'thuha.dalat@gmail.com',
        emailVerified: true,
        phone: '0914 987 654',
        phoneVerified: true,
        cccd: '068194002345',
        dobDay: '22',
        dobMonth: '10',
        dobYear: '1992',
        gender: 'nu',
        nationality: 'Việt Nam',
        street: '45 Đường Hoàng Hoa Thám',
        province: 'Tỉnh Lâm Đồng',
        ward: 'Phường 10, TP. Đà Lạt',
        taxCode: '5801293847',
        bizCode: '68B9023412',
        role: 'host',
        roleText: 'Chủ Homestay (Owner)',
        permission: 'Đối Tác Kinh Doanh',
        kycStatus: 'verified',
        kycText: 'Đã xác minh KYC',
        homestays: ['The Memory Valley Villa', 'Dalat Blooming Garden'],
        homestayCount: 2,
        bookingsCount: 38,
        joinDate: '18/03/2025',
        lastLogin: 'Hôm qua 09:15',
        status: 'active',
        statusText: 'Đang hoạt động',
        lockReason: '',
        memberTier: 'Host Tiêu Biểu',
        adminNotes: 'Chuyên villa săn mây và homestay thung lũng Đà Lạt.',
        avatarBg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)'
    },
    {
        id: 'usr-3',
        name: 'Lê Hoàng Mai Chi',
        nickname: 'Mai Chi Homestay',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        email: 'maichi.lehoang@gmail.com',
        emailVerified: true,
        phone: '0988 555 222',
        phoneVerified: false,
        cccd: '001203004005',
        dobDay: '18',
        dobMonth: '08',
        dobYear: '1998',
        gender: 'nu',
        nationality: 'Việt Nam',
        street: '123 Đường Lê Lợi',
        province: 'Thành phố Hà Nội',
        ward: 'Phường Hàng Trống, Quận Hoàn Kiếm',
        taxCode: '0312345678',
        bizCode: '41A8012345',
        role: 'guest',
        roleText: 'Khách lưu trú',
        permission: 'Người Dùng Phổ Thông',
        kycStatus: 'verified',
        kycText: 'Đã xác thực Email/CCCD',
        homestays: [],
        homestayCount: 0,
        bookingsCount: 8,
        joinDate: '05/06/2025',
        lastLogin: 'Hôm nay 10:05',
        status: 'active',
        statusText: 'Đang hoạt động',
        lockReason: '',
        memberTier: 'Thành viên thân thiết',
        adminNotes: 'Khách du lịch thường xuyên đặt phòng Tây Bắc và Đà Lạt.',
        avatarBg: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
    },
    {
        id: 'usr-4',
        name: 'Admin System (YÊN)',
        nickname: 'YEN Root Admin',
        avatar: '',
        email: 'admin@yenhomestay.com',
        emailVerified: true,
        phone: '0236 888 9999',
        phoneVerified: true,
        cccd: '048000999888',
        dobDay: '01',
        dobMonth: '01',
        dobYear: '1990',
        gender: 'nam',
        nationality: 'Việt Nam',
        street: 'Tòa nhà YÊN, 246 Nguyễn Văn Linh',
        province: 'Thành phố Đà Nẵng',
        ward: 'Phường Thạc Gián, Quận Thanh Khê',
        taxCode: '0409999888',
        bizCode: '48GP-YEN2024',
        role: 'admin',
        roleText: 'System Admin',
        permission: 'Toàn Quyền Quản Trị Hệ Thống (Super Admin)',
        kycStatus: 'verified',
        kycText: 'Quản trị viên Hệ thống',
        homestays: [],
        homestayCount: 0,
        bookingsCount: 0,
        joinDate: '01/01/2024',
        lastLogin: 'Hôm nay 15:10',
        status: 'active',
        statusText: 'Đang hoạt động',
        lockReason: '',
        memberTier: 'Quản Trị Viên Cấp Cao',
        adminNotes: 'Tài khoản quản trị gốc của hệ thống YÊN Homestay.',
        avatarBg: 'linear-gradient(135deg, #15803D 0%, #064E3B 100%)'
    },
    {
        id: 'usr-5',
        name: 'Phạm Minh Đức',
        nickname: 'Đức Phượt',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        email: 'minhduc.spam@gmail.com',
        emailVerified: false,
        phone: '0935 000 111',
        phoneVerified: false,
        cccd: '031095007890',
        dobDay: '09',
        dobMonth: '03',
        dobYear: '1995',
        gender: 'nam',
        nationality: 'Việt Nam',
        street: '78 Phố Cầu Giấy',
        province: 'Thành phố Hà Nội',
        ward: 'Phường Quan Hoa, Quận Cầu Giấy',
        taxCode: '',
        bizCode: '',
        role: 'guest',
        roleText: 'Khách lưu trú',
        permission: 'Bị Giới Hạn Truy Cập',
        kycStatus: 'unverified',
        kycText: 'Chưa KYC',
        homestays: [],
        homestayCount: 0,
        bookingsCount: 1,
        joinDate: '10/08/2025',
        lastLogin: '10/08/2025',
        status: 'blocked',
        statusText: 'Bị khóa',
        lockReason: 'Spammer / Đặt phòng ảo không đến (Vĩnh viễn)',
        memberTier: 'Tài khoản bị hạn chế',
        adminNotes: 'Có 3 báo cáo no-show từ các host Mai Châu và Sapa.',
        avatarBg: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)'
    }
];

let initialUsers = [];
let currentUserTab = 'all'; // 'all' | 'guest' | 'host' | 'admin'

function getStoredUsers() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInitialUsers));
        return defaultInitialUsers;
    }
    try {
        const parsed = JSON.parse(raw);
        return parsed && parsed.length > 0 ? parsed : defaultInitialUsers;
    } catch (e) {
        return defaultInitialUsers;
    }
}

function saveStoredUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', () => {
    initUserModule();
});

function initUserModule() {
    initialUsers = getStoredUsers();
    updateUserStatCards();
    renderUserTable();
    setupUserEventListeners();
}

function updateUserStatCards() {
    const totalUsers = initialUsers.length;
    const totalGuests = initialUsers.filter(u => u.role === 'guest').length;
    const totalHosts = initialUsers.filter(u => u.role === 'host').length;
    const activeUsers = initialUsers.filter(u => u.status === 'active').length;

    const totalUsersEl = document.getElementById('statTotalUsers');
    const totalGuestsEl = document.getElementById('statTotalGuests');
    const totalHostsEl = document.getElementById('statTotalHosts');
    const activeUsersEl = document.getElementById('statActiveUsers');

    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    if (totalGuestsEl) totalGuestsEl.textContent = totalGuests;
    if (totalHostsEl) totalHostsEl.textContent = totalHosts;
    if (activeUsersEl) activeUsersEl.textContent = activeUsers;
}

function switchUserTab(tabName) {
    currentUserTab = tabName;
    const tabBtns = document.querySelectorAll('.content-tab-btn');
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderUserTable();
}

function renderUserTable() {
    const container = document.getElementById('userTableBody');
    const tableHeader = document.getElementById('userTableHeader');
    if (!container || !tableHeader) return;

    const searchVal = (document.getElementById('userSearchInput')?.value || '').toLowerCase();
    const statusVal = document.getElementById('userStatusFilter')?.value || 'all';

    if (currentUserTab === 'host') {
        // Giao diện chuyên biệt cho QUẢN LÝ HOMESTAY OWNER
        tableHeader.innerHTML = `
            <tr>
                <th>Chủ Homestay Owner</th>
                <th>Thông Tin Liên Hệ</th>
                <th>Xác Minh KYC & CCCD</th>
                <th>Danh Sách Homestay Sở Hữu</th>
                <th>Tổng Đặt Phòng</th>
                <th>Trạng Thái</th>
                <th style="text-align: right;">Thao Tác</th>
            </tr>
        `;
    } else {
        tableHeader.innerHTML = `
            <tr>
                <th>Tài Khoản / Người Dùng</th>
                <th>Email & Số Điện Thoại</th>
                <th>Vai Trò & Phân Quyền</th>
                <th>Ngày Tham Gia</th>
                <th>Thống Kê Hoạt Động</th>
                <th>Trạng Thái</th>
                <th style="text-align: right;">Thao Tác</th>
            </tr>
        `;
    }

    let filtered = initialUsers.filter(item => {
        const matchTab = currentUserTab === 'all' || item.role === currentUserTab;
        const matchSearch = item.name.toLowerCase().includes(searchVal) || 
                            item.email.toLowerCase().includes(searchVal) || 
                            (item.phone && item.phone.includes(searchVal)) ||
                            (item.cccd && item.cccd.includes(searchVal));
        const matchStatus = statusVal === 'all' || item.status === statusVal;
        return matchTab && matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted);">Không tìm thấy tài khoản phù hợp.</td></tr>`;
        return;
    }

    if (currentUserTab === 'host') {
        container.innerHTML = filtered.map(item => `
            <tr>
                <td>
                    <div class="cell-item-title" style="cursor: pointer;" onclick="editUserAccount('${item.id}')" title="Bấm để chỉnh sửa chi tiết">
                        ${item.avatar ? 
                            `<img src="${item.avatar}" alt="${item.name}" class="user-avatar-circle" style="object-fit: cover;">` :
                            `<div class="user-avatar-circle" style="background: ${item.avatarBg || '#15803D'};">${item.name.charAt(0).toUpperCase()}</div>`
                        }
                        <div class="item-name-group">
                            <span class="item-name" style="display: flex; align-items: center; gap: 4px;">
                                ${item.name}
                                <span class="material-symbols-outlined" style="color: #15803D; font-size: 16px;" title="Verified Host">verified</span>
                            </span>
                            <span style="font-size: 11.5px; color: #15803D; font-weight: 700;">${item.memberTier || 'Chủ Homestay'}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column;">
                        <strong style="font-size: 13px; color: var(--text-main);">${item.email}</strong>
                        <span style="font-size: 12px; color: var(--text-muted);">${item.phone}</span>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span class="status-badge active" style="background: #DCFCE7; color: #15803D; width: fit-content;">
                            <span class="material-symbols-outlined" style="font-size: 14px;">verified_user</span>
                            ${item.kycText || 'Đã xác minh KYC'}
                        </span>
                        ${item.cccd ? `<span style="font-size: 11.5px; color: var(--text-muted); font-family: monospace;">CCCD: ${item.cccd}</span>` : ''}
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span class="status-badge active" style="width: fit-content;">🏡 ${item.homestayCount || (item.homestays ? item.homestays.length : 0)} Căn Homestay</span>
                        <span style="font-size: 11.5px; color: var(--text-muted); max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${(item.homestays || []).join(', ')}</span>
                    </div>
                </td>
                <td><strong style="font-size: 14px; color: #0284C7;">${item.bookingsCount || 0} lượt khách</strong></td>
                <td>
                    <span class="user-status-badge ${item.status}">
                        ${item.statusText || (item.status === 'active' ? 'Đang hoạt động' : 'Bị khóa')}
                    </span>
                </td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon" title="Chỉnh sửa chi tiết trang riêng" onclick="editUserAccount('${item.id}')">
                            <span class="material-symbols-outlined" style="color: #15803D;">edit</span>
                        </button>
                        <button class="btn-action-icon" title="${item.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}" onclick="handleLockToggle('${item.id}')">
                            <span class="material-symbols-outlined" style="color: ${item.status === 'active' ? '#EF4444' : '#15803D'};">
                                ${item.status === 'active' ? 'lock' : 'lock_open'}
                            </span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } else {
        container.innerHTML = filtered.map(item => `
            <tr>
                <td>
                    <div class="cell-item-title" style="cursor: pointer;" onclick="editUserAccount('${item.id}')" title="Bấm để chỉnh sửa chi tiết">
                        ${item.avatar ? 
                            `<img src="${item.avatar}" alt="${item.name}" class="user-avatar-circle" style="object-fit: cover;">` :
                            `<div class="user-avatar-circle" style="background: ${item.avatarBg || '#15803D'};">${item.name.charAt(0).toUpperCase()}</div>`
                        }
                        <div class="item-name-group">
                            <span class="item-name">${item.name}</span>
                            <span style="font-size: 11.5px; color: var(--text-muted);">${item.nickname ? '@' + item.nickname : 'ID: ' + item.id}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column;">
                        <strong style="font-size: 13px; color: var(--text-main);">${item.email}</strong>
                        <span style="font-size: 12px; color: var(--text-muted);">${item.phone}</span>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span class="role-badge ${item.role}" style="width: fit-content;">
                            <span class="material-symbols-outlined" style="font-size: 14px;">
                                ${item.role === 'host' ? 'cottage' : (item.role === 'admin' ? 'admin_panel_settings' : 'person')}
                            </span>
                            ${item.roleText || item.role}
                        </span>
                        <span style="font-size: 11px; color: var(--text-muted);">${item.permission}</span>
                    </div>
                </td>
                <td><span style="font-size: 12.5px; font-weight: 600; color: #475569;">${item.joinDate || '01/01/2025'}</span></td>
                <td>
                    ${item.role === 'host' ? 
                        `<span class="status-badge active">🏡 ${item.homestayCount || (item.homestays ? item.homestays.length : 0)} Homestay</span>` : 
                        `<span class="status-badge active" style="background: #E0F2FE; color: #0284C7;">🧳 ${item.bookingsCount || 0} lượt đặt</span>`
                    }
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span class="user-status-badge ${item.status}">
                            ${item.statusText || (item.status === 'active' ? 'Đang hoạt động' : 'Bị khóa')}
                        </span>
                        ${item.status === 'blocked' && item.lockReason ? `<span style="font-size: 11px; color: #EF4444;" title="${item.lockReason}">⚠️ ${item.lockReason}</span>` : ''}
                    </div>
                </td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon" title="Chỉnh sửa chi tiết trang riêng" onclick="editUserAccount('${item.id}')">
                            <span class="material-symbols-outlined" style="color: #15803D;">edit</span>
                        </button>
                        <button class="btn-action-icon" title="${item.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}" onclick="handleLockToggle('${item.id}')">
                            <span class="material-symbols-outlined" style="color: ${item.status === 'active' ? '#EF4444' : '#15803D'};">
                                ${item.status === 'active' ? 'lock' : 'lock_open'}
                            </span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Chuyển hướng sang trang Chỉnh sửa Chi tiết Riêng biệt (account_edit.html)
function editUserAccount(id) {
    window.location.href = `account_edit.html?id=${encodeURIComponent(id)}`;
}

// XỬ LÝ KHÓA / MỞ KHÓA TÀI KHOẢN KÈM LÝ DO
function handleLockToggle(id) {
    const user = initialUsers.find(u => u.id === id);
    if (!user) return;

    if (user.status === 'blocked') {
        if (confirm(`Mở khóa cho tài khoản "${user.name}"?`)) {
            user.status = 'active';
            user.statusText = 'Đang hoạt động';
            user.lockReason = '';
            saveStoredUsers(initialUsers);
            updateUserStatCards();
            renderUserTable();
        }
    } else {
        lockingUserId = id;
        document.getElementById('lockTargetUserName').textContent = user.name;
        document.getElementById('lockModalOverlay').classList.add('show');
    }
}

function closeLockModal() {
    lockingUserId = null;
    document.getElementById('lockModalOverlay')?.classList.remove('show');
}

function confirmLockAccount() {
    if (!lockingUserId) return;

    const user = initialUsers.find(u => u.id === lockingUserId);
    const reason = document.getElementById('lockReasonSelect').value;
    const duration = document.getElementById('lockDurationSelect').value;

    if (user) {
        user.status = 'blocked';
        user.statusText = 'Bị khóa';
        user.lockReason = `${reason} (${duration})`;
        saveStoredUsers(initialUsers);
    }

    closeLockModal();
    updateUserStatCards();
    renderUserTable();
}

function setupUserEventListeners() {
    const searchInput = document.getElementById('userSearchInput');
    const statusFilter = document.getElementById('userStatusFilter');

    if (searchInput) searchInput.addEventListener('input', renderUserTable);
    if (statusFilter) statusFilter.addEventListener('change', renderUserTable);
}
