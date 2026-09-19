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

    const toKey = date =>
        date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());

    const fromKey = key => {
        const parts = key.split('-');
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    };

    const toVN = key => {
        const date = fromKey(key);
        return pad(date.getDate()) + '/' + pad(date.getMonth() + 1) + '/' + date.getFullYear();
    };

    const daysBetween = (fromDateKey, toDateKey) =>
        Math.round((fromKey(toDateKey) - fromKey(fromDateKey)) / 86400000);

    const rangeKeys = (fromDateKey, toDateKey) => {

        const keys = [];
        const current = fromKey(fromDateKey);
        const end = fromKey(toDateKey);

        while (current <= end) {
            keys.push(toKey(current));
            current.setDate(current.getDate() + 1);
        }

        return keys;
    };

    const escapeHtml = text =>
        String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');


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

    $$('.room-modal').forEach(modal => {
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
    // 1. DỮ LIỆU PHÒNG (đọc từ DOM)
    // ==========================================

    function readRoom(button) {

        const data = button.dataset;

        return {
            code: data.roomCode || '',
            name: data.roomName || '',
            type: data.roomType || '',
            capacity: data.roomCapacity || '',
            price: Number(data.roomPrice) || 0,
            status: data.roomStatus || 'available',
            description: data.roomDescription || '',
            amenities: (data.roomAmenities || '')
                .split(',')
                .map(item => item.trim())
                .filter(Boolean),
            floor: data.roomFloor || '',
            bed: data.roomBed || '',
            guest: data.roomGuest || '',
            stay: data.roomStay || '',
            image: data.roomImage || ''
        };
    }

    const rooms = $$('.btn-room-detail').map(readRoom);

    const statusText = {
        occupied: 'Đang có khách',
        booked: 'Đã đặt • Chờ check-in',
        available: 'Còn trống',
        maintenance: 'Bảo trì / Dọn phòng'
    };


    // ==========================================
    // 1.1 LỊCH PHÒNG (dữ liệu mẫu)
    // ==========================================

    const roomSchedule = {};

    rooms.forEach(room => {
        roomSchedule[room.code] = { staying: [], booked: [], blocked: [] };
    });

    (function seedSchedule() {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const addDays = count => {
            const date = new Date(today);
            date.setDate(date.getDate() + count);
            return toKey(date);
        };

        if (roomSchedule['P.101']) {
            roomSchedule['P.101'].staying = [addDays(-1), addDays(0)];
            roomSchedule['P.101'].booked = [addDays(5), addDays(6), addDays(7)];
        }

        if (roomSchedule['P.201']) {
            roomSchedule['P.201'].booked =
                [addDays(0), addDays(1), addDays(2), addDays(10), addDays(11)];
        }

        if (roomSchedule['DORM.01']) {
            roomSchedule['DORM.01'].booked = [addDays(5), addDays(6)];
            roomSchedule['DORM.01'].blocked = [addDays(3), addDays(4)];
        }
    })();

    function dayStatus(roomCode, key) {

        const schedule = roomSchedule[roomCode];

        if (!schedule) {
            return 'available';
        }

        if (schedule.blocked.indexOf(key) > -1) return 'blocked';
        if (schedule.staying.indexOf(key) > -1) return 'staying';
        if (schedule.booked.indexOf(key) > -1) return 'booked';

        return 'available';
    }


    // ==========================================
    // 2. LỌC TRẠNG THÁI PHÒNG
    // ==========================================

    const tabs = $$('.filter-tab');

    tabs.forEach(tab => {

        tab.setAttribute(
            'aria-pressed',
            tab.classList.contains('active') ? 'true' : 'false'
        );

        tab.addEventListener('click', () => {

            tabs.forEach(item => item.setAttribute('aria-pressed', 'false'));
            tab.setAttribute('aria-pressed', 'true');

            const filter = tab.dataset.filter || 'all';

            $$('.room-card').forEach(card => {

                const detailButton = $('.btn-room-detail', card);
                const status = detailButton ? detailButton.dataset.roomStatus : '';

                card.style.display =
                    (filter === 'all' || status === filter) ? '' : 'none';
            });
        });
    });


    // ==========================================
    // 2.1 TÌM KIẾM NHANH
    // ==========================================

    const searchInput = $('input[placeholder="Tìm theo tên/mã phòng..."]');

    if (searchInput) {

        searchInput.addEventListener('input', () => {

            const keyword = searchInput.value.trim().toLowerCase();

            $$('.room-card').forEach(card => {

                const detailButton = $('.btn-room-detail', card);

                if (!detailButton) {
                    return;
                }

                const text = (
                    detailButton.dataset.roomName + ' ' +
                    detailButton.dataset.roomCode + ' ' +
                    detailButton.dataset.roomType
                ).toLowerCase();

                card.style.display = text.indexOf(keyword) > -1 ? '' : 'none';
            });
        });
    }


    // ==========================================
    // 3. CHUYỂN DẠNG THẺ / TIMELINE
    // ==========================================

    const btnViewCard = $('#btnViewCard');
    const btnViewTimeline = $('#btnViewTimeline');

    if (btnViewCard && btnViewTimeline) {

        btnViewCard.setAttribute('aria-pressed', 'true');
        btnViewTimeline.setAttribute('aria-pressed', 'false');

        btnViewTimeline.addEventListener('click', () => {

            btnViewCard.setAttribute('aria-pressed', 'false');
            btnViewTimeline.setAttribute('aria-pressed', 'true');

            const timeline = $('#timelineSection');

            if (timeline) {
                timeline.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        btnViewCard.addEventListener('click', () => {

            btnViewCard.setAttribute('aria-pressed', 'true');
            btnViewTimeline.setAttribute('aria-pressed', 'false');

            const roomGrid = $('#roomGridView');

            if (roomGrid) {
                roomGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }


    // ==========================================
    // 4. POPUP THÊM / SỬA PHÒNG
    // ==========================================

    const roomModal = $('#roomModal');
    const roomModalTitle = $('#roomModalTitle');
    const roomForm = $('#roomForm');

    const roomName = $('#roomName');
    const roomCode = $('#roomCode');
    const roomType = $('#roomType');
    const roomCapacity = $('#roomCapacity');
    const roomPrice = $('#roomPrice');
    const roomDescription = $('#roomDescription');

    const btnAddRoom = $('#btnAddRoom');
    const btnCloseRoomModal = $('#btnCloseRoomModal');
    const btnCancelRoom = $('#btnCancelRoom');

    let currentMode = 'add';
    let currentRoom = null;


    // ------------------------------------------
    // 4.1 TIỆN NGHI (người dùng tự nhập)
    // ------------------------------------------

    let amenityState = [];

    const amenityInput = $('#roomAmenityInput');
    const amenityList = $('#roomAmenityList');
    const amenityEmpty = $('#roomAmenityEmpty');
    const btnAddAmenity = $('#btnAddAmenity');

    function renderAmenities() {

        if (!amenityList) {
            return;
        }

        amenityList.innerHTML = '';

        amenityState.forEach((name, index) => {

            const tag = document.createElement('span');
            tag.className = 'room-amenity-tag';

            tag.innerHTML =
                '<span class="material-symbols-outlined text-[15px]">check_small</span>' +
                '<span>' + escapeHtml(name) + '</span>' +
                '<button type="button" class="room-amenity-remove" title="Xoá tiện nghi">' +
                '<span class="material-symbols-outlined text-[15px]">close</span></button>';

            $('.room-amenity-remove', tag).addEventListener('click', () => {
                amenityState.splice(index, 1);
                renderAmenities();
            });

            amenityList.appendChild(tag);
        });

        if (amenityEmpty) {
            amenityEmpty.style.display = amenityState.length ? 'none' : '';
        }
    }

    function addAmenity() {

        if (!amenityInput) {
            return;
        }

        // Cho phép nhập nhiều tiện nghi một lúc, cách nhau bằng dấu phẩy
        const values = amenityInput.value
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);

        if (!values.length) {
            showToast('Hãy nhập tên tiện nghi.', 'error');
            return;
        }

        let added = 0;

        values.forEach(value => {

            const isDuplicated = amenityState
                .some(item => item.toLowerCase() === value.toLowerCase());

            if (isDuplicated) {
                showToast('Tiện nghi "' + value + '" đã có trong danh sách.', 'error');
                return;
            }

            amenityState.push(value);
            added++;
        });

        amenityInput.value = '';
        amenityInput.focus();

        if (added) {
            renderAmenities();
        }
    }

    if (btnAddAmenity) {
        btnAddAmenity.addEventListener('click', addAmenity);
    }

    if (amenityInput) {

        amenityInput.addEventListener('keydown', event => {

            if (event.key === 'Enter') {
                // Tránh submit form khi đang thêm tiện nghi
                event.preventDefault();
                addAmenity();
            }

            if (event.key === 'Backspace' && !amenityInput.value && amenityState.length) {
                amenityState.pop();
                renderAmenities();
            }
        });
    }

    function resetAmenities(list) {
        amenityState = (list || []).slice();
        renderAmenities();
    }


    // ------------------------------------------
    // 4.2 ẢNH & VIDEO
    // ------------------------------------------

    const mediaState = { images: [], videos: [] };

    const imageInput = $('#roomImages');
    const videoInput = $('#roomVideos');
    const imagePreview = $('#roomImagePreview');
    const videoPreview = $('#roomVideoPreview');
    const imageEmpty = $('#roomImageEmpty');
    const videoEmpty = $('#roomVideoEmpty');
    const imageUrlInput = $('#roomImageUrl');
    const videoUrlInput = $('#roomVideoUrl');
    const btnAddImageUrl = $('#btnAddImageUrl');
    const btnAddVideoUrl = $('#btnAddVideoUrl');

    function renderMedia() {

        if (imagePreview) {

            imagePreview.innerHTML = '';

            mediaState.images.forEach((item, index) => {

                const box = document.createElement('div');
                box.className = 'room-media-item';

                box.innerHTML =
                    '<img src="' + escapeHtml(item.url) + '" alt="Ảnh phòng">' +
                    (index === 0 ? '<span class="room-media-cover">Ảnh bìa</span>' : '') +
                    '<button type="button" class="room-media-remove" title="Xoá ảnh">' +
                    '<span class="material-symbols-outlined text-[16px]">close</span></button>';

                $('.room-media-remove', box).addEventListener('click', () => {
                    mediaState.images.splice(index, 1);
                    renderMedia();
                });

                imagePreview.appendChild(box);
            });

            if (imageEmpty) {
                imageEmpty.style.display = mediaState.images.length ? 'none' : '';
            }
        }

        if (videoPreview) {

            videoPreview.innerHTML = '';

            mediaState.videos.forEach((item, index) => {

                const box = document.createElement('div');
                box.className = 'room-media-item room-media-item-video';

                box.innerHTML =
                    (item.kind === 'file'
                        ? '<video src="' + escapeHtml(item.url) + '" muted playsinline></video>'
                        : '<div class="room-media-link">' +
                        '<span class="material-symbols-outlined">smart_display</span>' +
                        '<span class="room-media-link-text">' + escapeHtml(item.url) + '</span></div>') +
                    '<button type="button" class="room-media-remove" title="Xoá video">' +
                    '<span class="material-symbols-outlined text-[16px]">close</span></button>';

                $('.room-media-remove', box).addEventListener('click', () => {
                    mediaState.videos.splice(index, 1);
                    renderMedia();
                });

                videoPreview.appendChild(box);
            });

            if (videoEmpty) {
                videoEmpty.style.display = mediaState.videos.length ? 'none' : '';
            }
        }
    }

    if (imageInput) {

        imageInput.addEventListener('change', () => {

            Array.from(imageInput.files).forEach(file => {

                if (!file.type.startsWith('image/')) {
                    showToast('Tệp "' + file.name + '" không phải ảnh.', 'error');
                    return;
                }

                mediaState.images.push({
                    kind: 'file',
                    name: file.name,
                    file: file,
                    url: URL.createObjectURL(file)
                });
            });

            imageInput.value = '';
            renderMedia();
        });
    }

    if (videoInput) {

        videoInput.addEventListener('change', () => {

            Array.from(videoInput.files).forEach(file => {

                if (!file.type.startsWith('video/')) {
                    showToast('Tệp "' + file.name + '" không phải video.', 'error');
                    return;
                }

                if (file.size > 100 * 1024 * 1024) {
                    showToast('Video "' + file.name + '" vượt quá 100MB.', 'error');
                    return;
                }

                mediaState.videos.push({
                    kind: 'file',
                    name: file.name,
                    file: file,
                    url: URL.createObjectURL(file)
                });
            });

            videoInput.value = '';
            renderMedia();
        });
    }

    if (btnAddImageUrl && imageUrlInput) {

        btnAddImageUrl.addEventListener('click', () => {

            const url = imageUrlInput.value.trim();

            if (!url) {
                showToast('Hãy nhập link ảnh.', 'error');
                return;
            }

            mediaState.images.push({ kind: 'url', url: url });
            imageUrlInput.value = '';
            renderMedia();
        });
    }

    if (btnAddVideoUrl && videoUrlInput) {

        btnAddVideoUrl.addEventListener('click', () => {

            const url = videoUrlInput.value.trim();

            if (!url) {
                showToast('Hãy nhập link video.', 'error');
                return;
            }

            mediaState.videos.push({ kind: 'url', url: url });
            videoUrlInput.value = '';
            renderMedia();
        });
    }

    function resetMedia(images) {

        mediaState.images = (images || []).map(url => ({ kind: 'url', url: url }));
        mediaState.videos = [];

        renderMedia();
    }


    // ------------------------------------------
    // 4.3 MỞ POPUP THÊM PHÒNG
    // ------------------------------------------

    function openAddRoomModal() {

        currentMode = 'add';
        currentRoom = null;

        if (roomModalTitle) {
            roomModalTitle.textContent = 'Thêm phòng mới';
        }

        if (roomForm) {
            roomForm.reset();
        }

        resetAmenities([]);
        resetMedia([]);

        openModal(roomModal);
    }


    // ------------------------------------------
    // 4.4 MỞ POPUP SỬA PHÒNG
    // ------------------------------------------

    function openEditRoomModal(room) {

        currentMode = 'edit';
        currentRoom = room;

        if (roomModalTitle) {
            roomModalTitle.textContent = 'Chỉnh sửa thông tin phòng';
        }

        if (roomName) roomName.value = room.name;
        if (roomCode) roomCode.value = room.code;
        if (roomType) roomType.value = room.type;
        if (roomCapacity) roomCapacity.value = room.capacity;
        if (roomPrice) roomPrice.value = room.price;
        if (roomDescription) roomDescription.value = room.description;

        resetAmenities(room.amenities);
        resetMedia(room.image ? [room.image] : []);

        openModal(roomModal);
    }

    if (btnAddRoom) {
        btnAddRoom.addEventListener('click', openAddRoomModal);
    }

    $$('.btn-edit-room').forEach(button => {
        button.addEventListener('click', () => openEditRoomModal(readRoom(button)));
    });

    if (btnCloseRoomModal) {
        btnCloseRoomModal.addEventListener('click', () => closeModal(roomModal));
    }

    if (btnCancelRoom) {
        btnCancelRoom.addEventListener('click', () => closeModal(roomModal));
    }


    // ------------------------------------------
    // 4.5 LƯU THÔNG TIN PHÒNG
    // ------------------------------------------

    if (roomForm) {

        roomForm.addEventListener('submit', event => {

            event.preventDefault();

            const roomData = {
                name: roomName ? roomName.value.trim() : '',
                code: roomCode ? roomCode.value.trim() : '',
                type: roomType ? roomType.value.trim() : '',
                capacity: roomCapacity ? roomCapacity.value : '',
                price: roomPrice ? roomPrice.value : '',
                description: roomDescription ? roomDescription.value.trim() : '',
                amenities: amenityState.slice(),
                images: mediaState.images.map(item =>
                    item.kind === 'file' ? item.name : item.url),
                videos: mediaState.videos.map(item =>
                    item.kind === 'file' ? item.name : item.url)
            };

            console.log(
                currentMode === 'add' ? 'Thêm phòng:' : 'Chỉnh sửa phòng:',
                roomData
            );

            /*
             * Kết nối backend tại đây.
             * Ảnh / video nên gửi bằng FormData:
             *
             * const form = new FormData();
             * form.append('name', roomData.name);
             * form.append('amenities', JSON.stringify(roomData.amenities));
             * mediaState.images.forEach(i => i.file && form.append('images', i.file));
             * mediaState.videos.forEach(v => v.file && form.append('videos', v.file));
             * fetch('/api/rooms', { method: 'POST', body: form });
             */

            // Cập nhật tạm trên giao diện khi đang sửa
            if (currentMode === 'edit' && currentRoom) {
                updateCardAmenities(currentRoom, roomData.amenities);
            }

            showToast(
                currentMode === 'add'
                    ? 'Đã thêm phòng "' + roomData.name + '".'
                    : 'Đã cập nhật phòng "' + roomData.name + '".'
            );

            closeModal(roomModal);
        });
    }

    function findCard(roomCodeValue) {

        const button = $$('.btn-room-detail')
            .find(item => item.dataset.roomCode === roomCodeValue);

        return button ? button.closest('.room-card') : null;
    }

    function updateCardAmenities(room, list) {

        const card = findCard(room.code);

        if (!card) {
            return;
        }

        $$('[data-room-code="' + room.code + '"]', card).forEach(item => {
            item.dataset.roomAmenities = list.join(',');
        });

        const holder = $('.flex.flex-wrap.gap-1\\.5', card);

        if (!holder) {
            return;
        }

        holder.innerHTML = list.map(name =>
            '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md ' +
            'bg-surface-container-low text-on-surface font-body-sm text-body-sm">' +
            '<span class="material-symbols-outlined text-[14px] text-secondary">check_small</span>' +
            escapeHtml(name) + '</span>'
        ).join('');

        const target = rooms.find(item => item.code === room.code);

        if (target) {
            target.amenities = list.slice();
        }
    }


    // ==========================================
    // 5. POPUP CHI TIẾT PHÒNG
    // ==========================================

    const roomDetailModal = $('#roomDetailModal');

    function openDetailModal(room) {

        currentRoom = room;

        $('#roomDetailTitle').textContent = room.name;

        const image = $('#roomDetailImage');
        image.src = room.image;
        image.alt = room.name;

        const status = $('#roomDetailStatus');
        status.textContent = statusText[room.status] || 'Còn trống';
        status.className = 'room-detail-status status-' + room.status;

        $('#roomDetailCode').textContent = room.code;
        $('#roomDetailType').textContent = room.type;
        $('#roomDetailCapacity').textContent = room.capacity + ' khách';
        $('#roomDetailPrice').textContent = formatMoney(room.price) + ' / đêm';
        $('#roomDetailFloor').textContent = room.floor || '—';
        $('#roomDetailBed').textContent = room.bed || '—';
        $('#roomDetailDescription').textContent = room.description || '—';

        const amenityBox = $('#roomDetailAmenities');
        amenityBox.innerHTML = '';

        room.amenities.forEach(item => {
            const chip = document.createElement('span');
            chip.className = 'room-detail-chip';
            chip.textContent = item;
            amenityBox.appendChild(chip);
        });

        const guestBox = $('#roomDetailGuestBox');

        if (room.guest) {
            guestBox.style.display = '';
            $('#roomDetailGuest').textContent = room.guest;
            $('#roomDetailStay').textContent = room.stay;
        } else {
            guestBox.style.display = 'none';
        }

        openModal(roomDetailModal);
    }

    $$('.btn-room-detail').forEach(button => {
        button.addEventListener('click', () => openDetailModal(readRoom(button)));
    });

    const btnDetailToEdit = $('#btnDetailToEdit');

    if (btnDetailToEdit) {

        btnDetailToEdit.addEventListener('click', () => {
            const room = currentRoom;
            closeModal(roomDetailModal);
            setTimeout(() => openEditRoomModal(room), 180);
        });
    }

    const btnDetailToCalendar = $('#btnDetailToCalendar');

    if (btnDetailToCalendar) {

        btnDetailToCalendar.addEventListener('click', () => {
            const room = currentRoom;
            closeModal(roomDetailModal);
            setTimeout(() => openCalendarModal(room), 180);
        });
    }


    // ==========================================
    // 6. POPUP LỊCH PHÒNG
    // ==========================================

    const roomCalendarModal = $('#roomCalendarModal');
    const calendarGrid = $('#roomCalendarGrid');
    const calendarMonthLabel = $('#roomCalendarMonth');
    const calendarSelection = $('#roomCalendarSelection');

    let calendarRoom = null;
    let calendarCursor = new Date();
    let selectionStart = null;
    let selectionEnd = null;

    function selectedKeys() {

        if (!selectionStart) {
            return [];
        }

        if (!selectionEnd) {
            return [selectionStart];
        }

        const start = selectionEnd < selectionStart ? selectionEnd : selectionStart;
        const end = selectionEnd < selectionStart ? selectionStart : selectionEnd;

        return rangeKeys(start, end);
    }

    function renderCalendar() {

        if (!calendarGrid || !calendarRoom) {
            return;
        }

        const year = calendarCursor.getFullYear();
        const month = calendarCursor.getMonth();

        calendarMonthLabel.textContent = 'Tháng ' + (month + 1) + ' / ' + year;

        const offset = (new Date(year, month, 1).getDay() + 6) % 7;
        const totalDays = new Date(year, month + 1, 0).getDate();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selected = selectedKeys();

        calendarGrid.innerHTML = '';

        for (let i = 0; i < offset; i++) {
            const blank = document.createElement('span');
            blank.className = 'room-calendar-day is-empty';
            calendarGrid.appendChild(blank);
        }

        for (let day = 1; day <= totalDays; day++) {

            const date = new Date(year, month, day);
            const key = toKey(date);

            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'room-calendar-day status-' + dayStatus(calendarRoom.code, key);
            cell.dataset.key = key;
            cell.innerHTML = '<span>' + day + '</span>';

            if (date < today) {
                cell.classList.add('is-past');
            }

            if (key === toKey(today)) {
                cell.classList.add('is-today');
            }

            if (selected.indexOf(key) > -1) {
                cell.classList.add('is-selected');
            }

            cell.addEventListener('click', () => {

                if (!selectionStart || selectionEnd) {
                    selectionStart = key;
                    selectionEnd = null;
                } else {
                    selectionEnd = key;
                }

                renderCalendar();
            });

            calendarGrid.appendChild(cell);
        }

        const keys = selectedKeys();

        if (!keys.length) {
            calendarSelection.textContent =
                'Chưa chọn ngày nào. Click 1 ngày để chọn, click ngày thứ 2 để chọn khoảng.';
        } else if (keys.length === 1) {
            calendarSelection.textContent = 'Đang chọn: ' + toVN(keys[0]) + ' (1 ngày)';
        } else {
            calendarSelection.textContent =
                'Đang chọn: ' + toVN(keys[0]) + ' → ' + toVN(keys[keys.length - 1]) +
                ' (' + keys.length + ' ngày)';
        }
    }

    function openCalendarModal(room) {

        calendarRoom = room;
        currentRoom = room;
        calendarCursor = new Date();
        selectionStart = null;
        selectionEnd = null;

        $('#roomCalendarTitle').textContent = 'Lịch phòng • ' + room.name;
        $('#roomCalendarSubtitle').textContent =
            'Mã ' + room.code + ' • ' + formatMoney(room.price) + ' / đêm';

        renderCalendar();
        openModal(roomCalendarModal);
    }

    $$('.btn-room-calendar').forEach(button => {
        button.addEventListener('click', () => openCalendarModal(readRoom(button)));
    });

    const btnCalendarPrev = $('#btnCalendarPrev');
    const btnCalendarNext = $('#btnCalendarNext');

    if (btnCalendarPrev) {

        btnCalendarPrev.addEventListener('click', () => {
            calendarCursor.setDate(1);
            calendarCursor.setMonth(calendarCursor.getMonth() - 1);
            renderCalendar();
        });
    }

    if (btnCalendarNext) {

        btnCalendarNext.addEventListener('click', () => {
            calendarCursor.setDate(1);
            calendarCursor.setMonth(calendarCursor.getMonth() + 1);
            renderCalendar();
        });
    }

    function blockKeys(room, keys) {

        const schedule = roomSchedule[room.code];
        let busy = 0;

        keys.forEach(key => {

            const status = dayStatus(room.code, key);

            if (status === 'staying' || status === 'booked') {
                busy++;
                return;
            }

            if (schedule.blocked.indexOf(key) === -1) {
                schedule.blocked.push(key);
            }
        });

        return busy;
    }

    const btnCalendarBlock = $('#btnCalendarBlock');

    if (btnCalendarBlock) {

        btnCalendarBlock.addEventListener('click', () => {

            const keys = selectedKeys();

            if (!keys.length) {
                showToast('Hãy chọn ngày trước khi chặn.', 'error');
                return;
            }

            const busy = blockKeys(calendarRoom, keys);

            selectionStart = null;
            selectionEnd = null;
            renderCalendar();

            showToast(
                busy
                    ? 'Đã chặn các ngày trống. Bỏ qua ' + busy + ' ngày đã có khách.'
                    : 'Đã chặn ' + keys.length + ' ngày cho ' + calendarRoom.name + '.'
            );
        });
    }

    const btnCalendarUnblock = $('#btnCalendarUnblock');

    if (btnCalendarUnblock) {

        btnCalendarUnblock.addEventListener('click', () => {

            const keys = selectedKeys();

            if (!keys.length) {
                showToast('Hãy chọn ngày muốn bỏ chặn.', 'error');
                return;
            }

            const schedule = roomSchedule[calendarRoom.code];
            schedule.blocked = schedule.blocked.filter(key => keys.indexOf(key) === -1);

            selectionStart = null;
            selectionEnd = null;
            renderCalendar();

            showToast('Đã bỏ chặn ngày đã chọn.');
        });
    }


    // ==========================================
    // 7. POPUP CHẶN NGÀY
    // ==========================================

    const blockDateModal = $('#blockDateModal');
    const blockDateForm = $('#blockDateForm');
    const blockFrom = $('#blockFrom');
    const blockTo = $('#blockTo');
    const blockSummary = $('#blockSummary');

    let blockRoom = null;

    function updateBlockSummary() {

        if (!blockFrom.value || !blockTo.value) {
            blockSummary.textContent = 'Chọn khoảng ngày để xem số đêm bị chặn.';
            return;
        }

        const nights = daysBetween(blockFrom.value, blockTo.value);

        if (nights < 0) {
            blockSummary.textContent = 'Ngày kết thúc phải sau ngày bắt đầu.';
            return;
        }

        blockSummary.textContent =
            'Sẽ chặn ' + (nights + 1) + ' ngày (' +
            toVN(blockFrom.value) + ' → ' + toVN(blockTo.value) + ')' +
            (blockRoom ? ' cho ' + blockRoom.name + '.' : '.');
    }

    if (blockFrom && blockTo) {
        blockFrom.addEventListener('change', updateBlockSummary);
        blockTo.addEventListener('change', updateBlockSummary);
    }

    function openBlockModal(room) {

        blockRoom = room;
        currentRoom = room;

        blockDateForm.reset();

        const today = toKey(new Date());

        blockFrom.min = today;
        blockTo.min = today;
        blockFrom.value = today;
        blockTo.value = today;

        $('#blockDateSubtitle').textContent =
            'Chặn ngày cho ' + room.name + ' (' + room.code + ').';

        updateBlockSummary();
        openModal(blockDateModal);
    }

    $$('.btn-block-date').forEach(button => {
        button.addEventListener('click', () => openBlockModal(readRoom(button)));
    });

    if (blockDateForm) {

        blockDateForm.addEventListener('submit', event => {

            event.preventDefault();

            if (daysBetween(blockFrom.value, blockTo.value) < 0) {
                showToast('Ngày kết thúc phải sau ngày bắt đầu.', 'error');
                return;
            }

            const keys = rangeKeys(blockFrom.value, blockTo.value);
            const busy = blockKeys(blockRoom, keys);

            console.log('Chặn ngày:', {
                room: blockRoom.code,
                from: blockFrom.value,
                to: blockTo.value,
                reason: $('#blockReason').value,
                note: $('#blockNote').value.trim(),
                stopSelling: $('#blockStopSelling').checked
            });

            showToast(
                busy
                    ? 'Đã chặn, bỏ qua ' + busy + ' ngày đã có khách.'
                    : 'Đã chặn ' + keys.length + ' ngày cho ' + blockRoom.name + '.'
            );

            closeModal(blockDateModal);
        });
    }


    // ==========================================
    // 7.1 ĐỔI PHÒNG (KHÁCH CHƯA CHECK-IN)
    // ==========================================

    const changeRoomModal = $('#changeRoomModal');
    const changeRoomForm = $('#changeRoomForm');
    const changeRoomTarget = $('#changeRoomTarget');
    const changeRoomPreview = $('#changeRoomPreview');
    const changeRoomCurrent = $('#changeRoomCurrent');

    let changeBooking = null;

    function readBooking(button) {

        const data = button.dataset;

        return {
            guestName: data.guestName || '',
            guestStay: data.guestStay || '',
            roomCode: data.roomCode || '',
            roomName: data.roomName || ''
        };
    }

    function buildChangeRoomOptions(currentCode) {

        changeRoomTarget.innerHTML = '';

        rooms
            .filter(room => room.code !== currentCode)
            .forEach(room => {

                const option = document.createElement('option');
                option.value = room.code;
                option.textContent =
                    room.name + ' (' + room.code + ') • ' + formatMoney(room.price) + ' / đêm';

                changeRoomTarget.appendChild(option);
            });
    }

    function renderChangeRoomPreview() {

        const fromRoom = rooms.find(item => item.code === changeBooking.roomCode);
        const toRoom = rooms.find(item => item.code === changeRoomTarget.value);

        if (!fromRoom || !toRoom) {
            changeRoomPreview.textContent = 'Chọn phòng đích để xem chênh lệch giá.';
            return;
        }

        const diff = toRoom.price - fromRoom.price;

        changeRoomPreview.textContent =
            'Từ ' + formatMoney(fromRoom.price) + ' → ' + formatMoney(toRoom.price) +
            ' / đêm (' + (diff > 0 ? '+' : '') + formatMoney(diff) + ')';
    }

    if (changeRoomTarget) {
        changeRoomTarget.addEventListener('change', renderChangeRoomPreview);
    }

    function openChangeRoomModal(booking) {

        changeBooking = booking;

        $('#changeRoomTitle').textContent = 'Đổi phòng • ' + booking.guestName;
        $('#changeRoomSubtitle').textContent =
            'Đang giữ ' + booking.roomName + ' (' + booking.guestStay + '), chưa check-in.';

        changeRoomCurrent.innerHTML =
            '<span class="material-symbols-outlined text-[18px]">person</span>' +
            '<span><strong>' + escapeHtml(booking.guestName) + '</strong> — ' +
            escapeHtml(booking.roomName) + ' • ' + escapeHtml(booking.guestStay) + '</span>';

        buildChangeRoomOptions(booking.roomCode);
        renderChangeRoomPreview();

        openModal(changeRoomModal);
    }

    $$('.btn-change-room').forEach(button => {
        button.addEventListener('click', () => openChangeRoomModal(readBooking(button)));
    });

    if (changeRoomForm) {

        changeRoomForm.addEventListener('submit', event => {

            event.preventDefault();

            const toRoom = rooms.find(item => item.code === changeRoomTarget.value);

            if (!toRoom) {
                showToast('Hãy chọn phòng muốn chuyển đến.', 'error');
                return;
            }

            console.log('Đổi phòng:', {
                guest: changeBooking.guestName,
                from: changeBooking.roomCode,
                to: toRoom.code,
                reason: $('#changeRoomReason').value,
                notify: $('#changeRoomNotify').checked
            });

            showToast(
                'Đã chuyển ' + changeBooking.guestName + ' sang ' + toRoom.name + '.'
            );

            closeModal(changeRoomModal);
        });
    }


    // ==========================================
    // 7.2 HỦY PHÒNG (KHÁCH CHƯA CHECK-IN)
    // ==========================================

    const cancelBookingModal = $('#cancelBookingModal');
    const cancelBookingForm = $('#cancelBookingForm');
    const cancelBookingCurrent = $('#cancelBookingCurrent');

    let cancelBooking = null;

    function openCancelBookingModal(booking) {

        cancelBooking = booking;

        $('#cancelBookingTitle').textContent = 'Hủy phòng • ' + booking.guestName;
        $('#cancelBookingSubtitle').textContent =
            'Hủy lượt đặt ' + booking.roomName + ', khách chưa check-in.';

        cancelBookingCurrent.innerHTML =
            '<span class="material-symbols-outlined text-[18px]">person</span>' +
            '<span><strong>' + escapeHtml(booking.guestName) + '</strong> — ' +
            escapeHtml(booking.roomName) + ' • ' + escapeHtml(booking.guestStay) + '</span>';

        cancelBookingForm.reset();
        $('#cancelBookingReopen').checked = true;

        openModal(cancelBookingModal);
    }

    $$('.btn-cancel-booking').forEach(button => {
        button.addEventListener('click', () => openCancelBookingModal(readBooking(button)));
    });

    if (cancelBookingForm) {

        cancelBookingForm.addEventListener('submit', event => {

            event.preventDefault();

            console.log('Hủy phòng:', {
                guest: cancelBooking.guestName,
                room: cancelBooking.roomCode,
                reason: $('#cancelBookingReason').value,
                note: $('#cancelBookingNote').value.trim(),
                refunded: $('#cancelBookingRefund').checked,
                reopen: $('#cancelBookingReopen').checked
            });

            showToast('Đã hủy đặt phòng của ' + cancelBooking.guestName + '.');

            closeModal(cancelBookingModal);
        });
    }


    // ==========================================
    // 7.3 CHECK-OUT (KHÁCH ĐANG Ở)
    // ==========================================

    const checkoutModal = $('#checkoutModal');
    const checkoutForm = $('#checkoutForm');
    const checkoutCurrent = $('#checkoutCurrent');

    let checkoutBooking = null;

    function openCheckoutModal(booking) {

        checkoutBooking = booking;

        $('#checkoutTitle').textContent = 'Check-out • ' + booking.guestName;
        $('#checkoutSubtitle').textContent =
            'Xác nhận ' + booking.guestName + ' trả ' + booking.roomName + '.';

        checkoutCurrent.innerHTML =
            '<span class="material-symbols-outlined text-[18px]">person</span>' +
            '<span><strong>' + escapeHtml(booking.guestName) + '</strong> — ' +
            escapeHtml(booking.roomName) + ' • ' + escapeHtml(booking.guestStay) + '</span>';

        checkoutForm.reset();
        $('#checkoutBillSettled').checked = true;
        $('#checkoutNeedCleaning').checked = true;

        openModal(checkoutModal);
    }

    $$('.btn-checkout').forEach(button => {
        button.addEventListener('click', () => openCheckoutModal(readBooking(button)));
    });

    if (checkoutForm) {

        checkoutForm.addEventListener('submit', event => {

            event.preventDefault();

            const billSettled = $('#checkoutBillSettled').checked;

            if (!billSettled) {
                showToast('Khách chưa thanh toán đủ, hãy xác nhận hóa đơn trước khi check-out.', 'error');
                return;
            }

            console.log('Check-out:', {
                guest: checkoutBooking.guestName,
                room: checkoutBooking.roomCode,
                inspected: $('#checkoutRoomInspected').checked,
                billSettled: billSettled,
                needCleaning: $('#checkoutNeedCleaning').checked,
                note: $('#checkoutNote').value.trim()
            });

            showToast(
                'Đã check-out ' + checkoutBooking.guestName + ' khỏi ' + checkoutBooking.roomName + '.'
            );

            closeModal(checkoutModal);
        });
    }


    // ==========================================
    // 8. POPUP CẬP NHẬT GIÁ HÀNG LOẠT
    // ==========================================

    const bulkPriceModal = $('#bulkPriceModal');
    const bulkPriceForm = $('#bulkPriceForm');
    const bulkRoomList = $('#bulkRoomList');
    const bulkPreview = $('#bulkPreview');
    const bulkSelectAll = $('#bulkSelectAll');
    const bulkMode = $('#bulkMode');
    const bulkValue = $('#bulkValue');
    const bulkRound = $('#bulkRoundPrice');
    const bulkCount = $('#bulkCount');

    function buildBulkList() {

        if (!bulkRoomList) {
            return;
        }

        bulkRoomList.innerHTML = '';

        rooms.forEach(room => {

            const row = document.createElement('label');
            row.className = 'room-bulk-item';

            row.innerHTML =
                '<input type="checkbox" class="bulk-room-check" value="' +
                escapeHtml(room.code) + '" checked>' +
                '<span class="room-bulk-name">' + escapeHtml(room.name) +
                '<small>' + escapeHtml(room.code) + ' • ' + escapeHtml(room.type) + '</small></span>' +
                '<span class="room-bulk-price">' + formatMoney(room.price) + '</span>';

            bulkRoomList.appendChild(row);
        });

        $$('.bulk-room-check').forEach(input => {
            input.addEventListener('change', renderBulkPreview);
        });
    }

    function computeNewPrice(price) {

        const mode = bulkMode.value;
        const value = Number(bulkValue.value) || 0;

        let result = price;

        if (mode === 'percent-up') result = price * (1 + value / 100);
        if (mode === 'percent-down') result = price * (1 - value / 100);
        if (mode === 'amount-up') result = price + value;
        if (mode === 'amount-down') result = price - value;
        if (mode === 'fixed') result = value;

        if (result < 0) {
            result = 0;
        }

        if (bulkRound && bulkRound.checked) {
            result = Math.round(result / 1000) * 1000;
        }

        return Math.round(result);
    }

    function selectedBulkRooms() {

        const codes = $$('.bulk-room-check')
            .filter(input => input.checked)
            .map(input => input.value);

        return rooms.filter(room => codes.indexOf(room.code) > -1);
    }

    function renderBulkPreview() {

        if (!bulkPreview) {
            return;
        }

        const list = selectedBulkRooms();

        bulkCount.textContent = list.length;
        bulkPreview.innerHTML = '';

        if (!list.length) {
            bulkPreview.innerHTML = '<p class="room-bulk-empty">Chưa chọn phòng nào.</p>';
            return;
        }

        list.forEach(room => {

            const newPrice = computeNewPrice(room.price);
            const diff = newPrice - room.price;

            const row = document.createElement('div');
            row.className = 'room-bulk-preview-row';

            row.innerHTML =
                '<span class="room-bulk-preview-name">' + escapeHtml(room.name) + '</span>' +
                '<span class="room-bulk-old">' + formatMoney(room.price) + '</span>' +
                '<span class="material-symbols-outlined text-[16px]">east</span>' +
                '<span class="room-bulk-new">' + formatMoney(newPrice) + '</span>' +
                '<span class="room-bulk-diff ' +
                (diff > 0 ? 'up' : diff < 0 ? 'down' : '') + '">' +
                (diff > 0 ? '+' : '') + formatMoney(diff) + '</span>';

            bulkPreview.appendChild(row);
        });
    }

    if (bulkSelectAll) {

        bulkSelectAll.addEventListener('change', () => {

            $$('.bulk-room-check').forEach(input => {
                input.checked = bulkSelectAll.checked;
            });

            renderBulkPreview();
        });
    }

    if (bulkMode) bulkMode.addEventListener('change', renderBulkPreview);
    if (bulkValue) bulkValue.addEventListener('input', renderBulkPreview);
    if (bulkRound) bulkRound.addEventListener('change', renderBulkPreview);

    const btnBulkPrice = $('#btnBulkPrice');

    if (btnBulkPrice) {

        btnBulkPrice.addEventListener('click', () => {

            buildBulkList();

            if (bulkValue) {
                bulkValue.value = '';
            }

            const today = toKey(new Date());
            $('#bulkFrom').value = today;
            $('#bulkTo').value = today;

            renderBulkPreview();
            openModal(bulkPriceModal);
        });
    }

    function updateCardPrice(room, newPrice) {

        const card = findCard(room.code);

        if (!card) {
            return;
        }

        $$('[data-room-code="' + room.code + '"]', card).forEach(item => {
            item.dataset.roomPrice = newPrice;
        });

        const priceLabel = $('.text-right span:last-child', card);

        if (priceLabel) {
            priceLabel.textContent = formatMoney(newPrice);
        }
    }

    if (bulkPriceForm) {

        bulkPriceForm.addEventListener('submit', event => {

            event.preventDefault();

            const list = selectedBulkRooms();

            if (!list.length) {
                showToast('Hãy chọn ít nhất một phòng.', 'error');
                return;
            }

            const days = $$('#bulkDayPicker input:checked').map(input => input.value);

            if (!days.length) {
                showToast('Hãy chọn ít nhất một ngày trong tuần.', 'error');
                return;
            }

            const changes = list.map(room => {

                const newPrice = computeNewPrice(room.price);

                room.price = newPrice;
                updateCardPrice(room, newPrice);

                return { code: room.code, price: newPrice };
            });

            console.log('Cập nhật giá hàng loạt:', {
                mode: bulkMode.value,
                value: bulkValue.value,
                from: $('#bulkFrom').value,
                to: $('#bulkTo').value,
                weekdays: days,
                rooms: changes
            });

            showToast('Đã cập nhật giá cho ' + list.length + ' phòng.');
            closeModal(bulkPriceModal);
        });
    }

});