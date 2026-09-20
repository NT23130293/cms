// guestExperience.js

document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------------------------------------------
       1. Tích hợp Header (Giả lập load file header.html riêng biệt)
    ------------------------------------------------------------- */
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        // Nếu bạn dùng fetch:
        // fetch('header.html').then(r => r.text()).then(html => headerContainer.innerHTML = html);

        // Đoạn này dùng tạm HTML cơ bản cho Header để bạn hình dung
        headerContainer.innerHTML = `
            <header class="bg-surface-container-lowest sticky top-0 z-40 border-b border-surface-variant">
                <div class="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
                    <div class="flex items-center gap-2">
                        <button class="material-symbols-outlined text-on-surface">menu</button>
                        <span class="font-bold text-primary text-lg tracking-tight">Nhà Sàn Mộc</span>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm">
                        MT
                    </div>
                </div>
            </header>
        `;
    }

    /* -------------------------------------------------------------
       2. Xử lý logic lọc Tab Dịch vụ
    ------------------------------------------------------------- */
    const tabBtns = document.querySelectorAll('.guest-tab-btn');
    const serviceCards = document.querySelectorAll('.guest-service-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Xóa trạng thái active của tất cả các tab
            tabBtns.forEach(t => {
                t.classList.remove('active', 'bg-primary', 'text-on-primary', 'shadow-sm');
                t.classList.add('bg-surface-container-low', 'text-on-surface');
            });

            // Thêm trạng thái active cho tab được click
            const currentBtn = e.currentTarget;
            currentBtn.classList.add('active', 'bg-primary', 'text-on-primary', 'shadow-sm');
            currentBtn.classList.remove('bg-surface-container-low', 'text-on-surface');

            // Lấy ID danh mục
            const activeTab = currentBtn.getAttribute('data-cat');

            // Lọc và hiển thị thẻ Card
            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (activeTab === 'all' || category === activeTab) {
                    card.style.display = 'flex';
                    // Reset animation để hiệu ứng chạy lại mỗi khi lọc
                    card.style.animation = 'none';
                    card.offsetHeight; // Kích hoạt reflow trình duyệt
                    card.style.animation = 'fadeInScale 0.3s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

/* -------------------------------------------------------------
   3. Hàm xử lý khi khách bấm nút "Đặt ngay" (Giao diện)
------------------------------------------------------------- */
function bookService(serviceName) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // Cập nhật nội dung thông báo
    toastMessage.textContent = `Đã yêu cầu đặt: ${serviceName}`;

    // Hiển thị Toast
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-4');
    }, 3000);
}