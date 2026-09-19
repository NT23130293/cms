document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LỌC TRẠNG THÁI PHÒNG
    // ==========================================

    const tabs = document.querySelectorAll('.filter-tab');

    tabs.forEach(tab => {
        tab.setAttribute(
            'aria-pressed',
            tab.classList.contains('active') ? 'true' : 'false'
        );

        tab.addEventListener('click', () => {

            tabs.forEach(item => {
                item.setAttribute('aria-pressed', 'false');
            });

            tab.setAttribute('aria-pressed', 'true');

            // Hiệu ứng chuyển trạng thái được CSS xử lý.
            // JS chỉ cập nhật trạng thái.
        });
    });


    // ==========================================
    // 2. CHUYỂN DẠNG THẺ / TIMELINE
    // ==========================================

    const btnViewCard = document.getElementById('btnViewCard');
    const btnViewTimeline = document.getElementById('btnViewTimeline');

    if (btnViewCard && btnViewTimeline) {

        btnViewCard.setAttribute('aria-pressed', 'true');
        btnViewTimeline.setAttribute('aria-pressed', 'false');

        btnViewTimeline.addEventListener('click', () => {

            btnViewCard.setAttribute('aria-pressed', 'false');
            btnViewTimeline.setAttribute('aria-pressed', 'true');

            const timeline =
                document.getElementById('timelineSection');

            if (timeline) {
                timeline.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        btnViewCard.addEventListener('click', () => {

            btnViewCard.setAttribute('aria-pressed', 'true');
            btnViewTimeline.setAttribute('aria-pressed', 'false');

            const roomGrid =
                document.getElementById('roomGridView');

            if (roomGrid) {
                roomGrid.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }


    // ==========================================
    // 3. POPUP
    // ==========================================

    const roomModal = document.getElementById('roomModal');
    const roomModalTitle = document.getElementById('roomModalTitle');

    const roomForm = document.getElementById('roomForm');

    const roomName = document.getElementById('roomName');
    const roomCode = document.getElementById('roomCode');
    const roomType = document.getElementById('roomType');
    const roomCapacity = document.getElementById('roomCapacity');
    const roomPrice = document.getElementById('roomPrice');
    const roomDescription = document.getElementById('roomDescription');

    const btnAddRoom = document.getElementById('btnAddRoom');
    const btnCloseRoomModal = document.getElementById('btnCloseRoomModal');
    const btnCancelRoom = document.getElementById('btnCancelRoom');

    let currentMode = 'add';


    // ==========================================
    // 4. MỞ POPUP THÊM PHÒNG
    // ==========================================

    function openAddRoomModal() {

        currentMode = 'add';

        if (roomModalTitle) {
            roomModalTitle.textContent = 'Thêm phòng mới';
        }

        if (roomForm) {
            roomForm.reset();
        }

        openModal();
    }


    // ==========================================
    // 5. MỞ POPUP CHỈNH SỬA PHÒNG
    // ==========================================

    function openEditRoomModal(button) {

        currentMode = 'edit';

        if (roomModalTitle) {
            roomModalTitle.textContent = 'Chỉnh sửa thông tin phòng';
        }

        if (roomName) {
            roomName.value =
                button.dataset.roomName || '';
        }

        if (roomCode) {
            roomCode.value =
                button.dataset.roomCode || '';
        }

        if (roomType) {
            roomType.value =
                button.dataset.roomType || '';
        }

        if (roomCapacity) {
            roomCapacity.value =
                button.dataset.roomCapacity || '';
        }

        if (roomPrice) {
            roomPrice.value =
                button.dataset.roomPrice || '';
        }

        if (roomDescription) {
            roomDescription.value =
                button.dataset.roomDescription || '';
        }

        openModal();
    }


    // ==========================================
    // 6. MỞ MODAL
    // ==========================================

    function openModal() {

        if (!roomModal) {
            return;
        }

        roomModal.removeAttribute('hidden');

        document.body.classList.add('modal-open');

        requestAnimationFrame(() => {
            roomModal.classList.add('is-open');
        });
    }


    // ==========================================
    // 7. ĐÓNG MODAL
    // ==========================================

    function closeModal() {

        if (!roomModal) {
            return;
        }

        roomModal.classList.remove('is-open');

        setTimeout(() => {
            roomModal.setAttribute('hidden', '');
            document.body.classList.remove('modal-open');
        }, 200);
    }


    // ==========================================
    // 8. NÚT THÊM PHÒNG
    // ==========================================

    if (btnAddRoom) {

        btnAddRoom.addEventListener('click', () => {
            openAddRoomModal();
        });
    }


    // ==========================================
    // 9. NÚT CHỈNH SỬA
    // ==========================================

    const editRoomButtons =
        document.querySelectorAll('.btn-edit-room');

    editRoomButtons.forEach(button => {

        button.addEventListener('click', () => {
            openEditRoomModal(button);
        });
    });


    // ==========================================
    // 10. ĐÓNG POPUP
    // ==========================================

    if (btnCloseRoomModal) {

        btnCloseRoomModal.addEventListener('click', () => {
            closeModal();
        });
    }

    if (btnCancelRoom) {

        btnCancelRoom.addEventListener('click', () => {
            closeModal();
        });
    }


    // ==========================================
    // 11. CLICK RA NGOÀI POPUP
    // ==========================================

    if (roomModal) {

        roomModal.addEventListener('click', event => {

            if (event.target === roomModal) {
                closeModal();
            }
        });
    }


    // ==========================================
    // 12. PHÍM ESC ĐỂ ĐÓNG POPUP
    // ==========================================

    document.addEventListener('keydown', event => {

        if (event.key === 'Escape') {

            if (
                roomModal &&
                !roomModal.hasAttribute('hidden')
            ) {
                closeModal();
            }
        }
    });


    // ==========================================
    // 13. LƯU THÔNG TIN PHÒNG
    // ==========================================

    if (roomForm) {

        roomForm.addEventListener('submit', event => {

            event.preventDefault();

            const roomData = {
                name: roomName ? roomName.value.trim() : '',
                code: roomCode ? roomCode.value.trim() : '',
                type: roomType ? roomType.value : '',
                capacity: roomCapacity ? roomCapacity.value : '',
                price: roomPrice ? roomPrice.value : '',
                description:
                    roomDescription
                        ? roomDescription.value.trim()
                        : ''
            };

            console.log(
                currentMode === 'add'
                    ? 'Thêm phòng:'
                    : 'Chỉnh sửa phòng:',
                roomData
            );

            /*
             * Sau này kết nối backend/API tại đây.
             *
             * Ví dụ:
             *
             * fetch('/api/rooms', {
             *     method: 'POST',
             *     headers: {
             *         'Content-Type': 'application/json'
             *     },
             *     body: JSON.stringify(roomData)
             * });
             */

            closeModal();
        });
    }

});