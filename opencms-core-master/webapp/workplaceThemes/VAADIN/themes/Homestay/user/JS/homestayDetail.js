/**
 * YÊN Homestay - Trang Chi Tiết Homestay
 * Đường dẫn: .../Homestay/user/JS/homestayDetail.js
 * Quản lý: Gallery, danh sách loại phòng, popup đặt phòng,
 *          Đánh giá (xem nhanh vài cái + popup bên phải có bộ lọc), Homestay tương tự
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
    const anyOpen = ['lightboxOverlay', 'roomModalOverlay', 'rvDrawer']
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
   7. PHÍM TẮT (ESC đóng popup trên cùng trước)
   ========================================================================== */
document.addEventListener('keydown', (e) => {
    const isOpen = (id) => document.getElementById(id)?.classList.contains('active');

    if (isOpen('lightboxOverlay')) {
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') lightboxNav(1);
        if (e.key === 'ArrowLeft') lightboxNav(-1);
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
   8. HOMESTAY TƯƠNG TỰ (dùng lại style .homestay-card của homepage)
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
   9. TOAST THÔNG BÁO
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