document.addEventListener('DOMContentLoaded', () => {
    // Nạp động Header từ header.html
    loadExternalHeader('header-placeholder', 'header.html', 'Trang chủ');

    // Nạp động Footer từ footer.html
    loadExternalFooter('footer-placeholder', 'footer.html');

    // ==========================================
    // 1. CHUYỂN TAB TRẠNG THÁI (Tất cả, Sắp diễn ra, Đã hoàn thành, Đã hủy)
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const upcomingSection = document.getElementById('upcoming-container');
    const historySection = document.getElementById('history-container');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Bỏ active cũ, gán active cho nút vừa click
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const status = btn.getAttribute('data-status');

            // Ẩn/Hiện tương ứng với từng trạng thái tab
            if (status === 'all') {
                upcomingSection.style.display = 'flex';
                historySection.style.display = 'flex';
            } else if (status === 'upcoming') {
                upcomingSection.style.display = 'flex';
                historySection.style.display = 'none';
            } else if (status === 'completed') {
                upcomingSection.style.display = 'none';
                historySection.style.display = 'flex';
            } else if (status === 'cancelled') {
                upcomingSection.style.display = 'none';
                historySection.style.display = 'none';
                alert('Hiện bạn không có đơn đặt phòng nào bị hủy.');
            }
        });
    });

    // ==========================================
    // 2. TÌM KIẾM NHANH THEO MÃ HOẶC TÊN HOMESTAY
    // ==========================================
    const searchInput = document.getElementById('search-booking');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase().trim();
            const allBookingCards = document.querySelectorAll('.booking-card, .history-item-row');

            allBookingCards.forEach(card => {
                const textContent = card.innerText.toLowerCase();
                if (textContent.includes(keyword)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ==========================================
    // 3. TÍNH NĂNG TRA CỨU NHANH TRÊN HERO CARD
    // ==========================================
    const btnLookup = document.getElementById('btn-lookup');
    const lookupInput = document.getElementById('lookup-input');

    if (btnLookup && lookupInput) {
        btnLookup.addEventListener('click', () => {
            const code = lookupInput.value.trim().toUpperCase();

            if (!code) {
                alert('Vui lòng nhập mã đặt phòng (Ví dụ: TH-2026-88924) hoặc số điện thoại.');
                lookupInput.focus();
                return;
            }

            // Tìm thẻ có mã tương ứng
            const targetCard = document.querySelector(`[data-booking="${code}"]`);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetCard.style.outline = '3px solid #15803d';
                setTimeout(() => {
                    targetCard.style.outline = 'none';
                }, 2500);
            } else {
                alert(`Không tìm thấy đơn đặt phòng có mã "${code}". Vui lòng kiểm tra lại!`);
            }
        });
    }
});

// ==========================================
// HÀM NẠP ĐỘNG HEADER & FOOTER (Dùng Fetch API)
// ==========================================
async function loadExternalHeader(placeholderId, filePath, pageName) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Không thể tải file ${filePath}`);
        const htmlContent = await response.text();
        placeholder.innerHTML = htmlContent;
    } catch (error) {
        console.error('Lỗi nạp Header:', error);
    }
}

async function loadExternalFooter(placeholderId, filePath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Không thể tải file ${filePath}`);
        const htmlContent = await response.text();
        placeholder.innerHTML = htmlContent;
    } catch (error) {
        console.error('Lỗi nạp Footer:', error);
    }
}

// ==========================================
// 4. MODAL POPUP MÃ QR CHECK-IN KHÔNG CHẠM
// ==========================================
function openQrModal(bookingId) {
    const modal = document.getElementById('qr-modal');
    const modalBookingId = document.getElementById('modal-booking-id');

    if (modalBookingId) {
        modalBookingId.textContent = `#${bookingId}`;
    }
    if (modal) {
        modal.classList.add('active');
    }
}

function closeQrModal() {
    const modal = document.getElementById('qr-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Đóng modal khi bấm ra ngoài vùng nền mờ
window.addEventListener('click', (e) => {
    const modal = document.getElementById('qr-modal');
    if (modal && e.target === modal) {
        closeQrModal();
    }
});