/**
 * ==========================================================================
 * YÊN HOMESTAY ADMIN - ACCOUNT MANAGEMENT JS
 * File: opencms-core-master/.../admin/JS/account_management.js
 * Quản lý logic CRUD: Khách hàng, Chủ Homestay Owner, Admin Phân Quyền & Lock/Unlock
 * ==========================================================================
 */

let editingUserId = null;
let lockingUserId = null;

// Dữ liệu mẫu Tài Khoản (Đã bổ sung KYC, Danh sách Homestay sở hữu & Lịch sử)
let initialUsers = [
    {
        id: 'usr-1',
        name: 'Nguyễn Văn An',
        email: 'nguyenvanan@gmail.com',
        phone: '0905 123 456',
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
        avatarBg: 'linear-gradient(135deg, #15803D 0%, #166534 100%)'
    },
    {
        id: 'usr-2',
        name: 'Trần Thị Thu Hà',
        email: 'thuha.dalat@gmail.com',
        phone: '0914 987 654',
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
        avatarBg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)'
    },
    {
        id: 'usr-3',
        name: 'Lê Hoàng Nam',
        email: 'hoangnam.tourist@gmail.com',
        phone: '0988 555 222',
        role: 'guest',
        roleText: 'Khách lưu trú',
        permission: 'Người Dùng Phổ Thông',
        kycStatus: 'verified',
        kycText: 'Đã xác thực Email/SĐT',
        homestays: [],
        homestayCount: 0,
        bookingsCount: 8,
        joinDate: '05/06/2025',
        lastLogin: 'Hôm nay 10:05',
        status: 'active',
        statusText: 'Đang hoạt động',
        lockReason: '',
        avatarBg: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
    },
    {
        id: 'usr-4',
        name: 'Admin System (YÊN)',
        email: 'admin@yenhomestay.com',
        phone: '0236 888 9999',
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
        avatarBg: 'linear-gradient(135deg, #7E22CE 0%, #6B21A8 100%)'
    },
    {
        id: 'usr-5',
        name: 'Phạm Minh Đức',
        email: 'minhduc.spam@gmail.com',
        phone: '0935 000 111',
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
        lockReason: 'Spammer / Đặt phòng ảo không đến',
        avatarBg: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)'
    }
];

let currentUserTab = 'all'; // 'all' | 'guest' | 'host' | 'admin'

document.addEventListener('DOMContentLoaded', () => {
    initUserModule();
});

function initUserModule() {
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
                <th>Xác Minh KYC</th>
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
                            item.phone.includes(searchVal);
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
                    <div class="cell-item-title">
                        <div class="user-avatar-circle" style="background: ${item.avatarBg};">
                            ${item.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="item-name-group">
                            <span class="item-name" style="display: flex; align-items: center; gap: 4px;">
                                ${item.name}
                                <span class="material-symbols-outlined" style="color: #15803D; font-size: 16px;" title="Verified Host">verified</span>
                            </span>
                            <span style="font-size: 11.5px; color: #15803D; font-weight: 700;">Chủ Homestay Chính Chủ</span>
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
                    <span class="status-badge active" style="background: #DCFCE7; color: #15803D;">
                        <span class="material-symbols-outlined" style="font-size: 14px;">verified_user</span>
                        ${item.kycText}
                    </span>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span class="status-badge active" style="width: fit-content;">🏡 ${item.homestayCount} Căn Homestay</span>
                        <span style="font-size: 11.5px; color: var(--text-muted);">${item.homestays.join(', ')}</span>
                    </div>
                </td>
                <td><strong style="font-size: 14px; color: #0284C7;">${item.bookingsCount} lượt khách</strong></td>
                <td>
                    <span class="user-status-badge ${item.status}">
                        ${item.statusText}
                    </span>
                </td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon" title="Chi tiết tài khoản" onclick="viewUserDetail('${item.id}')">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                        <button class="btn-action-icon" title="${item.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}" onclick="handleLockToggle('${item.id}')">
                            <span class="material-symbols-outlined" style="color: ${item.status === 'active' ? '#EF4444' : '#15803D'};">
                                ${item.status === 'active' ? 'lock' : 'lock_open'}
                            </span>
                        </button>
                        <button class="btn-action-icon" title="Chỉnh sửa" onclick="editUserAccount('${item.id}')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } else {
        container.innerHTML = filtered.map(item => `
            <tr>
                <td>
                    <div class="cell-item-title">
                        <div class="user-avatar-circle" style="background: ${item.avatarBg};">
                            ${item.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="item-name-group">
                            <span class="item-name">${item.name}</span>
                            <span style="font-size: 11.5px; color: var(--text-muted);">ID: ${item.id}</span>
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
                            ${item.roleText}
                        </span>
                        <span style="font-size: 11px; color: var(--text-muted);">${item.permission}</span>
                    </div>
                </td>
                <td><span style="font-size: 12.5px; font-weight: 600; color: #475569;">${item.joinDate}</span></td>
                <td>
                    ${item.role === 'host' ? 
                        `<span class="status-badge active">🏡 ${item.homestayCount} Homestay</span>` : 
                        `<span class="status-badge active" style="background: #E0F2FE; color: #0284C7;">🧳 ${item.bookingsCount} lượt đặt</span>`
                    }
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span class="user-status-badge ${item.status}">
                            ${item.statusText}
                        </span>
                        ${item.status === 'blocked' && item.lockReason ? `<span style="font-size: 11px; color: #EF4444;" title="${item.lockReason}">⚠️ ${item.lockReason}</span>` : ''}
                    </div>
                </td>
                <td>
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon" title="Xem chi tiết" onclick="viewUserDetail('${item.id}')">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                        <button class="btn-action-icon" title="${item.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}" onclick="handleLockToggle('${item.id}')">
                            <span class="material-symbols-outlined" style="color: ${item.status === 'active' ? '#EF4444' : '#15803D'};">
                                ${item.status === 'active' ? 'lock' : 'lock_open'}
                            </span>
                        </button>
                        <button class="btn-action-icon" title="Chỉnh sửa" onclick="editUserAccount('${item.id}')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// XEM CHI TIẾT TÀI KHOẢN (User Detail View Modal)
function viewUserDetail(id) {
    const user = initialUsers.find(u => u.id === id);
    if (!user) return;

    const modal = document.getElementById('userDetailModalOverlay');
    const content = document.getElementById('userDetailModalContent');
    if (!modal || !content) return;

    content.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);">
            <div class="user-avatar-circle" style="width: 64px; height: 64px; font-size: 24px; background: ${user.avatarBg};">
                ${user.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main);">${user.name}</h2>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                    <span class="role-badge ${user.role}">
                        <span class="material-symbols-outlined" style="font-size: 14px;">
                            ${user.role === 'host' ? 'cottage' : (user.role === 'admin' ? 'admin_panel_settings' : 'person')}
                        </span>
                        ${user.roleText}
                    </span>
                    <span class="user-status-badge ${user.status}">${user.statusText}</span>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 20px;">
            <div style="background: #F8FAFC; padding: 12px 16px; border-radius: 8px; border: 1px solid #E2E8F0;">
                <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;">EMAIL LIÊN HỆ</span>
                <p style="font-size: 14px; font-weight: 700; color: var(--text-main); margin-top: 2px;">${user.email}</p>
            </div>
            <div style="background: #F8FAFC; padding: 12px 16px; border-radius: 8px; border: 1px solid #E2E8F0;">
                <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;">SỐ ĐIỆN THOẠI</span>
                <p style="font-size: 14px; font-weight: 700; color: var(--text-main); margin-top: 2px;">${user.phone}</p>
            </div>
            <div style="background: #F8FAFC; padding: 12px 16px; border-radius: 8px; border: 1px solid #E2E8F0;">
                <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;">PHÂN QUYỀN HỆ THỐNG</span>
                <p style="font-size: 14px; font-weight: 700; color: #0284C7; margin-top: 2px;">${user.permission}</p>
            </div>
            <div style="background: #F8FAFC; padding: 12px 16px; border-radius: 8px; border: 1px solid #E2E8F0;">
                <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;">TRẠNG THÁI XÁC MINH KYC</span>
                <p style="font-size: 14px; font-weight: 700; color: #15803D; margin-top: 2px;">✓ ${user.kycText}</p>
            </div>
        </div>

        ${user.role === 'host' ? `
            <div style="margin-top: 20px;">
                <h4 style="font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">Danh sách Homestay thuộc quyền sở hữu (${user.homestayCount} căn):</h4>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${user.homestays.map(h => `
                        <div style="background: #F0FDF4; border: 1px solid #BBF7D0; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight: 700; color: #15803D; display: flex; align-items: center; gap: 8px;">
                            <span class="material-symbols-outlined">cottage</span> ${h}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        ${user.status === 'blocked' ? `
            <div style="margin-top: 20px; background: #FEF2F2; border: 1px solid #FCA5A5; padding: 12px 16px; border-radius: 8px; color: #991B1B;">
                <strong style="font-size: 13px;">⚠️ Thông tin khóa tài khoản:</strong>
                <p style="font-size: 13px; margin-top: 2px;">Lý do: ${user.lockReason || 'Vi phạm chính sách'}</p>
            </div>
        ` : ''}
    `;

    modal.classList.add('show');
}

function closeUserDetailModal() {
    const modal = document.getElementById('userDetailModalOverlay');
    if (modal) modal.classList.remove('show');
}

// XỬ LÝ KHÓA / MỞ KHÓA TÀI KHOẢN KÈM LÝ DO
function handleLockToggle(id) {
    const user = initialUsers.find(u => u.id === id);
    if (!user) return;

    if (user.status === 'blocked') {
        // Mở khóa trực tiếp
        if (confirm(`Mở khóa cho tài khoản "${user.name}"?`)) {
            user.status = 'active';
            user.statusText = 'Đang hoạt động';
            user.lockReason = '';
            updateUserStatCards();
            renderUserTable();
        }
    } else {
        // Bật Modal nhập lý do khóa
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
    }

    closeLockModal();
    updateUserStatCards();
    renderUserTable();
}

function editUserAccount(id) {
    const user = initialUsers.find(u => u.id === id);
    if (!user) return;

    editingUserId = id;
    const modal = document.getElementById('userModalOverlay');
    const modalTitle = document.getElementById('userModalTitleText');
    if (!modal) return;

    if (modalTitle) modalTitle.textContent = 'Chỉnh Sửa Thông Tin Tài Khoản & Phân Quyền';

    document.getElementById('userNameInput').value = user.name;
    document.getElementById('userEmailInput').value = user.email;
    document.getElementById('userPhoneInput').value = user.phone;
    document.getElementById('userRoleSelect').value = user.role;
    document.getElementById('userStatusSelect').value = user.status;

    modal.classList.add('show');
}

function closeUserModal() {
    editingUserId = null;
    const modal = document.getElementById('userModalOverlay');
    if (modal) modal.classList.remove('show');
}

function getRoleText(role) {
    if (role === 'host') return 'Chủ Homestay (Owner)';
    if (role === 'admin') return 'System Admin';
    return 'Khách lưu trú';
}

function getPermissionText(role) {
    if (role === 'host') return 'Đối Tác Kinh Doanh';
    if (role === 'admin') return 'Super Admin Hệ Thống';
    return 'Người Dùng Phổ Thông';
}

function saveUserData() {
    const name = document.getElementById('userNameInput').value.trim();
    const email = document.getElementById('userEmailInput').value.trim();
    const phone = document.getElementById('userPhoneInput').value.trim();
    const role = document.getElementById('userRoleSelect').value;
    const status = document.getElementById('userStatusSelect').value;

    if (!name || !email) {
        alert('Vui lòng nhập đầy đủ Họ tên và Email!');
        return;
    }

    const roleText = getRoleText(role);
    const permission = getPermissionText(role);
    const statusText = status === 'active' ? 'Đang hoạt động' : 'Bị khóa';

    if (editingUserId !== null) {
        const index = initialUsers.findIndex(u => u.id === editingUserId);
        if (index !== -1) {
            initialUsers[index].name = name;
            initialUsers[index].email = email;
            initialUsers[index].phone = phone || initialUsers[index].phone;
            initialUsers[index].role = role;
            initialUsers[index].roleText = roleText;
            initialUsers[index].permission = permission;
            initialUsers[index].status = status;
            initialUsers[index].statusText = statusText;
        }
    }

    closeUserModal();
    updateUserStatCards();
    renderUserTable();
}

function deleteUserAccount(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống?')) {
        initialUsers = initialUsers.filter(u => u.id !== id);
        updateUserStatCards();
        renderUserTable();
    }
}

function setupUserEventListeners() {
    const searchInput = document.getElementById('userSearchInput');
    const statusFilter = document.getElementById('userStatusFilter');

    if (searchInput) searchInput.addEventListener('input', renderUserTable);
    if (statusFilter) statusFilter.addEventListener('change', renderUserTable);
}
