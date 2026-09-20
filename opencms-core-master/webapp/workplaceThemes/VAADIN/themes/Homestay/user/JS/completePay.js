/**
 * YÊN Homestay - Trang Hoàn Tất Đặt Phòng
 * Đường dẫn: .../Homestay/user/JS/completePay.js
 * Luồng: booking.js lưu đặt phòng vừa thanh toán rồi chuyển sang completePay.html?code=YEN-XXXXXX
 *        -> trang này đọc lại đặt phòng theo mã và hiển thị xác nhận.
 * Lưu ý: file này chạy CÙNG với homepage.js (đã xử lý header/footer dùng chung).
 *        TODO(API): thay findBooking() bằng lời gọi server lấy đơn theo mã đặt phòng.
 */

const BOOKINGS_KEY = 'yenBookings'; // localStorage: danh sách đặt phòng (dữ liệu mẫu, do booking.js ghi)
const LAST_KEY = 'yenLastBooking';  // sessionStorage: đặt phòng vừa hoàn tất
const PAGES = { home: 'homepage.html', myBookings: 'my-bookings.html' };

const METHOD_LABELS = { vietqr: 'Chuyển khoản QR (VietQR)', momo: 'Ví MoMo', zalopay: 'ZaloPay', card: 'Thẻ ngân hàng' };
const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, '0');
const fmtVND = (n) => Math.round(n).toLocaleString('vi-VN') + 'đ';
const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function fmtDate(s) {
    if (!s) return '-';
    const d = new Date(s + 'T00:00:00');
    return `${WEEKDAYS[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/* ==========================================================================
   LẤY ĐẶT PHÒNG
   - Có ?code=...: tìm đúng mã đó (danh sách trong localStorage, rồi bản dự phòng sessionStorage)
   - Không có mã: lấy đặt phòng vừa hoàn tất, hoặc đặt phòng mới nhất
   ========================================================================== */
function readJSON(storage, key, fallback) {
    try {
        const raw = storage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        return fallback;
    }
}

function findBooking() {
    const code = new URLSearchParams(window.location.search).get('code');
    const list = readJSON(localStorage, BOOKINGS_KEY, []);
    const last = readJSON(sessionStorage, LAST_KEY, null);

    if (code) {
        return list.find((b) => b.code === code) || (last && last.code === code ? last : null);
    }
    return last || list[0] || null;
}

document.addEventListener('DOMContentLoaded', () => {
    $('cpMyBookings').href = PAGES.myBookings;
    $('cpEmptyBookings').href = PAGES.myBookings;
    $('cpHome').href = PAGES.home;
    $('cpEmptyHome').href = PAGES.home;

    const booking = findBooking();
    if (!booking || !booking.pricing || !booking.room) {
        $('cpTop').hidden = true;
        $('cpEmpty').hidden = false;
        document.title = 'Không tìm thấy đặt phòng | YÊN Homestay';
        return;
    }
    renderBooking(booking);
});

/* ==========================================================================
   HIỂN THỊ
   ========================================================================== */
function renderBooking(b) {
    const pr = b.pricing;
    const isDeposit = pr.remaining > 0;

    $('cpContent').hidden = false;
    document.title = `Đặt phòng ${b.code} thành công | YÊN Homestay`;

    // Hero
    $('cpCode').textContent = b.code;
    $('cpSub').textContent =
        `Cảm ơn ${b.contact.fullName}! Chúng tôi đã gửi email xác nhận tới ${b.contact.email}.` +
        (isDeposit ? ` Bạn đã đặt cọc ${fmtVND(pr.paid)}, phần còn lại trả khi nhận phòng.` : '');
    $('cpCopyBtn').addEventListener('click', () => copyText(b.code, 'Đã sao chép mã đặt phòng!'));

    // Thông tin đặt phòng
    $('cpThumb').src = b.room.thumb || '';
    $('cpThumb').alt = b.room.name;
    $('cpHomestay').textContent = b.homestay;
    $('cpRoom').textContent = b.room.name;
    $('cpLocation').innerHTML = b.location ? `<i class="bi bi-geo-alt-fill"></i><span>${esc(b.location)}</span>` : '';

    const info = [
        ['Nhận phòng', `${fmtDate(b.checkin)} · từ 14:00`],
        ['Trả phòng', `${fmtDate(b.checkout)} · trước 12:00`],
        ['Số khách', `${b.guests} khách · ${b.nights} đêm`],
        ['Người đặt', `${b.contact.fullName} · ${b.contact.phone}`]
    ];
    if (b.arrivalTime) info.push(['Giờ dự kiến đến', b.arrivalTime]);
    if (b.experiences && b.experiences.length) info.push(['Trải nghiệm đã chọn', b.experiences.join('; ')]);
    if (b.note) info.push(['Lời nhắn cho chủ nhà', b.note]);
    $('cpInfo').innerHTML = info.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');

    // Chi tiết thanh toán
    const status = $('cpStatus');
    status.textContent = isDeposit ? 'Đã đặt cọc' : 'Đã thanh toán đủ';
    status.classList.toggle('is-deposit', isDeposit);

    let html = `
    <div class="cp-row"><span>Tiền phòng (${b.nights} đêm)</span><span>${fmtVND(pr.subtotal)}</span></div>
    <div class="cp-row"><span>Phí vệ sinh</span><span>${fmtVND(pr.cleaning)}</span></div>
    <div class="cp-row"><span>Phí dịch vụ YÊN</span><span>${fmtVND(pr.service)}</span></div>`;
    if (pr.discount > 0) {
        html += `<div class="cp-row cp-row--discount"><span>Mã ${esc(b.coupon)}</span><span>-${fmtVND(pr.discount)}</span></div>`;
    }
    html += `
    <div class="cp-divider"></div>
    <div class="cp-row cp-row--total"><span>Tổng cộng</span><span>${fmtVND(pr.total)}</span></div>
    <div class="cp-paid">
      <div class="cp-row"><span>${isDeposit ? 'Đã đặt cọc' : 'Đã thanh toán'}</span><b>${fmtVND(pr.paid)}</b></div>
      <p class="cp-paid-method">${esc(METHOD_LABELS[b.method] || 'Thanh toán trực tuyến')}</p>
      ${isDeposit ? `<div class="cp-row cp-row--later"><span>Trả khi nhận phòng</span><span>${fmtVND(pr.remaining)}</span></div>` : ''}
    </div>`;
    if (pr.experienceEstimate > 0) {
        html += `<div class="cp-xp-note"><span>Trải nghiệm dự kiến, trả trực tiếp tại homestay</span><b>${fmtVND(pr.experienceEstimate)}</b></div>`;
    }
    $('cpBreakdown').innerHTML = html;

    // Bước tiếp theo
    const next = [
        'Chủ nhà sẽ nhắn mã mở khóa cho bạn trước ngày nhận phòng 1 ngày. Bạn tự nhận phòng trong khung 14:00 - 21:00.',
        `Email xác nhận kèm mã đặt phòng <b>${esc(b.code)}</b> đã được gửi tới <b>${esc(b.contact.email)}</b>.`
    ];
    if (isDeposit) next.push(`Bạn thanh toán nốt <b>${fmtVND(pr.remaining)}</b> khi nhận phòng.`);
    if (b.experiences && b.experiences.length) {
        const cost = pr.experienceEstimate > 0 ? `, dự kiến ${fmtVND(pr.experienceEstimate)}, trả trực tiếp tại homestay` : '';
        next.push(`Chủ nhà sẽ liên hệ xác nhận ${b.experiences.length} trải nghiệm bạn đã chọn${cost}.`);
    }
    next.push('Cần đổi lịch hoặc hủy phòng? Miễn phí hủy trong 48 giờ sau khi đặt.');
    $('cpNextList').innerHTML = next.map((t) => `<li><i class="bi bi-check2-circle"></i><span>${t}</span></li>`).join('');
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
    const toast = $('toastNotice');
    $('toastMsg').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}