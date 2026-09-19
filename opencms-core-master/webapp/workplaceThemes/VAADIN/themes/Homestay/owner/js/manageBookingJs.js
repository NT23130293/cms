// script.js - Xử lý các logic tương tác trên trang chính
document.addEventListener("DOMContentLoaded", function () {
    // Xử lý chuyển tab trạng thái (Status Tabs)
    const tabs = document.querySelectorAll('.status-tab');

    tabs.forEach(button => {
        button.addEventListener('click', function () {
            tabs.forEach(b => {
                b.className = 'status-tab px-space-sm py-1 rounded-full text-label-md font-label-md whitespace-nowrap bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all';
            });
            this.className = 'status-tab px-space-sm py-1 rounded-full text-label-md font-label-md whitespace-nowrap bg-primary text-on-primary transition-all custom-primary-bg';
        });
    });
});