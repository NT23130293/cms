/**
 * YÊN Homestay - Trang Chi Tiết Homestay
 * Đường dẫn: .../Homestay/user/JS/homestayDetail.js
 * Quản lý: Gallery, danh sách loại phòng, popup đặt phòng,
 *          Đánh giá (xem nhanh vài cái + popup bên phải có bộ lọc),
 *          Tiện nghi (xem nhanh 8 mục + popup bên phải có bộ lọc theo nhóm),
 *          Trải nghiệm homestay (xem nhanh 4 mục + popup bên phải có bộ lọc), Homestay tương tự
 * Lưu ý: file này chạy CÙNG với homepage.js (đã xử lý header/footer dùng chung)
 */

const SERVICE_FEE_RATE = 0.05; // Phí dịch vụ YÊN = 5% tiền phòng
const fmtVND = (n) => n.toLocaleString('vi-VN') + 'đ';

/* ==========================================================================
   DỮ LIỆU: CÁC LOẠI PHÒNG
   ========================================================================== */
const roomsData = [
    {
        id: 'doi',
        reviewGroup: 'doi',
        shortName: 'Phòng Đôi',
        name: 'Phòng Đôi View Rừng Thông',
        availableCount: 2,
        rating: 4.92,
        reviewCount: 58,
        specs: { area: '28m²', guests: 2, beds: '1 giường đôi' },
        price: 890000,
        cleaningFee: 100000,
        thumb: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=700&q=80',
        description: 'Phòng ấm cúng dành cho 2 người, view thẳng ra rừng thông, có ban công riêng để ngắm bình minh và uống trà sáng.',
        gallery: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Ban công riêng', 'Lò sưởi mini', 'Bồn tắm gỗ', 'Wifi tốc độ cao', 'Máy sấy tóc', 'Nước suối miễn phí']
    },
    {
        id: 'giadinh',
        reviewGroup: 'giadinh',
        shortName: 'Phòng Gia Đình',
        name: 'Phòng Gác Mái Gia Đình',
        availableCount: 1,
        rating: 4.90,
        reviewCount: 41,
        specs: { area: '42m²', guests: 4, beds: '1 giường đôi + 2 giường đơn' },
        price: 1350000,
        cleaningFee: 130000,
        thumb: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=700&q=80',
        description: 'Không gian 2 tầng ấm cúng cho gia đình, tầng trệt là phòng ngủ chính, gác mái nhỏ xinh dành riêng cho các bé, có bếp mini để tự nấu ăn nhẹ.',
        gallery: [
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Gác mái riêng cho trẻ em', 'Bếp mini', 'Tủ lạnh mini', 'Wifi tốc độ cao', 'Máy sưởi phòng', 'Sân chơi nhỏ ngoài trời']
    },
    {
        id: 'villa',
        reviewGroup: 'villa',
        shortName: 'Villa Toàn Căn',
        name: 'Villa Toàn Căn Đồi Thông',
        availableCount: 1,
        rating: 4.85,
        reviewCount: 27,
        specs: { area: '95m²', guests: 8, beds: '3 phòng ngủ · 4 giường' },
        price: 3200000,
        cleaningFee: 250000,
        thumb: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=700&q=80',
        description: 'Thuê trọn căn nhà gỗ 3 phòng ngủ, có phòng khách và sân BBQ riêng biệt — lựa chọn lý tưởng cho nhóm bạn hoặc gia đình lớn muốn có không gian riêng tư tuyệt đối.',
        gallery: [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Sân BBQ riêng', 'Bếp đầy đủ dụng cụ', 'Phòng khách riêng', 'Lò sưởi củi lớn', 'Chỗ đậu 2 ô tô', 'Máy giặt']
    }
];

let activeRoom = null;
let roomGalleryIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    renderRoomsList();
    renderAmenitiesPreview();
    renderExperiencePreview();
    renderHomestayReviewPreview();
    renderSimilarHomestays();
    initGalleryLabels();
    initPriceSummary();
    setDefaultRoomModalDates();
});

/* ==========================================================================
   TIỆN ÍCH: KHÓA CUỘN TRANG KHI CÓ POPUP
   ========================================================================== */
function syncScrollLock() {
    const anyOpen = ['lightboxOverlay', 'roomModalOverlay', 'rvDrawer', 'xpDrawer', 'amDrawer']
        .some((id) => document.getElementById(id)?.classList.contains('active'));
    document.body.style.overflow = anyOpen ? 'hidden' : '';
}

/* ==========================================================================
   1. GALLERY LIGHTBOX (ẢNH TOÀN HOMESTAY)
   ========================================================================== */
const galleryImages = [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80'
];
let lightboxImages = galleryImages;
let currentLightboxIndex = 0;

function initGalleryLabels() {
    const label = document.getElementById('galleryCountLabel');
    if (label) label.textContent = galleryImages.length;
}

function openLightbox(images, index) {
    lightboxImages = images;
    currentLightboxIndex = index || 0;
    const overlay = document.getElementById('lightboxOverlay');
    if (!overlay) return;
    updateLightboxImage();
    overlay.classList.add('active');
    syncScrollLock();
}

function openGallery(index) { openLightbox(galleryImages, index); }

// Mở ảnh đính kèm của một đánh giá
function openReviewPhotos(reviewId, index) {
    const review = allReviews.find((r) => r.id === reviewId);
    if (review && review.photos.length) openLightbox(review.photos.map((p) => p.full), index);
}

function closeGallery() {
    const overlay = document.getElementById('lightboxOverlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    syncScrollLock();
}

function lightboxNav(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const img = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    if (img) img.src = lightboxImages[currentLightboxIndex];
    if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
    document.querySelectorAll('.lightbox-arrow').forEach((btn) => {
        btn.style.visibility = lightboxImages.length > 1 ? 'visible' : 'hidden';
    });
}

/* ==========================================================================
   2. LƯU (WISHLIST) & CHIA SẺ
   ========================================================================== */
function toggleSaveListing(btn) {
    const isSaved = btn.classList.toggle('saved');
    btn.innerHTML = isSaved ? '<i class="bi bi-heart-fill"></i> Đã lưu' : '<i class="bi bi-heart"></i> Lưu';
    showToastDetail(isSaved ? 'Đã lưu "The Pine Hill Retreat" vào Wishlist!' : 'Đã bỏ lưu khỏi Wishlist.');
}

function shareListing() {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    showToastDetail('Đã sao chép liên kết chia sẻ homestay!');
}

/* ==========================================================================
   3. MÔ TẢ + CUỘN TỚI DANH SÁCH PHÒNG
   ========================================================================== */
function toggleDescription(btn) {
    const desc = document.getElementById('detailDescription');
    const expanded = desc.classList.toggle('detail-description-expanded');
    btn.innerHTML = expanded
        ? 'Thu gọn <i class="bi bi-chevron-up"></i>'
        : 'Đọc thêm <i class="bi bi-chevron-down"></i>';
}

function scrollToRooms() {
    const el = document.getElementById('roomsSection');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initPriceSummary() {
    const minPrice = Math.min(...roomsData.map((r) => r.price));
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    setText('summaryFromPrice', fmtVND(minPrice));
    setText('mobilePriceVal', fmtVND(minPrice));
    setText('roomsCountNote', `${roomsData.length} loại phòng đang mở đặt`);
}

/* ==========================================================================
   4. DANH SÁCH LOẠI PHÒNG (render từ roomsData - một nguồn dữ liệu duy nhất)
   ========================================================================== */
function renderRoomsList() {
    const container = document.getElementById('roomsList');
    if (!container) return;

    container.innerHTML = roomsData.map((room, i) => `
    <article class="room-list-card" onclick="openRoomModal(${i})">
      <div class="room-list-img">
        <img src="${room.thumb}" alt="${room.name}" loading="lazy">
        <span class="room-list-availability ${room.availableCount === 1 ? 'low' : ''}">
          ${room.availableCount === 1 ? 'Chỉ còn 1 phòng' : `Còn ${room.availableCount} phòng`}
        </span>
      </div>
      <div class="room-list-info">
        <h4 class="room-list-name">${room.name}</h4>
        <div class="room-list-specs">
          <span><i class="bi bi-arrows-fullscreen"></i>${room.specs.area}</span>
          <span><i class="bi bi-people"></i>${room.specs.guests} khách</span>
          <span><i class="bi bi-house-door"></i>${room.specs.beds}</span>
        </div>
        <ul class="room-list-tags">
          ${room.amenities.slice(0, 3).map((a) => `<li>${a}</li>`).join('')}
        </ul>
        <button type="button" class="room-rating-link" onclick="event.stopPropagation(); openReviewsDrawer('${room.reviewGroup}')">
          <i class="bi bi-star-fill"></i> ${room.rating.toFixed(2)} <i class="rating-sep"></i> <span>${room.reviewCount} đánh giá</span> <i class="bi bi-chevron-right rating-arrow"></i>
        </button>
      </div>
      <div class="room-list-action">
        <div>
          <div class="room-list-price-label">Giá mỗi đêm</div>
          <div class="room-list-price">${fmtVND(room.price)}</div>
        </div>
        <button type="button" class="yn-btn yn-btn--primary" onclick="event.stopPropagation(); openRoomModal(${i})">Xem & đặt phòng</button>
      </div>
    </article>
  `).join('');
}

/* ==========================================================================
   5. POPUP CHI TIẾT PHÒNG & ĐẶT PHÒNG
   ========================================================================== */
function openRoomModal(index) {
    activeRoom = roomsData[index];
    roomGalleryIndex = 0;

    document.getElementById('roomModalTag').textContent = `Còn ${activeRoom.availableCount} phòng trống`;
    document.getElementById('roomModalTitle').textContent = activeRoom.name;
    document.getElementById('roomModalSpecs').innerHTML = `
    <span><i class="bi bi-arrows-fullscreen"></i>${activeRoom.specs.area}</span>
    <span><i class="bi bi-people"></i>${activeRoom.specs.guests} khách</span>
    <span><i class="bi bi-house-door"></i>${activeRoom.specs.beds}</span>`;
    document.getElementById('roomModalPrice').textContent = fmtVND(activeRoom.price);
    document.getElementById('roomModalDesc').textContent = activeRoom.description;

    document.getElementById('roomModalAmenities').innerHTML = activeRoom.amenities
        .map((a) => `<div class="room-amenity-chip"><i class="bi bi-check-circle-fill"></i> ${a}</div>`).join('');

    // Đánh giá của phòng: chỉ hiện 2 cái mới nhất, còn lại xem trong popup bên phải
    document.getElementById('roomModalRating').innerHTML =
        `<i class="bi bi-star-fill"></i>${activeRoom.rating.toFixed(2)} · ${activeRoom.reviewCount} đánh giá`;
    document.getElementById('roomModalReviews').innerHTML =
        getFilteredReviews(activeRoom.reviewGroup, 'all', 'newest').slice(0, 2)
            .map((r) => reviewCardHTML(r, { showRoom: false, clamp: true })).join('');
    document.getElementById('roomModalReviewsBtn').innerHTML =
        `<i class="bi bi-chat-square-text"></i> Xem tất cả ${activeRoom.reviewCount} đánh giá về phòng này`;

    // Giới hạn số khách theo sức chứa
    const guestSelect = document.getElementById('roomGuests');
    guestSelect.innerHTML = '';
    for (let g = 1; g <= activeRoom.specs.guests; g++) {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = `${g} khách`;
        if (g === Math.min(2, activeRoom.specs.guests)) opt.selected = true;
        guestSelect.appendChild(opt);
    }

    setDefaultRoomModalDates();
    updateRoomGalleryImage();
    updateRoomModalSummary();

    document.getElementById('roomModalOverlay').classList.add('active');
    document.querySelector('.room-modal-scroll').scrollTop = 0;
    syncScrollLock();
}

function closeRoomModal() {
    document.getElementById('roomModalOverlay').classList.remove('active');
    activeRoom = null;
    syncScrollLock();
}

function openActiveRoomReviews() {
    if (activeRoom) openReviewsDrawer(activeRoom.reviewGroup);
}

function roomGalleryNav(direction) {
    if (!activeRoom) return;
    const total = activeRoom.gallery.length;
    roomGalleryIndex = (roomGalleryIndex + direction + total) % total;
    updateRoomGalleryImage();
}

function updateRoomGalleryImage() {
    if (!activeRoom) return;
    document.getElementById('roomModalImg').src = activeRoom.gallery[roomGalleryIndex];
    document.getElementById('roomGalleryCounter').textContent = `${roomGalleryIndex + 1} / ${activeRoom.gallery.length}`;
}

// Định dạng yyyy-mm-dd theo giờ địa phương (tránh lệch ngày do toISOString dùng UTC)
function toInputDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function setDefaultRoomModalDates() {
    const checkinInput = document.getElementById('roomCheckin');
    const checkoutInput = document.getElementById('roomCheckout');
    if (!checkinInput || !checkoutInput) return;

    const checkin = new Date();
    checkin.setDate(checkin.getDate() + 7);
    const checkout = new Date(checkin);
    checkout.setDate(checkin.getDate() + 2);

    checkinInput.min = toInputDate(new Date());
    checkinInput.value = toInputDate(checkin);
    checkoutInput.value = toInputDate(checkout);
    syncCheckoutMin();
}

function syncCheckoutMin() {
    const checkinInput = document.getElementById('roomCheckin');
    const checkoutInput = document.getElementById('roomCheckout');
    if (!checkinInput.value) return;
    const minOut = new Date(checkinInput.value);
    minOut.setDate(minOut.getDate() + 1);
    checkoutInput.min = toInputDate(minOut);
    // Nếu ngày trả phòng không còn hợp lệ sau khi đổi ngày nhận, tự đẩy sang hôm sau
    if (checkoutInput.value && checkoutInput.value < checkoutInput.min) {
        checkoutInput.value = checkoutInput.min;
    }
}

function updateRoomModalSummary() {
    if (!activeRoom) return;
    syncCheckoutMin();

    const warningEl = document.getElementById('roomBookingWarning');
    const checkinVal = document.getElementById('roomCheckin').value;
    const checkoutVal = document.getElementById('roomCheckout').value;
    let nights = 2;

    if (checkinVal && checkoutVal) {
        const diff = Math.round((new Date(checkoutVal) - new Date(checkinVal)) / 86400000);
        if (diff <= 0) {
            warningEl.textContent = 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm.';
            nights = 0;
        } else {
            warningEl.textContent = '';
            nights = diff;
        }
    }

    const subtotal = activeRoom.price * nights;
    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
    const total = nights > 0 ? subtotal + activeRoom.cleaningFee + serviceFee : 0;

    document.getElementById('roomPricePerNightLabel').textContent = fmtVND(activeRoom.price);
    document.getElementById('roomNightsCount').textContent = nights;
    document.getElementById('roomSubtotalPrice').textContent = fmtVND(subtotal);
    document.getElementById('roomCleaningFee').textContent = fmtVND(activeRoom.cleaningFee);
    document.getElementById('roomServiceFee').textContent = fmtVND(serviceFee);
    document.getElementById('roomTotalPrice').textContent = fmtVND(total);
    document.getElementById('roomFooterTotal').textContent = fmtVND(total);
    document.getElementById('roomFooterNights').textContent = nights;
}

function confirmRoomBooking() {
    if (!activeRoom) return;
    const nights = parseInt(document.getElementById('roomNightsCount').textContent, 10);
    if (!nights || nights <= 0) {
        showToastDetail('Vui lòng chọn lại ngày nhận - trả phòng hợp lệ!');
        return;
    }
    showToastDetail(`Đang chuyển đến trang xác nhận đặt "${activeRoom.name}"...`);
    closeRoomModal();
}

/* ==========================================================================
   6. ĐÁNH GIÁ
   Dữ liệu mẫu được sinh cố định (58 + 41 + 27 = 126) để số lượng khớp với giao diện.
   Khi có API thật: thay hàm buildAllReviews() bằng dữ liệu trả về từ server.
   ========================================================================== */
const REVIEW_GROUPS = [
    { id: 'doi',     label: 'Phòng Đôi',      total: 58 },
    { id: 'giadinh', label: 'Phòng Gia Đình', total: 41 },
    { id: 'villa',   label: 'Villa Toàn Căn', total: 27 }
];
const TOTAL_REVIEWS = REVIEW_GROUPS.reduce((s, g) => s + g.total, 0);

const reviewTexts = {
    doi: [
        'Ban công nhìn thẳng ra rừng thông, sáng dậy uống trà mà không muốn về.',
        'Bồn tắm gỗ ngoài trời là điểm cộng lớn nhất, tối ngâm mình ngắm sao rất chill.',
        'Phòng nhỏ xinh, ấm áp, lò sưởi mini bật lên là ngủ ngon ngay.',
        'Đi cùng người yêu, không gian riêng tư và lãng mạn đúng như hình.',
        'Giường êm, chăn dày, đêm Đà Lạt lạnh mấy cũng không thấy lạnh.',
        'Phòng sạch, thơm mùi gỗ thông, decor đơn giản mà tinh tế.',
        'Buổi sáng săn mây ngay từ ban công, chụp ảnh lên rất đẹp.',
        'Vị trí yên tĩnh nhưng ra chợ đêm chỉ mất vài phút đi xe.',
        'Chúng mình đi kỷ niệm ngày cưới, chủ nhà còn gửi thêm bình trà nóng buổi tối.',
        'Nhận phòng bằng mã số rất tiện, đến muộn cũng không lo.',
        'Phòng đúng như mô tả, view đẹp hơn cả mong đợi.',
        'Lò sưởi và bồn tắm gỗ khiến chuyến đi 2 ngày 1 đêm như một kỳ nghỉ dài.'
    ],
    giadinh: [
        'Nhà mình có 2 bé nhỏ, các bé mê gác mái riêng và ngủ rất ngoan.',
        'Phòng rộng rãi, bếp mini tiện nấu đồ ăn dặm cho bé.',
        'Sân chơi nhỏ ngoài trời an toàn, con chạy nhảy cả buổi chiều.',
        'Ba thế hệ đi cùng nhau vẫn thoải mái, giường đủ cho cả nhà.',
        'Không gian ấm cúng, có máy sưởi nên bé không bị lạnh về đêm.',
        'Gác mái được chăng đèn nhỏ xinh, bọn trẻ nhất quyết không chịu xuống.',
        'Tủ lạnh mini và bếp giúp gia đình tự chuẩn bị bữa sáng rất tiện.',
        'Chủ nhà chuẩn bị sẵn ghế ăn cho bé, rất chu đáo.',
        'Sân BBQ chung sạch sẽ, cả nhà nướng đồ ăn buổi tối vui hết ý.',
        'Phòng sạch sẽ, chăn ga thơm, không có mùi ẩm dù Đà Lạt hay mưa.',
        'Cách trung tâm gần, đi chợ đêm xong về nghỉ ngơi rất nhanh.',
        'Đây là lần thứ hai gia đình mình quay lại, vẫn hài lòng như lần đầu.'
    ],
    villa: [
        'Nhóm 8 người ở vừa vặn, mỗi cặp có phòng riêng mà vẫn có phòng khách chung.',
        'Sân BBQ riêng nên cả nhóm nướng đồ ăn ngay tại chỗ, không cần đi đâu.',
        'Villa riêng biệt hoàn toàn, sang trọng mà vẫn ấm cúng.',
        'Lò sưởi củi lớn ở phòng khách là tâm điểm của cả buổi tối.',
        'Bếp đầy đủ dụng cụ, cả nhóm tự nấu lẩu rất tiện.',
        'Chỗ đậu 2 ô tô ngay trong sân, đi nhóm không lo chỗ để xe.',
        'Đi nhóm bạn thân, không gian rộng để chơi board game và tán gẫu suốt đêm.',
        'Chia đều tiền phòng cho 8 người thì rất hợp lý so với chất lượng.',
        'Máy giặt trong nhà giúp chuyến đi dài ngày nhẹ nhàng hơn nhiều.',
        'Sáng dậy mở cửa là thấy đồi thông, cả nhóm ngồi cà phê ngoài sân đến trưa.',
        'Nhà rộng, sạch, ba phòng ngủ đều có cửa sổ nhìn ra rừng thông.',
        'Mùa hoa mai anh đào quay lại chắc chắn sẽ đặt villa này lần nữa.'
    ]
};
const reviewTails = [
    '',
    ' Chủ nhà hỗ trợ rất nhiệt tình.',
    '',
    ' Sẽ quay lại lần sau!',
    ' Wifi mạnh, mọi thứ đều sạch sẽ.',
    ' Rất đáng tiền.'
];
const reviewFirstNames = ['Minh', 'Bảo', 'Ngọc', 'Thanh', 'Quốc', 'Đức', 'Hoàng', 'Khánh', 'Phương', 'Tuấn', 'Thu', 'Hải', 'Mai', 'Linh'];
const reviewLastNames = ['Thư', 'Anh', 'Trâm', 'Hằng', 'Huy', 'Lan', 'Nam', 'Vy', 'Quân', 'Trang', 'Khoa', 'Chi'];
const avatarColors = ['#15803D', '#0F766E', '#B45309', '#BE123C', '#4338CA', '#0369A1', '#7C3AED'];

// Ảnh khách chụp, theo từng loại phòng (dữ liệu mẫu)
const reviewPhotoPool = {
    doi:     ['1522708323590-d24dbb6b0267', '1560448204-e02f11c3d0e2', '1560185893-a55cbc8c57e8', '1470770903676-69b98201ea1c'],
    giadinh: ['1505691938895-1758d7feb511', '1522708323590-d24dbb6b0267', '1584622650111-993a426fbf0a', '1470071459604-3b5ec3a7fe05'],
    villa:   ['1584622650111-993a426fbf0a', '1542314831-068cd1dbfeeb', '1518780664697-55e3ad937233', '1520250497591-112f2f40a3f4']
};
const unsplashUrl = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// ~60% đánh giá có 1-3 ảnh
function buildReviewPhotos(groupId, k, gi) {
    if ((k * 7 + gi) % 5 >= 3) return [];
    const pool = reviewPhotoPool[groupId];
    const count = 1 + (k % 3);
    return Array.from({ length: count }, (_, i) => {
        const id = pool[(k + i * 2) % pool.length];
        return { thumb: unsplashUrl(id, 400), full: unsplashUrl(id, 1400) };
    });
}

function buildAllReviews() {
    const list = [];
    let counter = 0;
    // Mốc "hiện tại" của dữ liệu mẫu: cuối tháng 8/2026, lùi dần ~18 tháng
    const base = new Date(2026, 7, 28).getTime();

    REVIEW_GROUPS.forEach((group, gi) => {
        for (let k = 0; k < group.total; k++) {
            const daysBack = Math.floor((k / group.total) * 540) + ((k * 7 + gi * 3) % 9);
            const ts = base - daysBack * 86400000;
            const d = new Date(ts);
            list.push({
                id: `${group.id}-${k}`,
                group: group.id,
                room: group.label,
                name: `${reviewFirstNames[(counter * 3 + gi) % reviewFirstNames.length]} ${reviewLastNames[(counter * 5 + Math.floor(counter / 14)) % reviewLastNames.length]}`,
                ts,
                date: `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`,
                stars: k % 10 === 6 ? 4 : 5,
                text: reviewTexts[group.id][k % 12] + reviewTails[(k * 5 + 3) % reviewTails.length],
                photos: buildReviewPhotos(group.id, k, gi)
            });
            counter++;
        }
    });
    return list;
}
const allReviews = buildAllReviews();

function getFilteredReviews(group, stars, sort, onlyPhotos) {
    let list = allReviews.filter((r) =>
        (group === 'all' || r.group === group) &&
        (stars === 'all' || r.stars === Number(stars)) &&
        (!onlyPhotos || r.photos.length > 0));
    if (sort === 'high') list.sort((a, b) => b.stars - a.stars || b.ts - a.ts);
    else if (sort === 'low') list.sort((a, b) => a.stars - b.stars || b.ts - a.ts);
    else list.sort((a, b) => b.ts - a.ts);
    return list;
}

function reviewAvatarHTML(name) {
    const initial = name.trim().split(' ').pop().charAt(0).toUpperCase();
    let hash = 0;
    for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
    return `<div class="review-avatar" style="background:${avatarColors[hash % avatarColors.length]}">${initial}</div>`;
}

function reviewCardHTML(r, { showRoom = true, clamp = false } = {}) {
    const stars = Array.from({ length: 5 }, (_, i) => `<i class="bi bi-star-fill ${i < r.stars ? '' : 'off'}"></i>`).join('');
    const photos = r.photos.length ? `
      <div class="review-photos">
        ${r.photos.map((p, i) => `
        <button type="button" class="review-photo" onclick="openReviewPhotos('${r.id}', ${i})" title="Xem ảnh lớn">
          <img src="${p.thumb}" alt="Ảnh của ${r.name}" loading="lazy">
        </button>`).join('')}
      </div>` : '';
    return `
    <div class="review-card">
      <div class="review-head">
        ${reviewAvatarHTML(r.name)}
        <div>
          <h5>${r.name}</h5>
          <span>${r.date}</span>
        </div>
      </div>
      ${showRoom ? `<span class="review-room-badge"><i class="bi bi-door-open"></i> ${r.room}</span>` : ''}
      <div class="review-stars">${stars}</div>
      <p class="review-text ${clamp ? 'review-text--clamp' : ''}">${r.text}</p>
      ${photos}
    </div>`;
}

/* 6.1 Xem nhanh trên trang: mỗi loại phòng 1 đánh giá mới nhất (ưu tiên có ảnh), xếp dọc */
function renderHomestayReviewPreview() {
    const container = document.getElementById('reviewsGrid');
    if (!container) return;

    const newest = getFilteredReviews('all', 'all', 'newest');
    const picks = REVIEW_GROUPS
        .map((g) => newest.find((r) => r.group === g.id && r.photos.length) || newest.find((r) => r.group === g.id))
        .sort((a, b) => b.ts - a.ts);

    container.innerHTML = picks.map((r) => reviewCardHTML(r, { showRoom: true, clamp: true })).join('');
}

/* 6.2 Popup đánh giá trượt từ bên phải (rộng ~ nửa màn hình) + bộ lọc */
const REVIEW_PAGE_SIZE = 6;
const reviewState = { group: 'all', stars: 'all', sort: 'newest', photo: false, shown: REVIEW_PAGE_SIZE };
let reviewsDrawerOpener = null;

function openReviewsDrawer(group) {
    reviewsDrawerOpener = document.activeElement;
    Object.assign(reviewState, { group: group || 'all', stars: 'all', sort: 'newest', photo: false, shown: REVIEW_PAGE_SIZE });
    document.getElementById('rvSort').value = 'newest';
    renderReviewsDrawer();

    document.getElementById('rvOverlay').classList.add('active');
    const drawer = document.getElementById('rvDrawer');
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    syncScrollLock();
    setTimeout(() => document.getElementById('rvCloseBtn').focus(), 50);
}

function closeReviewsDrawer() {
    document.getElementById('rvOverlay').classList.remove('active');
    const drawer = document.getElementById('rvDrawer');
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    syncScrollLock();
    if (reviewsDrawerOpener && typeof reviewsDrawerOpener.focus === 'function') reviewsDrawerOpener.focus();
    reviewsDrawerOpener = null;
}

function updateReviewFilter(patch) {
    Object.assign(reviewState, patch, { shown: REVIEW_PAGE_SIZE });
    renderReviewsDrawer();
}
function setReviewGroup(group) { updateReviewFilter({ group }); }
function setReviewStars(stars) { updateReviewFilter({ stars, photo: false }); }
function toggleReviewPhoto() { updateReviewFilter({ photo: !reviewState.photo, stars: 'all' }); }
function setReviewSort(sort) { updateReviewFilter({ sort }); }
function resetReviewFilters() {
    document.getElementById('rvSort').value = 'newest';
    updateReviewFilter({ group: 'all', stars: 'all', sort: 'newest', photo: false });
}

function showMoreReviews() {
    reviewState.shown += REVIEW_PAGE_SIZE;
    renderReviewsDrawer(true);
}

function renderReviewsDrawer(keepScroll) {
    const { group, stars, sort, photo, shown } = reviewState;
    const listEl = document.getElementById('rvList');
    const prevScroll = listEl.scrollTop;

    // Tóm tắt điểm theo loại phòng đang chọn
    const room = roomsData.find((r) => r.reviewGroup === group);
    document.getElementById('rvScore').textContent = room ? room.rating.toFixed(2) : '4.90';
    document.getElementById('rvSummaryLabel').textContent = `${room ? room.reviewCount : TOTAL_REVIEWS} đánh giá`;
    document.getElementById('rvSummarySub').textContent = room ? room.name : 'Tất cả loại phòng';

    // Chip loại phòng
    document.getElementById('rvRoomChips').innerHTML = [{ id: 'all', label: 'Tất cả', total: TOTAL_REVIEWS }, ...REVIEW_GROUPS]
        .map((g) => `<button type="button" class="yn-chip ${group === g.id ? 'active' : ''}" onclick="setReviewGroup('${g.id}')">${g.label} <span class="chip-count">${g.total}</span></button>`)
        .join('');

    // Chip số sao + có hình ảnh
    const photoCount = getFilteredReviews(group, 'all', 'newest', true).length;
    document.getElementById('rvStarChips').innerHTML = [
            { v: 'all', label: 'Tất cả sao' },
            { v: '5', label: '5', star: true },
            { v: '4', label: '4', star: true }
        ].map((s) => `<button type="button" class="yn-chip ${!photo && stars === s.v ? 'active' : ''}" onclick="setReviewStars('${s.v}')">${s.star ? '<i class="bi bi-star-fill"></i>' : ''}${s.label}</button>`).join('')
        + `<button type="button" class="yn-chip ${photo ? 'active' : ''}" onclick="toggleReviewPhoto()"><i class="bi bi-camera-fill"></i> Có hình ảnh <span class="chip-count">${photoCount}</span></button>`;

    // Danh sách xếp dọc
    const result = getFilteredReviews(group, stars, sort, photo);
    const visible = result.slice(0, shown);
    document.getElementById('rvResultCount').textContent =
        result.length ? `Hiển thị ${visible.length} / ${result.length} đánh giá` : 'Không có đánh giá phù hợp';

    listEl.innerHTML = visible.length
        ? visible.map((r) => reviewCardHTML(r, { showRoom: true, clamp: false })).join('')
        : `<div class="rv-empty"><i class="bi bi-chat-square-dots"></i>Chưa có đánh giá nào khớp với bộ lọc này.
             <br><button type="button" class="yn-btn yn-btn--outline yn-btn--sm" onclick="resetReviewFilters()">Xóa bộ lọc</button></div>`;

    document.getElementById('rvFoot').innerHTML = result.length > shown
        ? `<button type="button" class="yn-btn yn-btn--outline yn-btn--block" onclick="showMoreReviews()">Xem thêm ${Math.min(REVIEW_PAGE_SIZE, result.length - shown)} đánh giá</button>`
        : '';

    listEl.scrollTop = keepScroll ? prevScroll : 0;
}

/* ==========================================================================
   7. TIỆN NGHI
   - Trang chính: xem nhanh 8 tiện nghi nổi bật (các mục có trường preview, theo thứ tự preview)
   - Popup trượt từ bên phải (cùng khung rv-* với popup đánh giá): xem tất cả, chia theo nhóm + lọc theo nhóm
   Số lượng "24" trên nút được tính tự động từ amenitiesData.
   Khi có API thật: thay amenitiesData bằng dữ liệu trả về từ server.
   ========================================================================== */
const AMENITY_GROUPS = [
    { id: 'ngoaitroi', label: 'Ngoài trời & thiên nhiên', icon: 'bi-tree' },
    { id: 'bep',       label: 'Bếp & ăn uống',            icon: 'bi-cup-straw' },
    { id: 'phong',     label: 'Phòng ngủ & phòng tắm',    icon: 'bi-moon-stars' },
    { id: 'tienich',   label: 'Tiện ích & an toàn',       icon: 'bi-shield-check' }
];

const amenitiesData = [
    // Ngoài trời & thiên nhiên
    { id: 'bontam',   group: 'ngoaitroi', icon: 'bi-cup-hot',          name: 'Bồn tắm gỗ ngắm mây', note: 'Hẹn giờ với chủ nhà để có nước nóng sẵn sàng.', preview: 2 },
    { id: 'bbq',      group: 'ngoaitroi', icon: 'bi-egg-fried',        name: 'Sân BBQ chung', note: 'Villa Toàn Căn có sân BBQ riêng.', preview: 3 },
    { id: 'luatrai',  group: 'ngoaitroi', icon: 'bi-fire',             name: 'Khu lửa trại ngoài sân' },
    { id: 'vuon',     group: 'ngoaitroi', icon: 'bi-flower1',          name: 'Vườn rau, vườn hoa trước nhà' },
    { id: 'hien',     group: 'ngoaitroi', icon: 'bi-tree',             name: 'Hiên gỗ nhìn ra đồi thông' },
    { id: 'vong',     group: 'ngoaitroi', icon: 'bi-cloud-sun',        name: 'Võng và ghế thư giãn ngoài sân' },
    // Bếp & ăn uống
    { id: 'bep',      group: 'bep',       icon: 'bi-cup-straw',        name: 'Bếp chung đầy đủ dụng cụ', preview: 6 },
    { id: 'tulanh',   group: 'bep',       icon: 'bi-snow2',            name: 'Tủ lạnh' },
    { id: 'vivi',     group: 'bep',       icon: 'bi-lightning-charge', name: 'Lò vi sóng và ấm siêu tốc' },
    { id: 'tra',      group: 'bep',       icon: 'bi-cup-hot',          name: 'Bộ ấm trà và cà phê' },
    { id: 'banan',    group: 'bep',       icon: 'bi-table',            name: 'Bàn ăn ngoài trời' },
    { id: 'nuoc',     group: 'bep',       icon: 'bi-droplet',          name: 'Nước lọc miễn phí' },
    // Phòng ngủ & phòng tắm
    { id: 'losuoi',   group: 'phong',     icon: 'bi-fire',             name: 'Lò sưởi củi', preview: 1 },
    { id: 'maysuoi',  group: 'phong',     icon: 'bi-snow',             name: 'Máy sưởi phòng', preview: 8 },
    { id: 'changa',   group: 'phong',     icon: 'bi-moon',             name: 'Chăn ga gối sạch, thơm mùi gỗ thông' },
    { id: 'chan',     group: 'phong',     icon: 'bi-moon-stars',       name: 'Chăn dày bổ sung cho đêm lạnh' },
    { id: 'saytoc',   group: 'phong',     icon: 'bi-wind',             name: 'Máy sấy tóc' },
    { id: 'khan',     group: 'phong',     icon: 'bi-droplet-half',     name: 'Khăn tắm và đồ vệ sinh cá nhân' },
    // Tiện ích & an toàn
    { id: 'wifi',     group: 'tienich',   icon: 'bi-wifi',             name: 'Wifi tốc độ cao', preview: 4 },
    { id: 'dauxe',    group: 'tienich',   icon: 'bi-car-front',        name: 'Chỗ đậu xe miễn phí', note: 'Villa Toàn Căn có chỗ đậu 2 ô tô ngay trong sân.', preview: 5 },
    { id: 'tv',       group: 'tienich',   icon: 'bi-tv',               name: 'Smart TV', preview: 7 },
    { id: 'khoama',   group: 'tienich',   icon: 'bi-key',              name: 'Tự nhận phòng bằng mã số' },
    { id: 'camera',   group: 'tienich',   icon: 'bi-camera-video',     name: 'Camera ở khu vực ngoài trời' },
    { id: 'yte',      group: 'tienich',   icon: 'bi-bandaid',          name: 'Bình chữa cháy và hộp sơ cứu' }
];

const amenityState = { category: 'all' };
let amenitiesDrawerOpener = null;

/* 7.1 Xem nhanh trên trang */
function renderAmenitiesPreview() {
    const grid = document.getElementById('amenitiesGrid');
    if (!grid) return;

    const picks = amenitiesData
        .filter((a) => a.preview)
        .sort((a, b) => a.preview - b.preview);
    grid.innerHTML = picks
        .map((a) => `<div class="amenity-row"><i class="bi ${a.icon}"></i> ${a.name}</div>`)
        .join('');

    const btnCount = document.getElementById('amenitiesBtnCount');
    if (btnCount) btnCount.textContent = amenitiesData.length;
}

/* 7.2 Popup tiện nghi trượt từ bên phải */
function openAmenitiesDrawer(category) {
    amenitiesDrawerOpener = document.activeElement;
    amenityState.category = category || 'all';
    renderAmenitiesDrawer();

    document.getElementById('amOverlay').classList.add('active');
    const drawer = document.getElementById('amDrawer');
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    syncScrollLock();
    setTimeout(() => document.getElementById('amCloseBtn').focus(), 50);
}

function closeAmenitiesDrawer() {
    document.getElementById('amOverlay').classList.remove('active');
    const drawer = document.getElementById('amDrawer');
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    syncScrollLock();
    if (amenitiesDrawerOpener && typeof amenitiesDrawerOpener.focus === 'function') amenitiesDrawerOpener.focus();
    amenitiesDrawerOpener = null;
}

function setAmenityCategory(category) {
    amenityState.category = category;
    renderAmenitiesDrawer();
}

function renderAmenitiesDrawer() {
    const { category } = amenityState;
    const listEl = document.getElementById('amList');

    const groups = AMENITY_GROUPS.filter((g) => category === 'all' || g.id === category);
    const shown = amenitiesData.filter((a) => category === 'all' || a.group === category).length;
    const activeGroup = AMENITY_GROUPS.find((g) => g.id === category);

    document.getElementById('amSummaryLabel').textContent = `${shown} tiện nghi`;
    document.getElementById('amSummarySub').textContent = activeGroup ? activeGroup.label : 'Tất cả nhóm tiện nghi';
    document.getElementById('amResultCount').textContent = `Hiển thị ${shown} / ${amenitiesData.length} tiện nghi`;

    document.getElementById('amCategoryChips').innerHTML =
        [{ id: 'all', label: 'Tất cả', count: amenitiesData.length },
            ...AMENITY_GROUPS.map((g) => ({ ...g, count: amenitiesData.filter((a) => a.group === g.id).length }))]
            .map((g) => `<button type="button" class="yn-chip ${category === g.id ? 'active' : ''}" onclick="setAmenityCategory('${g.id}')">${g.label} <span class="chip-count">${g.count}</span></button>`)
            .join('');

    listEl.innerHTML = groups.map((g) => {
        const items = amenitiesData.filter((a) => a.group === g.id);
        return `
    <section class="am-group">
      <h4 class="am-group-title"><i class="bi ${g.icon}"></i> ${g.label} <span class="am-group-count">${items.length}</span></h4>
      <ul class="am-group-list">
        ${items.map((a) => `
        <li class="am-row">
          <i class="bi ${a.icon}"></i>
          <div>
            <span class="am-row-name">${a.name}</span>
            ${a.note ? `<span class="am-row-note">${a.note}</span>` : ''}
          </div>
        </li>`).join('')}
      </ul>
    </section>`;
    }).join('');

    listEl.scrollTop = 0;
}

/* ==========================================================================
   8. TRẢI NGHIỆM HOMESTAY MANG LẠI
   - Trang chính (trong khối Tiện nghi): xem nhanh 4 trải nghiệm nổi bật
   - Popup trượt từ bên phải (cùng khung rv-* với popup đánh giá): xem tất cả + lọc theo nhóm / chi phí
   Dữ liệu mẫu: khi có API thật, thay experiencesData bằng dữ liệu trả về từ server
   (price = 0 nghĩa là miễn phí).
   ========================================================================== */
const EXPERIENCE_CATEGORIES = [
    { id: 'thiennhien', label: 'Thiên nhiên',          icon: 'bi-tree' },
    { id: 'nongtrai',   label: 'Vườn & nông trại',     icon: 'bi-basket' },
    { id: 'amthuc',     label: 'Ẩm thực',              icon: 'bi-cup-hot' },
    { id: 'thugian',    label: 'Thư giãn & giao lưu',  icon: 'bi-fire' }
];

const EXPERIENCE_COSTS = [
    { id: 'all',  label: 'Tất cả' },
    { id: 'free', label: 'Miễn phí' },
    { id: 'paid', label: 'Có phí' }
];

// Các trải nghiệm hiện ở phần xem nhanh (theo thứ tự)
const EXPERIENCE_PREVIEW_IDS = ['sanmay', 'hairau', 'naucom', 'luatrai'];

// Ảnh dự phòng khi ảnh chính của trải nghiệm không tải được
const EXPERIENCE_FALLBACK_IMG = '1470071459604-3b5ec3a7fe05';

const experiencesData = [
    {
        id: 'sanmay',
        category: 'thiennhien',
        title: 'Săn mây bình minh trên đồi thông',
        summary: 'Dậy sớm cùng chủ nhà lên điểm ngắm mây phía sau đồi, vừa nhâm nhi trà gừng nóng vừa chờ mặt trời ló dạng.',
        img: '1470770903676-69b98201ea1c',
        duration: '90 phút',
        time: '05:30 – 07:00',
        people: 'Mọi lứa tuổi',
        price: 0,
        unit: '',
        includes: ['Trà gừng nóng', 'Chủ nhà chỉ đường lên điểm ngắm mây', 'Góc chụp ảnh nhìn ra biển mây'],
        note: 'Sáng sớm ở Đà Lạt khá lạnh, bạn nhớ mang áo ấm.',
        booking: 'Không cần đặt trước'
    },
    {
        id: 'trekking',
        category: 'thiennhien',
        title: 'Đi bộ xuyên rừng thông',
        summary: 'Cung đường mòn nhẹ nhàng quanh đồi, chủ nhà dẫn bạn đi qua những góc rừng yên tĩnh ít người biết đến.',
        img: '1441974231531-c6227db76b6e',
        duration: '2 giờ',
        time: 'Sáng hoặc chiều',
        people: 'Từ 6 tuổi',
        price: 100000,
        unit: '/ nhóm',
        includes: ['Chủ nhà dẫn đường', 'Nước suối', 'Gậy đi bộ'],
        note: 'Nên mang giày thể thao hoặc giày đế bám.',
        booking: 'Đặt trước 1 ngày'
    },
    {
        id: 'hairau',
        category: 'nongtrai',
        title: 'Hái rau, dâu tại vườn nhà',
        summary: 'Tự tay chọn rau củ và dâu tây trong vườn hữu cơ của gia đình, rồi mang về bếp chung nấu ngay trong bữa.',
        img: '1464965911861-746a04b4bca6',
        duration: '60 phút',
        time: '08:00 – 10:00',
        people: 'Mọi lứa tuổi',
        price: 60000,
        unit: '/ khách',
        includes: ['Giỏ và kéo cắt rau', 'Mang về tối đa 1kg rau, quả', 'Găng tay cho bé'],
        note: 'Rau, quả theo mùa vụ nên có thể thay đổi giữa các tháng.',
        booking: 'Đặt trước 1 ngày'
    },
    {
        id: 'nongtrai',
        category: 'nongtrai',
        title: 'Cho gà, thỏ ăn & chơi vườn cùng bé',
        summary: 'Góc nông trại nhỏ trong sân vườn: các bé cho gà, thỏ ăn, nhặt trứng và chạy nhảy thoải mái, an toàn.',
        img: '1500382017468-9049fed747ef',
        duration: '45 phút',
        time: 'Cả ngày',
        people: 'Gia đình có trẻ nhỏ',
        price: 0,
        unit: '',
        includes: ['Thức ăn cho vật nuôi', 'Nước rửa tay sau khi chơi'],
        note: 'Trẻ nhỏ cần có người lớn đi cùng.',
        booking: 'Không cần đặt trước'
    },
    {
        id: 'naucom',
        category: 'amthuc',
        title: 'Học nấu bữa cơm quê cùng chủ nhà',
        summary: 'Cùng chị Lan Anh vào bếp làm 3 món quê từ rau vườn nhà, rồi ngồi ăn quây quần như bữa cơm gia đình.',
        img: '1414235077428-338989a2e8c0',
        duration: '2 giờ',
        time: '16:00 – 18:00',
        people: 'Từ 2 khách',
        price: 180000,
        unit: '/ khách',
        includes: ['Nguyên liệu tươi từ vườn', 'Chủ nhà hướng dẫn từng món', 'Bữa cơm thưởng thức tại chỗ'],
        note: 'Báo trước nếu có khách ăn chay hoặc dị ứng thực phẩm.',
        booking: 'Đặt trước 1 ngày'
    },
    {
        id: 'tradacphe',
        category: 'amthuc',
        title: 'Trà atiso & cà phê rang xay buổi sáng',
        summary: 'Ngồi hiên nhà gỗ thưởng thức trà atiso và cà phê xay tay, kèm bánh ngọt chủ nhà làm từ sáng.',
        img: '1495474472287-4d71bcdd2085',
        duration: '45 phút',
        time: '07:00 – 09:00',
        people: 'Mọi lứa tuổi',
        price: 0,
        unit: '',
        includes: ['Ly trà hoặc cà phê đầu tiên miễn phí', 'Bánh ngọt làm tại nhà', 'Chỗ ngồi hiên nhìn ra đồi'],
        note: 'Từ ly thứ hai, mỗi ly tính thêm 25.000đ.',
        booking: 'Không cần đặt trước'
    },
    {
        id: 'luatrai',
        category: 'thugian',
        title: 'Lửa trại & nướng BBQ đêm đồi thông',
        summary: 'Quây quần bên đống lửa nướng đồ, hát hò và kể chuyện dưới trời se lạnh, một buổi tối rất Đà Lạt.',
        img: '1584622650111-993a426fbf0a',
        duration: '2 giờ',
        time: '18:30 – 21:00',
        people: 'Từ 2 khách',
        price: 250000,
        unit: '/ nhóm',
        includes: ['Củi và than', 'Bếp nướng, vỉ nướng, dụng cụ', 'Bàn ghế ngoài trời'],
        note: 'Khách tự mang thực phẩm hoặc đặt combo BBQ với chủ nhà. Kết thúc trước 21:00 để giữ yên tĩnh cho cả khu.',
        booking: 'Đặt trước 1 ngày'
    },
    {
        id: 'bontam',
        category: 'thugian',
        title: 'Ngâm bồn tắm gỗ ngắm mây, ngắm sao',
        summary: 'Ngâm nước ấm trong bồn tắm gỗ ngoài trời, ngắm mây trôi ban ngày hoặc bầu trời sao ban đêm.',
        img: '1560448204-e02f11c3d0e2',
        duration: '60 phút',
        time: 'Cả ngày',
        people: 'Khách lưu trú',
        price: 0,
        unit: '',
        includes: ['Nước nóng sẵn sàng', 'Khăn tắm và muối thảo mộc'],
        note: 'Hãy báo giờ với chủ nhà trước để có nước nóng đúng lúc.',
        booking: 'Hẹn giờ với chủ nhà'
    }
];

const experienceState = { category: 'all', cost: 'all' };
let experiencesDrawerOpener = null;

const experienceCategory = (id) => EXPERIENCE_CATEGORIES.find((c) => c.id === id);
const experiencePriceLabel = (x) => (x.price > 0 ? `${fmtVND(x.price)} ${x.unit}` : 'Miễn phí');

function experienceImgTag(x, w) {
    return `<img src="${unsplashUrl(x.img, w)}" alt="${x.title}" loading="lazy"
              onerror="this.onerror=null;this.src='${unsplashUrl(EXPERIENCE_FALLBACK_IMG, w)}'">`;
}

function matchExperience(x, category, cost) {
    return (category === 'all' || x.category === category)
        && (cost === 'all' || (cost === 'free' ? x.price === 0 : x.price > 0));
}

/* 7.1 Xem nhanh trong khối Tiện nghi */
function renderExperiencePreview() {
    const grid = document.getElementById('experienceGrid');
    if (!grid) return;

    const picks = EXPERIENCE_PREVIEW_IDS
        .map((id) => experiencesData.find((x) => x.id === id))
        .filter(Boolean);

    grid.innerHTML = picks.map((x) => {
        const cat = experienceCategory(x.category);
        return `
    <button type="button" class="xp-card" onclick="openExperiencesDrawer('all', '${x.id}')">
      <span class="xp-card-media">
        ${experienceImgTag(x, 700)}
        <span class="xp-badge ${x.price > 0 ? '' : 'xp-badge--free'}">${experiencePriceLabel(x)}</span>
      </span>
      <span class="xp-card-body">
        <span class="xp-cat"><i class="bi ${cat.icon}"></i> ${cat.label}</span>
        <span class="xp-card-name">${x.title}</span>
        <span class="xp-card-meta"><i class="bi bi-clock"></i> ${x.duration}</span>
      </span>
    </button>`;
    }).join('');

    const countText = `${experiencesData.length} trải nghiệm`;
    const note = document.getElementById('experienceCountNote');
    const btnCount = document.getElementById('experienceBtnCount');
    if (note) note.textContent = countText;
    if (btnCount) btnCount.textContent = experiencesData.length;
}

/* 7.2 Popup trải nghiệm trượt từ bên phải */
function openExperiencesDrawer(category, focusId) {
    experiencesDrawerOpener = document.activeElement;
    Object.assign(experienceState, { category: category || 'all', cost: 'all' });
    renderExperiencesDrawer(focusId);

    document.getElementById('xpOverlay').classList.add('active');
    const drawer = document.getElementById('xpDrawer');
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    syncScrollLock();
    setTimeout(() => document.getElementById('xpCloseBtn').focus(), 50);
}

function closeExperiencesDrawer() {
    document.getElementById('xpOverlay').classList.remove('active');
    const drawer = document.getElementById('xpDrawer');
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    syncScrollLock();
    if (experiencesDrawerOpener && typeof experiencesDrawerOpener.focus === 'function') experiencesDrawerOpener.focus();
    experiencesDrawerOpener = null;
}

// Nút "Chọn phòng để đặt" ở chân popup: đóng popup rồi cuộn tới danh sách phòng
function experiencesToRooms() {
    closeExperiencesDrawer();
    scrollToRooms();
}

function setExperienceCategory(category) {
    experienceState.category = category;
    renderExperiencesDrawer();
}
function setExperienceCost(cost) {
    experienceState.cost = cost;
    renderExperiencesDrawer();
}
function resetExperienceFilters() {
    Object.assign(experienceState, { category: 'all', cost: 'all' });
    renderExperiencesDrawer();
}

function experienceItemHTML(x) {
    const cat = experienceCategory(x.category);
    const isFree = x.price === 0;
    return `
    <article class="xp-item" data-xp-id="${x.id}">
      <div class="xp-item-media">
        ${experienceImgTag(x, 1000)}
        <span class="xp-badge"><i class="bi ${cat.icon}"></i> ${cat.label}</span>
      </div>
      <div class="xp-item-body">
        <h4 class="xp-item-title">${x.title}</h4>
        <p class="xp-item-desc">${x.summary}</p>
        <div class="xp-item-facts">
          <span><i class="bi bi-hourglass-split"></i>${x.duration}</span>
          <span><i class="bi bi-clock"></i>${x.time}</span>
          <span><i class="bi bi-people"></i>${x.people}</span>
        </div>
        <ul class="xp-item-includes">
          ${x.includes.map((t) => `<li><i class="bi bi-check2"></i><span>${t}</span></li>`).join('')}
        </ul>
        ${x.note ? `<div class="xp-item-note"><i class="bi bi-info-circle"></i><span>${x.note}</span></div>` : ''}
        <div class="xp-item-foot">
          <span class="xp-item-price ${isFree ? 'is-free' : ''}">${experiencePriceLabel(x)}</span>
          <span class="xp-item-book"><i class="bi bi-calendar-check"></i>${x.booking}</span>
        </div>
      </div>
    </article>`;
}

function renderExperiencesDrawer(focusId) {
    const { category, cost } = experienceState;
    const listEl = document.getElementById('xpList');

    const result = experiencesData.filter((x) => matchExperience(x, category, cost));
    const cat = experienceCategory(category);
    const costItem = EXPERIENCE_COSTS.find((c) => c.id === cost);

    // Tóm tắt theo bộ lọc đang chọn
    document.getElementById('xpSummaryLabel').textContent = `${result.length} trải nghiệm`;
    document.getElementById('xpSummarySub').textContent =
        (cat ? cat.label : 'Tất cả nhóm trải nghiệm') + (cost === 'all' ? '' : ` · ${costItem.label}`);

    // Chip nhóm trải nghiệm (số đếm tính theo bộ lọc chi phí đang chọn)
    document.getElementById('xpCategoryChips').innerHTML =
        [{ id: 'all', label: 'Tất cả' }, ...EXPERIENCE_CATEGORIES]
            .map((c) => {
                const count = experiencesData.filter((x) => matchExperience(x, c.id, cost)).length;
                return `<button type="button" class="yn-chip ${category === c.id ? 'active' : ''}" onclick="setExperienceCategory('${c.id}')">${c.label} <span class="chip-count">${count}</span></button>`;
            }).join('');

    // Chip chi phí (số đếm tính theo nhóm đang chọn)
    document.getElementById('xpCostChips').innerHTML = EXPERIENCE_COSTS
        .map((c) => {
            const count = experiencesData.filter((x) => matchExperience(x, category, c.id)).length;
            return `<button type="button" class="yn-chip ${cost === c.id ? 'active' : ''}" onclick="setExperienceCost('${c.id}')">${c.label} <span class="chip-count">${count}</span></button>`;
        }).join('');

    document.getElementById('xpResultCount').textContent =
        result.length ? `Hiển thị ${result.length} / ${experiencesData.length} trải nghiệm` : 'Không có trải nghiệm phù hợp';

    listEl.innerHTML = result.length
        ? result.map(experienceItemHTML).join('')
        : `<div class="rv-empty"><i class="bi bi-compass"></i>Chưa có trải nghiệm nào khớp với bộ lọc này.
             <br><button type="button" class="yn-btn yn-btn--outline yn-btn--sm" onclick="resetExperienceFilters()">Xóa bộ lọc</button></div>`;

    listEl.scrollTop = 0;

    // Bấm từ thẻ xem nhanh: cuộn tới đúng trải nghiệm và làm nổi viền một lúc
    if (focusId) {
        const target = listEl.querySelector(`[data-xp-id="${focusId}"]`);
        if (target) {
            listEl.scrollTop = Math.max(0, target.offsetTop - 12);
            target.classList.add('is-focus');
            setTimeout(() => target.classList.remove('is-focus'), 2400);
        }
    }
}

/* ==========================================================================
   9. PHÍM TẮT (ESC đóng popup trên cùng trước)
   ========================================================================== */
document.addEventListener('keydown', (e) => {
    const isOpen = (id) => document.getElementById(id)?.classList.contains('active');

    if (isOpen('lightboxOverlay')) {
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') lightboxNav(1);
        if (e.key === 'ArrowLeft') lightboxNav(-1);
        return;
    }
    if (isOpen('amDrawer')) {
        if (e.key === 'Escape') closeAmenitiesDrawer();
        return;
    }
    if (isOpen('xpDrawer')) {
        if (e.key === 'Escape') closeExperiencesDrawer();
        return;
    }
    if (isOpen('rvDrawer')) {
        if (e.key === 'Escape') closeReviewsDrawer();
        return;
    }
    if (isOpen('roomModalOverlay')) {
        if (e.key === 'Escape') closeRoomModal();
        if (e.key === 'ArrowRight' && !/INPUT|SELECT/.test(document.activeElement.tagName)) roomGalleryNav(1);
        if (e.key === 'ArrowLeft' && !/INPUT|SELECT/.test(document.activeElement.tagName)) roomGalleryNav(-1);
    }
});

/* ==========================================================================
   10. HOMESTAY TƯƠNG TỰ (dùng lại style .homestay-card của homepage)
   ========================================================================== */
const similarHomestaysData = [
    { name: 'Xuan Huong Lake View House', location: 'Đà Lạt', rating: '4.91', reviews: '158', specs: '3 phòng ngủ · 6 khách', amenities: 'View toàn cảnh hồ · Sân BBQ rộng · Gần chợ đêm', price: '1.250.000đ', img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80' },
    { name: 'Rustic Pine Hill Cabin', location: 'Đà Lạt', rating: '4.88', reviews: '124', specs: '1 phòng ngủ · 2 khách', amenities: 'Nhà gỗ mái dốc · Săn mây ban mai · Lửa trại', price: '790.000đ', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80' },
    { name: 'Thung Lũng Mơ Màng Homestay', location: 'Đà Lạt', rating: '4.88', reviews: '112', specs: '1 phòng ngủ · 2 khách', amenities: 'Vườn cúc hoạ mi · Kính ngắm thung lũng đèn', price: '850.000đ', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80' },
    { name: 'The Memory Valley Villa', location: 'Đà Lạt', rating: '4.96', reviews: '340', specs: '3 phòng ngủ · 6 khách', amenities: 'Bể bơi nước ấm · Lò sưởi củi · Sân BBQ đồi thông', price: '1.450.000đ', img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80' }
];

function renderSimilarHomestays() {
    const container = document.getElementById('similarGrid');
    if (!container) return;

    container.innerHTML = similarHomestaysData.map((item) => `
    <article class="sim-card">
      <button type="button" class="sim-wish" onclick="toggleWishlistSimilar(event, this, '${item.name}')" title="Lưu vào Wishlist">
        <i class="bi bi-heart"></i>
      </button>
      <a class="sim-media" href="homestay-detail.html">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
      </a>
      <div class="sim-body">
        <div class="sim-meta">
          <span class="sim-loc"><i class="bi bi-geo-alt-fill"></i> ${item.location}</span>
          <span class="sim-rate"><i class="bi bi-star-fill"></i> ${item.rating} <small>(${item.reviews})</small></span>
        </div>
        <h3 class="sim-title"><a href="homestay-detail.html">${item.name}</a></h3>
        <p class="sim-specs">${item.specs}</p>
        <ul class="sim-tags">
          ${item.amenities.split(' · ').map((a) => `<li>${a}</li>`).join('')}
        </ul>
        <div class="sim-foot">
          <div class="sim-price"><small>Giá từ</small><b>${item.price}</b><small>/ đêm</small></div>
          <button type="button" class="yn-btn yn-btn--primary yn-btn--sm" onclick="window.location.href='homestay-detail.html'">Xem chi tiết</button>
        </div>
      </div>
    </article>
  `).join('');
}

function toggleWishlistSimilar(e, btn, name) {
    e.stopPropagation();
    const icon = btn.querySelector('i');
    const active = btn.classList.toggle('active');
    icon.classList.toggle('bi-heart-fill', active);
    icon.classList.toggle('bi-heart', !active);
    showToastDetail(active ? `Đã thêm "${name}" vào Wishlist!` : `Đã bỏ lưu "${name}" khỏi Wishlist.`);
}

/* ==========================================================================
   11. TOAST THÔNG BÁO
   ========================================================================== */
let toastTimer = null;
function showToastDetail(message) {
    const toast = document.getElementById('toastNoticeDetail');
    const msgEl = document.getElementById('toastMsgDetail');
    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}