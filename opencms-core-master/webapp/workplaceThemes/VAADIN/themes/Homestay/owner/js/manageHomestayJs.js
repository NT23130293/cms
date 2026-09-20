document.addEventListener("DOMContentLoaded", function () {
    // Tự động gán sự kiện mở popup cho các nút tương ứng dựa vào văn bản hiển thị trên nút
    const allButtons = document.querySelectorAll('button');

    allButtons.forEach(btn => {
        const text = btn.textContent.trim();

        // Nút Thêm Homestay mới hoặc Khởi tạo cơ sở
        if (text.includes('Thêm Homestay mới') || text.includes('Khởi tạo cơ sở ngay')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openModal('addHomestayModal');
            });
        }

        // Nút Báo cáo tổng hợp chuỗi
        if (text.includes('Báo cáo tổng hợp chuỗi')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openModal('reportModal');
            });
        }

        // Nút Đổi quyền / Thiết lập trong bảng nhân sự
        if (text.includes('Đổi quyền') || text.includes('Thiết lập') || text.includes('Phân quyền nhân viên mới')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openModal('permissionModal');
            });
        }
    });
});

// Hàm mở Modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

// Hàm đóng Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}