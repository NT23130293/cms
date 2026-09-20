document.addEventListener("DOMContentLoaded", function () {
    // Tải Sidebar
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            // Xử lý active
            const currentFile = window.location.pathname.split("/").pop().toLowerCase();
            const pageMap = {
                "dashboard.html": "trang-chu",
                "quan-ly-homestay.html": "quan-ly-homestay",
                "quan-ly-phong.html": "quan-ly-phong",
                "serviceandlocalexperience.html": "quan-ly-dich-vu",
                "quan-ly-booking.html": "quan-ly-booking",
                "questsandexperience.html": "quan-ly-nhiem-vu",
                "quan-ly-danh-gia.html": "quan-ly-danh-gia",
                "quan-ly-ma-giam-gia.html": "quan-ly-ma-giam-gia",
                "doanh-thu-thong-ke.html": "doanh-thu-thong-ke",
                "goi-quang-cao.html": "goi-quang-cao",
                "cai-dat-he-thong.html": "cai-dat-he-thong"
            };

            const currentPath = pageMap[currentFile];
            const sidebarItems = document.querySelectorAll("#sidebar-container [data-path]");

            // Các class CSS trạng thái active và inactive
            const activeClasses = ["bg-primary-container", "text-on-primary", "font-bold", "shadow-[0_1px_8px_rgba(0,0,0,0.04)]", "custom-active-link"];
            const inactiveClasses = ["text-on-primary-container", "hover:bg-primary-container", "hover:text-on-primary"];

            sidebarItems.forEach(function (item) {
                // Đặt tất cả về trạng thái inactive
                item.classList.remove(...activeClasses);
                item.classList.add(...inactiveClasses);
                item.removeAttribute("aria-current");

                // Nếu khớp với trang hiện tại, set thành active
                if (item.getAttribute("data-path") === currentPath) {
                    item.classList.remove(...inactiveClasses);
                    item.classList.add(...activeClasses);
                    item.setAttribute("aria-current", "page");
                }
            });
        })
        .catch(error => console.error('Lỗi khi tải sidebar:', error));

    // Tải Header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.error('Lỗi khi tải header:', error));
});