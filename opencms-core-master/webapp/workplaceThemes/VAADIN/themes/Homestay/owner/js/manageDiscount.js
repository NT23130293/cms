// ==========================================================================
// Tailwind config — phải chạy ngay sau script CDN Tailwind, trước khi
// các class trong <body> được quét/áp dụng.
// ==========================================================================
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "on-primary-fixed": "#002115",
                "secondary-fixed-dim": "#88d982",
                "tertiary-fixed-dim": "#ffb77d",
                "on-secondary-fixed": "#002204",
                "tertiary-container": "#5d2f00",
                "primary": "#002c1e",
                "outline": "#717974",
                "outline-variant": "#c0c8c2",
                "on-primary-fixed-variant": "#224f3d",
                "surface-dim": "#cbdbf5",
                "inverse-surface": "#213145",
                "surface-variant": "#d3e4fe",
                "error-container": "#ffdad6",
                "surface-container-low": "#eff4ff",
                "secondary": "#1b6d24",
                "primary-fixed": "#bdedd5",
                "surface-container": "#e5eeff",
                "on-surface-variant": "#414944",
                "surface": "#f8f9ff",
                "on-primary-container": "#81b099",
                "background": "#f8f9ff",
                "on-tertiary-fixed-variant": "#6e3900",
                "on-tertiary-container": "#f38b23",
                "tertiary-fixed": "#ffdcc3",
                "on-surface": "#0b1c30",
                "surface-tint": "#3b6754",
                "tertiary": "#3d1d00",
                "on-tertiary-fixed": "#2f1500",
                "surface-container-highest": "#d3e4fe",
                "on-primary": "#ffffff",
                "inverse-primary": "#a1d1ba",
                "on-secondary-fixed-variant": "#005312",
                "secondary-container": "#a0f399",
                "error": "#ba1a1a",
                "on-error-container": "#93000a",
                "on-secondary": "#ffffff",
                "secondary-fixed": "#a3f69c",
                "surface-container-high": "#dce9ff",
                "surface-container-lowest": "#ffffff",
                "on-secondary-container": "#217128",
                "surface-bright": "#f8f9ff",
                "on-error": "#ffffff",
                "primary-container": "#154332",
                "on-background": "#0b1c30",
                "inverse-on-surface": "#eaf1ff",
                "on-tertiary": "#ffffff",
                "primary-fixed-dim": "#a1d1ba"
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            spacing: {
                "space-xs": "0.25rem",
                "margin": "1.75rem",
                "space-md": "0.875rem",
                "space-sm": "0.5rem",
                "space-xl": "1.75rem",
                "gutter-sm": "0.75rem",
                "margin-mobile": "1rem",
                "gutter": "1.25rem",
                "space-lg": "1.25rem"
            },
            fontFamily: {
                "headline-sm": ["Plus Jakarta Sans"],
                "display-lg": ["Plus Jakarta Sans"],
                "label-md": ["Inter"],
                "body-md": ["Plus Jakarta Sans"],
                "label-sm": ["Inter"],
                "body-sm": ["Plus Jakarta Sans"],
                "headline-lg": ["Plus Jakarta Sans"],
                "headline-lg-mobile": ["Plus Jakarta Sans"],
                "label-lg": ["Inter"],
                "headline-md": ["Plus Jakarta Sans"],
                "body-lg": ["Plus Jakarta Sans"]
            },
            fontSize: {
                "headline-sm": ["16px", { "lineHeight": "24px", "fontWeight": "600" }],
                "display-lg": ["30px", { "lineHeight": "38px", "fontWeight": "700" }],
                "label-md": ["11.5px", { "lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "600" }],
                "body-md": ["13.5px", { "lineHeight": "20px", "fontWeight": "400" }],
                "label-sm": ["10.5px", { "lineHeight": "14px", "letterSpacing": "0.03em", "fontWeight": "500" }],
                "headline-lg": ["22px", { "lineHeight": "30px", "fontWeight": "700" }],
                "headline-lg-mobile": ["19px", { "lineHeight": "26px", "fontWeight": "700" }],
                "label-lg": ["13px", { "lineHeight": "18px", "fontWeight": "600" }],
                "headline-md": ["18px", { "lineHeight": "26px", "fontWeight": "600" }],
                "body-lg": ["15px", { "lineHeight": "22px", "fontWeight": "400" }]
            }
        }
    }
};


document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 0. TIỆN ÍCH CHUNG
    // ==========================================

    var $ = function (selector, scope) {
        return (scope || document).querySelector(selector);
    };

    var $$ = function (selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    };

    var formatMoney = function (value) {
        return (Number(value) || 0).toLocaleString("vi-VN") + "₫";
    };

    var toVN = function (isoDate) {
        if (!isoDate) return "—";
        var parts = isoDate.split("-");
        return parts[2] + "/" + parts[1] + "/" + parts[0];
    };

    var escapeHtml = function (text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    var statusText = {
        active: "Đang hoạt động",
        upcoming: "Sắp diễn ra",
        ended: "Đã kết thúc"
    };


    // ==========================================
    // 0.1 TOAST THÔNG BÁO
    // ==========================================

    var toastBox = document.createElement("div");
    toastBox.className = "voucher-toast-box";
    document.body.appendChild(toastBox);

    function showToast(message, type) {

        var toast = document.createElement("div");
        toast.className = "voucher-toast voucher-toast-" + (type || "success");

        toast.innerHTML =
            '<span class="material-symbols-outlined text-[18px]">' +
            (type === "error" ? "error" : "check_circle") +
            '</span><span>' + escapeHtml(message) + '</span>';

        toastBox.appendChild(toast);

        setTimeout(function () { toast.classList.add("is-show"); }, 10);

        setTimeout(function () {
            toast.classList.remove("is-show");
            setTimeout(function () { toast.remove(); }, 250);
        }, 2800);
    }


    // ==========================================
    // 0.2 QUẢN LÝ MODAL CHUNG
    // ==========================================

    var openedModals = [];

    function openModal(modal) {

        if (!modal) return;

        modal.removeAttribute("hidden");
        document.body.classList.add("modal-open");

        requestAnimationFrame(function () { modal.classList.add("is-open"); });

        if (openedModals.indexOf(modal) === -1) {
            openedModals.push(modal);
        }
    }

    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("is-open");

        setTimeout(function () {

            modal.setAttribute("hidden", "");

            var index = openedModals.indexOf(modal);
            if (index > -1) openedModals.splice(index, 1);

            if (!openedModals.length) {
                document.body.classList.remove("modal-open");
            }
        }, 200);
    }

    $$("[data-close-modal]").forEach(function (button) {
        button.addEventListener("click", function () {
            closeModal(document.getElementById(button.dataset.closeModal));
        });
    });

    $$(".voucher-modal").forEach(function (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) closeModal(modal);
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && openedModals.length) {
            closeModal(openedModals[openedModals.length - 1]);
        }
    });


    // ==========================================
    // 0.3 SAO CHÉP MÃ TRÊN THẺ VOUCHER
    // ==========================================

    $$(".js-copy-code").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var code = btn.getAttribute("data-code");
            if (!code) return;

            navigator.clipboard.writeText(code).then(function () {
                showToast('Đã sao chép mã "' + code + '".');
            });
        });
    });


    // ==========================================
    // 1. ĐỌC DỮ LIỆU VOUCHER TỪ DOM
    // ==========================================

    function readVoucher(button) {

        var data = button.dataset;

        return {
            code: data.voucherCode || "",
            name: data.voucherName || "",
            type: data.voucherType || "percent",
            value: Number(data.voucherValue) || 0,
            maxDiscount: Number(data.voucherMaxDiscount) || 0,
            minOrder: Number(data.voucherMinOrder) || 0,
            usageLimit: Number(data.voucherUsageLimit) || 0,
            used: Number(data.voucherUsed) || 0,
            perUser: Number(data.voucherPerUser) || 1,
            start: data.voucherStart || "",
            end: data.voucherEnd || "",
            audience: data.voucherAudience || "Công khai toàn sàn",
            status: data.voucherStatus || "active",
            description: data.voucherDescription || "",
            image: data.voucherImage || ""
        };
    }

    var currentVoucher = null;


    // ==========================================
    // 1.1 LỊCH SỬ PHÁT HÀNH (dữ liệu mẫu)
    // ==========================================

    var voucherHistorySeed = [
        { name: "Ưu đãi Mountain View & Garden View", code: "MAICHAU15", period: "15/09 - 30/10/2024", used: 42, limit: 100, revenue: 94500000, status: "active" },
        { name: "Tri ân khách hoàn thành trải nghiệm dệt thổ cẩm", code: "THOCAM10", period: "01/08 - 31/08/2024", used: 36, limit: 50, revenue: 41200000, status: "ended" },
        { name: "Kích cầu mùa lúa chín Mai Châu", code: "LUACHIN2024", period: "20/09 - 15/10/2024", used: 0, limit: 80, revenue: 0, status: "upcoming" },
        { name: "Chào hè Tây Bắc", code: "HELOSUMMER", period: "01/06 - 31/07/2024", used: 118, limit: 120, revenue: 132800000, status: "ended" },
        { name: "Voucher đoàn trekking Bản Lác", code: "BANLAC5", period: "10/07 - 10/08/2024", used: 24, limit: 40, revenue: 21600000, status: "ended" }
    ];


    // ==========================================
    // 1.2 THANH LỌC TRẠNG THÁI & TÌM KIẾM
    // ==========================================

    var filterTabs = $$(".voucher-filter-tab");
    var voucherSearchInput = $("#voucherSearchInput");

    function cardStatus(card) {
        var detailBtn = $(".btn-voucher-detail", card);
        return detailBtn ? (detailBtn.dataset.voucherStatus || "") : "";
    }

    function cardSearchText(card) {
        var detailBtn = $(".btn-voucher-detail", card);
        if (!detailBtn) return "";
        return (
            (detailBtn.dataset.voucherName || "") + " " +
            (detailBtn.dataset.voucherCode || "")
        ).toLowerCase();
    }

    function applyVoucherFilters() {

        var activeTab = filterTabs.filter(function (tab) {
            return tab.getAttribute("aria-pressed") === "true";
        })[0];

        var filter = activeTab ? activeTab.dataset.filter : "all";
        var keyword = voucherSearchInput ? voucherSearchInput.value.trim().toLowerCase() : "";

        $$(".voucher-card").forEach(function (card) {

            var matchesFilter = (filter === "all" || cardStatus(card) === filter);
            var matchesSearch = !keyword || cardSearchText(card).indexOf(keyword) > -1;

            card.style.display = (matchesFilter && matchesSearch) ? "" : "none";
        });
    }

    filterTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {

            filterTabs.forEach(function (item) {
                item.setAttribute("aria-pressed", "false");
            });

            tab.setAttribute("aria-pressed", "true");

            applyVoucherFilters();
        });
    });

    if (voucherSearchInput) {
        voucherSearchInput.addEventListener("input", applyVoucherFilters);
    }


    // ==========================================
    // 2. POPUP THÊM / CHỈNH SỬA MÃ GIẢM GIÁ
    // ==========================================

    var voucherModal = $("#voucherModal");
    var voucherModalTitle = $("#voucherModalTitle");
    var voucherForm = $("#voucherForm");

    var fName = $("#voucherName");
    var fCode = $("#voucherCode");
    var fType = $("#voucherType");
    var fValue = $("#voucherValue");
    var fMaxDiscount = $("#voucherMaxDiscount");
    var fMinOrder = $("#voucherMinOrder");
    var fUsageLimit = $("#voucherUsageLimit");
    var fPerUser = $("#voucherPerUser");
    var fStart = $("#voucherStart");
    var fEnd = $("#voucherEnd");
    var fAudience = $("#voucherAudience");
    var fDescription = $("#voucherDescription");
    var fActive = $("#voucherActive");

    var currentMode = "add";

    // ---- Ảnh voucher ----

    var imageState = [];

    var imageInput = $("#voucherImageFile");
    var imageUrlInput = $("#voucherImageUrl");
    var btnAddImageUrl = $("#btnAddVoucherImageUrl");
    var imagePreview = $("#voucherImagePreview");
    var imageEmpty = $("#voucherImageEmpty");

    function renderVoucherImages() {

        if (!imagePreview) return;

        imagePreview.innerHTML = "";

        imageState.forEach(function (item, index) {

            var box = document.createElement("div");
            box.className = "voucher-media-item";

            box.innerHTML =
                '<img src="' + escapeHtml(item.url) + '" alt="Ảnh voucher">' +
                '<button type="button" class="voucher-media-remove" title="Xoá ảnh">' +
                '<span class="material-symbols-outlined text-[16px]">close</span></button>';

            $(".voucher-media-remove", box).addEventListener("click", function () {
                imageState.splice(index, 1);
                renderVoucherImages();
            });

            imagePreview.appendChild(box);
        });

        if (imageEmpty) {
            imageEmpty.style.display = imageState.length ? "none" : "";
        }
    }

    function resetVoucherImages(urls) {
        imageState = (urls || []).map(function (url) { return { url: url }; });
        renderVoucherImages();
    }

    if (imageInput) {
        imageInput.addEventListener("change", function () {

            Array.prototype.forEach.call(imageInput.files, function (file) {

                if (!file.type.indexOf("image/") === 0) return;

                imageState.push({ name: file.name, url: URL.createObjectURL(file) });
            });

            imageInput.value = "";
            renderVoucherImages();
        });
    }

    if (btnAddImageUrl && imageUrlInput) {
        btnAddImageUrl.addEventListener("click", function () {

            var url = imageUrlInput.value.trim();

            if (!url) {
                showToast("Hãy nhập link ảnh.", "error");
                return;
            }

            imageState.push({ url: url });
            imageUrlInput.value = "";
            renderVoucherImages();
        });
    }

    // ---- Loại giảm giá: ẩn/hiện gợi ý giảm tối đa ----

    function syncVoucherTypeHint() {
        if (!fType || !fMaxDiscount) return;
        var group = fMaxDiscount.closest(".voucher-form-group");
        if (group) {
            group.style.opacity = fType.value === "percent" ? "1" : "0.5";
        }
    }

    if (fType) {
        fType.addEventListener("change", syncVoucherTypeHint);
    }

    // ---- Mở popup Thêm ----

    function openAddVoucherModal() {

        currentMode = "add";
        currentVoucher = null;

        if (voucherModalTitle) voucherModalTitle.textContent = "Tạo mã giảm giá mới";
        if (voucherForm) voucherForm.reset();

        resetVoucherImages([]);
        syncVoucherTypeHint();

        openModal(voucherModal);
    }

    // ---- Mở popup Sửa ----

    function openEditVoucherModal(voucher) {

        currentMode = "edit";
        currentVoucher = voucher;

        if (voucherModalTitle) voucherModalTitle.textContent = "Chỉnh sửa mã giảm giá";

        if (fName) fName.value = voucher.name;
        if (fCode) fCode.value = voucher.code;
        if (fType) fType.value = voucher.type;
        if (fValue) fValue.value = voucher.value;
        if (fMaxDiscount) fMaxDiscount.value = voucher.maxDiscount || "";
        if (fMinOrder) fMinOrder.value = voucher.minOrder || "";
        if (fUsageLimit) fUsageLimit.value = voucher.usageLimit;
        if (fPerUser) fPerUser.value = voucher.perUser;
        if (fStart) fStart.value = voucher.start;
        if (fEnd) fEnd.value = voucher.end;
        if (fAudience) fAudience.value = voucher.audience;
        if (fDescription) fDescription.value = voucher.description;
        if (fActive) fActive.checked = voucher.status !== "ended";

        resetVoucherImages(voucher.image ? [voucher.image] : []);
        syncVoucherTypeHint();

        openModal(voucherModal);
    }

    var btnAddVoucher = $("#btnAddVoucher");
    if (btnAddVoucher) {
        btnAddVoucher.addEventListener("click", openAddVoucherModal);
    }

    $$(".btn-edit-voucher").forEach(function (button) {
        button.addEventListener("click", function () {
            openEditVoucherModal(readVoucher(button));
        });
    });

    var btnCloseVoucherModal = $("#btnCloseVoucherModal");
    var btnCancelVoucher = $("#btnCancelVoucher");

    if (btnCloseVoucherModal) btnCloseVoucherModal.addEventListener("click", function () { closeModal(voucherModal); });
    if (btnCancelVoucher) btnCancelVoucher.addEventListener("click", function () { closeModal(voucherModal); });

    // ---- Lưu form ----

    if (voucherForm) {

        voucherForm.addEventListener("submit", function (event) {

            event.preventDefault();

            var voucherData = {
                name: fName ? fName.value.trim() : "",
                code: fCode ? fCode.value.trim().toUpperCase() : "",
                type: fType ? fType.value : "percent",
                value: fValue ? fValue.value : "",
                maxDiscount: fMaxDiscount ? fMaxDiscount.value : "",
                minOrder: fMinOrder ? fMinOrder.value : "",
                usageLimit: fUsageLimit ? fUsageLimit.value : "",
                perUser: fPerUser ? fPerUser.value : "",
                start: fStart ? fStart.value : "",
                end: fEnd ? fEnd.value : "",
                audience: fAudience ? fAudience.value : "",
                description: fDescription ? fDescription.value.trim() : "",
                active: fActive ? fActive.checked : true,
                images: imageState.map(function (item) { return item.url; })
            };

            console.log(
                currentMode === "add" ? "Tạo mã giảm giá:" : "Cập nhật mã giảm giá:",
                voucherData
            );

            /*
             * Kết nối backend tại đây, ví dụ:
             * fetch('/api/vouchers', { method: currentMode === 'add' ? 'POST' : 'PUT', body: JSON.stringify(voucherData) });
             */

            showToast(
                currentMode === "add"
                    ? 'Đã tạo mã "' + voucherData.code + '".'
                    : 'Đã cập nhật mã "' + voucherData.code + '".'
            );

            closeModal(voucherModal);
        });
    }


    // ==========================================
    // 3. POPUP CHI TIẾT MÃ GIẢM GIÁ
    // ==========================================

    var voucherDetailModal = $("#voucherDetailModal");

    function openVoucherDetailModal(voucher) {

        currentVoucher = voucher;

        $("#voucherDetailTitle").textContent = voucher.name;

        var image = $("#voucherDetailImage");
        image.src = voucher.image;
        image.alt = voucher.name;

        var status = $("#voucherDetailStatus");
        status.textContent = statusText[voucher.status] || "Đang hoạt động";
        status.className = "voucher-detail-status status-" + voucher.status;

        $("#voucherDetailCode").textContent = voucher.code;

        $("#voucherDetailValue").textContent =
            voucher.type === "percent" ? "Giảm " + voucher.value + "%" : formatMoney(voucher.value);

        $("#voucherDetailMaxDiscount").textContent =
            voucher.maxDiscount ? formatMoney(voucher.maxDiscount) : "Không giới hạn";

        $("#voucherDetailMinOrder").textContent =
            voucher.minOrder ? formatMoney(voucher.minOrder) : "Không yêu cầu";

        $("#voucherDetailPerUser").textContent = voucher.perUser + " lượt / khách";
        $("#voucherDetailPeriod").textContent = toVN(voucher.start) + " - " + toVN(voucher.end);
        $("#voucherDetailAudience").textContent = voucher.audience;
        $("#voucherDetailDescription").textContent = voucher.description || "—";

        var percent = voucher.usageLimit
            ? Math.min(100, Math.round((voucher.used / voucher.usageLimit) * 100))
            : 0;

        $("#voucherDetailUsedText").textContent = voucher.used + "/" + voucher.usageLimit + " lượt";
        $("#voucherDetailUsedPercent").textContent = percent + "%";
        $("#voucherDetailUsedBar").style.width = percent + "%";

        openModal(voucherDetailModal);
    }

    $$(".btn-voucher-detail").forEach(function (button) {
        button.addEventListener("click", function () {
            openVoucherDetailModal(readVoucher(button));
        });
    });

    var btnDetailToEditVoucher = $("#btnDetailToEditVoucher");

    if (btnDetailToEditVoucher) {
        btnDetailToEditVoucher.addEventListener("click", function () {
            var voucher = currentVoucher;
            closeModal(voucherDetailModal);
            setTimeout(function () { openEditVoucherModal(voucher); }, 180);
        });
    }

    var btnCopyDetailCode = $("#btnCopyDetailCode");

    if (btnCopyDetailCode) {
        btnCopyDetailCode.addEventListener("click", function () {
            if (!currentVoucher) return;
            navigator.clipboard.writeText(currentVoucher.code).then(function () {
                showToast('Đã sao chép mã "' + currentVoucher.code + '".');
            });
        });
    }

    var btnDetailToHistory = $("#btnDetailToHistory");

    if (btnDetailToHistory) {
        btnDetailToHistory.addEventListener("click", function () {
            closeModal(voucherDetailModal);
            setTimeout(openVoucherHistoryModal, 180);
        });
    }


    // ==========================================
    // 4. POPUP LỊCH SỬ PHÁT HÀNH
    // ==========================================

    var voucherHistoryModal = $("#voucherHistoryModal");
    var voucherHistoryList = $("#voucherHistoryList");

    function renderVoucherHistory() {

        if (!voucherHistoryList) return;

        voucherHistoryList.innerHTML = "";

        if (!voucherHistorySeed.length) {
            voucherHistoryList.innerHTML =
                '<p class="voucher-history-empty">Chưa có chương trình nào được phát hành.</p>';
            return;
        }

        voucherHistorySeed.forEach(function (item) {

            var row = document.createElement("div");
            row.className = "voucher-history-item";

            row.innerHTML =
                '<div class="voucher-history-icon"><span class="material-symbols-outlined text-[18px]">confirmation_number</span></div>' +
                '<div class="voucher-history-main">' +
                '<span class="voucher-history-name">' + escapeHtml(item.name) + '</span>' +
                '<span class="voucher-history-meta">' + escapeHtml(item.code) + ' • ' + escapeHtml(item.period) + '</span>' +
                '</div>' +
                '<div class="voucher-history-stat">' +
                '<div class="voucher-history-used">' + item.used + '/' + item.limit + ' lượt</div>' +
                '<div class="voucher-history-revenue">' + formatMoney(item.revenue) + '</div>' +
                '</div>' +
                '<span class="voucher-history-tag status-' + item.status + '">' +
                (statusText[item.status] || item.status) + '</span>';

            voucherHistoryList.appendChild(row);
        });
    }

    function openVoucherHistoryModal() {
        renderVoucherHistory();
        openModal(voucherHistoryModal);
    }

    var btnVoucherHistory = $("#btnVoucherHistory");

    if (btnVoucherHistory) {
        btnVoucherHistory.addEventListener("click", openVoucherHistoryModal);
    }


    // ==========================================
    // 5. POPUP XÁC NHẬN XOÁ MÃ GIẢM GIÁ
    // ==========================================

    var voucherDeleteModal = $("#voucherDeleteModal");
    var voucherDeleteForm = $("#voucherDeleteForm");
    var voucherDeleteCurrent = $("#voucherDeleteCurrent");

    var deleteTarget = null;

    function openVoucherDeleteModal(data) {

        deleteTarget = data;

        $("#voucherDeleteSubtitle").textContent =
            "Dừng và gỡ mã \"" + data.code + "\" khỏi hệ thống.";

        voucherDeleteCurrent.innerHTML =
            '<span class="material-symbols-outlined text-[18px]">sell</span>' +
            '<span><strong>' + escapeHtml(data.code) + '</strong> — ' +
            escapeHtml(data.name) +
            (data.used ? ' • Đã dùng ' + data.used + ' lượt' : '') + '</span>';

        if (voucherDeleteForm) voucherDeleteForm.reset();
        $("#voucherDeleteNotify").checked = true;

        openModal(voucherDeleteModal);
    }

    $$(".btn-delete-voucher").forEach(function (button) {
        button.addEventListener("click", function () {

            var data = button.dataset;

            openVoucherDeleteModal({
                code: data.voucherCode || "",
                name: data.voucherName || "",
                used: Number(data.voucherUsed) || 0
            });
        });
    });

    if (voucherDeleteForm) {

        voucherDeleteForm.addEventListener("submit", function (event) {

            event.preventDefault();

            console.log("Xoá mã giảm giá:", {
                code: deleteTarget.code,
                reason: $("#voucherDeleteReason").value,
                notify: $("#voucherDeleteNotify").checked
            });

            showToast('Đã xoá mã "' + deleteTarget.code + '".');

            closeModal(voucherDeleteModal);
        });
    }


    // ==========================================
    // 6. TOGGLE BẬT / TẮT MÃ TRÊN THẺ
    // ==========================================

    $$(".js-toggle-voucher").forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {

            var name = checkbox.getAttribute("data-voucher-name") || "";
            var code = checkbox.getAttribute("data-voucher-code") || "";

            showToast(
                checkbox.checked
                    ? 'Đã bật lại mã "' + code + '".'
                    : 'Đã tạm dừng mã "' + code + '".'
            );
        });
    });

});