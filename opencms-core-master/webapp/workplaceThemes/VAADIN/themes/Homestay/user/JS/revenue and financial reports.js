const DBManager = (function() {
    const dbName = "DashboardImagesDB";
    const storeName = "images";
    let db;

    // Data URI SVG base64 placeholders cho các hình ảnh trong trang
    const mockImages = [
        {
            id: 'dashboard-main-img',
            // Hình phong cảnh Mai Châu
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDIyYzIyIi8+PHBhdGggZD0iTTAgMjAwIEwxNTAgMTAwIEwzMDAgMTgwIEw1MDAgODAgTDgwMCAyNTAgTDgwMCA0MDAgTDAgNDAwIFoiIGZpbGw9IiMwNjRlM2IiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzJweCIgZmlsbD0iI2FhYWFhYSI+TUFJIENIw4JVIExBTkRTQ0FQRTwvdGV4dD48L3N2Zz4='
        },
        {
            id: 'room1-img',
            // Hình phòng 1
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2JkNWUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwcHgiIGZpbGw9IiM0NzU1NjkiPlJPT00gMTwvdGV4dD48L3N2Zz4='
        },
        {
            id: 'room2-img',
            // Hình phòng 2
            src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOTRjM2I4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwcHgiIGZpbGw9IiNmOGZhZmMiPlJPT00gMjwvdGV4dD48L3N2Zz4='
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