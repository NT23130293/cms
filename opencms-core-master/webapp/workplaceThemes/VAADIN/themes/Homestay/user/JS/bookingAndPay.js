/**
 * YÊN Homestay - Trang Đặt Phòng & Thanh Toán
 * Đường dẫn: .../Homestay/user/JS/booking.js
 * Luồng: trang chi tiết homestay (nút "Đặt phòng ngay") lưu bản nháp vào sessionStorage
 *        -> booking.html đọc bản nháp -> khách nhập thông tin, chọn cách thanh toán
 *        -> popup thanh toán (QR / ví / thẻ) -> chuyển sang completePay.html (trang hoàn tất).
 * Lưu ý: file này chạy CÙNG với homepage.js (đã xử lý header/footer dùng chung).
 *        Phần thanh toán hiện là giả lập giao diện. Khi có backend, thay các chỗ đánh dấu
 *        "TODO(API)" bằng lời gọi thật (tạo đơn, tạo phiên thanh toán, kiểm tra trạng thái).
 */

/* Toàn bộ code nằm trong IIFE để KHÔNG tạo biến toàn cục.
   File này chạy cùng homepage.js trên một trang: nếu hai file cùng khai báo const/let trùng tên
   (ví dụ $, pad, showToast, toastTimer...) trình duyệt sẽ báo "already been declared" và
   homepage.js dừng chạy, làm mất header/footer. */
(function () {
    'use strict';


    /* ==========================================================================
       CẤU HÌNH
       ========================================================================== */
    const SERVICE_FEE_RATE = 0.05;        // Phí dịch vụ YÊN = 5% tiền phòng (giống trang chi tiết)
    const DEPOSIT_RATE = 0.3;             // Đặt cọc 30%
    const PAY_SESSION_SECONDS = 15 * 60;  // Phiên thanh toán 15 phút
    const DRAFT_KEY = 'yenBookingDraft';  // sessionStorage: bản nháp từ trang chi tiết
    const BOOKINGS_KEY = 'yenBookings';   // localStorage: danh sách đặt phòng (dữ liệu mẫu)
    const LAST_KEY = 'yenLastBooking';    // sessionStorage: đặt phòng vừa hoàn tất (dự phòng khi localStorage bị chặn)
    const PAGES = { detail: 'homestay-detail.html', complete: 'completePay.html' };

    const fmtVND = (n) => Math.round(n).toLocaleString('vi-VN') + 'đ';
    const $ = (id) => document.getElementById(id);
    const pad = (n) => String(n).padStart(2, '0');

    /* ==========================================================================
       DỮ LIỆU DỰ PHÒNG (dùng khi mở booking.html trực tiếp, không có bản nháp)
       Khi có API thật: lấy theo ?room=<id> từ server.
       ========================================================================== */
    const DEFAULT_HOMESTAY = {
        name: 'The Pine Hill Retreat',
        location: 'Phường 3, TP. Đà Lạt, Lâm Đồng',
        rating: 4.9,
        reviewCount: 126,
        url: PAGES.detail
    };

    const ROOM_CATALOG = {
        doi: {
            id: 'doi', name: 'Phòng Đôi View Rừng Thông', price: 890000, cleaningFee: 100000, maxGuests: 2,
            specs: { area: '28m²', guests: 2, beds: '1 giường đôi' },
            thumb: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'
        },
        giadinh: {
            id: 'giadinh', name: 'Phòng Gác Mái Gia Đình', price: 1350000, cleaningFee: 130000, maxGuests: 4,
            specs: { area: '42m²', guests: 4, beds: '1 giường đôi + 2 giường đơn' },
            thumb: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80'
        },
        villa: {
            id: 'villa', name: 'Villa Toàn Căn Đồi Thông', price: 3200000, cleaningFee: 250000, maxGuests: 8,
            specs: { area: '95m²', guests: 8, beds: '3 phòng ngủ · 4 giường' },
            thumb: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'
        }
    };

// Trải nghiệm (rút gọn từ experiencesData của trang chi tiết). price = 0 nghĩa là miễn phí.
    const EXPERIENCES = [
        { id: 'sanmay',    title: 'Săn mây bình minh trên đồi thông',     price: 0,      unit: '',         note: 'Không cần đặt trước' },
        { id: 'trekking',  title: 'Đi bộ xuyên rừng thông',               price: 100000, unit: '/ nhóm',   note: '2 giờ · đặt trước 1 ngày' },
        { id: 'hairau',    title: 'Hái rau, dâu tại vườn nhà',            price: 60000,  unit: '/ khách',  note: '60 phút · đặt trước 1 ngày' },
        { id: 'nongtrai',  title: 'Cho gà, thỏ ăn & chơi vườn cùng bé',   price: 0,      unit: '',         note: 'Gia đình có trẻ nhỏ' },
        { id: 'naucom',    title: 'Học nấu bữa cơm quê cùng chủ nhà',     price: 180000, unit: '/ khách',  note: '2 giờ · đặt trước 1 ngày' },
        { id: 'tradacphe', title: 'Trà atiso & cà phê rang xay buổi sáng', price: 0,      unit: '',         note: 'Ly đầu miễn phí' },
        { id: 'luatrai',   title: 'Lửa trại & nướng BBQ đêm đồi thông',   price: 250000, unit: '/ nhóm',   note: '2 giờ · đặt trước 1 ngày' },
        { id: 'bontam',    title: 'Ngâm bồn tắm gỗ ngắm mây, ngắm sao',   price: 0,      unit: '',         note: 'Hẹn giờ với chủ nhà' }
    ];

// Mã giảm giá / voucher (dữ liệu mẫu).
// wallet: true  -> voucher nằm trong túi của khách (hiện ở danh sách chọn)
// wallet: false -> mã công khai, chỉ dùng được khi khách nhập tay
// expiresInDays âm = đã hết hạn. Khi có API thật: lấy túi voucher của tài khoản từ server
// và gọi server để kiểm tra mã nhập tay.
    const COUPONS = {
        YEN10: {
            title: 'Giảm 10% tiền phòng', desc: 'Tối đa 300.000đ', badge: '-10%', wallet: true, expiresInDays: 30,
            calc: (subtotal) => Math.min(Math.round(subtotal * 0.1), 300000)
        },
        DALAT100: {
            title: 'Giảm 100.000đ', desc: 'Cho tiền phòng từ 1.500.000đ', badge: '-100K', wallet: true, expiresInDays: 14,
            min: 1500000,
            calc: () => 100000
        },
        LONGSTAY: {
            title: 'Giảm 150.000đ khi ở dài ngày', desc: 'Áp dụng khi ở từ 3 đêm', badge: '-150K', wallet: true, expiresInDays: 45,
            minNights: 3,
            calc: () => 150000
        },
        GIAMHE: {
            title: 'Giảm 12% ưu đãi mùa hè', desc: 'Tối đa 200.000đ', badge: '-12%', wallet: true, expiresInDays: -3,
            calc: (subtotal) => Math.min(Math.round(subtotal * 0.12), 200000)
        },
        HELLODALAT: {
            title: 'Giảm 5% tiền phòng', desc: 'Tối đa 100.000đ', badge: '-5%', wallet: false, expiresInDays: 90,
            calc: (subtotal) => Math.min(Math.round(subtotal * 0.05), 100000)
        }
    };
    Object.entries(COUPONS).forEach(([code, c]) => {
        c.code = code;
        c.expiresAt = new Date(Date.now() + c.expiresInDays * 86400000);
    });

    const PAY_METHODS = {
        vietqr: {
            name: 'VietQR', color: '#15803D', caption: 'Quét bằng app của bất kỳ ngân hàng nào',
            steps: ['Mở app ngân hàng và chọn Quét mã QR.', 'Quét mã bên trên, kiểm tra số tiền và nội dung.', 'Xác nhận chuyển khoản rồi quay lại bấm "Tôi đã thanh toán".']
        },
        momo: {
            name: 'MoMo', color: '#A50064', caption: 'Quét bằng ứng dụng MoMo',
            steps: ['Mở ứng dụng MoMo và chọn Quét mã.', 'Quét mã bên trên và xác nhận thanh toán.', 'Quay lại đây và bấm "Tôi đã thanh toán".']
        },
        zalopay: {
            name: 'ZaloPay', color: '#0068FF', caption: 'Quét bằng ứng dụng ZaloPay',
            steps: ['Mở ứng dụng ZaloPay và chọn Quét mã.', 'Quét mã bên trên và xác nhận thanh toán.', 'Quay lại đây và bấm "Tôi đã thanh toán".']
        },
        card: { name: 'thẻ', color: '#0F172A', caption: '', steps: [] }
    };

// Thông tin nhận chuyển khoản (dữ liệu mẫu)
    const BANK_INFO = { bank: 'Ngân hàng mẫu (demo)', account: '0123456789', holder: 'CONG TY YEN HOMESTAY' };

    /* ==========================================================================
       TRẠNG THÁI
       ========================================================================== */
    const state = {
        homestay: DEFAULT_HOMESTAY,
        room: ROOM_CATALOG.doi,
        checkin: '',
        checkout: '',
        guests: 2,
        coupon: null,
        plan: 'full',
        method: 'vietqr',
        experiences: new Set(),
        bookingCode: null,
        payTimer: null,
        payDeadline: 0,
        processing: false
    };

    /* ==========================================================================
       TIỆN ÍCH NGÀY THÁNG
       ========================================================================== */
    const toInputDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const parseDate = (s) => new Date(s + 'T00:00:00');
    const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    function fmtDate(s) {
        if (!s) return '-';
        const d = parseDate(s);
        return `${WEEKDAYS[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    }
    function fmtDateTime(d) {
        return `${pad(d.getHours())}:${pad(d.getMinutes())}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    }

    function getNights() {
        if (!state.checkin || !state.checkout) return 0;
        const diff = Math.round((parseDate(state.checkout) - parseDate(state.checkin)) / 86400000);
        return diff > 0 ? diff : 0;
    }

    /* ==========================================================================
       KHỞI TẠO: ĐỌC BẢN NHÁP
       ========================================================================== */
    function loadDraft() {
        const params = new URLSearchParams(window.location.search);
        let draft = null;
        try { draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY)); } catch (e) { draft = null; }

        // Ưu tiên ?room=... (mở trực tiếp), sau đó đến bản nháp, cuối cùng là phòng mặc định
        const roomParam = params.get('room');
        if (roomParam && ROOM_CATALOG[roomParam]) {
            draft = {
                homestay: DEFAULT_HOMESTAY,
                room: ROOM_CATALOG[roomParam],
                checkin: params.get('checkin') || '',
                checkout: params.get('checkout') || '',
                guests: Number(params.get('guests')) || 2
            };
        }

        if (draft && draft.room && Number(draft.room.price) > 0) {
            state.homestay = { ...DEFAULT_HOMESTAY, ...(draft.homestay || {}) };
            state.room = {
                ...draft.room,
                price: Number(draft.room.price),
                cleaningFee: Number(draft.room.cleaningFee) || 0,
                maxGuests: Number(draft.room.maxGuests) || (draft.room.specs && draft.room.specs.guests) || 2
            };
            state.checkin = draft.checkin || '';
            state.checkout = draft.checkout || '';
            state.guests = Number(draft.guests) || 2;
        }

        // Ngày mặc định nếu thiếu hoặc không hợp lệ: 7 ngày nữa, ở 2 đêm
        const today = toInputDate(new Date());
        if (!state.checkin || !state.checkout || state.checkin < today || state.checkout <= state.checkin) {
            const ci = new Date(); ci.setDate(ci.getDate() + 7);
            const co = new Date(ci); co.setDate(ci.getDate() + 2);
            state.checkin = toInputDate(ci);
            state.checkout = toInputDate(co);
        }
        state.guests = Math.min(Math.max(1, state.guests), state.room.maxGuests);
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadDraft();
        initStaticFields();
        initExperiences();
        bindEvents();
        renderAll();
    });

    function initStaticFields() {
        $('bkBackLink').href = state.homestay.url || PAGES.detail;

        $('sumThumb').src = state.room.thumb || '';
        $('sumThumb').alt = state.room.name;
        $('sumHomestay').textContent = state.homestay.name;
        $('sumRoom').textContent = state.room.name;
        $('sumRating').textContent = `${Number(state.homestay.rating).toFixed(2)} · ${state.homestay.reviewCount} đánh giá`;

        const today = toInputDate(new Date());
        $('checkin').min = today;
        $('checkin').value = state.checkin;
        $('checkout').value = state.checkout;
        syncCheckoutMin();

        const select = $('guests');
        select.innerHTML = '';
        for (let g = 1; g <= state.room.maxGuests; g++) {
            const opt = document.createElement('option');
            opt.value = g;
            opt.textContent = `${g} khách`;
            if (g === state.guests) opt.selected = true;
            select.appendChild(opt);
        }
        $('guestsHint').textContent = `Phòng này nhận tối đa ${state.room.maxGuests} khách.`;
    }

    function initExperiences() {
        $('xpList').innerHTML = EXPERIENCES.map((x) => `
    <label class="bk-xp">
      <input type="checkbox" value="${x.id}">
      <span class="bk-xp-box"><i class="bi bi-check-lg"></i></span>
      <span class="bk-xp-body"><b>${x.title}</b><small>${x.note}</small></span>
      <span class="bk-xp-price ${x.price > 0 ? '' : 'is-free'}">${x.price > 0 ? `${fmtVND(x.price)} ${x.unit}` : 'Miễn phí'}</span>
    </label>`).join('');
    }

    /* ==========================================================================
       SỰ KIỆN
       ========================================================================== */
    function bindEvents() {
        $('checkin').addEventListener('change', onTripChange);
        $('checkout').addEventListener('change', onTripChange);
        $('guests').addEventListener('change', onTripChange);

        $('xpList').addEventListener('change', (e) => {
            if (e.target.type !== 'checkbox') return;
            e.target.checked ? state.experiences.add(e.target.value) : state.experiences.delete(e.target.value);
            renderAll();
        });

        document.querySelectorAll('input[name="payPlan"]').forEach((r) =>
            r.addEventListener('change', () => { state.plan = r.value; renderAll(); }));
        document.querySelectorAll('input[name="payMethod"]').forEach((r) =>
            r.addEventListener('change', () => { state.method = r.value; $('cardForm').hidden = r.value !== 'card'; }));

        $('couponApplyBtn').addEventListener('click', applyCoupon);
        $('couponRemoveBtn').addEventListener('click', () => removeCoupon());
        $('couponInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } });
        $('voucherList').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-voucher]');
            if (btn && !btn.disabled) toggleVoucher(btn.dataset.voucher);
        });

        // Định dạng ô thẻ
        $('cardNumber').addEventListener('input', (e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, 19);
            e.target.value = digits.replace(/(.{4})/g, '$1 ').trim();
        });
        $('cardExpiry').addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 4);
            if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
            e.target.value = v;
        });
        $('cardCvv').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });
        $('cardName').addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase(); });

        // Xóa lỗi khi khách bắt đầu sửa
        ['fullName', 'phone', 'email', 'cardNumber', 'cardName', 'cardExpiry', 'cardCvv'].forEach((id) =>
            $(id).addEventListener('input', () => setError(id, '')));
        $('agreeTerms').addEventListener('change', () => { $('termsError').textContent = ''; });

        $('bookingForm').addEventListener('submit', onSubmit);

        $('payCloseBtn').addEventListener('click', closePayModal);
        $('payBackBtn').addEventListener('click', closePayModal);
        $('payConfirmBtn').addEventListener('click', confirmPayment);
        $('payRestartBtn').addEventListener('click', startCountdown);
        $('payOverlay').addEventListener('click', (e) => { if (e.target === $('payOverlay')) closePayModal(); });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && $('payOverlay').classList.contains('active')) closePayModal();
        });
    }

    function syncCheckoutMin() {
        const ci = $('checkin').value;
        if (!ci) return;
        const minOut = parseDate(ci);
        minOut.setDate(minOut.getDate() + 1);
        $('checkout').min = toInputDate(minOut);
        if ($('checkout').value && $('checkout').value < $('checkout').min) $('checkout').value = $('checkout').min;
    }

    function onTripChange() {
        syncCheckoutMin();
        state.checkin = $('checkin').value;
        state.checkout = $('checkout').value;
        state.guests = Number($('guests').value) || 1;
        renderAll();
    }

    /* ==========================================================================
       TÍNH GIÁ
       ========================================================================== */
    function experienceCost(x) {
        if (x.price <= 0) return 0;
        return x.unit === '/ khách' ? x.price * state.guests : x.price;
    }

    function calcPricing() {
        const nights = getNights();
        const subtotal = state.room.price * nights;
        const cleaning = nights > 0 ? state.room.cleaningFee : 0;
        const service = Math.round(subtotal * SERVICE_FEE_RATE);
        const coupon = state.coupon ? COUPONS[state.coupon] : null;
        const discount = coupon && nights > 0 ? Math.min(coupon.calc(subtotal), subtotal) : 0;
        const total = nights > 0 ? subtotal + cleaning + service - discount : 0;
        const payNow = state.plan === 'deposit' ? Math.round((total * DEPOSIT_RATE) / 1000) * 1000 : total;
        const payLater = total - payNow;
        const experiences = EXPERIENCES.filter((x) => state.experiences.has(x.id));
        const experienceTotal = experiences.reduce((s, x) => s + experienceCost(x), 0);
        return { nights, subtotal, cleaning, service, discount, total, payNow, payLater, experiences, experienceTotal };
    }

    /* ==========================================================================
       MÃ GIẢM GIÁ + VOUCHER TRONG TÚI
       ========================================================================== */
    function setCouponMsg(text, type) {
        const el = $('couponMsg');
        el.textContent = text || '';
        el.className = 'bk-coupon-msg' + (type ? ` is-${type}` : '');
    }

// Trả về lý do voucher chưa dùng được cho đặt phòng hiện tại, hoặc '' nếu dùng được
    function couponIssue(coupon, subtotal, nights) {
        if (coupon.expiresAt < new Date()) return 'Đã hết hạn';
        if (nights === 0) return 'Chọn ngày ở hợp lệ để dùng';
        if (coupon.min && subtotal < coupon.min) return `Cần tiền phòng từ ${fmtVND(coupon.min)}`;
        if (coupon.minNights && nights < coupon.minNights) return `Cần ở từ ${coupon.minNights} đêm`;
        return '';
    }
    const lowerFirst = (t) => t.charAt(0).toLowerCase() + t.slice(1);

// Dùng chung cho nhập tay và chọn từ túi voucher
    function applyCouponCode(code) {
        const coupon = COUPONS[code];
        if (!coupon) { setCouponMsg('Mã không hợp lệ. Hãy kiểm tra lại mã của bạn.', 'error'); return false; }
        const nights = getNights();
        const issue = couponIssue(coupon, state.room.price * nights, nights);
        if (issue) { setCouponMsg(`Mã ${code} chưa áp dụng được: ${lowerFirst(issue)}.`, 'error'); return false; }

        state.coupon = code;
        $('couponInput').value = code;
        setCouponMsg(`Đã áp dụng ${code}: ${coupon.title}.`, 'ok');
        renderAll();
        showToast('Đã áp dụng mã giảm giá!');
        return true;
    }

    function applyCoupon() {
        const code = $('couponInput').value.trim().toUpperCase();
        if (!code) { setCouponMsg('Vui lòng nhập mã giảm giá.', 'error'); return; }
        applyCouponCode(code);
    }

    function removeCoupon(message) {
        state.coupon = null;
        $('couponInput').value = '';
        setCouponMsg(message || '', message ? 'error' : '');
        renderAll();
    }

// Bấm vào voucher trong túi: chọn, hoặc bấm lần nữa để bỏ chọn
    function toggleVoucher(code) {
        if (state.coupon === code) { removeCoupon(); return; }
        applyCouponCode(code);
    }

// Đổi ngày ở có thể làm mã không còn đủ điều kiện
    function revalidateCoupon() {
        if (!state.coupon) return;
        const nights = getNights();
        const issue = couponIssue(COUPONS[state.coupon], state.room.price * nights, nights);
        if (issue) {
            const code = state.coupon;
            state.coupon = null;
            $('couponInput').value = '';
            setCouponMsg(`Mã ${code} đã được gỡ vì không còn áp dụng được: ${lowerFirst(issue)}.`, 'error');
        }
    }

    function renderVouchers(p) {
        const items = Object.values(COUPONS).filter((c) => c.wallet).map((c) => {
            const issue = couponIssue(c, p.subtotal, p.nights);
            return { c, issue, saving: issue ? 0 : Math.min(c.calc(p.subtotal), p.subtotal) };
        });
        // Dùng được lên trước, tiết kiệm nhiều nhất lên đầu
        items.sort((a, b) => (!!a.issue - !!b.issue) || b.saving - a.saving);

        const usable = items.filter((i) => !i.issue);
        const best = usable.length > 1 ? usable[0] : null;
        $('voucherCount').textContent = `${usable.length}/${items.length} dùng được`;

        $('voucherList').innerHTML = items.map(({ c, issue, saving }) => {
            const selected = state.coupon === c.code;
            const d = c.expiresAt;
            const exp = `HSD: ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
            const side = issue
                ? `<span class="bk-voucher-issue">${issue}</span>`
                : `<span class="bk-voucher-save">Giảm ${fmtVND(saving)}</span><span class="bk-voucher-radio"></span>`;
            return `
    <button type="button" class="bk-voucher ${selected ? 'is-selected' : ''}" data-voucher="${c.code}" aria-pressed="${selected}" ${issue ? 'disabled' : ''}>
      <span class="bk-voucher-badge">${c.badge}</span>
      <span class="bk-voucher-body">
        <b>${c.title}${best && best.c === c ? '<em class="bk-voucher-best">Tiết kiệm nhất</em>' : ''}</b>
        <small>${c.desc}</small>
        <small>Mã ${c.code} · ${exp}</small>
      </span>
      <span class="bk-voucher-side">${side}</span>
    </button>`;
        }).join('');
    }

    /* ==========================================================================
       HIỂN THỊ
       ========================================================================== */
    function renderAll() {
        revalidateCoupon();
        const p = calcPricing();

        // Cảnh báo ngày
        $('tripWarning').textContent = p.nights === 0 ? 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm.' : '';

        // Tóm tắt
        $('sumCheckin').textContent = fmtDate(state.checkin) + ' · từ 14:00';
        $('sumCheckout').textContent = fmtDate(state.checkout) + ' · trước 12:00';
        $('sumGuests').textContent = `${state.guests} khách · ${p.nights} đêm`;
        $('sumNightsLabel').textContent = `${fmtVND(state.room.price)} x ${p.nights} đêm`;
        $('sumSubtotal').textContent = fmtVND(p.subtotal);
        $('sumCleaning').textContent = fmtVND(p.cleaning);
        $('sumService').textContent = fmtVND(p.service);

        $('sumDiscountRow').hidden = !(p.discount > 0);
        if (p.discount > 0) {
            $('sumDiscountLabel').textContent = `Mã ${state.coupon}`;
            $('sumDiscount').textContent = '-' + fmtVND(p.discount);
        }
        $('sumTotal').textContent = fmtVND(p.total);
        $('sumPayNow').textContent = fmtVND(p.payNow);
        $('sumPayLaterRow').hidden = !(p.payLater > 0);
        $('sumPayLater').textContent = fmtVND(p.payLater);

        renderVouchers(p);

        // Nút đổi giữa "Hủy mã" / "Áp dụng"
        $('couponRemoveBtn').hidden = !state.coupon;
        $('couponApplyBtn').hidden = !!state.coupon;

        // Lựa chọn số tiền thanh toán
        $('planFullAmount').textContent = fmtVND(p.total);
        const deposit = Math.round((p.total * DEPOSIT_RATE) / 1000) * 1000;
        $('planDepositAmount').textContent = fmtVND(deposit);
        $('planDepositSub').textContent = `Trả ngay ${fmtVND(deposit)}, còn ${fmtVND(p.total - deposit)} trả khi nhận phòng.`;

        // Trải nghiệm
        $('xpTotalRow').hidden = p.experiences.length === 0 || p.experienceTotal === 0;
        $('xpTotal').textContent = fmtVND(p.experienceTotal);

        // Thanh mobile
        $('mobileTotal').textContent = fmtVND(p.payNow);
        $('mobileTotalNote').textContent = p.payLater > 0 ? 'đặt cọc bây giờ' : 'thanh toán bây giờ';

        renderPolicy();
    }

    function renderPolicy() {
        const now = new Date();
        const freeUntil = new Date(now.getTime() + 48 * 3600 * 1000);
        const checkinAt = state.checkin ? new Date(state.checkin + 'T14:00:00') : freeUntil;
        const freeDeadline = freeUntil < checkinAt ? freeUntil : checkinAt;

        // Hoàn 50% nếu hủy trước 5 ngày nhận phòng
        const halfDeadline = new Date(checkinAt.getTime() - 5 * 86400000);
        const items = [
            `<li><i class="bi bi-check-circle-fill"></i><span>Miễn phí hủy trước <b>${fmtDateTime(freeDeadline)}</b> (trong 48 giờ sau khi đặt).</span></li>`
        ];
        if (halfDeadline > freeDeadline) {
            items.push(`<li><i class="bi bi-arrow-counterclockwise"></i><span>Hoàn 50% nếu hủy trước <b>${fmtDateTime(halfDeadline)}</b> (5 ngày trước giờ nhận phòng).</span></li>`);
            items.push(`<li class="is-muted"><i class="bi bi-info-circle"></i><span>Hủy sau thời hạn này, đặt phòng không được hoàn tiền.</span></li>`);
        } else {
            items.push(`<li class="is-muted"><i class="bi bi-info-circle"></i><span>Ngày nhận phòng còn dưới 5 ngày nên sau thời hạn miễn phí, đặt phòng không được hoàn tiền.</span></li>`);
        }
        items.push(`<li class="is-muted"><i class="bi bi-slash-circle"></i><span>Nội quy: không tổ chức tiệc, sự kiện. Nhận phòng 14:00 - 21:00, trả phòng trước 12:00.</span></li>`);
        $('policyList').innerHTML = items.join('');
    }

    /* ==========================================================================
       KIỂM TRA DỮ LIỆU
       ========================================================================== */
    function setError(id, message) {
        const field = $(id).closest('.bk-field');
        if (!field) return;
        field.classList.toggle('has-error', !!message);
        const err = field.querySelector('.bk-error');
        if (err) err.textContent = message || '';
    }

    function luhn(num) {
        let sum = 0, alt = false;
        for (let i = num.length - 1; i >= 0; i--) {
            let n = Number(num[i]);
            if (alt) { n *= 2; if (n > 9) n -= 9; }
            sum += n;
            alt = !alt;
        }
        return sum % 10 === 0;
    }

// Trả về phần tử lỗi đầu tiên (để cuộn tới), hoặc null nếu hợp lệ
    function validateForm() {
        let firstInvalid = null;
        const fail = (id, message) => { setError(id, message); if (!firstInvalid) firstInvalid = $(id); };

        if (getNights() === 0) {
            $('tripWarning').textContent = 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm.';
            if (!firstInvalid) firstInvalid = $('checkout');
        }

        const name = $('fullName').value.trim();
        if (name.length < 2) fail('fullName', 'Vui lòng nhập họ và tên của bạn.'); else setError('fullName', '');

        const phone = $('phone').value.replace(/[\s.\-]/g, '');
        if (!/^(0|\+84)(3|5|7|8|9)\d{8}$/.test(phone)) fail('phone', 'Số điện thoại chưa đúng. Ví dụ: 0901 234 567.'); else setError('phone', '');

        const email = $('email').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail('email', 'Email chưa đúng. Ví dụ: ban@example.com.'); else setError('email', '');

        if (state.method === 'card') {
            const digits = $('cardNumber').value.replace(/\D/g, '');
            if (digits.length < 13 || digits.length > 19 || !luhn(digits)) fail('cardNumber', 'Số thẻ không hợp lệ. Hãy kiểm tra lại các chữ số.'); else setError('cardNumber', '');

            if ($('cardName').value.trim().length < 2) fail('cardName', 'Vui lòng nhập tên in trên thẻ.'); else setError('cardName', '');

            const m = $('cardExpiry').value.match(/^(\d{2})\/(\d{2})$/);
            let expiryOk = false;
            if (m) {
                const month = Number(m[1]), year = 2000 + Number(m[2]);
                const endOfMonth = new Date(year, month, 0, 23, 59, 59);
                expiryOk = month >= 1 && month <= 12 && endOfMonth >= new Date();
            }
            if (!expiryOk) fail('cardExpiry', 'Ngày hết hạn không hợp lệ hoặc thẻ đã hết hạn.'); else setError('cardExpiry', '');

            if (!/^\d{3,4}$/.test($('cardCvv').value)) fail('cardCvv', 'Mã CVV gồm 3 hoặc 4 chữ số.'); else setError('cardCvv', '');
        }

        if (!$('agreeTerms').checked) {
            $('termsError').textContent = 'Bạn cần đồng ý với nội quy và chính sách hủy phòng để tiếp tục.';
            if (!firstInvalid) firstInvalid = $('agreeTerms');
        } else {
            $('termsError').textContent = '';
        }
        return firstInvalid;
    }

    function onSubmit(e) {
        e.preventDefault();
        const invalid = validateForm();
        if (invalid) {
            const target = invalid.closest('.bk-card') || invalid;
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (invalid.type !== 'checkbox') setTimeout(() => invalid.focus({ preventScroll: true }), 350);
            return;
        }
        openPayModal();
    }

    /* ==========================================================================
       BƯỚC (STEPPER)
       ========================================================================== */
    function setStep(step) {
        document.querySelectorAll('#bkSteps .bk-step').forEach((el) => {
            const n = Number(el.dataset.step);
            el.classList.toggle('is-done', n < step || (step === 3 && n === 3));
            el.classList.toggle('is-active', n === step && step !== 3);
        });
    }

    /* ==========================================================================
       POPUP THANH TOÁN
       ========================================================================== */
    function generateBookingCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bỏ ký tự dễ nhầm: I, O, 0, 1
        let code = '';
        for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
        return 'YEN-' + code;
    }

    function openPayModal() {
        // TODO(API): tạo đơn đặt phòng ở trạng thái "chờ thanh toán" + tạo phiên thanh toán, nhận mã đơn từ server
        if (!state.bookingCode) state.bookingCode = generateBookingCode();
        const p = calcPricing();

        $('payAmount').textContent = fmtVND(p.payNow);
        $('payAmountLabel').textContent = p.payLater > 0 ? 'Số tiền đặt cọc cần thanh toán' : 'Số tiền cần thanh toán';
        renderPayView(p);

        $('payProcessing').hidden = true;
        $('payOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        setStep(2);
        startCountdown();
        setTimeout(() => $('payConfirmBtn').focus(), 60);
    }

    function closePayModal() {
        if (state.processing) return;
        clearInterval(state.payTimer);
        $('payOverlay').classList.remove('active');
        document.body.style.overflow = '';
        setStep(1);
    }

    function renderPayView(p) {
        const method = PAY_METHODS[state.method];
        const isCard = state.method === 'card';
        $('payTitle').textContent = isCard ? 'Thanh toán bằng thẻ' : `Thanh toán bằng ${method.name}`;
        $('payQrView').hidden = isCard;
        $('payCardView').hidden = !isCard;

        if (isCard) {
            const digits = $('cardNumber').value.replace(/\D/g, '');
            $('payCardMasked').textContent = `•••• •••• •••• ${digits.slice(-4)}`;
            $('payCardHolder').textContent = $('cardName').value.trim();
            $('payConfirmBtn').textContent = `Thanh toán ${fmtVND(p.payNow)}`;
            return;
        }

        $('payConfirmBtn').textContent = 'Tôi đã thanh toán';
        $('payQr').innerHTML = qrSvg(state.bookingCode + state.method, method.color);
        $('payQrCaption').textContent = method.caption;
        $('payQrSteps').innerHTML = method.steps.map((s) => `<li>${s}</li>`).join('');

        const transferNote = state.bookingCode.replace('-', '');
        const bank = $('payBank');
        bank.hidden = state.method !== 'vietqr';
        if (state.method === 'vietqr') {
            const rows = [
                ['Ngân hàng', BANK_INFO.bank, false],
                ['Số tài khoản', BANK_INFO.account, true],
                ['Chủ tài khoản', BANK_INFO.holder, false],
                ['Số tiền', fmtVND(p.payNow), true, String(p.payNow)],
                ['Nội dung', transferNote, true]
            ];
            bank.innerHTML = rows.map(([label, value, copy, raw]) => `
      <div><dt>${label}</dt><dd>${value}${copy ? `<button type="button" class="pay-copy" data-copy="${raw || value}" title="Sao chép"><i class="bi bi-copy"></i></button>` : ''}</dd></div>`).join('');
            bank.querySelectorAll('.pay-copy').forEach((btn) =>
                btn.addEventListener('click', () => copyText(btn.dataset.copy, 'Đã sao chép!')));
        }
    }

    /* Mã QR minh họa: sinh từ mã đặt phòng, KHÔNG phải mã QR thanh toán thật.
       TODO(API): thay bằng ảnh/chuỗi QR do cổng thanh toán trả về. */
    function qrSvg(seedStr, color) {
        const N = 29;
        let seed = 0;
        for (const ch of seedStr) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
        const rand = () => {
            seed = (seed + 0x6D2B79F5) >>> 0;
            let t = seed;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        const finder = (x, y, ox, oy) => {
            const dx = x - ox, dy = y - oy;
            if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null;
            return Math.max(Math.abs(dx - 3), Math.abs(dy - 3)) !== 2;
        };
        const near = (x, y, ox, oy) => x >= ox - 1 && x <= ox + 7 && y >= oy - 1 && y <= oy + 7;

        let d = '';
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                const f = [finder(x, y, 0, 0), finder(x, y, N - 7, 0), finder(x, y, 0, N - 7)].find((v) => v !== null);
                let dark;
                if (f !== undefined) dark = f;
                else if (near(x, y, 0, 0) || near(x, y, N - 7, 0) || near(x, y, 0, N - 7)) dark = false;
                else dark = rand() > 0.52;
                if (dark) d += `M${x} ${y}h1v1h-1z`;
            }
        }
        return `<svg viewBox="-1 -1 ${N + 2} ${N + 2}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mã QR thanh toán minh họa" shape-rendering="crispEdges"><path d="${d}" fill="${color}"/></svg>`;
    }

    /* Đồng hồ đếm ngược phiên thanh toán */
    function startCountdown() {
        clearInterval(state.payTimer);
        state.payDeadline = Date.now() + PAY_SESSION_SECONDS * 1000;
        $('payExpired').hidden = true;
        $('payConfirmBtn').disabled = false;
        $('payTimerBox').hidden = false;

        const tick = () => {
            const left = Math.max(0, Math.round((state.payDeadline - Date.now()) / 1000));
            $('payCountdown').textContent = `${pad(Math.floor(left / 60))}:${pad(left % 60)}`;
            $('payTimerBox').classList.toggle('is-urgent', left <= 60);
            if (left === 0) {
                clearInterval(state.payTimer);
                $('payExpired').hidden = false;
                $('payConfirmBtn').disabled = true;
                $('payTimerBox').hidden = true;
            }
        };
        tick();
        state.payTimer = setInterval(tick, 1000);
    }

    function confirmPayment() {
        if (state.processing) return;
        state.processing = true;
        $('payProcessing').hidden = false;

        // TODO(API): kiểm tra trạng thái giao dịch với server / cổng thanh toán (polling hoặc webhook)
        setTimeout(finishBooking, 1800);
    }

    /* ==========================================================================
       HOÀN TẤT ĐẶT PHÒNG
       ========================================================================== */
    function finishBooking() {
        clearInterval(state.payTimer);
        const p = calcPricing();
        const contact = { fullName: $('fullName').value.trim(), phone: $('phone').value.trim(), email: $('email').value.trim() };

        // Lưu ý: KHÔNG lưu thông tin thẻ ở bất kỳ đâu
        const record = {
            code: state.bookingCode,
            createdAt: new Date().toISOString(),
            status: p.payLater > 0 ? 'deposit_paid' : 'paid',
            homestay: state.homestay.name,
            location: state.homestay.location,
            room: { id: state.room.id, name: state.room.name, thumb: state.room.thumb },
            checkin: state.checkin,
            checkout: state.checkout,
            nights: p.nights,
            guests: state.guests,
            contact,
            arrivalTime: $('arrivalTime').value,
            note: $('guestNote').value.trim(),
            experiences: p.experiences.map((x) => x.title),
            coupon: state.coupon,
            method: state.method,
            pricing: {
                subtotal: p.subtotal, cleaning: p.cleaning, service: p.service, discount: p.discount,
                total: p.total, paid: p.payNow, remaining: p.payLater, experienceEstimate: p.experienceTotal
            }
        };

        // TODO(API): đơn đã được server xác nhận, trang hoàn tất chỉ cần đọc lại theo mã đơn
        try {
            const list = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
            list.unshift(record);
            localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
        } catch (e) { /* trình duyệt chặn lưu trữ: đã có bản dự phòng ở sessionStorage bên dưới */ }
        try {
            sessionStorage.setItem(LAST_KEY, JSON.stringify(record));
            sessionStorage.removeItem(DRAFT_KEY);
        } catch (e) { /* bỏ qua */ }

        // Giữ lớp "đang xác nhận" cho tới khi trang mới tải xong.
        // Dùng replace để nút Back không đưa khách về form đã thanh toán (tránh đặt trùng).
        document.body.style.overflow = '';
        window.location.replace(`${PAGES.complete}?code=${encodeURIComponent(record.code)}`);
    }

    /* ==========================================================================
       SAO CHÉP + TOAST
       ========================================================================== */
    function copyText(text, message) {
        const ok = () => showToast(message || 'Đã sao chép!');
        const fail = () => showToast('Không sao chép được, hãy chọn và sao chép thủ công.');
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(ok).catch(fail);
        } else {
            fail();
        }
    }

    let toastTimer = null;
    function showToast(message) {
        const toast = $('bkToast');
        $('bkToastMsg').textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
    }

})();