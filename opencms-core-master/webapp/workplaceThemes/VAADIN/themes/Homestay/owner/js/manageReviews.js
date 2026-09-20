const DBManager = (function() {
    const dbName = "ReviewImagesDB";
    const storeName = "images";
    let db;

    // Data URI SVG base64 placeholders để lưu trữ vào IndexedDB giống hình ảnh
    const mockImages = [
        {
            id: 'img1',
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2JkNWUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0cHgiIGZpbGw9IiM0NzU1NjkiPkJBTiBjw5RORzwvdGV4dD48L3N2Zz4='
        },
        {
            id: 'img2',
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOTRjM2I4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0cHgiIGZpbGw9IiNmOGZhZmMiPkPBL1RIPSBBTjwvdGV4dD48L3N2Zz4='
        },
        {
            id: 'img3',
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNmI3MjgwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0cHgiIGZpbGw9IiNmOGZhZmMiPk5Iw4AgU8OATjwvdGV4dD48L3N2Zz4='
        }
    ];

    function initDB() {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: "id" });
            }
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            storeInitialData();
        };

        request.onerror = function(event) {
            console.error("Lỗi khi mở IndexedDB:", event.target.error);
        };
    }

    function storeInitialData() {
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);

        mockImages.forEach(img => {
            const request = objectStore.put(img);
            request.onerror = () => console.error("Lỗi khi lưu ảnh:", img.id);
        });

        transaction.oncomplete = function() {
            loadImagesToDOM();
        };
    }

    function loadImagesToDOM() {
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const results = event.target.result;
            results.forEach(imgData => {
                const imgElement = document.getElementById(imgData.id);
                if (imgElement) {
                    imgElement.src = imgData.src;
                }
            });
        };
    }

    return {
        init: initDB
    };
})();

document.addEventListener("DOMContentLoaded", function() {
    DBManager.init();
});
document.addEventListener("DOMContentLoaded", function() {
    DBManager.init();

    // Logic xử lý lọc đánh giá
    const filterButtons = document.querySelectorAll("#filter-buttons .filter-btn");
    const reviewCards = document.querySelectorAll(".lg\\:col-span-8 > div"); // Chọn các thẻ đánh giá ở cột trái

    filterButtons.forEach(button => {
        button.addEventListener("click", function() {
            const filterValue = this.getAttribute("data-filter");

            // 1. Cập nhật giao diện nút active
            filterButtons.forEach(btn => {
                btn.classList.remove("bg-primary", "text-on-primary", "shadow-sm");
                btn.classList.add("bg-surface-container-low", "text-on-surface-variant");
            });

            this.classList.remove("bg-surface-container-low", "text-on-surface-variant");
            this.classList.add("bg-primary", "text-on-primary", "shadow-sm");

            // 2. Ẩn / Hiển thị các bài đánh giá tương ứng
            reviewCards.forEach(card => {
                const rating = card.getAttribute("data-rating");
                const isReplied = card.getAttribute("data-replied") === "true";

                if (filterValue === "all") {
                    card.style.display = "flex";
                } else if (filterValue === "unreplied") {
                    card.style.display = !isReplied ? "flex" : "none";
                } else {
                    // Lọc theo số sao (5, 4, 3, 2, 1)
                    card.style.display = (rating === filterValue) ? "flex" : "none";
                }
            });
        });
    });
});