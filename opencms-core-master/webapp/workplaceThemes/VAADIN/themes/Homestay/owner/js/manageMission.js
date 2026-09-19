document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. TIỆN ÍCH CHUNG
    // ==========================================

    const $ = (selector, scope) =>
        (scope || document).querySelector(selector);

    const $$ = (selector, scope) =>
        Array.from((scope || document).querySelectorAll(selector));

    const formatMoney = value =>
        (Number(value) || 0).toLocaleString('vi-VN') + '₫';

    const pad = number => String(number).padStart(2, '0');

    const escapeHtml = text =>
        String(text == null ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

    const toKey = date =>
        date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());


    // ==========================================
    // 0.1 TOAST THÔNG BÁO
    // ==========================================

    const toastBox = document.createElement('div');
    toastBox.className = 'mission-toast-box';
    document.body.appendChild(toastBox);

    function showToast(message, type) {

        const toast = document.createElement('div');
        toast.className = 'mission-toast mission-toast-' + (type || 'success');

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

        if (!modal) {
            return;
        }

        modal.removeAttribute('hidden');
        document.body.classList.add('modal-open');

        requestAnimationFrame(() => modal.classList.add('is-open'));

        if (openedModals.indexOf(modal) === -1) {
            openedModals.push(modal);
        }
    }

    function closeModal(modal) {

        if (!modal) {
            return;
        }

        modal.classList.remove('is-open');

        setTimeout(() => {

            modal.setAttribute('hidden', '');

            const index = openedModals.indexOf(modal);

            if (index > -1) {
                openedModals.splice(index, 1);
            }

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

    $$('.mission-modal').forEach(modal => {
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && openedModals.length) {
            closeModal(openedModals[openedModals.length - 1]);
        }
    });


    // ==========================================
    // 1. NHIỆM VỤ (render từ data-attribute)
    // ==========================================

    const missionList = $('#missionList');

    const iconColor = {
        wb_sunny: 'text-amber-600',
        star: 'text-amber-500'
    };

    function readMission(card) {

        const data = card.dataset;

        return {
            id: data.id || '',
            title: data.title || '',
            desc: data.desc || '',
            icon: data.icon || 'photo_camera',
            rewardType: data.rewardType || 'voucher-percent',
            rewardValue: data.rewardValue || '',
            rewardExtra: data.rewardExtra || '',
            given: Number(data.given) || 0,
            status: data.status || 'active'
        };
    }

    function rewardLabel(mission) {

        const value = mission.rewardValue;
        let text = '';

        if (mission.rewardType === 'voucher-percent') text = 'Tặng Voucher giảm ' + value + '%';
        if (mission.rewardType === 'voucher-amount') text = 'Tặng Voucher ' + formatMoney(value) + ' trừ thẳng';
        if (mission.rewardType === 'points') text = 'Tặng ' + value + ' điểm';
        if (mission.rewardType === 'gift') text = 'Tặng quà: ' + value;

        if (mission.rewardExtra) {
            text += ' + ' + mission.rewardExtra;
        }

        return text;
    }

    function rewardIcon(type) {

        if (type === 'voucher-percent') return 'local_offer';
        if (type === 'voucher-amount') return 'payments';

        return 'card_giftcard';
    }

    function renderMissionCard(card) {

        const mission = readMission(card);
        const paused = mission.status === 'paused';

        card.classList.toggle('is-paused', paused);

        card.innerHTML =
            '<div class="flex items-start justify-between gap-space-xs">' +
            '<div class="flex items-center gap-space-xs text-primary font-headline-sm text-[14px]">' +
            '<span class="material-symbols-outlined ' + (iconColor[mission.icon] || 'text-secondary') +
            ' text-[18px]">' + escapeHtml(mission.icon) + '</span>' +
            '<span>' + escapeHtml(mission.title) + '</span></div>' +
            '<span class="px-2 py-0.5 rounded-full ' +
            (paused ? 'bg-surface-container-high text-on-surface-variant' : 'bg-secondary-container text-on-secondary-container') +
            ' font-label-sm text-[10px] shrink-0">' + (paused ? 'Tạm dừng' : 'Đang kích hoạt') + '</span></div>' +

            '<p class="font-body-sm text-body-sm text-on-surface-variant">' + escapeHtml(mission.desc) + '</p>' +

            '<div class="flex items-center justify-between pt-1 font-label-sm text-label-sm">' +
            '<span class="text-secondary font-semibold flex items-center gap-1">' +
            '<span class="material-symbols-outlined text-[15px]">' + rewardIcon(mission.rewardType) + '</span>' +
            escapeHtml(rewardLabel(mission)) + '</span>' +
            '<span class="text-on-surface-variant">Đã trao: ' + mission.given + ' lượt</span></div>' +

            '<div class="flex items-center justify-end gap-space-xs pt-1">' +
            '<button type="button" class="btn-toggle-mission px-2 py-1 rounded-md bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container font-label-sm text-[11px] flex items-center gap-1">' +
            '<span class="material-symbols-outlined text-[14px]">' + (paused ? 'play_arrow' : 'pause') + '</span>' +
            (paused ? 'Kích hoạt' : 'Tạm dừng') + '</button>' +
            '<button type="button" class="btn-edit-mission px-2 py-1 rounded-md bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container font-label-sm text-[11px] flex items-center gap-1">' +
            '<span class="material-symbols-outlined text-[14px]">edit</span>Chỉnh sửa</button></div>';
    }

    function writeMission(card, mission) {

        card.dataset.id = mission.id;
        card.dataset.title = mission.title;
        card.dataset.desc = mission.desc;
        card.dataset.icon = mission.icon;
        card.dataset.rewardType = mission.rewardType;
        card.dataset.rewardValue = mission.rewardValue;
        card.dataset.rewardExtra = mission.rewardExtra;
        card.dataset.given = mission.given;
        card.dataset.status = mission.status;

        renderMissionCard(card);
    }

    function updateMissionCounters() {

        const cards = $$('.mission-card');
        const active = cards.filter(card => card.dataset.status === 'active').length;

        const metricActive = $('#metricActive');
        const running = $('#missionRunning');

        if (metricActive) metricActive.textContent = pad(active);
        if (running) running.textContent = active + ' Nhiệm vụ chạy song song';
    }

    // Click trong danh sách nhiệm vụ (uỷ quyền sự kiện vì card được render lại)
    if (missionList) {

        missionList.addEventListener('click', event => {

            const editBtn = event.target.closest('.btn-edit-mission');
            const toggleBtn = event.target.closest('.btn-toggle-mission');

            if (editBtn) {
                openMissionModal(editBtn.closest('.mission-card'));
            }

            if (toggleBtn) {

                const card = toggleBtn.closest('.mission-card');
                const mission = readMission(card);

                mission.status = mission.status === 'active' ? 'paused' : 'active';
                writeMission(card, mission);
                updateMissionCounters();

                showToast(mission.status === 'active'
                    ? 'Đã kích hoạt nhiệm vụ.'
                    : 'Đã tạm dừng nhiệm vụ.');
            }
        });
    }

    $$('.mission-card').forEach(renderMissionCard);
    updateMissionCounters();


    // ==========================================
    // 2. POPUP TẠO / SỬA NHIỆM VỤ
    // ==========================================

    const missionModal = $('#missionModal');
    const missionForm = $('#missionForm');
    const missionRewardType = $('#missionRewardType');
    const missionRewardValue = $('#missionRewardValue');
    const missionRewardValueLabel = $('#missionRewardValueLabel');

    let editingMissionCard = null;

    const rewardValueConfig = {
        'voucher-percent': { label: 'Giá trị (%)', placeholder: 'Ví dụ: 10' },
        'voucher-amount': { label: 'Giá trị (₫)', placeholder: 'Ví dụ: 100000' },
        'points': { label: 'Số điểm', placeholder: 'Ví dụ: 50' },
        'gift': { label: 'Tên quà tặng', placeholder: 'Ví dụ: Túi trà gạo lứt' }
    };

    function syncRewardValueField() {

        const config = rewardValueConfig[missionRewardType.value];

        missionRewardValueLabel.textContent = config.label;
        missionRewardValue.placeholder = config.placeholder;
    }

    if (missionRewardType) {
        missionRewardType.addEventListener('change', syncRewardValueField);
    }

    function openMissionModal(card) {

        editingMissionCard = card || null;

        missionForm.reset();

        if (card) {

            const mission = readMission(card);

            $('#missionModalTitle').textContent = 'Chỉnh sửa nhiệm vụ';
            $('#missionTitle').value = mission.title;
            $('#missionDesc').value = mission.desc;
            $('#missionIcon').value = mission.icon;
            $('#missionStatus').value = mission.status;
            missionRewardType.value = mission.rewardType;
            missionRewardValue.value = mission.rewardValue;
            $('#missionRewardExtra').value = mission.rewardExtra;

        } else {

            $('#missionModalTitle').textContent = 'Tạo nhiệm vụ mới';
            $('#missionFrom').value = toKey(new Date());
        }

        syncRewardValueField();
        openModal(missionModal);
    }

    const btnAddMission = $('#btnAddMission');

    if (btnAddMission) {
        btnAddMission.addEventListener('click', () => openMissionModal(null));
    }

    if (missionForm) {

        missionForm.addEventListener('submit', event => {

            event.preventDefault();

            const rewardType = missionRewardType.value;
            const rewardValue = missionRewardValue.value.trim();

            if (rewardType !== 'gift' && isNaN(Number(rewardValue))) {
                showToast('Giá trị phần thưởng phải là số.', 'error');
                return;
            }

            const mission = {
                id: editingMissionCard ? editingMissionCard.dataset.id : 'M' + Date.now(),
                title: $('#missionTitle').value.trim(),
                desc: $('#missionDesc').value.trim(),
                icon: $('#missionIcon').value,
                rewardType: rewardType,
                rewardValue: rewardValue,
                rewardExtra: $('#missionRewardExtra').value.trim(),
                given: editingMissionCard ? Number(editingMissionCard.dataset.given) || 0 : 0,
                status: $('#missionStatus').value
            };

            console.log(editingMissionCard ? 'Sửa nhiệm vụ:' : 'Tạo nhiệm vụ:', {
                mission: mission,
                from: $('#missionFrom').value,
                to: $('#missionTo').value,
                needPhoto: $('#missionNeedPhoto').checked,
                autoApprove: $('#missionAutoApprove').checked
            });

            /*
             * Kết nối backend tại đây:
             * fetch('/api/missions', { method: 'POST', body: JSON.stringify(mission) });
             */

            if (editingMissionCard) {

                writeMission(editingMissionCard, mission);

            } else {

                const card = document.createElement('div');
                card.className = 'mission-card bg-surface-container-low/70 p-space-md rounded-lg flex flex-col gap-2 hover:bg-surface-container-low transition-colors';

                writeMission(card, mission);
                missionList.appendChild(card);
            }

            updateMissionCounters();

            showToast(editingMissionCard
                ? 'Đã cập nhật nhiệm vụ "' + mission.title + '".'
                : 'Đã tạo nhiệm vụ "' + mission.title + '".');

            closeModal(missionModal);
        });
    }


    // ==========================================
    // 3. KHO PHẦN THƯỞNG
    // ==========================================

    const rewardStockModal = $('#rewardStockModal');
    const rewardStockList = $('#rewardStockList');

    let stockState = [
        { name: 'Voucher giảm 10%', type: 'Voucher', qty: 60 },
        { name: 'Voucher 100.000₫ trừ thẳng', type: 'Voucher', qty: 40 },
        { name: 'Túi trà gạo lứt Mộc Châu', type: 'Quà tặng', qty: 25 },
        { name: 'Quà nông sản lưu niệm', type: 'Quà tặng', qty: 30 }
    ];

    function renderStock() {

        rewardStockList.innerHTML = '';

        if (!stockState.length) {
            rewardStockList.innerHTML = '<p class="mission-empty">Kho phần thưởng đang trống.</p>';
            return;
        }

        stockState.forEach((item, index) => {

            const row = document.createElement('div');
            row.className = 'mission-stock-item';

            row.innerHTML =
                '<span class="mission-stock-name">' + escapeHtml(item.name) +
                '<small>' + escapeHtml(item.type) + '</small></span>' +
                '<input type="number" min="0" class="mission-stock-qty" value="' + item.qty + '">' +
                '<button type="button" class="mission-stock-remove" title="Xoá">' +
                '<span class="material-symbols-outlined text-[18px]">delete</span></button>';

            $('.mission-stock-qty', row).addEventListener('input', event => {
                item.qty = Number(event.target.value) || 0;
            });

            $('.mission-stock-remove', row).addEventListener('click', () => {
                stockState.splice(index, 1);
                renderStock();
            });

            rewardStockList.appendChild(row);
        });
    }

    const btnRewardStock = $('#btnRewardStock');

    if (btnRewardStock) {
        btnRewardStock.addEventListener('click', () => {
            renderStock();
            openModal(rewardStockModal);
        });
    }

    const btnAddStock = $('#btnAddStock');

    if (btnAddStock) {

        btnAddStock.addEventListener('click', () => {

            const name = $('#stockName').value.trim();

            if (!name) {
                showToast('Hãy nhập tên phần thưởng.', 'error');
                return;
            }

            stockState.push({
                name: name,
                type: $('#stockType').value,
                qty: Number($('#stockQty').value) || 0
            });

            $('#stockName').value = '';
            $('#stockQty').value = '';

            renderStock();
        });
    }

    const btnSaveStock = $('#btnSaveStock');

    if (btnSaveStock) {

        btnSaveStock.addEventListener('click', () => {
            console.log('Lưu kho phần thưởng:', stockState);
            showToast('Đã lưu kho phần thưởng.');
            closeModal(rewardStockModal);
        });
    }


    // ==========================================
    // 4. BÀI NỘP: ĐỌC DỮ LIỆU & CẬP NHẬT SỐ LIỆU
    // ==========================================

    const submissionList = $('#submissionList');

    function readSubmission(card) {

        const data = card.dataset;
        const photo = $('.submission-photo', card);

        return {
            id: data.id || '',
            guest: data.guest || '',
            room: data.room || '',
            time: data.time || '',
            task: data.task || '',
            taskType: data.taskType || '',
            review: data.review || '',
            reward: data.reward || '',
            photos: Number(data.photos) || 1,
            image: photo ? photo.src : ''
        };
    }

    function getCard(id) {
        return $$('.submission-card').find(card => card.dataset.id === id);
    }

    function pendingCount() {
        return $$('.submission-card').filter(card => !card.classList.contains('is-done')).length;
    }

    // Số "chờ duyệt" gốc là 8, chỉ có 2 card mẫu trên giao diện
    const basePending = 8;
    const sampleCount = $$('.submission-card').length;

    function updatePendingCounters() {

        const total = basePending - sampleCount + pendingCount();

        const metric = $('#metricPending');
        const badge = $('#pendingBadge');

        if (metric) metric.textContent = pad(Math.max(total, 0));
        if (badge) badge.textContent = Math.max(total, 0) + ' bài mới';
    }

    function markSubmission(card, statusClass, text) {

        const status = $('.submission-status', card);

        status.className = 'submission-status px-2.5 py-1 rounded-full font-label-md text-[11px] ' + statusClass;
        status.textContent = text;

        card.classList.add('is-done');
        updatePendingCounters();
    }

    function submissionSummaryHtml(submission) {

        return '<span class="material-symbols-outlined text-[18px]">person</span>' +
            '<span><strong>' + escapeHtml(submission.guest) + '</strong> — ' +
            escapeHtml(submission.task) + '</span>';
    }


    // ==========================================
    // 5. POPUP CHI TIẾT BÀI NỘP
    // ==========================================

    const submissionDetailModal = $('#submissionDetailModal');
    let currentSubmission = null;

    function openSubmissionDetail(submission) {

        currentSubmission = submission;

        $('#submissionDetailTitle').textContent = 'Bài nộp • ' + submission.guest;
        $('#submissionDetailSubtitle').textContent = 'Mã bài nộp ' + submission.id;

        const image = $('#submissionDetailImage');
        image.src = submission.image;
        image.alt = submission.guest;

        $('#submissionDetailPhotos').textContent = submission.photos + ' ảnh đính kèm';
        $('#submissionDetailGuest').textContent = submission.guest;
        $('#submissionDetailRoom').textContent = submission.room;
        $('#submissionDetailTime').textContent = submission.time;
        $('#submissionDetailTask').textContent = submission.task;
        $('#submissionDetailReview').textContent = '“' + submission.review + '”';
        $('#submissionDetailReward').textContent = submission.reward;

        const card = getCard(submission.id);
        const done = card && card.classList.contains('is-done');

        $('#btnDetailApprove').style.display = done ? 'none' : '';
        $('#btnDetailReject').style.display = done ? 'none' : '';

        openModal(submissionDetailModal);
    }

    $('#btnDetailApprove').addEventListener('click', () => {
        const submission = currentSubmission;
        closeModal(submissionDetailModal);
        setTimeout(() => openApproveModal(submission), 180);
    });

    $('#btnDetailReject').addEventListener('click', () => {
        const submission = currentSubmission;
        closeModal(submissionDetailModal);
        setTimeout(() => openRejectModal(submission), 180);
    });


    // ==========================================
    // 6. POPUP PHÊ DUYỆT & TRAO THƯỞNG
    // ==========================================

    const approveModal = $('#approveModal');
    const approveForm = $('#approveForm');

    function openApproveModal(submission) {

        currentSubmission = submission;

        approveForm.reset();

        $('#approveSubtitle').textContent =
            'Xác nhận bài nộp của ' + submission.guest + ' hợp lệ và trao thưởng.';
        $('#approveCurrent').innerHTML = submissionSummaryHtml(submission);
        $('#approveReward').value = submission.reward;
        $('#approveNotify').checked = true;

        openModal(approveModal);
    }

    approveForm.addEventListener('submit', event => {

        event.preventDefault();

        const card = getCard(currentSubmission.id);

        console.log('Duyệt bài nộp:', {
            id: currentSubmission.id,
            reward: $('#approveReward').value.trim(),
            note: $('#approveNote').value.trim(),
            notify: $('#approveNotify').checked,
            allowFeature: $('#approveFeature').checked
        });

        if (card) {
            markSubmission(card, 'is-approved', 'Đã duyệt');
        }

        // Tăng số voucher đã trao
        const voucher = $('#metricVoucher');

        if (voucher) {
            voucher.textContent = (Number(voucher.textContent) || 0) + 1;
        }

        showToast('Đã duyệt và trao thưởng cho ' + currentSubmission.guest + '.');
        closeModal(approveModal);
    });


    // ==========================================
    // 7. POPUP TỪ CHỐI
    // ==========================================

    const rejectModal = $('#rejectModal');
    const rejectForm = $('#rejectForm');

    function openRejectModal(submission) {

        currentSubmission = submission;

        rejectForm.reset();
        $('#rejectCurrent').innerHTML = submissionSummaryHtml(submission);

        openModal(rejectModal);
    }

    rejectForm.addEventListener('submit', event => {

        event.preventDefault();

        const card = getCard(currentSubmission.id);

        console.log('Từ chối bài nộp:', {
            id: currentSubmission.id,
            reason: $('#rejectReason').value,
            note: $('#rejectNote').value.trim()
        });

        if (card) {
            markSubmission(card, 'is-rejected', 'Đã từ chối');
        }

        showToast('Đã từ chối bài nộp của ' + currentSubmission.guest + '.');
        closeModal(rejectModal);
    });


    // ==========================================
    // 8. POPUP YÊU CẦU CHỤP LẠI
    // ==========================================

    const retakeModal = $('#retakeModal');
    const retakeForm = $('#retakeForm');

    function openRetakeModal(submission) {

        currentSubmission = submission;

        retakeForm.reset();
        $('#retakeCurrent').innerHTML = submissionSummaryHtml(submission);

        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 3);
        $('#retakeDeadline').value = toKey(deadline);

        openModal(retakeModal);
    }

    retakeForm.addEventListener('submit', event => {

        event.preventDefault();

        const card = getCard(currentSubmission.id);

        console.log('Yêu cầu chụp lại:', {
            id: currentSubmission.id,
            reason: $('#retakeReason').value,
            note: $('#retakeNote').value.trim(),
            deadline: $('#retakeDeadline').value
        });

        if (card) {
            markSubmission(card, 'is-retake', 'Chờ nộp lại');
        }

        showToast('Đã gửi yêu cầu chụp lại cho ' + currentSubmission.guest + '.');
        closeModal(retakeModal);
    });


    // ==========================================
    // 9. GẮN SỰ KIỆN CHO NÚT TRÊN CARD BÀI NỘP
    // ==========================================

    if (submissionList) {

        submissionList.addEventListener('click', event => {

            const button = event.target.closest('button');

            if (!button) {
                return;
            }

            const card = button.closest('.submission-card');
            const submission = readSubmission(card);

            if (button.classList.contains('btn-view-submission')) openSubmissionDetail(submission);
            if (button.classList.contains('btn-approve-submission')) openApproveModal(submission);
            if (button.classList.contains('btn-reject-submission')) openRejectModal(submission);
            if (button.classList.contains('btn-retake-submission')) openRetakeModal(submission);
        });
    }


    // ==========================================
    // 10. LỌC & TẢI LẠI
    // ==========================================

    const filterModal = $('#filterModal');
    const filterForm = $('#filterForm');
    const submissionEmpty = $('#submissionEmpty');

    function applyFilter() {

        const type = $('#filterType').value;
        const keyword = $('#filterKeyword').value.trim().toLowerCase();

        let visible = 0;

        $$('.submission-card').forEach(card => {

            const matchType = type === 'all' || card.dataset.taskType === type;
            const matchName = !keyword || card.dataset.guest.toLowerCase().indexOf(keyword) > -1;
            const show = matchType && matchName;

            card.style.display = show ? '' : 'none';

            if (show) {
                visible++;
            }
        });

        if (submissionEmpty) {
            submissionEmpty.hidden = visible > 0;
        }
    }

    const btnFilterSubmission = $('#btnFilterSubmission');

    if (btnFilterSubmission) {
        btnFilterSubmission.addEventListener('click', () => openModal(filterModal));
    }

    if (filterForm) {

        filterForm.addEventListener('submit', event => {
            event.preventDefault();
            applyFilter();
            closeModal(filterModal);
        });
    }

    const btnFilterReset = $('#btnFilterReset');

    if (btnFilterReset) {

        btnFilterReset.addEventListener('click', () => {
            filterForm.reset();
            applyFilter();
            closeModal(filterModal);
        });
    }

    const btnRefreshSubmission = $('#btnRefreshSubmission');

    if (btnRefreshSubmission) {

        btnRefreshSubmission.addEventListener('click', () => {
            /* Gọi API tải lại danh sách bài nộp tại đây */
            showToast('Đã tải lại danh sách bài nộp.');
        });
    }


    // ==========================================
    // 11. POPUP THỐNG KÊ NHIỆM VỤ
    // ==========================================

    const statsModal = $('#statsModal');

    const btnMissionStats = $('#btnMissionStats');

    if (btnMissionStats) {

        btnMissionStats.addEventListener('click', () => {

            const list = $('#statsList');
            const missions = $$('.mission-card').map(readMission);
            const max = Math.max.apply(null, missions.map(item => item.given).concat([1]));

            list.innerHTML = missions.map(item =>
                '<div class="mission-stats-row">' +
                '<div class="mission-stats-head"><span>' + escapeHtml(item.title) + '</span>' +
                '<span>' + item.given + ' lượt</span></div>' +
                '<div class="mission-stats-bar"><i style="width:' +
                Math.round(item.given / max * 100) + '%"></i></div></div>'
            ).join('');

            openModal(statsModal);
        });
    }


    // ==========================================
    // 12. POPUP GỬI QUÀ TRI ÂN
    // ==========================================

    const giftModal = $('#giftModal');
    const giftForm = $('#giftForm');

    const btnSendGift = $('#btnSendGift');

    if (btnSendGift) {

        btnSendGift.addEventListener('click', () => {

            const holder = $('#giftGuestList');
            holder.innerHTML = '';

            $$('.top-guest').forEach(guest => {

                const row = document.createElement('label');
                row.className = 'mission-gift-item';

                row.innerHTML =
                    '<input type="checkbox" class="gift-guest-check" value="' +
                    escapeHtml(guest.dataset.name) + '" checked>' +
                    '<span>' + escapeHtml(guest.dataset.name) + '</span>' +
                    '<small>' + escapeHtml(guest.dataset.points) + ' điểm</small>';

                holder.appendChild(row);
            });

            openModal(giftModal);
        });
    }

    if (giftForm) {

        giftForm.addEventListener('submit', event => {

            event.preventDefault();

            const receivers = $$('.gift-guest-check')
                .filter(input => input.checked)
                .map(input => input.value);

            if (!receivers.length) {
                showToast('Hãy chọn ít nhất một người nhận.', 'error');
                return;
            }

            console.log('Gửi quà tri ân:', {
                receivers: receivers,
                gift: $('#giftItem').value,
                message: $('#giftMessage').value.trim()
            });

            showToast('Đã gửi quà tri ân cho ' + receivers.length + ' du khách.');
            closeModal(giftModal);
        });
    }

});