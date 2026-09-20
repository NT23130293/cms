// Hàm xử lý việc nhấn vào nút trái tim (Lưu/Bỏ lưu khách sạn)
function toggleFavorite(buttonElement) {
    // Thêm/bỏ class 'active' để CSS đổi màu icon trái tim
    buttonElement.classList.toggle('active');

    // Lấy thẻ icon <i> bên trong button
    const icon = buttonElement.querySelector('i');

    // Đổi qua lại giữa viền trái tim và trái tim tô đặc
    if (buttonElement.classList.contains('active')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
    }
}

// Hàm xử lý nút Toggle "Xem ngang / Xem dọc"
document.addEventListener('DOMContentLoaded', () => {
    const viewButtons = document.querySelectorAll('.btn-view');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Xóa class active ở tất cả các nút
            viewButtons.forEach(btn => btn.classList.remove('active'));
            // Thêm class active vào nút được click
            this.classList.add('active');

            // Note: Logic đổi hiển thị ngang/dọc của danh sách khách sạn
            // sẽ cần thêm code xử lý CSS flex-direction tùy theo yêu cầu của bạn sau này.
        });
    });
});