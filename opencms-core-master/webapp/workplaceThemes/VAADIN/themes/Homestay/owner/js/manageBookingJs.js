// manageBookingJs.js - Hệ thống quản trị và xử lý toàn bộ Popup / Modal tương tác cho trang Quản lý đơn đặt phòng

// 1. Dữ liệu mẫu chi tiết của các đơn đặt phòng (Mock Data Store)
const bookingDataStore = {
    "BK-9842": {
        id: "BK-9842",
        source: "OTA Sàn VN",
        guestName: "Nguyễn Thị Mai",
        phone: "0982 341 112",
        email: "mai.nguyen@gmail.com",
        cccd: "001198034521",
        avatar: "M",
        avatarBg: "bg-secondary-fixed-dim/40 text-on-secondary-fixed",
        avatarImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0LFSerZuRWRa-xYFKGn0v9Z7yaO3TJcniYry7vFR_CNLVdUzBx82AtU9qTsUosSm_cVRV-LR_jKwTuoFPG-EeKZkuXgN-XFKhCKmGUPU95IYF-Neyeva84ZwupG97XUHWs8qt5O8BKkpjXazR3XTGVmtlpdT64Cal4NtBQx_mNvBXaGg33t8hGkimNQpk6iGHK7QXHMZkp17dvnr72Tgr-dgQV9ur5Zr1URU3oLW1q2Pndz6dbLs",
        city: "Quận Cầu Giấy, Hà Nội",
        roomType: "Phòng Mountain View (Nhà Gỗ)",
        roomCode: "Mountain View #01",
        guestsCount: "2 người lớn",
        checkIn: "17/09/2024",
        checkInTime: "14:00 (Hôm nay)",
        checkOut: "20/09/2024",
        checkOutTime: "12:00",
        nights: 3,
        depositStatus: "Đã thanh toán sàn",
        depositAmount: 1500000,
        totalAmount: 2850000,
        remainAmount: 1350000,
        status: "Chờ Check-in",
        statusBadge: "bg-surface-container-highest text-primary",
        specialRequest: "Ăn tối cơm lam thịt nướng tại homestay lúc 18h30. Nhờ chuẩn bị trước lò nướng than mộc ngoài sân.",
        services: [
            { name: "Cơm lam thịt nướng Mai Châu", qty: 2, price: 180000, total: 360000 }
        ],
        timeline: [
            { title: "Đặt phòng trực tuyến qua Sàn OTA", time: "15/09/2024 10:20", status: "done" },
            { title: "Sàn xác nhận giữ cọc 1.500.000đ", time: "15/09/2024 10:25", status: "done" },
            { title: "Chuẩn bị phòng Mountain View #01", time: "17/09/2024 11:30", status: "done" },
            { title: "Chờ khách check-in và nhận phòng", time: "Hôm nay 14:00", status: "current" }
        ]
    },
    "BK-9839": {
        id: "BK-9839",
        source: "Trực tiếp",
        guestName: "Lê Văn Hiếu",
        phone: "0915 884 920",
        email: "hieule.van@outlook.com",
        cccd: "034093012845",
        avatar: "H",
        avatarBg: "bg-primary-fixed text-on-primary-fixed",
        city: "TP. Nam Định",
        roomType: "Phòng Lake View (Ven Hồ)",
        roomCode: "Lake View #02",
        guestsCount: "2 người lớn",
        checkIn: "16/09/2024",
        checkInTime: "14:00",
        checkOut: "18/09/2024",
        checkOutTime: "12:00 (Mai trả phòng)",
        nights: 2,
        depositStatus: "Đã cọc 50% tiền mặt",
        depositAmount: 1000000,
        totalAmount: 2200000,
        remainAmount: 1200000,
        status: "Đang ở",
        statusBadge: "bg-secondary-container text-on-secondary-container",
        specialRequest: "Bổ sung thêm củi lửa trại và ngô nướng ngoài thềm tối nay lúc 20h00.",
        services: [
            { name: "Thuê xe máy dạo bản Lác (1 ngày)", qty: 1, price: 150000, total: 150000 },
            { name: "Set lửa trại & bắp khoai nướng", qty: 1, price: 250000, total: 250000 }
        ],
        timeline: [
            { title: "Tạo đơn đặt phòng trực tiếp qua Zalo", time: "12/09/2024 14:00", status: "done" },
            { title: "Đã nhận cọc chuyển khoản 1.000.000đ", time: "12/09/2024 14:15", status: "done" },
            { title: "Đã Check-in nhận phòng Lake View #02", time: "16/09/2024 14:10", status: "done" },
            { title: "Đang lưu trú tại Homestay", time: "Hiện tại", status: "current" }
        ]
    },
    "BK-9830": {
        id: "BK-9830",
        source: "OTA Sàn VN",
        guestName: "Phạm Thị Lan",
        phone: "0903 442 771",
        email: "lanpham.vn@gmail.com",
        cccd: "025091004523",
        avatar: "L",
        avatarBg: "bg-surface-container-highest text-on-surface",
        city: "Quận 1, TP. Hồ Chí Minh",
        roomType: "Bungalow Suối",
        roomCode: "Bungalow Suối #01",
        guestsCount: "4 người lớn",
        checkIn: "14/09/2024",
        checkInTime: "14:00",
        checkOut: "16/09/2024",
        checkOutTime: "12:00 (Đã trả hôm qua)",
        nights: 2,
        depositStatus: "Đã quyết toán",
        depositAmount: 1500000,
        totalAmount: 3100000,
        remainAmount: 0,
        status: "Đã hoàn tất",
        statusBadge: "bg-surface-container text-on-surface-variant",
        specialRequest: "Đoàn gia đình có trẻ em, nhờ chuẩn bị bữa sáng xôi nếp nương Mai Châu.",
        services: [
            { name: "Phòng Bungalow Suối (2 đêm)", qty: 2, price: 1250000, total: 2500000 },
            { name: "Mẹt ẩm thực Tây Bắc & Gà đồi nướng", qty: 1, price: 600000, total: 600000 }
        ],
        invoiceNo: "HD-20240916-003",
        invoiceDate: "16/09/2024 11:45",
        timeline: [
            { title: "Khách đặt phòng trên OTA Sàn VN", time: "10/09/2024 09:12", status: "done" },
            { title: "Check-in Bungalow Suối #01", time: "14/09/2024 14:05", status: "done" },
            { title: "Sử dụng set ẩm thực gà đồi xôi nếp", time: "15/09/2024 19:00", status: "done" },
            { title: "Check-out & Thanh toán hoàn tất", time: "16/09/2024 11:45", status: "done" }
        ]
    },
    "BK-9850": {
        id: "BK-9850",
        source: "Web Homestay",
        guestName: "Trần Tuấn Kiệt",
        phone: "0977 123 445",
        email: "tuankiet.tran@gmail.com",
        cccd: "031094002931",
        avatar: "K",
        avatarBg: "bg-tertiary-fixed text-on-tertiary-fixed",
        city: "TP. Hải Phòng",
        roomType: "Nhà Sàn Trải Nghiệm",
        roomCode: "Nhà Sàn Tập Thể",
        guestsCount: "6 khách đoàn",
        checkIn: "18/09/2024",
        checkInTime: "14:00 (Ngày mai đến)",
        checkOut: "20/09/2024",
        checkOutTime: "12:00",
        nights: 2,
        depositStatus: "Chờ duyệt cọc",
        depositAmount: 2100000,
        totalAmount: 4200000,
        remainAmount: 2100000,
        status: "Chờ xác nhận",
        statusBadge: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
        specialRequest: "Đoàn chụp ảnh kỷ yếu, nhờ hỗ trợ 6 bộ trang phục Thái và chuẩn bị loa kéo hát giao lưu.",
        bankTransferInfo: {
            bankName: "Vietcombank - Chi nhánh Tây Hà Nội",
            accountNumber: "0491000128932",
            accountName: "HOMESTAY NHA SAN MOC",
            amountTransferred: "2.100.000 VNĐ",
            transferContent: "BK9850 Tran Tuan Kiet dat phong nha san",
            transferDate: "17/09/2024 08:35:12",
            transferCode: "FT24261899201"
        },
        services: [],
        timeline: [
            { title: "Khách gửi yêu cầu đặt phòng trên Website", time: "17/09/2024 08:20", status: "done" },
            { title: "Khách chuyển khoản tiền cọc 50%", time: "17/09/2024 08:35", status: "done" },
            { title: "Chờ chủ Homestay đối soát ngân hàng", time: "Hiện tại", status: "current" }
        ]
    }
};

// Biến lưu trữ booking đang thao tác hiện tại
let currentActiveBookingId = "BK-9842";

// 2. Khởi tạo và Bắt sự kiện khi tải trang xong
document.addEventListener("DOMContentLoaded", function () {
    initStatusTabs();
    initGlobalModalTriggers();
    initDirectBookingCalculator();
    initModalEscAndBackdrop();
});

// 3. Xử lý chuyển tab trạng thái (Status Tabs)
function initStatusTabs() {
    const tabs = document.querySelectorAll('.status-tab');
    tabs.forEach(button => {
        button.addEventListener('click', function () {
            tabs.forEach(b => {
                b.className = 'status-tab px-space-sm py-1 rounded-full text-label-md font-label-md whitespace-nowrap bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all';
            });
            this.className = 'status-tab px-space-sm py-1 rounded-full text-label-md font-label-md whitespace-nowrap bg-primary text-on-primary transition-all custom-primary-bg';

            const filterText = this.textContent.trim();
            filterTableRows(filterText);
        });
    });

    // Lọc theo thanh tìm kiếm
    const searchInput = document.getElementById("bookingSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = this.value.toLowerCase().trim();
            const rows = document.querySelectorAll("tbody tr");
            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(query) ? "" : "none";
            });
        });
    }
}

function filterTableRows(filterText) {
    const rows = document.querySelectorAll("tbody tr");
    if (filterText.includes("Tất cả")) {
        rows.forEach(r => r.style.display = "");
        return;
    }

    rows.forEach(row => {
        const text = row.innerText;
        if (filterText.includes("Chờ xác nhận") && text.includes("Chờ xác nhận")) {
            row.style.display = "";
        } else if (filterText.includes("Đã cọc") && (text.includes("Chờ Check-in") || text.includes("Đã cọc"))) {
            row.style.display = "";
        } else if (filterText.includes("Đang ở") && text.includes("Đang ở")) {
            row.style.display = "";
        } else if (filterText.includes("Đã hoàn tất") && text.includes("Đã hoàn tất")) {
            row.style.display = "";
        } else if (filterText.includes("Đã hủy") && text.includes("Đã hủy")) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// 4. Bắt sự kiện toàn cầu cho các nút mở Popup
function initGlobalModalTriggers() {
    // 4.1 Nút "Tạo đơn đặt phòng trực tiếp" trên Top Banner
    const createBtns = document.querySelectorAll("button");
    createBtns.forEach(btn => {
        const txt = btn.textContent.trim();
        if (txt.includes("Tạo đơn đặt phòng trực tiếp")) {
            btn.onclick = (e) => {
                e.preventDefault();
                openModal("createBookingModal");
            };
        } else if (txt.includes("Xuất file Excel / Báo cáo")) {
            btn.onclick = (e) => {
                e.preventDefault();
                openModal("exportReportModal");
            };
        } else if (txt.includes("Đánh dấu khách đã nhận phòng")) {
            btn.onclick = (e) => {
                e.preventDefault();
                openCheckinModal("BK-9842");
            };
        } else if (txt.includes("Gọi cho khách")) {
            btn.onclick = (e) => {
                e.preventDefault();
                openContactModal("BK-9842", "call");
            };
        } else if (txt.includes("Nhắn qua sàn")) {
            btn.onclick = (e) => {
                e.preventDefault();
                openContactModal("BK-9842", "chat");
            };
        }
    });

    // 4.2 Gán sự kiện cho các hàng trong bảng
    attachTableRowActions();
}

function attachTableRowActions() {
    // Hàng 1: #BK-9842 (Nguyễn Thị Mai - Chờ Check-in)
    // Hàng 2: #BK-9839 (Lê Văn Hiếu - Đang ở)
    // Hàng 3: #BK-9830 (Phạm Thị Lan - Đã hoàn tất)
    // Hàng 4: #BK-9850 (Trần Tuấn Kiệt - Chờ xác nhận)
    const rows = document.querySelectorAll("tbody tr");
    const rowIds = ["BK-9842", "BK-9839", "BK-9830", "BK-9850"];

    rows.forEach((row, index) => {
        const bookingId = rowIds[index] || "BK-9842";

        // Tìm nút xem chi tiết
        const detailBtn = row.querySelector("button[title='Chi tiết booking']") || row.querySelector("button:has(.material-symbols-outlined)");
        if (detailBtn) {
            detailBtn.onclick = (e) => {
                e.preventDefault();
                openDetailModal(bookingId);
            };
        }

        // Tìm các nút thao tác khác trong hàng
        const buttons = row.querySelectorAll("button");
        buttons.forEach(btn => {
            const txt = btn.textContent.trim();
            if (txt === "Check-in") {
                btn.onclick = (e) => {
                    e.preventDefault();
                    openCheckinModal(bookingId);
                };
            } else if (txt === "Check-out") {
                btn.onclick = (e) => {
                    e.preventDefault();
                    openCheckoutModal(bookingId);
                };
            } else if (txt === "+ Dịch vụ") {
                btn.onclick = (e) => {
                    e.preventDefault();
                    openAddServiceModal(bookingId);
                };
            } else if (txt === "Xem hóa đơn") {
                btn.onclick = (e) => {
                    e.preventDefault();
                    openInvoiceModal(bookingId);
                };
            } else if (txt === "Duyệt") {
                btn.onclick = (e) => {
                    e.preventDefault();
                    openApproveModal(bookingId);
                };
            } else if (txt === "Từ chối") {
                btn.onclick = (e) => {
                    e.preventDefault();
                    openRejectModal(bookingId);
                };
            }
        });
    });
}

// 5. Các hàm điều khiển Modal Chung (đồng bộ với manageRoom)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    // Bỏ thuộc tính hidden nếu có (giống room-modal)
    modal.removeAttribute("hidden");
    // Sau 1 frame thêm is-open để kích hoạt CSS transition
    requestAnimationFrame(() => {
        modal.classList.add("is-open");
    });
    document.body.classList.add("modal-open");
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove("is-open");
    // Đợi transition xong rồi mới ẩn hẳn
    modal.addEventListener("transitionend", function handler() {
        if (!modal.classList.contains("is-open")) {
            modal.setAttribute("hidden", "");
        }
        modal.removeEventListener("transitionend", handler);
    });
    // Kiểm tra nếu không còn modal nào mở thì xóa class modal-open
    setTimeout(() => {
        const openModals = document.querySelectorAll(".bk-modal.is-open");
        if (openModals.length === 0) {
            document.body.classList.remove("modal-open");
        }
    }, 250);
}

// Đóng modal khi ấn ESC hoặc ấn ra ngoài phần backdrop xám
function initModalEscAndBackdrop() {
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            const openModals = document.querySelectorAll(".bk-modal.is-open");
            openModals.forEach(m => closeModal(m.id));
        }
    });

    // Bắt sự kiện click backdrop để đóng modal
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("bk-modal") && e.target.classList.contains("is-open")) {
            closeModal(e.target.id);
        }
    });

    // Nút đóng dùng data-close-modal
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
        btn.addEventListener("click", function () {
            closeModal(this.dataset.closeModal);
        });
    });
}

// 6. LOGIC MỞ CÁC POPUP CỤ THỂ VÀ ĐIỀN DỮ LIỆU ĐỘNG

// 6.1 Mở Popup Chi tiết Booking
function openDetailModal(bookingId) {
    currentActiveBookingId = bookingId;
    const data = bookingDataStore[bookingId];
    if (!data) return;

    document.getElementById("detailModalBookingId").textContent = "#" + data.id;
    document.getElementById("detailModalSource").textContent = data.source;
    document.getElementById("detailModalGuestName").textContent = data.guestName;
    document.getElementById("detailModalPhone").textContent = data.phone;
    document.getElementById("detailModalEmail").textContent = data.email;
    document.getElementById("detailModalCccd").textContent = data.cccd;
    document.getElementById("detailModalCity").textContent = data.city;
    document.getElementById("detailModalRoom").textContent = data.roomCode;
    document.getElementById("detailModalRoomType").textContent = data.roomType;
    document.getElementById("detailModalGuests").textContent = data.guestsCount;
    document.getElementById("detailModalSchedule").textContent = `${data.checkIn} - ${data.checkOut} (${data.nights} đêm)`;
    document.getElementById("detailModalDeposit").textContent = formatVND(data.depositAmount);
    document.getElementById("detailModalTotal").textContent = formatVND(data.totalAmount);
    document.getElementById("detailModalRemain").textContent = formatVND(data.remainAmount);
    document.getElementById("detailModalRequest").textContent = data.specialRequest || "Không có yêu cầu đặc biệt";

    // Đổi Avatar chữ cái
    const avatarEl = document.getElementById("detailModalAvatar");
    avatarEl.textContent = data.avatar;
    avatarEl.className = `w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 ${data.avatarBg}`;

    // Đổi Badge trạng thái
    const badgeEl = document.getElementById("detailModalStatus");
    badgeEl.textContent = data.status;
    badgeEl.className = `px-space-sm py-1 rounded-full text-label-md font-bold ${data.statusBadge}`;

    // Render danh sách dịch vụ đã dùng
    const servicesContainer = document.getElementById("detailModalServicesList");
    if (servicesContainer) {
        if (data.services && data.services.length > 0) {
            servicesContainer.innerHTML = data.services.map(s => `
                <div class="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-body-sm">
                    <span class="text-on-surface font-medium">${s.name} <span class="text-outline">(x${s.qty})</span></span>
                    <span class="font-bold text-primary">${formatVND(s.total)}</span>
                </div>
            `).join("");
        } else {
            servicesContainer.innerHTML = `<span class="text-body-sm text-outline italic">Chưa phát sinh dịch vụ phụ</span>`;
        }
    }

    // Render Timeline tiến trình
    const timelineContainer = document.getElementById("detailModalTimeline");
    if (timelineContainer && data.timeline) {
        timelineContainer.innerHTML = data.timeline.map((step, idx) => `
            <div class="flex items-start gap-space-xs relative">
                <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${step.status === 'done' ? 'bg-secondary text-on-secondary' : 'bg-secondary-container text-on-secondary-container animate-pulse'}">
                    <span class="material-symbols-outlined text-[14px]">${step.status === 'done' ? 'check' : 'schedule'}</span>
                </div>
                <div class="flex flex-col">
                    <span class="font-label-md text-label-md ${step.status === 'done' ? 'text-on-surface' : 'text-secondary font-bold'}">${step.title}</span>
                    <span class="text-body-sm text-outline text-[11px]">${step.time}</span>
                </div>
            </div>
        `).join("");
    }

    // Cập nhật các nút hành động chân modal dựa vào trạng thái booking
    // (dùng class bk-btn để đồng bộ với popup của trang Quản lý phòng)
    const actionContainer = document.getElementById("detailModalActions");
    if (actionContainer) {
        const closeBtn = `<button onclick="closeModal('detailBookingModal')" class="bk-btn bk-btn-cancel" type="button">Đóng</button>`;

        if (data.status === "Chờ Check-in") {
            actionContainer.innerHTML = `
                ${closeBtn}
                <div class="flex items-center gap-space-xs">
                    <button onclick="closeModal('detailBookingModal'); openContactModal('${data.id}', 'call')" class="bk-btn bk-btn-ghost" type="button">
                        <span class="material-symbols-outlined text-[17px]">call</span> Gọi điện
                    </button>
                    <button onclick="closeModal('detailBookingModal'); openCheckinModal('${data.id}')" class="bk-btn bk-btn-save" type="button">
                        <span class="material-symbols-outlined text-[17px]">login</span> Check-in ngay
                    </button>
                </div>
            `;
        } else if (data.status === "Đang ở") {
            actionContainer.innerHTML = `
                ${closeBtn}
                <div class="flex items-center gap-space-xs">
                    <button onclick="closeModal('detailBookingModal'); openAddServiceModal('${data.id}')" class="bk-btn bk-btn-ghost" type="button">
                        <span class="material-symbols-outlined text-[17px]">add_circle</span> Dịch vụ
                    </button>
                    <button onclick="closeModal('detailBookingModal'); openCheckoutModal('${data.id}')" class="bk-btn bk-btn-save" type="button">
                        <span class="material-symbols-outlined text-[17px]">logout</span> Check-out & Quyết toán
                    </button>
                </div>
            `;
        } else if (data.status === "Chờ xác nhận") {
            actionContainer.innerHTML = `
                ${closeBtn}
                <div class="flex items-center gap-space-xs">
                    <button onclick="closeModal('detailBookingModal'); openRejectModal('${data.id}')" class="bk-btn bk-btn-danger-soft" type="button">Từ chối</button>
                    <button onclick="closeModal('detailBookingModal'); openApproveModal('${data.id}')" class="bk-btn bk-btn-save" type="button">
                        <span class="material-symbols-outlined text-[17px]">verified_user</span> Duyệt cọc
                    </button>
                </div>
            `;
        } else {
            actionContainer.innerHTML = `
                ${closeBtn}
                <button onclick="closeModal('detailBookingModal'); openInvoiceModal('${data.id}')" class="bk-btn bk-btn-save" type="button">
                    <span class="material-symbols-outlined text-[17px]">receipt_long</span> Xem hóa đơn thanh toán
                </button>
            `;
        }
    }

    openModal("detailBookingModal");
}

// 6.2 Mở Popup Xác nhận Check-in
function openCheckinModal(bookingId) {
    currentActiveBookingId = bookingId;
    const data = bookingDataStore[bookingId];
    if (!data) return;

    document.getElementById("checkinModalBookingId").textContent = "#" + data.id;
    document.getElementById("checkinModalGuestName").textContent = data.guestName;
    document.getElementById("checkinModalPhone").textContent = data.phone;
    document.getElementById("checkinModalRoom").textContent = data.roomCode;
    document.getElementById("checkinModalSchedule").textContent = `${data.checkIn} - ${data.checkOut}`;
    document.getElementById("checkinModalRemain").textContent = formatVND(data.remainAmount);

    openModal("checkinModal");
}

// Xác nhận thủ tục Check-in thành công
function confirmCheckin() {
    const data = bookingDataStore[currentActiveBookingId];
    if (data) {
        data.status = "Đang ở";
        data.remainAmount = 0;
        showToast("Check-in thành công!", `Đã bàn giao phòng ${data.roomCode} cho khách ${data.guestName}`, "success");
    }
    closeModal("checkinModal");
}

// 6.3 Mở Popup Check-out & Quyết toán
function openCheckoutModal(bookingId) {
    currentActiveBookingId = bookingId;
    const data = bookingDataStore[bookingId];
    if (!data) return;

    document.getElementById("checkoutModalBookingId").textContent = "#" + data.id;
    document.getElementById("checkoutModalGuestName").textContent = data.guestName;
    document.getElementById("checkoutModalRoom").textContent = data.roomCode;
    document.getElementById("checkoutModalRemainRoom").textContent = formatVND(data.remainAmount);

    // Tính tổng tiền dịch vụ phát sinh
    let serviceTotal = 0;
    if (data.services && data.services.length > 0) {
        serviceTotal = data.services.reduce((acc, cur) => acc + cur.total, 0);
        document.getElementById("checkoutModalServicesList").innerHTML = data.services.map(s => `
            <div class="flex items-center justify-between text-body-sm py-1 border-b border-surface-container">
                <span class="text-on-surface">${s.name} (x${s.qty})</span>
                <span class="font-semibold text-on-surface">${formatVND(s.total)}</span>
            </div>
        `).join("");
    } else {
        document.getElementById("checkoutModalServicesList").innerHTML = `<span class="text-body-sm text-outline italic">Không có dịch vụ phát sinh</span>`;
    }

    document.getElementById("checkoutModalServiceTotal").textContent = formatVND(serviceTotal);
    const finalTotal = data.remainAmount + serviceTotal;
    document.getElementById("checkoutModalFinalTotal").textContent = formatVND(finalTotal);

    openModal("checkoutModal");
}

function confirmCheckout() {
    const data = bookingDataStore[currentActiveBookingId];
    if (data) {
        data.status = "Đã hoàn tất";
        data.remainAmount = 0;
        showToast("Check-out thành công!", `Đã quyết toán và giải phóng phòng ${data.roomCode}`, "success");
    }
    closeModal("checkoutModal");
}

// 6.4 Mở Popup Thêm Dịch Vụ
function openAddServiceModal(bookingId) {
    currentActiveBookingId = bookingId;
    const data = bookingDataStore[bookingId];
    if (!data) return;

    document.getElementById("addServiceModalBookingId").textContent = "#" + data.id + " (" + data.guestName + " - " + data.roomCode + ")";

    // Reset các bộ đếm số lượng về 0
    document.querySelectorAll(".service-qty-input").forEach(inp => inp.value = "0");
    updateServiceTotalSummary();

    openModal("addServiceModal");
}

function adjustServiceQty(btn, change) {
    const parent = btn.closest(".service-counter-wrap");
    const input = parent.querySelector(".service-qty-input");
    let currentVal = parseInt(input.value) || 0;
    currentVal = Math.max(0, currentVal + change);
    input.value = currentVal;
    updateServiceTotalSummary();
}

function updateServiceTotalSummary() {
    let total = 0;
    let count = 0;
    document.querySelectorAll(".service-item-row").forEach(row => {
        const price = parseInt(row.getAttribute("data-price")) || 0;
        const qty = parseInt(row.querySelector(".service-qty-input").value) || 0;
        if (qty > 0) {
            total += price * qty;
            count += qty;
        }
    });

    const sumEl = document.getElementById("addServiceTotalSum");
    if (sumEl) sumEl.textContent = formatVND(total);
}

function saveAddedServices() {
    const data = bookingDataStore[currentActiveBookingId];
    let addedCount = 0;

    document.querySelectorAll(".service-item-row").forEach(row => {
        const name = row.getAttribute("data-name");
        const price = parseInt(row.getAttribute("data-price")) || 0;
        const qty = parseInt(row.querySelector(".service-qty-input").value) || 0;
        if (qty > 0 && data) {
            data.services = data.services || [];
            data.services.push({
                name: name,
                qty: qty,
                price: price,
                total: price * qty
            });
            addedCount += qty;
        }
    });

    if (addedCount > 0) {
        showToast("Thêm dịch vụ thành công!", `Đã ghi nhận ${addedCount} món/dịch vụ vào đơn #${data.id}`, "success");
    } else {
        showToast("Thông báo", "Chưa có dịch vụ nào được chọn", "info");
    }

    closeModal("addServiceModal");
}

// 6.5 Mở Popup Hóa đơn Thanh toán (Invoice)
function openInvoiceModal(bookingId) {
    currentActiveBookingId = bookingId;
    const data = bookingDataStore[bookingId];
    if (!data) return;

    document.getElementById("invModalNumber").textContent = data.invoiceNo || "HD-20240917-00" + Math.floor(Math.random() * 90 + 10);
    document.getElementById("invModalDate").textContent = data.invoiceDate || "17/09/2024 12:00";
    document.getElementById("invModalGuestName").textContent = data.guestName;
    document.getElementById("invModalPhone").textContent = data.phone;
    document.getElementById("invModalCccd").textContent = data.cccd;
    document.getElementById("invModalRoom").textContent = data.roomCode;
    document.getElementById("invModalSchedule").textContent = `${data.checkIn} đến ${data.checkOut} (${data.nights} đêm)`;

    // Bảng kê chi phí
    const itemsTable = document.getElementById("invModalItemsTable");
    let rowsHtml = `
        <tr class="border-b border-surface-container-low">
            <td class="py-2.5 px-3">1</td>
            <td class="py-2.5 px-3 font-medium text-on-surface">Tiền phòng: ${data.roomType}</td>
            <td class="py-2.5 px-3 text-center">${data.nights} đêm</td>
            <td class="py-2.5 px-3 text-right">${formatVND(data.totalAmount - (data.services ? data.services.reduce((a,c)=>a+c.total,0) : 0))}</td>
            <td class="py-2.5 px-3 text-right font-bold text-on-surface">${formatVND(data.totalAmount - (data.services ? data.services.reduce((a,c)=>a+c.total,0) : 0))}</td>
        </tr>
    `;

    if (data.services && data.services.length > 0) {
        data.services.forEach((s, idx) => {
            rowsHtml += `
                <tr class="border-b border-surface-container-low">
                    <td class="py-2 px-3">${idx + 2}</td>
                    <td class="py-2 px-3 text-on-surface">${s.name}</td>
                    <td class="py-2 px-3 text-center">${s.qty}</td>
                    <td class="py-2 px-3 text-right">${formatVND(s.price)}</td>
                    <td class="py-2 px-3 text-right font-bold text-on-surface">${formatVND(s.total)}</td>
                </tr>
            `;
        });
    }

    itemsTable.innerHTML = rowsHtml;
    document.getElementById("invModalTotal").textContent = formatVND(data.totalAmount);
    document.getElementById("invModalDeposit").textContent = "-" + formatVND(data.depositAmount);
    document.getElementById("invModalFinalPaid").textContent = formatVND(data.totalAmount - data.depositAmount);

    openModal("invoiceModal");
}

function printInvoice() {
    window.print();
}

// 6.6 Mở Popup Duyệt Đơn & Xác nhận cọc
function openApproveModal(bookingId) {
    currentActiveBookingId = bookingId;
    const data = bookingDataStore[bookingId];
    if (!data) return;

    document.getElementById("approveModalBookingId").textContent = "#" + data.id;
    document.getElementById("approveModalGuestName").textContent = data.guestName;
    document.getElementById("approveModalRoom").textContent = data.roomCode;
    document.getElementById("approveModalAmount").textContent = formatVND(data.depositAmount);

    if (data.bankTransferInfo) {
        document.getElementById("approveModalBankInfo").textContent = `${data.bankTransferInfo.bankName} - Số GD: ${data.bankTransferInfo.transferCode}`;
        document.getElementById("approveModalContent").textContent = data.bankTransferInfo.transferContent;
        document.getElementById("approveModalTransferDate").textContent = data.bankTransferInfo.transferDate;
    }

    openModal("approveBookingModal");
}

function confirmApproveBooking() {
    const data = bookingDataStore[currentActiveBookingId];
    if (data) {
        data.status = "Chờ Check-in";
        data.depositStatus = "Đã nhận đủ cọc";
        showToast("Đã duyệt đơn thành công!", `Đã xác nhận cọc ${formatVND(data.depositAmount)} cho khách ${data.guestName}`, "success");
    }
    closeModal("approveBookingModal");
}

// 6.7 Mở Popup Từ chối Đơn
function openRejectModal(bookingId) {
    currentActiveBookingId = bookingId;
    const data = bookingDataStore[bookingId];
    if (!data) return;

    document.getElementById("rejectModalBookingId").textContent = "#" + data.id;
    document.getElementById("rejectModalGuestName").textContent = data.guestName;

    openModal("rejectBookingModal");
}

function confirmRejectBooking() {
    const data = bookingDataStore[currentActiveBookingId];
    if (data) {
        data.status = "Đã hủy";
        showToast("Đã từ chối đơn!", `Đã gửi thông báo hủy đơn #${data.id} đến khách hàng`, "info");
    }
    closeModal("rejectBookingModal");
}

// 6.8 Mở Popup Liên hệ khách hàng (Gọi điện / Nhắn tin)
function openContactModal(bookingId, tab = "call") {
    currentActiveBookingId = bookingId;
    const data = bookingDataStore[bookingId];
    if (!data) return;

    document.getElementById("contactModalGuestName").textContent = data.guestName;
    document.getElementById("contactModalPhone").textContent = data.phone;
    document.getElementById("contactModalBookingId").textContent = "#" + data.id + " (" + data.roomCode + ")";

    switchContactTab(tab);
    openModal("contactGuestModal");
}

function switchContactTab(tab) {
    const callTabBtn = document.getElementById("contactTabCallBtn");
    const chatTabBtn = document.getElementById("contactTabChatBtn");
    const callSection = document.getElementById("contactCallSection");
    const chatSection = document.getElementById("contactChatSection");

    if (tab === "call") {
        callTabBtn.className = "flex-1 py-2 rounded-lg font-label-md text-label-md font-bold bg-primary text-on-primary transition-all custom-primary-bg";
        chatTabBtn.className = "flex-1 py-2 rounded-lg font-label-md text-label-md font-medium text-on-surface-variant hover:bg-surface-container-high transition-all";
        callSection.classList.remove("hidden");
        chatSection.classList.add("hidden");
    } else {
        chatTabBtn.className = "flex-1 py-2 rounded-lg font-label-md text-label-md font-bold bg-primary text-on-primary transition-all custom-primary-bg";
        callTabBtn.className = "flex-1 py-2 rounded-lg font-label-md text-label-md font-medium text-on-surface-variant hover:bg-surface-container-high transition-all";
        chatSection.classList.remove("hidden");
        callSection.classList.add("hidden");
    }
}

function selectMessageTemplate(templateText) {
    const textarea = document.getElementById("contactChatMessageInput");
    if (textarea) {
        textarea.value = templateText;
    }
}

function sendContactMessage() {
    const textarea = document.getElementById("contactChatMessageInput");
    if (textarea && textarea.value.trim()) {
        showToast("Tin nhắn đã gửi!", "Đã gửi tin nhắn đến khách hàng qua kênh sàn / Zalo", "success");
        closeModal("contactGuestModal");
    } else {
        showToast("Cảnh báo", "Vui lòng nhập nội dung tin nhắn trước khi gửi", "error");
    }
}

// 6.9 Tính tiền tự động khi tạo đơn trực tiếp
function initDirectBookingCalculator() {
    const roomSelect = document.getElementById("newBookingRoomSelect");
    const checkinInput = document.getElementById("newBookingCheckIn");
    const checkoutInput = document.getElementById("newBookingCheckOut");

    // Đặt ngày mặc định hôm nay và ngày mai
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 2);

    if (checkinInput && checkoutInput) {
        checkinInput.value = today.toISOString().split("T")[0];
        checkoutInput.value = tomorrow.toISOString().split("T")[0];

        [roomSelect, checkinInput, checkoutInput].forEach(el => {
            if (el) el.addEventListener("change", calculateDirectBookingTotal);
        });
    }
}

function calculateDirectBookingTotal() {
    const roomPriceMap = {
        "mountain": 950000,
        "lake": 1100000,
        "bungalow": 1250000,
        "dorm": 350000
    };

    const roomSelect = document.getElementById("newBookingRoomSelect");
    const checkinInput = document.getElementById("newBookingCheckIn");
    const checkoutInput = document.getElementById("newBookingCheckOut");

    if (!roomSelect || !checkinInput || !checkoutInput) return;

    const pricePerNight = roomPriceMap[roomSelect.value] || 950000;
    const d1 = new Date(checkinInput.value);
    const d2 = new Date(checkoutInput.value);

    let diffDays = 1;
    if (d2 > d1) {
        const diffTime = Math.abs(d2 - d1);
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const total = pricePerNight * diffDays;
    const deposit = Math.round(total * 0.5);

    const priceNightEl = document.getElementById("newBookingPricePerNight");
    const nightsEl = document.getElementById("newBookingNightsCount");
    const totalEl = document.getElementById("newBookingEstimatedTotal");
    const depositInp = document.getElementById("newBookingDepositInput");

    if (priceNightEl) priceNightEl.textContent = formatVND(pricePerNight);
    if (nightsEl) nightsEl.textContent = diffDays + " đêm";
    if (totalEl) totalEl.textContent = formatVND(total);
    if (depositInp && (!depositInp.value || depositInp.dataset.manual !== "true")) {
        depositInp.value = deposit;
    }
}

function submitNewBooking() {
    const nameInp = document.getElementById("newBookingGuestName");
    const phoneInp = document.getElementById("newBookingPhone");

    if (!nameInp || !nameInp.value.trim()) {
        showToast("Thiếu thông tin", "Vui lòng nhập họ tên khách hàng", "error");
        nameInp.focus();
        return;
    }
    if (!phoneInp || !phoneInp.value.trim()) {
        showToast("Thiếu thông tin", "Vui lòng nhập số điện thoại khách hàng", "error");
        phoneInp.focus();
        return;
    }

    showToast("Tạo đơn thành công!", `Đã lưu đơn đặt phòng cho khách ${nameInp.value}`, "success");
    closeModal("createBookingModal");
}

// 6.10 Xuất báo cáo Excel / CSV
function handleExportReport() {
    showToast("Đang tải xuống...", "Hệ thống đang xuất file Excel dữ liệu booking tháng 9...", "info");
    setTimeout(() => {
        showToast("Hoàn tất xuất file!", "File Báo_cáo_đơn_đặt_phòng_MaiChau.xlsx đã được lưu về máy", "success");
        closeModal("exportReportModal");
    }, 900);
}

// 7. TIỆN ÍCH ĐỊNH DẠNG TIỀN TỆ & HỆ THỐNG THÔNG BÁO TOAST
function formatVND(num) {
    if (isNaN(num)) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(num) + "đ";
}

// Toast đồng bộ kiểu với trang Quản lý phòng (góc phải dưới, nền xanh đậm)
function showToast(title, message, type = "success") {
    let box = document.getElementById("bkToastBox");

    if (!box) {
        box = document.createElement("div");
        box.id = "bkToastBox";
        box.className = "bk-toast-box";
        document.body.appendChild(box);
    }

    const icon = type === "success" ? "check_circle" : type === "error" ? "error" : "info";

    const toast = document.createElement("div");
    toast.className = "bk-toast bk-toast-" + type;

    toast.innerHTML = `
        <span class="material-symbols-outlined text-[20px]">${icon}</span>
        <div class="bk-toast-text">
            <strong>${title}</strong>
            <span>${message}</span>
        </div>
    `;

    box.appendChild(toast);

    setTimeout(() => toast.classList.add("is-show"), 10);

    setTimeout(() => {
        toast.classList.remove("is-show");
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}