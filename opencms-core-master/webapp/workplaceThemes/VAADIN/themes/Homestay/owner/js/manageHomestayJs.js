/* =====================================================
   manageHomestayJs.js - Quản lý Homestay & Chuỗi cơ sở
   ===================================================== */

/* ---------- 1. Hàm mở / đóng popup dùng chung ---------- */
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = true;
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

/* ---------- 2. Popup chỉnh sửa homestay ---------- */
let currentCard = null;      // card đang được chỉnh sửa
let editImageFiles = [];     // ảnh mới được chọn
let currentImageSrc = '';    // ảnh hiện tại của card

const LOCKED_BADGE_CLASS =
    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error text-on-error font-label-sm text-label-sm shadow-sm font-semibold';

// Gọi từ nút "Chỉnh sửa": onclick="openEditHomestay(this)"
function openEditHomestay(btn) {
    currentCard = btn.closest('.group');
    if (!currentCard) return;

    const name = currentCard.querySelector('h2').textContent.trim();
    const address = currentCard.querySelector('h2 + p').lastChild.textContent.trim();
    const d = currentCard.dataset;
    const locked = d.locked === '1';

    document.getElementById('editHomestayName').value = name;
    document.getElementById('editHomestayAddress').value = address;
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

// Cập nhật giao diện card theo trạng thái khóa / mở khóa
function applyLockState(card, locked, type, note, until) {
    const badge = card.querySelector('.absolute.top-space-sm span');
    if (badge && !card.dataset.origBadgeClass) {
        card.dataset.origBadgeClass = badge.className;
        card.dataset.origBadgeHtml = badge.innerHTML;
    }
    let noteEl = card.querySelector('.lock-note');

    if (locked) {
        card.dataset.locked = '1';
        card.dataset.lockType = type;
        card.dataset.lockNote = note;
        card.dataset.lockUntil = until;

        if (badge) {
            badge.className = LOCKED_BADGE_CLASS;
            badge.innerHTML = '<span class="material-symbols-outlined text-[14px]">lock</span> Đã khóa';
        }
        if (!noteEl) {
            noteEl = document.createElement('div');
            noteEl.className = 'lock-note flex items-start gap-1.5 bg-error-container/40 text-error rounded-lg p-2 font-label-md text-label-md';
            noteEl.innerHTML = '<span class="material-symbols-outlined text-[16px]">lock</span><span class="lock-text"></span>';
            card.querySelector('.p-space-md').appendChild(noteEl);
        }
        noteEl.querySelector('.lock-text').textContent =
            'Lý do khóa: ' + type + ' - ' + note + (until ? ' (khóa đến ' + formatDate(until) + ')' : '');
    } else {
        delete card.dataset.locked;
        delete card.dataset.lockType;
        delete card.dataset.lockNote;
        delete card.dataset.lockUntil;

        if (badge && card.dataset.origBadgeClass) {
            badge.className = card.dataset.origBadgeClass;
            badge.innerHTML = card.dataset.origBadgeHtml;
        }
        if (noteEl) noteEl.remove();
    }
}

function submitEditHomestay(e) {
    e.preventDefault();
    if (!currentCard) return;

    const name = document.getElementById('editHomestayName').value.trim();
    const address = document.getElementById('editHomestayAddress').value.trim();
    const locked = document.getElementById('editLockToggle').checked;
    let type = '', note = '', until = '';

    if (locked) {
        type = document.getElementById('editLockReasonType').value;
        note = document.getElementById('editLockReasonNote').value.trim();
        until = document.getElementById('editLockUntil').value;
        if (!type) return alert('Vui lòng chọn lý do khóa homestay!');
        if (note.length < 10) return alert('Vui lòng ghi rõ chi tiết lý do khóa (tối thiểu 10 ký tự)!');
    }

    // Cập nhật tên, địa chỉ, ảnh trên card
    currentCard.querySelector('h2').textContent = name;
    currentCard.querySelector('h2 + p').lastChild.textContent = ' ' + address;
    if (editImageFiles.length > 0) {
        currentCard.querySelector('img').src = URL.createObjectURL(editImageFiles[0]);
    }
    applyLockState(currentCard, locked, type, note, until);

    alert(locked ? 'Đã khóa cơ sở và lưu thay đổi!' : 'Đã cập nhật thông tin thành công!');
    closeModal('editHomestayModal');
}

/* ---------- 3. Popup xóa homestay ---------- */
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