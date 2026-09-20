/**
 * ==========================================================================
 * YÊN HOMESTAY ADMIN - ACCOUNT MANAGEMENT JS
 * File: opencms-core-master/.../admin/JS/account_management.js
 * Quản lý logic CRUD: Khách hàng, Chủ Homestay Owner, Admin Phân Quyền,
 * Cập nhật CCCD, Đổi Mật Khẩu, Ngân Hàng & Lock/Unlock
 * ==========================================================================
 */

let editingUserId = null;
let lockingUserId = null;
let resetPwdUserId = null;

// Dữ liệu mẫu Tài Khoản (Đã bổ sung CCCD, Mật khẩu, Mã số thuế, Ngân hàng Payout, Danh sách Homestay sở hữu & Phân quyền)
let initialUsers = [
    {
        id: 'usr-1',
        name: 'Nguyễn Văn An',
        nickname: 'An Homestay Sông Hàn',
        email: 'nguyenvanan@gmail.com',
        phone: '0905 123 456',
        cccd: '048090001234',
        cccdDate: '15/04/2021',
        cccdPlace: 'Cục Cảnh sát QLHC về trật tự xã hội',
        dob: '1990-08-18',
        gender: 'Nam',
        address: '123 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng',
        taxCode: '0312345678',
        bizCode: '41A8012345',
        bankName: 'Vietcombank (VCB)',
        bankAccount: '1012998877',
        bankHolder: 'NGUYEN VAN AN',
        role: 'host',
        roleText: 'Chủ Homestay (Owner)',
        permission: 'Đối Tác Kinh Doanh Homestay',
        permissionLevel: 'Đối Tác Kinh Doanh Homestay',
        kycStatus: 'verified',
        kycText: 'Đã xác minh KYC & CCCD',
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
        nickname: 'Thu Hà Đà Lạt Villa',
        email: 'thuha.dalat@gmail.com',
        phone: '0914 987 654',
        cccd: '068195005678',
        cccdDate: '20/10/2022',
        cccdPlace: 'Cục Cảnh sát QLHC về trật tự xã hội',
        dob: '1995-03-24',
        gender: 'Nữ',
        address: '45 Trần Hưng Đạo, Phường 10, Thành phố Đà Lạt, Lâm Đồng',
        taxCode: '0898765432',
        bizCode: '42B9099887',
        bankName: 'MBBank (MB)',
        bankAccount: '999988887777',
        bankHolder: 'TRAN THI THU HA',
        role: 'host',
        roleText: 'Chủ Homestay (Owner)',
        permission: 'Đối Tác Kinh Doanh Homestay',
        permissionLevel: 'Đối Tác Kinh Doanh Homestay',
        kycStatus: 'verified',
        kycText: 'Đã xác minh KYC & CCCD',
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
        nickname: 'Nam Traveler',
        email: 'hoangnam.tourist@gmail.com',
        phone: '0988 555 222',
        cccd: '001098009988',
        cccdDate: '05/01/2020',
        cccdPlace: 'Công an TP. Hà Nội',
        dob: '1998-11-12',
        gender: 'Nam',
        address: '88 Phố Huế, Quận Hai Bà Trưng, Hà Nội',
        taxCode: '',
        bizCode: '',
        bankName: 'Techcombank (TCB)',
        bankAccount: '190388877766',
        bankHolder: 'LE HOANG NAM',
        role: 'guest',
        roleText: 'Khách lưu trú',
        permission: 'Người Dùng Phổ Thông',
        permissionLevel: 'Người Dùng Phổ Thông',
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
        nickname: 'SuperAdmin YÊN',
        email: 'admin@yenhomestay.com',
        phone: '0236 888 9999',
        cccd: '001088000001',
        cccdDate: '01/01/2021',
        cccdPlace: 'Bộ Công An',
        dob: '1988-05-20',
        gender: 'Nam',
        address: 'Tòa nhà YÊN Center, 01 Bạch Đằng, Đà Nẵng',
        taxCode: '0401998877',
        bizCode: '0401998877-001',
        bankName: 'Vietcombank (VCB)',
        bankAccount: '0071001234567',
        bankHolder: 'CONG TY CP YEN HOMESTAY',
        role: 'admin',
        roleText: 'System Admin',
        permission: 'Toàn Quyền Hệ Thống (Super Admin)',
        permissionLevel: 'Toàn Quyền Hệ Thống (Super Admin)',
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
        nickname: 'Minh Đức',
        email: 'minhduc.spam@gmail.com',
        phone: '0935 000 111',
        cccd: '036092003344',
        cccdDate: '10/05/2019',
        cccdPlace: 'Công an Tỉnh Nam Định',
        dob: '1992-04-10',
        gender: 'Nam',
        address: 'Phủ Lý, Hà Nam',
        taxCode: '',
        bizCode: '',
        bankName: 'VietinBank',
        bankAccount: '10800998811',
        bankHolder: 'PHAM MINH DUC',
        role: 'guest',
        roleText: 'Khách lưu trú',
        permission: 'Bị Giới Hạn Truy Cập',
        permissionLevel: 'Người Dùng Phổ Thông',
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

// CHUYỂN TAB TRONG FORM MODAL
function switchFormTab(formTabId) {
    const tabBtns = document.querySelectorAll('.form-modal-tab-btn');
    const tabPanels = document.querySelectorAll('.form-tab-panel');

    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-formtab') === formTabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    tabPanels.forEach(panel => {
        if (panel.id === formTabId) {
            panel.classList.remove('d-none');
        } else {
            panel.classList.add('d-none');
        }
    });
}

// ẨN / HIỆN MẬT KHẨU
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        btn.querySelector('.material-symbols-outlined').textContent = 'visibility_off';
    } else {
        input.type = 'password';
        btn.querySelector('.material-symbols-outlined').textContent = 'visibility';
    }
}

// TẠO MẬT KHẨU NGẪU NHIÊN CHẤT LƯỢNG CAO
function generateRandomPassword(inputId) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$';
    let pwd = 'Yen@';
    for (let i = 0; i < 6; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const input = document.getElementById(inputId);
    if (input) {
        input.type = 'text';
        input.value = pwd;
    }
    alert(`Đã tạo mật khẩu ngẫu nhiên: ${pwd}`);
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
                <th>Thông Tin CCCD & Liên Hệ</th>
                <th>Xác Minh KYC & Thuế</th>
                <th>Danh Sách Homestay Sở Hữu</th>
                <th>Tài Khoản Payout Ngân Hàng</th>
                <th>Trạng Thái</th>
                <th style="text-align: right;">Thao Tác Quản Lý</th>
            </tr>
        `;
    } else {
        tableHeader.innerHTML = `
            <tr>
                <th>Tài Khoản / Người Dùng</th>
                <th>Email, SĐT & CCCD</th>
                <th>Vai Trò & Phân Quyền</th>
                <th>Ngày Tham Gia</th>
                <th>Thống Kê Hoạt Động</th>
                <th>Trạng Thái</th>
                <th style="text-align: right;">Thao Tác Quản Lý</th>
            </tr>
        `;
    }

    let filtered = initialUsers.filter(item => {
        const matchTab = currentUserTab === 'all' || item.role === currentUserTab;
        const matchSearch = item.name.toLowerCase().includes(searchVal) || 
                            item.email.toLowerCase().includes(searchVal) || 
                            item.phone.includes(searchVal) ||
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
                    <div class="cell-item-title">
                        <div class="user-avatar-circle" style="background: ${item.avatarBg};">
                            ${item.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="item-name-group">
                            <span class="item-name" style="display: flex; align-items: center; gap: 4px;">
                                ${item.name}
                                <span class="material-symbols-outlined" style="color: #15803D; font-size: 16px;" title="Verified Host">verified</span>
                            </span>
                            <span style="font-size: 11.5px; color: #15803D; font-weight: 700;">${item.nickname || 'Chủ Homestay'}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column;">
                        <strong style="font-size: 13px; color: var(--text-main);">${item.email}</strong>
                        <span style="font-size: 12px; color: var(--text-muted);">${item.phone}</span>
                        <span style="font-size: 11.5px; color: #0284C7; font-weight: 700; margin-top: 2px;">🪪 CCCD: ${item.cccd || 'Chưa cập nhật'}</span>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span class="status-badge active" style="background: #DCFCE7; color: #15803D; width: fit-content;">
                            <span class="material-symbols-outlined" style="font-size: 14px;">verified_user</span>
                            ${item.kycText}
                        </span>
                        ${item.taxCode ? `<span style="font-size: 11px; color: #64748B;">MST: ${item.taxCode}</span>` : ''}
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span class="status-badge active" style="width: fit-content;">🏡 ${item.homestayCount} Căn Homestay</span>
                        <span style="font-size: 11.5px; color: var(--text-muted);">${item.homestays.join(', ')}</span>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column;">
                        <strong style="font-size: 12.5px; color: #0F172A;">${item.bankName || 'Chưa liên kết'}</strong>
                        <span style="font-size: 11.5px; color: #0284C7; font-weight: 700;">STK: ${item.bankAccount || '-'}</span>
                    </div>
                </td>
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
                        <button class="btn-action-icon" title="Đổi mật khẩu nhanh" onclick="openResetPasswordModal('${item.id}')">
                            <span class="material-symbols-outlined" style="color: #0284C7;">key</span>
                        </button>
                        <button class="btn-action-icon" title="${item.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}" onclick="handleLockToggle('${item.id}')">
                            <span class="material-symbols-outlined" style="color: ${item.status === 'active' ? '#EF4444' : '#15803D'};">
                                ${item.status === 'active' ? 'lock' : 'lock_open'}
                            </span>
                        </button>
                        <button class="btn-action-icon" title="Chỉnh sửa thông tin & CCCD" onclick="editUserAccount('${item.id}')">
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
                        <span style="font-size: 11.5px; color: #475569;">🪪 CCCD: ${item.cccd || 'Chưa cập nhật'}</span>
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
                        <button class="btn-action-icon" title="Đổi mật khẩu nhanh" onclick="openResetPasswordModal('${item.id}')">
                            <span class="material-symbols-outlined" style="color: #0284C7;">key</span>
                        </button>
                        <button class="btn-action-icon" title="${item.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}" onclick="handleLockToggle('${item.id}')">
                            <span class="material-symbols-outlined" style="color: ${item.status === 'active' ? '#EF4444' : '#15803D'};">
                                ${item.status === 'active' ? 'lock' : 'lock_open'}
                            </span>
                        </button>
                        <button class="btn-action-icon" title="Chỉnh sửa thông tin & CCCD" onclick="editUserAccount('${item.id}')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-action-icon" title="Xóa tài khoản" onclick="deleteUserAccount('${item.id}')">
                            <span class="material-symbols-outlined" style="color: #DC2626;">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// MỞ MODAL THÊM TÀI KHOẢN MỚI HỆ THỐNG
function openAddUserModal() {
    editingUserId = null;
    switchFormTab('tab-personal');

    const modal = document.getElementById('userModalOverlay');
    const modalTitle = document.getElementById('userModalTitleText');
    if (!modal) return;

    if (modalTitle) modalTitle.textContent = 'Thêm Tài Khoản Mới & Phân Quyền Hệ Thống';

    document.getElementById('userNameInput').value = '';
    document.getElementById('userNicknameInput').value = '';
    document.getElementById('userEmailInput').value = '';
    document.getElementById('userPhoneInput').value = '';
    document.getElementById('userPasswordInput').value = 'Yen@2026';
    document.getElementById('userGenderSelect').value = 'Nam';
    document.getElementById('userDobInput').value = '';
    document.getElementById('userCccdInput').value = '';
    document.getElementById('userCccdDateInput').value = '';
    document.getElementById('userCccdPlaceInput').value = '';
    document.getElementById('userAddressInput').value = '';
    document.getElementById('userTaxCodeInput').value = '';
    document.getElementById('userBizCodeInput').value = '';
    document.getElementById('userBankNameSelect').value = 'Vietcombank (VCB)';
    document.getElementById('userBankAccountInput').value = '';
    document.getElementById('userBankHolderInput').value = '';
    document.getElementById('userRoleSelect').value = 'host';
    document.getElementById('userStatusSelect').value = 'active';
    document.getElementById('userKycSelect').value = 'verified';
    document.getElementById('userPermissionSelect').value = 'Đối Tác Kinh Doanh Homestay';

    modal.classList.add('show');
}

// XEM CHI TIẾT TÀI KHOẢN KÈM CCCD & NGÂN HÀNG
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
                    <span style="font-size: 12px; color: #15803D; font-weight: 700; background: #DCFCE7; padding: 2px 8px; border-radius: 99px;">✓ ${user.kycText}</span>
                </div>
            </div>
        </div>

        <!-- Khối ĐỊNH DANH CCCD & LIÊN HỆ -->
        <div style="margin-top: 20px;">
            <h4 style="font-size: 13.5px; font-weight: 800; color: #0284C7; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="font-size: 18px;">badge</span> Thông Tin Định Danh CCCD & Liên Hệ
            </h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div style="background: #F0FDF4; padding: 12px 16px; border-radius: 8px; border: 1px solid #BBF7D0;">
                    <span style="font-size: 11.5px; color: #15803D; font-weight: 700;">SỐ CCCD / CMND ĐỊNH DANH</span>
                    <p style="font-size: 15px; font-weight: 800; color: #14532D; margin-top: 2px; letter-spacing: 0.5px;">🪪 ${user.cccd || 'Chưa cập nhật'}</p>
                    ${user.cccdDate ? `<span style="font-size: 11px; color: #166534;">Ngày cấp: ${user.cccdDate} (${user.cccdPlace || ''})</span>` : ''}
                </div>
                <div style="background: #F8FAFC; padding: 12px 16px; border-radius: 8px; border: 1px solid #E2E8F0;">
                    <span style="font-size: 11.5px; color: var(--text-muted); font-weight: 700;">EMAIL & SỐ ĐIỆN THOẠI</span>
                    <p style="font-size: 13.5px; font-weight: 700; color: var(--text-main); margin-top: 2px;">✉️ ${user.email}</p>
                    <p style="font-size: 13px; font-weight: 700; color: #0284C7; margin-top: 2px;">📞 ${user.phone}</p>
                </div>
            </div>
        </div>

        <!-- Khối PHÁP LÝ & NGÂN HÀNG PAYOUT -->
        <div style="margin-top: 16px;">
            <h4 style="font-size: 13.5px; font-weight: 800; color: #D97706; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                <span class="material-symbols-outlined" style="font-size: 18px;">account_balance</span> Pháp Lý & Tài Khoản Ngân Hàng Nhận Doanh Thu
            </h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div style="background: #FFFBEB; padding: 12px 16px; border-radius: 8px; border: 1px solid #FDE68A;">
                    <span style="font-size: 11.5px; color: #92400E; font-weight: 700;">MÃ SỐ THUẾ & ĐĂNG KÝ KINH DOANH</span>
                    <p style="font-size: 13px; font-weight: 700; color: #78350F; margin-top: 2px;">MST: ${user.taxCode || 'Chưa khai báo'}</p>
                    <p style="font-size: 12px; color: #B45309; margin-top: 2px;">Giấy phép ĐKKD: ${user.bizCode || 'Chưa cấp'}</p>
                </div>
                <div style="background: #EFF6FF; padding: 12px 16px; border-radius: 8px; border: 1px solid #BFDBFE;">
                    <span style="font-size: 11.5px; color: #1E40AF; font-weight: 700;">NGÂN HÀNG PAYOUT LIÊN KẾT</span>
                    <p style="font-size: 13.5px; font-weight: 800; color: #1E3A8A; margin-top: 2px;">🏦 ${user.bankName || 'Chưa liên kết'}</p>
                    <p style="font-size: 13px; font-weight: 700; color: #0284C7; margin-top: 2px;">STK: ${user.bankAccount || '-'} (${user.bankHolder || ''})</p>
                </div>
            </div>
        </div>

        ${user.role === 'host' ? `
            <div style="margin-top: 16px;">
                <h4 style="font-size: 13.5px; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">Danh sách Homestay thuộc quyền sở hữu (${user.homestayCount} căn):</h4>
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
            <div style="margin-top: 16px; background: #FEF2F2; border: 1px solid #FCA5A5; padding: 12px 16px; border-radius: 8px; color: #991B1B;">
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

// XỬ LÝ ĐỔI MẬT KHẨU NHANH
function openResetPasswordModal(id) {
    const user = initialUsers.find(u => u.id === id);
    if (!user) return;

    resetPwdUserId = id;
    document.getElementById('resetPwdTargetUser').textContent = `${user.name} (${user.email})`;
    document.getElementById('quickResetPwdInput').value = 'Yen@2026!Secured';
    document.getElementById('resetPasswordModalOverlay').classList.add('show');
}

function closeResetPasswordModal() {
    resetPwdUserId = null;
    document.getElementById('resetPasswordModalOverlay')?.classList.remove('show');
}

function confirmResetPassword() {
    if (!resetPwdUserId) return;

    const user = initialUsers.find(u => u.id === resetPwdUserId);
    const newPwd = document.getElementById('quickResetPwdInput').value.trim();

    if (!newPwd) {
        alert('Vui lòng nhập mật khẩu mới!');
        return;
    }

    if (user) {
        alert(`Đã đổi mật khẩu thành công cho tài khoản "${user.name}" thành: ${newPwd}`);
    }

    closeResetPasswordModal();
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
    }

    closeLockModal();
    updateUserStatCards();
    renderUserTable();
}

function editUserAccount(id) {
    const user = initialUsers.find(u => u.id === id);
    if (!user) return;

    editingUserId = id;
    switchFormTab('tab-personal');

    const modal = document.getElementById('userModalOverlay');
    const modalTitle = document.getElementById('userModalTitleText');
    if (!modal) return;

    if (modalTitle) modalTitle.textContent = `Chỉnh Sửa CCCD, Mật Khẩu & Thông Tin: ${user.name}`;

    document.getElementById('userNameInput').value = user.name || '';
    document.getElementById('userNicknameInput').value = user.nickname || '';
    document.getElementById('userEmailInput').value = user.email || '';
    document.getElementById('userPhoneInput').value = user.phone || '';
    document.getElementById('userPasswordInput').value = '';
    document.getElementById('userGenderSelect').value = user.gender || 'Nam';
    document.getElementById('userDobInput').value = user.dob || '';
    document.getElementById('userCccdInput').value = user.cccd || '';
    document.getElementById('userCccdDateInput').value = user.cccdDate || '';
    document.getElementById('userCccdPlaceInput').value = user.cccdPlace || '';
    document.getElementById('userAddressInput').value = user.address || '';
    document.getElementById('userTaxCodeInput').value = user.taxCode || '';
    document.getElementById('userBizCodeInput').value = user.bizCode || '';
    document.getElementById('userBankNameSelect').value = user.bankName || 'Vietcombank (VCB)';
    document.getElementById('userBankAccountInput').value = user.bankAccount || '';
    document.getElementById('userBankHolderInput').value = user.bankHolder || '';
    document.getElementById('userRoleSelect').value = user.role || 'host';
    document.getElementById('userStatusSelect').value = user.status || 'active';
    document.getElementById('userKycSelect').value = user.kycStatus || 'verified';
    document.getElementById('userPermissionSelect').value = user.permission || 'Đối Tác Kinh Doanh Homestay';

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
    if (role === 'staff') return 'Nhân viên hỗ trợ';
    return 'Khách lưu trú';
}

function onRoleSelectChange(roleVal) {
    const permSelect = document.getElementById('userPermissionSelect');
    if (!permSelect) return;

    if (roleVal === 'host') {
        permSelect.value = 'Đối Tác Kinh Doanh Homestay';
    } else if (roleVal === 'admin') {
        permSelect.value = 'Toàn Quyền Hệ Thống (Super Admin)';
    } else if (roleVal === 'staff') {
        permSelect.value = 'Quản Lý Kiểm Duyệt & Nội Dung';
    } else {
        permSelect.value = 'Người Dùng Phổ Thông';
    }
}

function saveUserData() {
    const name = document.getElementById('userNameInput').value.trim();
    const nickname = document.getElementById('userNicknameInput').value.trim();
    const email = document.getElementById('userEmailInput').value.trim();
    const phone = document.getElementById('userPhoneInput').value.trim();
    const password = document.getElementById('userPasswordInput').value.trim();
    const gender = document.getElementById('userGenderSelect').value;
    const dob = document.getElementById('userDobInput').value;
    const cccd = document.getElementById('userCccdInput').value.trim();
    const cccdDate = document.getElementById('userCccdDateInput').value.trim();
    const cccdPlace = document.getElementById('userCccdPlaceInput').value.trim();
    const address = document.getElementById('userAddressInput').value.trim();
    const taxCode = document.getElementById('userTaxCodeInput').value.trim();
    const bizCode = document.getElementById('userBizCodeInput').value.trim();
    const bankName = document.getElementById('userBankNameSelect').value;
    const bankAccount = document.getElementById('userBankAccountInput').value.trim();
    const bankHolder = document.getElementById('userBankHolderInput').value.trim();
    const role = document.getElementById('userRoleSelect').value;
    const status = document.getElementById('userStatusSelect').value;
    const kycStatus = document.getElementById('userKycSelect').value;
    const permission = document.getElementById('userPermissionSelect').value;

    if (!name || !email) {
        alert('Vui lòng nhập đầy đủ Họ tên và Địa chỉ Email!');
        return;
    }

    const roleText = getRoleText(role);
    const statusText = status === 'active' ? 'Đang hoạt động' : 'Bị khóa';
    const kycText = kycStatus === 'verified' ? 'Đã xác minh KYC & CCCD' : (kycStatus === 'pending' ? 'Đang chờ duyệt KYC' : 'Chưa KYC');

    if (editingUserId !== null) {
        // Cập nhật người dùng hiện tại
        const user = initialUsers.find(u => u.id === editingUserId);
        if (user) {
            user.name = name;
            user.nickname = nickname || user.nickname;
            user.email = email;
            user.phone = phone || user.phone;
            user.gender = gender;
            user.dob = dob || user.dob;
            user.cccd = cccd || user.cccd;
            user.cccdDate = cccdDate || user.cccdDate;
            user.cccdPlace = cccdPlace || user.cccdPlace;
            user.address = address || user.address;
            user.taxCode = taxCode || user.taxCode;
            user.bizCode = bizCode || user.bizCode;
            user.bankName = bankName;
            user.bankAccount = bankAccount || user.bankAccount;
            user.bankHolder = bankHolder || user.bankHolder;
            user.role = role;
            user.roleText = roleText;
            user.permission = permission;
            user.kycStatus = kycStatus;
            user.kycText = kycText;
            user.status = status;
            user.statusText = statusText;

            if (password) {
                alert(`Đã lưu thông tin và đổi mật khẩu mới cho ${name}!`);
            }
        }
    } else {
        // Thêm tài khoản mới
        const newId = `usr-${Date.now().toString().slice(-4)}`;
        const newUser = {
            id: newId,
            name: name,
            nickname: nickname || name,
            email: email,
            phone: phone || '0900 000 000',
            cccd: cccd || '04809000' + Math.floor(1000 + Math.random() * 9000),
            cccdDate: cccdDate || '01/01/2023',
            cccdPlace: cccdPlace || 'Cục Cảnh sát QLHC về trật tự xã hội',
            dob: dob || '1995-01-01',
            gender: gender,
            address: address || 'Đà Nẵng',
            taxCode: taxCode || '',
            bizCode: bizCode || '',
            bankName: bankName,
            bankAccount: bankAccount || '',
            bankHolder: bankHolder || name.toUpperCase(),
            role: role,
            roleText: roleText,
            permission: permission,
            kycStatus: kycStatus,
            kycText: kycText,
            homestays: role === 'host' ? ['Homestay Mới Tạo'] : [],
            homestayCount: role === 'host' ? 1 : 0,
            bookingsCount: 0,
            joinDate: 'Hôm nay',
            lastLogin: 'Mới tạo',
            status: status,
            statusText: statusText,
            lockReason: '',
            avatarBg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)'
        };

        initialUsers.unshift(newUser);
        alert(`Đã thêm thành công tài khoản mới: "${name}" (${email})!`);
    }

    closeUserModal();
    updateUserStatCards();
    renderUserTable();
}

function deleteUserAccount(id) {
    const user = initialUsers.find(u => u.id === id);
    if (!user) return;

    if (confirm(`Bạn có chắc chắn muốn XÓA vĩnh viễn tài khoản "${user.name}" (${user.email}) khỏi hệ thống?`)) {
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
