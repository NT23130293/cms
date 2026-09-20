document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.service-tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    const searchInput = document.querySelector('input[placeholder="Tìm tên dịch vụ..."]');

    // Hàm cập nhật hiển thị của các thẻ dịch vụ (Card)
    const filterServices = () => {
        const activeTab = document.querySelector('.service-tab-btn.active').getAttribute('data-cat');
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

        serviceCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.getAttribute('data-category');

            const matchesSearch = title.includes(searchTerm);
            const matchesTab = (activeTab === 'all' || category === activeTab);

            if (matchesSearch && matchesTab) {
                card.style.display = 'flex';
                // Reset animation để hiệu ứng chạy lại mỗi khi lọc
                card.style.animation = 'none';
                card.offsetHeight; // Kích hoạt reflow
                card.style.animation = 'fadeIn 0.4s ease-in-out';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Xử lý sự kiện click vào các Tab
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Xóa trạng thái active của tất cả các tab
            tabBtns.forEach(t => {
                t.classList.remove('active', 'bg-primary', 'text-on-primary');
                t.classList.add('text-on-surface-variant', 'hover:bg-surface-container-low', 'hover:text-on-surface');
                t.style.backgroundColor = ''; // Xóa màu nền inline
            });

            // Thêm trạng thái active cho tab được click
            const currentBtn = e.currentTarget;
            currentBtn.classList.add('active', 'bg-primary', 'text-on-primary');
            currentBtn.classList.remove('text-on-surface-variant', 'hover:bg-surface-container-low', 'hover:text-on-surface');
            currentBtn.style.backgroundColor = 'rgb(21, 128, 61)'; // Màu xanh lá chủ đạo

            filterServices();
        });
    });

    // Xử lý sự kiện gõ phím vào ô Tìm kiếm
    if (searchInput) {
        searchInput.addEventListener('input', filterServices);
    }
});