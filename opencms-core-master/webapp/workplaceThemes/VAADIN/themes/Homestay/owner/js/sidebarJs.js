document.addEventListener("DOMContentLoaded", function () {
    // Tải Sidebar
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
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