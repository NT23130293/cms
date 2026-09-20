document.addEventListener("DOMContentLoaded", () => {

    // 2. CẤU HÌNH INDEXEDDB
    const dbName = "HomestayAdsDB";
    const storeName = "ad_history";
    let db;

    const request = indexedDB.open(dbName, 1);

    request.onerror = (event) => {
        console.error("Lỗi khi mở IndexedDB:", event.target.errorCode);
    };

    // Khởi tạo bảng (Object Store) nếu chưa có
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            const objectStore = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
            // Tạo index để có thể sắp xếp hoặc tìm kiếm sau này
            objectStore.createIndex("date", "date", { unique: false });
        }
    };

    // Khi mở DB thành công
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("IndexedDB đã sẵn sàng!");
        loadHistoryFromDB(); // Tải dữ liệu cũ lên giao diện
    };

    // 3. HÀM THÊM GÓI QUẢNG CÁO VÀO INDEXEDDB
    function addPackageToHistory(pkgName, price) {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);

        // Tạo ngày giả định
        const today = new Date();
        const dateStr = `${today.getDate().toString().padStart(2,'0')}/${(today.getMonth()+1).toString().padStart(2,'0')}`;

        const newRecord = {
            pkgName: pkgName,
            price: price,
            date: dateStr,
            status: "Đang chạy",
            timestamp: new Date().getTime() // Để sort mới nhất lên đầu
        };

        const addRequest = store.add(newRecord);

        addRequest.onsuccess = () => {
            alert(`Đã đăng ký thành công gói: ${pkgName}`);
            loadHistoryFromDB(); // Cập nhật lại UI sau khi thêm
        };

        addRequest.onerror = () => {
            alert("Có lỗi xảy ra khi lưu lịch sử đăng ký!");
        };
    }

    // 4. HÀM ĐỌC DỮ LIỆU TỪ INDEXEDDB VÀ HIỂN THỊ RA UI
    function loadHistoryFromDB() {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = (event) => {
            const historyData = event.target.result;
            const historyListContainer = document.getElementById("history-list");

            // Sắp xếp mới nhất lên đầu
            historyData.sort((a, b) => b.timestamp - a.timestamp);

            historyListContainer.innerHTML = ""; // Xóa dữ liệu cũ trên UI

            if (historyData.length === 0) {
                historyListContainer.innerHTML = `<p class="text-muted fs-12 text-center py-3">Chưa có lịch sử đăng ký nào.</p>`;
                return;
            }

            // Render từng item
            historyData.forEach(item => {
                const formattedPrice = parseInt(item.price).toLocaleString('vi-VN') + " đ";
                const isLive = item.status === "Đang chạy";
                const statusClass = isLive ? "status-active" : "status-done";

                const historyHTML = `
                    <div class="history-item">
                        <div class="history-item-header">
                            <span class="history-item-title">${item.pkgName}</span>
                            <span class="status-badge ${statusClass}">${item.status}</span>
                        </div>
                        <div class="history-item-details">
                            <span>Thời gian: ${item.date}</span>
                            <strong class="text-main">${formattedPrice}</strong>
                        </div>
                    </div>
                `;
                historyListContainer.insertAdjacentHTML('beforeend', historyHTML);
            });
        };
    }

    // 5. BẮT SỰ KIỆN CLICK VÀO CÁC NÚT ĐĂNG KÝ GÓI
    const registerButtons = document.querySelectorAll(".register-btn");
    registerButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Lấy thông tin gói từ data-attributes (đã cài đặt trong HTML)
            const pkgName = this.getAttribute("data-pkg");
            const price = this.getAttribute("data-price");

            // Gọi hàm thêm vào DB
            addPackageToHistory(pkgName, price);
        });
    });
});