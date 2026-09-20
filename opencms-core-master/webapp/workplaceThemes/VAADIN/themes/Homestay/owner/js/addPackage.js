document.addEventListener("DOMContentLoaded", () => {

    // 1. CHỨC NĂNG LỌC BỘ NÚT CHUYỂN ĐỔI (Tất cả gói, Gói HOT, Ngắn hạn, Dài hạn)
    const filterButtons = document.querySelectorAll("#pkg-filter-group .filter-btn");
    const packageItems = document.querySelectorAll("#packages-container .package-item");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            // Reset style nút
            filterButtons.forEach(b => {
                b.classList.remove("bg-emerald-800", "text-white", "shadow-sm", "font-semibold");
                b.classList.add("text-slate-600", "hover:bg-slate-200");
            });

            // Set style active cho nút được click
            this.classList.remove("text-slate-600", "hover:bg-slate-200");
            this.classList.add("bg-emerald-800", "text-white", "shadow-sm", "font-semibold");

            const filterValue = this.getAttribute("data-filter");

            // Thực hiện chuyển đổi lọc gói
            packageItems.forEach(item => {
                const categories = item.getAttribute("data-category") ? item.getAttribute("data-category").split(" ") : [];
                if (filterValue === "all" || categories.includes(filterValue)) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });

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

        const today = new Date();
        const dateStr = `${today.getDate().toString().padStart(2,'0')}/${(today.getMonth()+1).toString().padStart(2,'0')}`;

        const newRecord = {
            pkgName: pkgName,
            price: price,
            date: dateStr,
            status: "Đang chạy",
            timestamp: new Date().getTime()
        };

        const addRequest = store.add(newRecord);

        addRequest.onsuccess = () => {
            alert(`Đã đăng ký thành công gói: ${pkgName}`);
            loadHistoryFromDB();
        };

        addRequest.onerror = () => {
            alert("Có lỗi xảy ra khi lưu lịch sử đăng ký!");
        };
    }

    // 4. HÀM ĐỌC DỮ LIỆU TỪ INDEXEDDB VÀ HIỂN THỊ RA UI
    function loadHistoryFromDB() {
        const historyListContainer = document.getElementById("history-list");
        if (!historyListContainer) return; // Tránh lỗi nếu container không xuất hiện trên UI

        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = (event) => {
            const historyData = event.target.result;

            historyData.sort((a, b) => b.timestamp - a.timestamp);
            historyListContainer.innerHTML = "";

            if (historyData.length === 0) {
                historyListContainer.innerHTML = `<p class="text-muted fs-12 text-center py-3">Chưa có lịch sử đăng ký nào.</p>`;
                return;
            }

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

    // 5. XỬ LÝ QUẢN LÝ POPUP (MODAL) XÁC NHẬN DỊCH VỤ
    const modal = document.getElementById("confirmModal");
    const modalPlanName = document.getElementById("modalPlanName");
    const modalPlanDesc = document.getElementById("modalPlanDesc");
    const modalPlanDuration = document.getElementById("modalPlanDuration");
    const modalPlanPrice = document.getElementById("modalPlanPrice");
    const modalPlanFeatures = document.getElementById("modalPlanFeatures");

    const btnCloseX = document.getElementById("btnCloseX");
    const btnCancel = document.getElementById("btnCancel");
    const btnConfirm = document.getElementById("btnConfirm");

    let currentSelectedPkg = null;

    // Hàm mở Modal và đổ dữ liệu gói
    function openModal(btnElement) {
        const pkgName = btnElement.getAttribute("data-pkg");
        const rawPrice = btnElement.getAttribute("data-price");
        const duration = btnElement.getAttribute("data-duration") || "N/A";
        const desc = btnElement.getAttribute("data-desc") || "";
        const rawFeatures = btnElement.getAttribute("data-features") || "";

        currentSelectedPkg = {
            name: pkgName,
            price: rawPrice
        };

        // Gán dữ liệu lên Modal UI
        modalPlanName.textContent = pkgName;
        modalPlanDesc.textContent = desc;
        modalPlanDuration.textContent = duration;
        modalPlanPrice.textContent = parseInt(rawPrice).toLocaleString('vi-VN') + " VNĐ";

        // Tách và dựng danh sách tính năng (Features)
        modalPlanFeatures.innerHTML = "";
        if (rawFeatures) {
            const featuresList = rawFeatures.split(";");
            featuresList.forEach(feat => {
                if (feat.trim()) {
                    const li = document.createElement("li");
                    li.className = "flex items-center gap-2";
                    li.innerHTML = `<span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span> ${feat.trim()}`;
                    modalPlanFeatures.appendChild(li);
                }
            });
        }

        // Hiện modal
        modal.classList.add("active");
    }

    // Hàm đóng Modal
    function closeModal() {
        modal.classList.remove("active");
        currentSelectedPkg = null;
    }

    // Bắt sự kiện click nút Đăng ký ngay / Kích hoạt gói để bật Modal
    document.addEventListener("click", function(e) {
        const btn = e.target.closest(".register-btn");
        if (btn) {
            openModal(btn);
        }
    });

    // Các sự kiện đóng Modal
    if (btnCloseX) btnCloseX.addEventListener("click", closeModal);
    if (btnCancel) btnCancel.addEventListener("click", closeModal);

    // Đóng Modal khi bấm ra ngoài vùng nội dung
    if (modal) {
        modal.addEventListener("click", function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Bắt sự kiện người dùng bấm "Xác nhận đăng ký"
    if (btnConfirm) {
        btnConfirm.addEventListener("click", function() {
            if (currentSelectedPkg) {
                addPackageToHistory(currentSelectedPkg.name, currentSelectedPkg.price);
                closeModal();
            }
        });
    }
});