/**
 * ==========================================================================
 * YÊN HOMESTAY ADMIN - ACCOUNT EDIT & DETAIL LOGIC JS
 * File: opencms-core-master/.../admin/JS/account_edit.js
 * Chức năng: Đọc, hiển thị và lưu thông tin chi tiết đầy đủ của tài khoản
 * ==========================================================================
 */

const STORAGE_KEY = 'yen_admin_users';

// Dữ liệu mẫu ban đầu giàu thông tin (đồng bộ và đầy đủ như trang tài khoản cá nhân)
const defaultUsers = [
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

let currentUser = null;
let currentUserId = null;

// Lấy danh sách tài khoản từ localStorage
function getAllUsers() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return defaultUsers;
    }
}

// Lưu danh sách tài khoản vào localStorage
function saveAllUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', () => {
    initDateDropdowns();
    loadUserFromParams();
    setupFileInput();
});

// Sinh các option cho dropdown Ngày / Tháng / Năm sinh
function initDateDropdowns() {
    const daySelect = document.getElementById('editDobDay');
    const monthSelect = document.getElementById('editDobMonth');
    const yearSelect = document.getElementById('editDobYear');

    if (daySelect) {
        daySelect.innerHTML = '<option value="">Ngày</option>' + 
            Array.from({ length: 31 }, (_, i) => {
                const d = String(i + 1).padStart(2, '0');
                return `<option value="${d}">${d}</option>`;
            }).join('');
    }

    if (monthSelect) {
        monthSelect.innerHTML = '<option value="">Tháng</option>' + 
            Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, '0');
                return `<option value="${m}">Tháng ${m}</option>`;
            }).join('');
    }

    if (yearSelect) {
        yearSelect.innerHTML = '<option value="">Năm</option>' + 
            Array.from({ length: 70 }, (_, i) => {
                const y = 2015 - i;
                return `<option value="${y}">${y}</option>`;
            }).join('');
    }
}

// Đọc tham số userId từ URL và đổ dữ liệu
function loadUserFromParams() {
    const params = new URLSearchParams(window.location.search);
    currentUserId = params.get('id') || 'usr-1';

    const users = getAllUsers();
    currentUser = users.find(u => u.id === currentUserId);

    if (!currentUser && currentUserId !== 'new') {
        currentUser = users[0];
        currentUserId = currentUser.id;
    }

    if (currentUserId === 'new') {
        setupNewUserForm();
    } else {
        populateUserForm(currentUser);
    }
}

// Điền toàn bộ thông tin chi tiết vào form
function populateUserForm(user) {
    // 1. Tiêu đề & Breadcrumb
    const headerTitle = document.getElementById('headerUserNameTitle');
    const breadcrumbName = document.getElementById('breadcrumbUserName');
    if (headerTitle) headerTitle.textContent = `${user.name} (${user.id})`;
    if (breadcrumbName) breadcrumbName.textContent = `Chỉnh sửa: ${user.name}`;

    // 2. Cột trái: Tóm tắt
    document.getElementById('displayFullName').textContent = user.name;
    document.getElementById('displayNickname').textContent = user.nickname ? `@${user.nickname}` : `@${user.id}`;
    document.getElementById('tierBadgeText').textContent = user.memberTier || user.roleText;
    document.getElementById('metaUserId').textContent = user.id;
    document.getElementById('metaJoinDate').textContent = user.joinDate || '01/01/2025';
    document.getElementById('metaLastLogin').textContent = user.lastLogin || 'Gần đây';

    const statusBadgeEl = document.getElementById('metaStatusBadge');
    if (statusBadgeEl) {
        statusBadgeEl.innerHTML = `<span class="user-status-badge ${user.status}">${user.statusText || (user.status === 'active' ? 'Đang hoạt động' : 'Bị khóa')}</span>`;
    }

    // Avatar preview
    renderAvatarPreview(user.avatar, user.name);

    // KYC Check
    document.getElementById('kycPhoneSub').textContent = user.phone || 'Chưa cung cấp';
    document.getElementById('kycEmailSub').textContent = user.email || 'Chưa cung cấp';
    document.getElementById('kycCccdSub').textContent = user.cccd || 'Chưa cung cấp';

    document.getElementById('kycPhoneStatus').innerHTML = user.phoneVerified ? 
        '<span class="verified-pill">✓ Đã xác minh</span>' : '<span class="unverified-pill">⚠️ Chưa xác minh</span>';
    document.getElementById('kycEmailStatus').innerHTML = user.emailVerified ? 
        '<span class="verified-pill">✓ Đã xác minh</span>' : '<span class="unverified-pill">⚠️ Chưa xác minh</span>';
    document.getElementById('kycCccdStatus').innerHTML = user.kycStatus === 'verified' ? 
        '<span class="verified-pill">✓ Đã xác thực KYC</span>' : '<span class="unverified-pill">⚠️ Chưa KYC</span>';

    document.getElementById('editAdminNotes').value = user.adminNotes || '';

    // 3. Cột phải: Form thông tin cá nhân
    document.getElementById('editFullName').value = user.name || '';
    document.getElementById('editNickname').value = user.nickname || '';
    document.getElementById('editCccd').value = user.cccd || '';
    document.getElementById('editNationality').value = user.nationality || 'Việt Nam';

    if (user.dobDay) document.getElementById('editDobDay').value = String(user.dobDay).padStart(2, '0');
    if (user.dobMonth) document.getElementById('editDobMonth').value = String(user.dobMonth).padStart(2, '0');
    if (user.dobYear) document.getElementById('editDobYear').value = String(user.dobYear);

    if (user.gender) {
        const genderRadio = document.querySelector(`input[name="editGender"][value="${user.gender}"]`);
        if (genderRadio) genderRadio.checked = true;
    }

    document.getElementById('editAvatarUrl').value = user.avatar || '';

    // Địa chỉ
    document.getElementById('editStreet').value = user.street || '';
    document.getElementById('editProvince').value = user.province || '';
    document.getElementById('editWard').value = user.ward || '';

    // Liên hệ & Xác thực
    document.getElementById('editEmail').value = user.email || '';
    document.getElementById('editEmailVerified').checked = !!user.emailVerified;
    document.getElementById('editPhone').value = user.phone || '';
    document.getElementById('editPhoneVerified').checked = !!user.phoneVerified;
    document.getElementById('editKycStatus').value = user.kycStatus || 'verified';

    // Thuế & ĐKKD
    document.getElementById('editTaxCode').value = user.taxCode || '';
    document.getElementById('editBizCode').value = user.bizCode || '';
    
    const homestays = user.homestays || [];
    document.getElementById('editHomestaysInput').value = homestays.join(', ');
    renderHomestayChips(homestays);

    // Phân quyền & Trạng thái
    document.getElementById('editRoleSelect').value = user.role || 'guest';
    document.getElementById('editPermission').value = user.permission || '';
    document.getElementById('editStatusSelect').value = user.status || 'active';
    document.getElementById('editMemberTier').value = user.memberTier || '';

    handleStatusChange();
}

function setupNewUserForm() {
    const headerTitle = document.getElementById('headerUserNameTitle');
    const breadcrumbName = document.getElementById('breadcrumbUserName');
    if (headerTitle) headerTitle.textContent = 'Thêm Tài Khoản Mới';
    if (breadcrumbName) breadcrumbName.textContent = 'Thêm mới tài khoản';

    document.getElementById('displayFullName').textContent = 'Tài Khoản Mới';
    document.getElementById('displayNickname').textContent = '@new_account';
    document.getElementById('tierBadgeText').textContent = 'Thành viên mới';
    document.getElementById('metaUserId').textContent = 'usr-' + Date.now().toString().slice(-4);
    document.getElementById('metaJoinDate').textContent = 'Hôm nay';
    document.getElementById('metaLastLogin').textContent = 'Chưa đăng nhập';

    renderAvatarPreview('', 'T');

    document.getElementById('editNationality').value = 'Việt Nam';
    document.getElementById('editRoleSelect').value = 'guest';
    document.getElementById('editPermission').value = 'Người Dùng Phổ Thông';
    document.getElementById('editStatusSelect').value = 'active';
}

function renderAvatarPreview(url, name) {
    const imgEl = document.getElementById('editAvatarImg');
    const fallbackEl = document.getElementById('editAvatarFallback');

    if (url && url.trim().length > 0) {
        imgEl.src = url;
        imgEl.style.display = 'block';
        fallbackEl.style.display = 'none';
    } else {
        imgEl.style.display = 'none';
        fallbackEl.style.display = 'flex';
        fallbackEl.textContent = (name || 'A').charAt(0).toUpperCase();
    }
}

function handleAvatarUrlChange() {
    const url = document.getElementById('editAvatarUrl').value.trim();
    const name = document.getElementById('editFullName').value.trim();
    renderAvatarPreview(url, name);
}

function triggerAvatarUpload() {
    document.getElementById('editAvatarFileInput').click();
}

function setupFileInput() {
    const fileInput = document.getElementById('editAvatarFileInput');
    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                const dataUrl = evt.target.result;
                document.getElementById('editAvatarUrl').value = dataUrl;
                renderAvatarPreview(dataUrl, document.getElementById('editFullName').value);
            };
            reader.readAsDataURL(file);
        }
    });

    const homestayInput = document.getElementById('editHomestaysInput');
    if (homestayInput) {
        homestayInput.addEventListener('input', () => {
            const list = homestayInput.value.split(',').map(s => s.trim()).filter(Boolean);
            renderHomestayChips(list);
        });
    }
}

function renderHomestayChips(list) {
    const chipContainer = document.getElementById('editHomestayChipList');
    if (!chipContainer) return;

    if (!list || list.length === 0) {
        chipContainer.innerHTML = '<span style="font-size: 12px; color: var(--text-muted); font-style: italic;">Chưa có Homestay liên kết</span>';
        return;
    }

    chipContainer.innerHTML = list.map(h => `
        <span class="homestay-chip">
            <span class="material-symbols-outlined" style="font-size: 16px;">cottage</span>
            ${h}
        </span>
    `).join('');
}

function handleStatusChange() {
    const status = document.getElementById('editStatusSelect').value;
    const lockGroup = document.getElementById('lockReasonGroup');
    if (!lockGroup) return;

    if (status === 'blocked') {
        lockGroup.style.display = 'block';
        if (currentUser && currentUser.lockReason) {
            document.getElementById('editLockReason').value = currentUser.lockReason;
        }
    } else {
        lockGroup.style.display = 'none';
    }
}

function handleRoleChange() {
    const role = document.getElementById('editRoleSelect').value;
    const permissionInput = document.getElementById('editPermission');
    const tierInput = document.getElementById('editMemberTier');

    if (role === 'host') {
        if (!permissionInput.value || permissionInput.value === 'Người Dùng Phổ Thông') {
            permissionInput.value = 'Đối Tác Kinh Doanh';
        }
        if (!tierInput.value || tierInput.value === 'Thành viên thân thiết') {
            tierInput.value = 'Host Uy Tín (SuperHost)';
        }
    } else if (role === 'admin') {
        permissionInput.value = 'Toàn Quyền Quản Trị Hệ Thống (Super Admin)';
        tierInput.value = 'Quản Trị Viên Cấp Cao';
    } else {
        permissionInput.value = 'Người Dùng Phổ Thông';
        tierInput.value = 'Thành viên thân thiết';
    }
}

function handleProvinceChange() {
    // Có thể bổ sung tự động lọc xã/phường nếu cần
}

// Lưu toàn bộ dữ liệu người dùng
function saveUserEditForm() {
    const fullName = document.getElementById('editFullName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const cccd = document.getElementById('editCccd').value.trim();

    if (!fullName) {
        alert('Vui lòng nhập Họ và Tên!');
        document.getElementById('editFullName').focus();
        return;
    }

    if (!email) {
        alert('Vui lòng nhập Địa chỉ Email!');
        document.getElementById('editEmail').focus();
        return;
    }

    const nickname = document.getElementById('editNickname').value.trim();
    const nationality = document.getElementById('editNationality').value;
    const dobDay = document.getElementById('editDobDay').value;
    const dobMonth = document.getElementById('editDobMonth').value;
    const dobYear = document.getElementById('editDobYear').value;
    const gender = document.querySelector('input[name="editGender"]:checked')?.value || 'nam';
    const avatar = document.getElementById('editAvatarUrl').value.trim();

    const street = document.getElementById('editStreet').value.trim();
    const province = document.getElementById('editProvince').value;
    const ward = document.getElementById('editWard').value.trim();

    const emailVerified = document.getElementById('editEmailVerified').checked;
    const phoneVerified = document.getElementById('editPhoneVerified').checked;
    const kycStatus = document.getElementById('editKycStatus').value;

    const taxCode = document.getElementById('editTaxCode').value.trim();
    const bizCode = document.getElementById('editBizCode').value.trim();
    const homestaysRaw = document.getElementById('editHomestaysInput').value.trim();
    const homestays = homestaysRaw ? homestaysRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

    const role = document.getElementById('editRoleSelect').value;
    const permission = document.getElementById('editPermission').value.trim();
    const status = document.getElementById('editStatusSelect').value;
    const memberTier = document.getElementById('editMemberTier').value.trim();
    const lockReason = status === 'blocked' ? (document.getElementById('editLockReason').value.trim() || 'Tài khoản bị khóa bởi Quản trị viên') : '';
    const adminNotes = document.getElementById('editAdminNotes').value.trim();

    let roleText = 'Khách lưu trú';
    if (role === 'host') roleText = 'Chủ Homestay (Owner)';
    if (role === 'admin') roleText = 'System Admin';

    let kycText = 'Đã xác minh KYC';
    if (kycStatus === 'pending') kycText = 'Chờ duyệt KYC';
    if (kycStatus === 'unverified') kycText = 'Chưa KYC';

    const users = getAllUsers();

    if (currentUserId === 'new') {
        const newId = 'usr-' + Date.now().toString().slice(-4);
        const newUser = {
            id: newId,
            name: fullName,
            nickname: nickname,
            avatar: avatar,
            email: email,
            emailVerified: emailVerified,
            phone: phone,
            phoneVerified: phoneVerified,
            cccd: cccd,
            dobDay: dobDay,
            dobMonth: dobMonth,
            dobYear: dobYear,
            dob: dobDay && dobMonth && dobYear ? `${dobDay}/${dobMonth}/${dobYear}` : '',
            gender: gender,
            nationality: nationality,
            street: street,
            province: province,
            ward: ward,
            taxCode: taxCode,
            bizCode: bizCode,
            role: role,
            roleText: roleText,
            permission: permission || 'Người Dùng Phổ Thông',
            kycStatus: kycStatus,
            kycText: kycText,
            homestays: homestays,
            homestayCount: homestays.length,
            bookingsCount: 0,
            joinDate: 'Hôm nay',
            lastLogin: 'Chưa đăng nhập',
            status: status,
            statusText: status === 'active' ? 'Đang hoạt động' : 'Bị khóa',
            lockReason: lockReason,
            memberTier: memberTier || roleText,
            adminNotes: adminNotes,
            avatarBg: 'linear-gradient(135deg, #15803D 0%, #166534 100%)'
        };
        users.unshift(newUser);
    } else {
        const idx = users.findIndex(u => u.id === currentUserId);
        if (idx !== -1) {
            users[idx] = Object.assign({}, users[idx], {
                name: fullName,
                nickname: nickname,
                avatar: avatar,
                email: email,
                emailVerified: emailVerified,
                phone: phone,
                phoneVerified: phoneVerified,
                cccd: cccd,
                dobDay: dobDay,
                dobMonth: dobMonth,
                dobYear: dobYear,
                dob: dobDay && dobMonth && dobYear ? `${dobDay}/${dobMonth}/${dobYear}` : users[idx].dob,
                gender: gender,
                nationality: nationality,
                street: street,
                province: province,
                ward: ward,
                taxCode: taxCode,
                bizCode: bizCode,
                role: role,
                roleText: roleText,
                permission: permission || users[idx].permission,
                kycStatus: kycStatus,
                kycText: kycText,
                homestays: homestays,
                homestayCount: homestays.length,
                status: status,
                statusText: status === 'active' ? 'Đang hoạt động' : 'Bị khóa',
                lockReason: lockReason,
                memberTier: memberTier || users[idx].memberTier,
                adminNotes: adminNotes
            });
        }
    }

    saveAllUsers(users);

    // Hiển thị Toast thông báo thành công
    showToast('✓ Cập nhật thông tin tài khoản thành công!');

    // Tự động chuyển hướng về trang danh sách sau 1.2s
    setTimeout(() => {
        window.location.href = 'account_management.html';
    }, 1200);
}

function showToast(msg) {
    const toast = document.getElementById('adminToast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
        toastMsg.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}
