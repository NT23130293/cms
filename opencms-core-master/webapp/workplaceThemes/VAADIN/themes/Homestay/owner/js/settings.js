document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. TIỆN ÍCH CHUNG
    // ==========================================

    const $ = (selector, scope) =>
        (scope || document).querySelector(selector);

    const $$ = (selector, scope) =>
        Array.from((scope || document).querySelectorAll(selector));

    const escapeHtml = text =>
        String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

    function initials(name) {
        return String(name || '')
            .trim()
            .split(/\s+/)
            .slice(-2)
            .map(part => part.charAt(0).toUpperCase())
            .join('');
    }

    function timeAgo(minutesAgo) {
        if (minutesAgo < 60) return minutesAgo + ' phút trước';
        const hours = Math.floor(minutesAgo / 60);
        if (hours < 24) return hours + ' giờ trước';
        const days = Math.floor(hours / 24);
        return days + ' ngày trước';
    }


    // ==========================================
    // 0.1 TOAST THÔNG BÁO
    // ==========================================

    const toastBox = document.createElement('div');
    toastBox.className = 'room-toast-box';
    document.body.appendChild(toastBox);

    function showToast(message, type) {

        const toast = document.createElement('div');
        toast.className = 'room-toast room-toast-' + (type || 'success');

        toast.innerHTML =
            '<span class="material-symbols-outlined text-[18px]">' +
            (type === 'error' ? 'error' : 'check_circle') +
            '</span><span>' + escapeHtml(message) + '</span>';

        toastBox.appendChild(toast);

        setTimeout(() => toast.classList.add('is-show'), 10);

        setTimeout(() => {
            toast.classList.remove('is-show');
            setTimeout(() => toast.remove(), 250);
        }, 2800);
    }


    // ==========================================
    // 0.2 QUẢN LÝ MODAL CHUNG
    // ==========================================

    const openedModals = [];

    function openModal(modal) {

        if (!modal) return;

        modal.removeAttribute('hidden');
        document.body.classList.add('modal-open');

        requestAnimationFrame(() => modal.classList.add('is-open'));

        if (openedModals.indexOf(modal) === -1) {
            openedModals.push(modal);
        }
    }

    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove('is-open');

        setTimeout(() => {
            modal.setAttribute('hidden', '');

            const index = openedModals.indexOf(modal);
            if (index > -1) openedModals.splice(index, 1);

            if (!openedModals.length) {
                document.body.classList.remove('modal-open');
            }
        }, 200);
    }

    $$('[data-close-modal]').forEach(button => {
        button.addEventListener('click', () => {
            closeModal(document.getElementById(button.dataset.closeModal));
        });
    });

    $$('.room-modal').forEach(modal => {
        modal.addEventListener('click', event => {
            if (event.target === modal) closeModal(modal);
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && openedModals.length) {
            closeModal(openedModals[openedModals.length - 1]);
        }
    });


    // ==========================================
    // 1. CHUYỂN MỤC CÀI ĐẶT (TABS)
    // ==========================================

    const settingsTabs = $$('.settings-tab');
    const sections = {
        account: $('#section-account'),
        bank: $('#section-bank'),
        notification: $('#section-notification')
    };

    settingsTabs.forEach(tab => {
        tab.addEventListener('click', () => {

            settingsTabs.forEach(item => item.setAttribute('aria-pressed', 'false'));
            tab.setAttribute('aria-pressed', 'true');

            const target = tab.dataset.tab;

            Object.keys(sections).forEach(key => {
                if (!sections[key]) return;
                sections[key].hidden = key !== target;
            });

            sections[target] && sections[target].scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });


    // ==========================================
    // 2. MỤC TÀI KHOẢN CỦA TÔI
    // ==========================================

    const accountForm = $('#accountForm');
    const accFullName = $('#accFullName');
    const accEmail = $('#accEmail');
    const accountAvatarPreview = $('#accountAvatarPreview');
    const accountAvatarInput = $('#accountAvatarInput');
    const accountPreviewName = $('#accountPreviewName');
    const accountPreviewEmail = $('#accountPreviewEmail');
    const settingsAvatarBadge = $('#settingsAvatarBadge');
    const settingsHeaderName = $('#settingsHeaderName');

    function syncAccountPreview() {

        const name = accFullName.value.trim() || 'Chưa đặt tên';
        const email = accEmail.value.trim();

        accountPreviewName.textContent = name;
        accountPreviewEmail.textContent = email;
        settingsHeaderName.textContent = name;

        const letters = initials(name) || 'NH';
        settingsAvatarBadge.textContent = letters;

        if (!accountAvatarPreview.querySelector('img')) {
            accountAvatarPreview.innerHTML = '<span>' + escapeHtml(letters) + '</span>';
        }
    }

    if (accFullName) accFullName.addEventListener('input', syncAccountPreview);
    if (accEmail) accEmail.addEventListener('input', syncAccountPreview);

    if (accountAvatarInput) {

        accountAvatarInput.addEventListener('change', () => {

            const file = accountAvatarInput.files && accountAvatarInput.files[0];

            if (!file) return;

            if (!file.type.startsWith('image/')) {
                showToast('Tệp đã chọn không phải là ảnh.', 'error');
                return;
            }

            const url = URL.createObjectURL(file);
            accountAvatarPreview.innerHTML = '<img src="' + url + '" alt="Ảnh đại diện">';

            showToast('Đã cập nhật ảnh đại diện.');
        });
    }

    if (accountForm) {

        accountForm.addEventListener('submit', event => {

            event.preventDefault();

            const payload = {
                fullName: accFullName.value.trim(),
                phone: $('#accPhone').value.trim(),
                email: accEmail.value.trim(),
                birthday: $('#accBirthday').value,
                address: $('#accAddress').value.trim()
            };

            console.log('Cập nhật tài khoản:', payload);

            /*
             * Kết nối backend tại đây, ví dụ:
             * fetch('/api/account', { method: 'PUT', body: JSON.stringify(payload) });
             */

            showToast('Đã lưu thông tin tài khoản.');
        });
    }

    const passwordForm = $('#passwordForm');

    if (passwordForm) {

        passwordForm.addEventListener('submit', event => {

            event.preventDefault();

            const current = $('#passCurrent').value;
            const next = $('#passNew').value;
            const confirm = $('#passConfirm').value;

            if (!current) {
                showToast('Hãy nhập mật khẩu hiện tại.', 'error');
                return;
            }

            if (next.length < 8) {
                showToast('Mật khẩu mới phải có tối thiểu 8 ký tự.', 'error');
                return;
            }

            if (next !== confirm) {
                showToast('Mật khẩu xác nhận không khớp.', 'error');
                return;
            }

            console.log('Đổi mật khẩu:', { current, next });

            passwordForm.reset();
            showToast('Đã cập nhật mật khẩu mới.');
        });
    }


    // ==========================================
    // 3. MỤC LIÊN KẾT NGÂN HÀNG
    // ==========================================

    let bankAccounts = [
        {
            id: 'bank-1',
            bankName: 'Vietcombank',
            accountNumber: '0123456789',
            accountName: 'NGUYEN HOA',
            branch: 'Chi nhánh Hòa Bình',
            isDefault: true,
            verified: true
        },
        {
            id: 'bank-2',
            bankName: 'MB Bank',
            accountNumber: '9988776655',
            accountName: 'NGUYEN HOA',
            branch: 'Chi nhánh Mai Châu',
            isDefault: false,
            verified: false
        }
    ];

    const bankList = $('#bankList');
    const tabBankCount = $('#tabBankCount');

    function maskAccountNumber(number) {
        const value = String(number);
        if (value.length <= 4) return value;
        return value.slice(0, 2) + ' •••• ' + value.slice(-4);
    }

    function renderBankList() {

        if (!bankList) return;

        tabBankCount.textContent = bankAccounts.length;

        if (!bankAccounts.length) {
            bankList.innerHTML =
                '<div class="noti-empty" style="grid-column:1/-1;">Chưa có tài khoản ngân hàng nào được liên kết.</div>';
            return;
        }

        bankList.innerHTML = bankAccounts.map(account => `
            <div class="bank-card ${account.isDefault ? 'is-default' : ''}" data-bank-id="${account.id}">
                <div class="bank-card-top">
                    <div class="bank-card-brand">
                        <div class="bank-card-icon">
                            <span class="material-symbols-outlined text-[22px]">account_balance</span>
                        </div>
                        <div class="min-w-0">
                            <div class="bank-card-name">${escapeHtml(account.bankName)}</div>
                            <div class="bank-card-sub">${escapeHtml(account.branch || 'Chưa cập nhật chi nhánh')}</div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="bank-card-number">${escapeHtml(maskAccountNumber(account.accountNumber))}</span>
                    <span class="bank-card-holder">${escapeHtml(account.accountName)}</span>
                </div>

                <div class="bank-card-badges">
                    ${account.isDefault ? '<span class="bank-badge bank-badge-default">Mặc định</span>' : ''}
                    ${account.verified
            ? '<span class="bank-badge bank-badge-verified">Đã xác thực</span>'
            : '<span class="bank-badge bank-badge-pending">Chờ xác thực</span>'}
                </div>

                <div class="bank-card-actions">
                    ${account.isDefault
            ? ''
            : `<button type="button" class="room-btn room-btn-ghost btn-set-default-bank" data-bank-id="${account.id}">
                               <span class="material-symbols-outlined text-[15px]">star</span>
                               Đặt mặc định
                           </button>`}
                    <button type="button" class="room-btn room-btn-ghost btn-remove-bank" data-bank-id="${account.id}">
                        <span class="material-symbols-outlined text-[15px]">link_off</span>
                        Gỡ liên kết
                    </button>
                </div>
            </div>
        `).join('');

        $$('.btn-set-default-bank', bankList).forEach(button => {
            button.addEventListener('click', () => setDefaultBank(button.dataset.bankId));
        });

        $$('.btn-remove-bank', bankList).forEach(button => {
            button.addEventListener('click', () => openRemoveBankModal(button.dataset.bankId));
        });
    }

    function setDefaultBank(bankId) {

        bankAccounts = bankAccounts.map(account => ({
            ...account,
            isDefault: account.id === bankId
        }));

        renderBankList();

        const target = bankAccounts.find(item => item.id === bankId);
        showToast('Đã đặt ' + (target ? target.bankName : 'tài khoản') + ' làm tài khoản nhận tiền mặc định.');
    }

    // --- Popup liên kết ngân hàng mới ---

    const bankModal = $('#bankModal');
    const bankForm = $('#bankForm');
    const btnAddBank = $('#btnAddBank');
    const btnCloseBankModal = $('#btnCloseBankModal');
    const btnCancelBank = $('#btnCancelBank');

    function openAddBankModal() {
        bankForm.reset();
        openModal(bankModal);
    }

    if (btnAddBank) btnAddBank.addEventListener('click', openAddBankModal);
    if (btnCloseBankModal) btnCloseBankModal.addEventListener('click', () => closeModal(bankModal));
    if (btnCancelBank) btnCancelBank.addEventListener('click', () => closeModal(bankModal));

    if (bankForm) {

        bankForm.addEventListener('submit', event => {

            event.preventDefault();

            const bankName = $('#bankSelect').value.trim();
            const accountNumber = $('#bankAccountNumber').value.trim();
            const accountName = $('#bankAccountName').value.trim().toUpperCase();
            const branch = $('#bankBranch').value.trim();
            const setDefault = $('#bankSetDefault').checked;

            if (!/^[0-9]{6,20}$/.test(accountNumber)) {
                showToast('Số tài khoản không hợp lệ (chỉ gồm chữ số).', 'error');
                return;
            }

            const newAccount = {
                id: 'bank-' + Date.now(),
                bankName,
                accountNumber,
                accountName,
                branch,
                isDefault: setDefault || !bankAccounts.length,
                verified: false
            };

            if (newAccount.isDefault) {
                bankAccounts = bankAccounts.map(account => ({ ...account, isDefault: false }));
            }

            bankAccounts.push(newAccount);

            console.log('Liên kết ngân hàng mới:', newAccount);

            renderBankList();
            closeModal(bankModal);

            showToast('Đã gửi yêu cầu liên kết ' + bankName + '. Tài khoản sẽ được xác thực trong ít phút.');
        });
    }

    // --- Popup gỡ liên kết ngân hàng ---

    const bankRemoveModal = $('#bankRemoveModal');
    const bankRemoveSubtitle = $('#bankRemoveSubtitle');
    const btnConfirmRemoveBank = $('#btnConfirmRemoveBank');

    let bankToRemove = null;

    function openRemoveBankModal(bankId) {

        bankToRemove = bankAccounts.find(item => item.id === bankId) || null;

        if (!bankToRemove) return;

        bankRemoveSubtitle.textContent =
            'Gỡ ' + bankToRemove.bankName + ' • ' + maskAccountNumber(bankToRemove.accountNumber) + '?';

        openModal(bankRemoveModal);
    }

    if (btnConfirmRemoveBank) {

        btnConfirmRemoveBank.addEventListener('click', () => {

            if (!bankToRemove) return;

            const wasDefault = bankToRemove.isDefault;

            bankAccounts = bankAccounts.filter(item => item.id !== bankToRemove.id);

            if (wasDefault && bankAccounts.length) {
                bankAccounts[0].isDefault = true;
            }

            console.log('Gỡ liên kết ngân hàng:', bankToRemove.id);

            showToast('Đã gỡ liên kết ' + bankToRemove.bankName + '.');

            bankToRemove = null;
            renderBankList();
            closeModal(bankRemoveModal);
        });
    }

    renderBankList();


    // ==========================================
    // 4. MỤC DANH SÁCH THÔNG BÁO NHẬN ĐƯỢC
    // ==========================================

    let notifications = [
        {
            id: 'noti-1',
            category: 'booking',
            icon: 'event_available',
            title: 'Đặt phòng mới • Mountain View 201',
            message: 'Nguyễn Thị Mai vừa đặt phòng cho 17/09 → 20/09 và đã cọc 50%.',
            minutesAgo: 12,
            unread: true
        },
        {
            id: 'noti-2',
            category: 'payment',
            icon: 'payments',
            title: 'Thanh toán thành công',
            message: 'Đã nhận 600.000₫ tiền cọc từ khách Lê Văn Hiếu qua Vietcombank.',
            minutesAgo: 48,
            unread: true
        },
        {
            id: 'noti-3',
            category: 'system',
            icon: 'build',
            title: 'Nhắc lịch bảo trì',
            message: 'Nhà Sàn Gỗ Lớn đang trong thời gian bảo trì điện & quạt trần đến 19/09.',
            minutesAgo: 130,
            unread: true
        },
        {
            id: 'noti-4',
            category: 'booking',
            icon: 'cancel',
            title: 'Khách hủy đặt phòng',
            message: 'Một lượt đặt phòng Dorm Bản Đạo đã bị hủy do khách đổi lịch trình.',
            minutesAgo: 620,
            unread: false
        },
        {
            id: 'noti-5',
            category: 'system',
            icon: 'campaign',
            title: 'Cập nhật chính sách hoa hồng',
            message: 'Chính sách hoa hồng kênh OTA sẽ điều chỉnh từ ngày 01/10.',
            minutesAgo: 1600,
            unread: false
        }
    ];

    const notificationList = $('#notificationList');
    const tabNotiCount = $('#tabNotiCount');
    const notiFilterTabs = $$('.noti-filter-tab');
    let currentNotiFilter = 'all';

    function updateNotiBadge() {

        const unreadCount = notifications.filter(item => item.unread).length;

        tabNotiCount.textContent = unreadCount;
        tabNotiCount.style.display = unreadCount ? '' : 'none';
    }

    function renderNotificationList() {

        if (!notificationList) return;

        const filtered = notifications.filter(item => {
            if (currentNotiFilter === 'all') return true;
            if (currentNotiFilter === 'unread') return item.unread;
            return item.category === currentNotiFilter;
        });

        if (!filtered.length) {
            notificationList.innerHTML = '<div class="noti-empty">Không có thông báo phù hợp.</div>';
            updateNotiBadge();
            return;
        }

        notificationList.innerHTML = filtered.map(item => `
            <div class="noti-item ${item.unread ? 'is-unread' : ''}" data-noti-id="${item.id}">
                <div class="noti-icon">
                    <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
                </div>
                <div class="noti-body">
                    <span class="noti-title">
                        ${item.unread ? '<span class="noti-dot"></span>' : ''}
                        ${escapeHtml(item.title)}
                    </span>
                    <span class="noti-message">${escapeHtml(item.message)}</span>
                    <span class="noti-time">${timeAgo(item.minutesAgo)}</span>
                </div>
            </div>
        `).join('');

        $$('.noti-item', notificationList).forEach(el => {
            el.addEventListener('click', () => markNotificationRead(el.dataset.notiId));
        });

        updateNotiBadge();
    }

    function markNotificationRead(notiId) {

        const target = notifications.find(item => item.id === notiId);

        if (!target || !target.unread) return;

        target.unread = false;
        renderNotificationList();
    }

    notiFilterTabs.forEach(tab => {
        tab.addEventListener('click', () => {

            notiFilterTabs.forEach(item => item.setAttribute('aria-pressed', 'false'));
            tab.setAttribute('aria-pressed', 'true');

            currentNotiFilter = tab.dataset.notiFilter || 'all';
            renderNotificationList();
        });
    });

    const btnMarkAllRead = $('#btnMarkAllRead');

    if (btnMarkAllRead) {

        btnMarkAllRead.addEventListener('click', () => {

            notifications.forEach(item => { item.unread = false; });

            renderNotificationList();
            showToast('Đã đánh dấu tất cả thông báo là đã đọc.');
        });
    }

    renderNotificationList();


    // ------------------------------------------
    // 4.1 KÊNH NHẬN THÔNG BÁO
    // ------------------------------------------

    const notiSettingsData = [
        {
            id: 'booking',
            label: 'Đặt phòng & hủy phòng',
            desc: 'Khi có đặt phòng mới, đổi phòng hoặc huỷ phòng.',
            email: true,
            sms: true,
            push: true
        },
        {
            id: 'payment',
            label: 'Thanh toán & hoàn tiền',
            desc: 'Khi nhận cọc, thanh toán hoặc xử lý hoàn tiền.',
            email: true,
            sms: true,
            push: true
        },
        {
            id: 'promotion',
            label: 'Khuyến mãi & tiếp thị',
            desc: 'Gợi ý chương trình ưu đãi để tăng tỉ lệ lấp đầy phòng.',
            email: true,
            sms: false,
            push: false
        },
        {
            id: 'system',
            label: 'Hệ thống & bảo trì',
            desc: 'Nhắc lịch bảo trì, thay đổi chính sách nền tảng.',
            email: true,
            sms: false,
            push: true
        }
    ];

    const notiSettingsList = $('#notiSettingsList');

    function renderNotiSettings() {

        if (!notiSettingsList) return;

        notiSettingsList.innerHTML = notiSettingsData.map(item => `
            <div class="noti-setting-row">
                <div class="noti-setting-info">
                    <span class="noti-setting-label">${escapeHtml(item.label)}</span>
                    <span class="noti-setting-desc">${escapeHtml(item.desc)}</span>
                </div>
                <div class="flex items-center gap-space-sm">
                    <label class="settings-switch" title="Email">
                        <input type="checkbox" data-noti-id="${item.id}" data-channel="email" ${item.email ? 'checked' : ''}>
                        <span class="settings-switch-track"></span>
                    </label>
                </div>
            </div>
        `).join('');

        $$('input[type="checkbox"]', notiSettingsList).forEach(input => {
            input.addEventListener('change', () => {
                const target = notiSettingsData.find(item => item.id === input.dataset.notiId);
                if (target) target[input.dataset.channel] = input.checked;
            });
        });
    }

    renderNotiSettings();

    const btnSaveNotiSettings = $('#btnSaveNotiSettings');

    if (btnSaveNotiSettings) {

        btnSaveNotiSettings.addEventListener('click', () => {

            console.log('Lưu tuỳ chọn kênh nhận thông báo:', notiSettingsData);

            /*
             * Kết nối backend tại đây, ví dụ:
             * fetch('/api/settings/notifications', { method: 'PUT', body: JSON.stringify(notiSettingsData) });
             */

            showToast('Đã lưu tuỳ chọn kênh nhận thông báo.');
        });
    }

});