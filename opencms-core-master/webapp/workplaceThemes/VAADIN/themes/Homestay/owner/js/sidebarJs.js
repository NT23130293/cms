document.addEventListener("DOMContentLoaded", function () {
    // 1. Tải Sidebar
    fetch('sidebar.html')
        .then(response => {
            if (!response.ok) throw new Error('Không thể tải file sidebar.html');
            return response.text();
        })
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;

            // Sau khi sidebar được nạp vào DOM, tiến hành tô màu tab active
            highlightActiveMenu();
        })
        .catch(error => console.error('Lỗi khi tải sidebar:', error));

    // 2. Tải Header
    fetch('header.html')
        .then(response => {
            if (!response.ok) throw new Error('Không thể tải file header.html');
            return response.text();
        })
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.error('Lỗi khi tải header:', error));
});

// Hàm tự động nhận diện trang hiện tại và đổi màu tab trong sidebar
function highlightActiveMenu() {
    // Lấy tên file từ URL hiện tại (Ví dụ: manageBooking.html)
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navItems = document.querySelectorAll('#sidebar-container a');

    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');

        // Kiểm tra nếu href trùng khớp với tên file trang hiện tại
        if (itemHref === currentPath) {
            // Xóa màu mặc định của trạng thái bình thường
            item.classList.remove('text-on-primary-container', 'hover:bg-primary-container', 'hover:text-on-primary');
            // Thêm màu và hiệu ứng nổi bật cho tab đang đứng
            item.classList.add('bg-primary-container', 'text-on-primary', 'font-bold', 'shadow-[0_1px_8px_rgba(0,0,0,0.04)]');
            item.setAttribute('aria-current', 'page');
        }
    });
}

function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    menu.classList.toggle('hidden');
}

function logout() {
    window.location.href = '../../user/html/login.html';
}