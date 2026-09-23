/**
 * YÊN Homestay - Trang Đặt Phòng & Quản Lý Nhiệm Vụ (Sidebar Left Layout)
 * File: user/JS/bookings.js
 * Quản lý danh sách phòng đã đặt, lọc theo tab sidebar, hiển thị nhiệm vụ và hoàn thành nhiệm vụ qua Đánh Giá
 */

// Dữ liệu mẫu danh sách phòng đã đặt và Nhiệm vụ đi kèm
let userBookings = [
  {
    id: 'BK-2026-8892',
    code: 'YEN-2026-8892',
    homestayName: 'The Memory Valley Villa',
    homestayImg: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
    location: 'Hồ Tuyền Lâm, Đà Lạt',
    roomType: 'Villa 3 phòng ngủ view thung lũng',
    checkIn: '22/09/2026',
    checkOut: '25/09/2026',
    nights: 3,
    guests: '6 người lớn · 2 trẻ em',
    totalPrice: '4.350.000đ',
    payStatus: 'Đã thanh toán VNPAY (100%)',
    status: 'active', // 'active' (Đang lưu trú), 'upcoming', 'completed', 'cancelled'
    task: {
      id: 'TASK-8892',
      title: 'Danh sách việc cần làm tại Homestay',
      rewardText: '🎁 Quà tặng trực tiếp từ Homestay',
      status: 'pending', // 'pending' (Chưa hoàn thành), 'completed' (Đã hoàn thành)
      checklist: [
        { id: 1, text: 'Chụp ảnh phòng ở thực tế & nội thất homestay', done: false },
        { id: 2, text: 'Chụp ảnh check-in khuôn viên & cảnh quan xung quanh', done: false },
        { id: 3, text: 'Đăng nhận xét & đánh giá trải nghiệm homestay', done: false }
      ],
      userReview: null
    }
  },
  {
    id: 'BK-2026-7714',
    code: 'YEN-2026-7714',
    homestayName: 'Han River Glass House',
    homestayImg: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    location: 'Bờ sông Hàn, Đà Nẵng',
    roomType: 'Căn hộ kính view toàn cảnh bờ sông Hàn',
    checkIn: '15/10/2026',
    checkOut: '18/10/2026',
    nights: 3,
    guests: '4 người lớn',
    totalPrice: '3.450.000đ',
    payStatus: 'Đã cọc 30% (VietQR)',
    status: 'upcoming',
    task: {
      id: 'TASK-7714',
      title: 'Danh sách việc cần làm tại Homestay',
      rewardText: '🎁 Quà tặng trực tiếp từ Homestay',
      status: 'pending',
      checklist: [
        { id: 1, text: 'Chụp ảnh phòng kính view toàn cảnh Sông Hàn', done: false },
        { id: 2, text: 'Chụp ảnh check-in khoảnh khắc ngắm hoàng hôn', done: false },
        { id: 3, text: 'Đánh giá chất lượng dịch vụ & độ sạch của phòng', done: false }
      ],
      userReview: null
    }
  },
{
    id: 'BK-2026-5021',
    code: 'YEN-2026-5021',
    homestayName: 'Hội An Ancient Town Retreat',
    homestayImg: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=600&q=80',
    location: 'Phố cổ Hội An, Quảng Nam',
    roomType: 'Phòng suite view phố cổ đèn lồng',
    checkIn: '10/07/2026',
    checkOut: '13/07/2026',
    nights: 3,
    guests: '2 người lớn',
    totalPrice: '2.850.000đ',
    payStatus: 'Đã thanh toán (MoMo)',
    status: 'complaint',
    complaint: {
      id: 'KN-5021',
      type: 'room_quality',
      typeText: 'Chất lượng phòng ở',
      severity: 'medium',
      content: 'Phòng có mùi ẩm, điều hòa không hoạt động trong suốt kỳ lưu trú. Chủ nhà phản hồi chậm, không khắc phục kịp thời.',
      resolution: 'refund_partial',
      contact: '0912345678',
      status: 'processing',
      statusText: 'Đang xử lý',
      submittedDate: '14/07/2026',
      ticketCode: 'KN-5021-A'
    },
    task: {
      id: 'TASK-5021',
      title: 'Danh sách việc cần làm tại Homestay',
      rewardText: '🎁 Quà tặng trực tiếp từ Homestay',
      status: 'pending',
      checklist: [
        { id: 1, text: 'Chụp ảnh phòng suite view phố cổ', done: false },
        { id: 3, text: 'Đăng bài nhận xét trải nghiệm', done: false }
      ],
      userReview: null
    }
  },
  {
    id: 'BK-2026-6540',
    code: 'YEN-2026-6540',
    homestayName: 'Topas Ecolodge Sapa',
    homestayImg: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    location: 'Mường Hoa, Sapa',
    roomType: 'Bungalow thung lũng Mường Hoa',
    checkIn: '05/08/2026',
    checkOut: '08/08/2026',
    nights: 3,
    guests: '2 người lớn',
    totalPrice: '13.770.000đ',
    payStatus: 'Đã thanh toán (Thẻ Visa)',
    status: 'completed',
    task: {
      id: 'TASK-6540',
      title: 'Danh sách việc cần làm tại Homestay',
      rewardText: '🎁 Đã nhận quà tặng từ Homestay',
      status: 'completed',
      checklist: [
        { id: 1, text: 'Chụp ảnh Bungalow view thung lũng Mường Hoa', done: true },
        { id: 2, text: 'Chụp ảnh check-in biển mây Sapa', done: true },
        { id: 3, text: 'Đăng bài nhận xét & đánh giá trải nghiệm Sapa', done: true }
      ],
      userReview: {
        rating: 5,
        title: 'Chuyến săn mây tuyệt vời nhất năm!',
        content: 'Cảnh quan thung lũng Mường Hoa quá đẹp. Chủ nhà YÊN hỗ trợ xe Limousine tận tình, phòng ốc sạch sẽ ấm cúng.',
        createdAt: '09/08/2026'
      }
    }
  }
];

let currentFilter = 'all';
let currentSearchQuery = '';
let selectedRatingStars = 5;
let activeTaskBookingId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Nạp Header & Footer
  if (typeof loadExternalHeader === 'function') {
    loadExternalHeader('header-placeholder', 'header.html', 'Đặt phòng');
  }
  if (typeof loadExternalFooter === 'function') {
    loadExternalFooter('footer-placeholder', 'footer.html');
  }

  // Render ban đầu
  renderBookingsList();
  updateStatsHeader();
});

/**
 * Cập nhật số liệu thống kê trên Sidebar
 */
function updateStatsHeader() {
  const activeCount = userBookings.filter(b => b.status === 'active').length;
  const pendingTasksCount = userBookings.filter(b => b.task && b.task.status === 'pending').length;

  const statActiveEl = document.getElementById('statActiveCount');
  if (statActiveEl) statActiveEl.textContent = `${activeCount} phòng`;

  const statPendingTasksEl = document.getElementById('statPendingTasksCount');
  if (statPendingTasksEl) statPendingTasksEl.textContent = `${pendingTasksCount} mục`;

  // Cập nhật đếm cho Tab Sidebar
  const cntAll = document.getElementById('cntAll');
  if (cntAll) cntAll.textContent = userBookings.length;

  const cntActive = document.getElementById('cntActive');
  if (cntActive) cntActive.textContent = activeCount;

  const cntUpcoming = document.getElementById('cntUpcoming');
  if (cntUpcoming) cntUpcoming.textContent = userBookings.filter(b => b.status === 'upcoming').length;

  const cntComplaint = document.getElementById('cntComplaint');
  if (cntComplaint) cntComplaint.textContent = userBookings.filter(b => b.status === 'complaint').length;

  const cntCompleted = document.getElementById('cntCompleted');
  if (cntCompleted) cntCompleted.textContent = userBookings.filter(b => b.status === 'completed').length;
}

/**
 * Chuyển tab bộ lọc trên Sidebar
 */
function filterBookingTab(filterType, btnEl) {
  currentFilter = filterType;

  const tabBtns = document.querySelectorAll('.account-sidebar-card .account-nav-item');
  tabBtns.forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  renderBookingsList();
}

/**
 * Tìm kiếm phòng đặt
 */
function searchBookings(query) {
  currentSearchQuery = query.trim().toLowerCase();
  renderBookingsList();
}

/**
 * Render danh sách phòng đặt theo bộ lọc
 */
function renderBookingsList() {
  const container = document.getElementById('bookingsListContainer');
  if (!container) return;

  let items = userBookings;
  if (currentFilter !== 'all') {
    items = items.filter(b => b.status === currentFilter);
  }

  if (currentSearchQuery) {
    items = items.filter(b => {
      const matchName = b.homestayName.toLowerCase().includes(currentSearchQuery);
      const matchCode = b.code.toLowerCase().includes(currentSearchQuery);
      const matchLoc = b.location.toLowerCase().includes(currentSearchQuery);
      return matchName || matchCode || matchLoc;
    });
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; background: #FFFFFF; border-radius: 16px; border: 1.5px dashed #CBD5E1;">
        <i class="bi bi-calendar-x" style="font-size: 2.5rem; color: #94A3B8; display: block; margin-bottom: 12px;"></i>
        <h3 style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin-bottom: 6px;">Chưa có lịch sử phòng đặt trong mục này</h3>
        <p style="font-size: 0.88rem; color: #64748B; margin-bottom: 18px;">Hãy khám phá các homestay sinh thái tuyệt đẹp và đặt chuyến đi ngay hôm nay!</p>
        <a href="homepage.html" class="btn-do-task" style="display: inline-flex; text-decoration: none;">
          <i class="bi bi-compass"></i> Khám phá Homestay ngay
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(bk => {
    let statusBadgeHtml = '';
    if (bk.status === 'complaint') {
    statusBadgeHtml = '<span class="status-badge status-complaint"><i class="bi bi-exclamation-triangle-fill me-1"></i> Khiếu nại</span>';
  } else if (bk.status === 'active') {
      statusBadgeHtml = `
        <span class="status-badge status-active">
          <span class="active-pulse-dot"></span> ĐANG LƯU TRÚ
        </span>
      `;
    } else if (bk.status === 'upcoming') {
      statusBadgeHtml = `
        <span class="status-badge status-upcoming">
          <i class="bi bi-clock-history"></i> SẮP NHẬN PHÒNG
        </span>
      `;
    } else if (bk.status === 'completed') {
      statusBadgeHtml = `
        <span class="status-badge status-completed">
          <i class="bi bi-check-circle-fill text-success"></i> ĐÃ HOÀN THÀNH
        </span>
      `;
    } else {
      statusBadgeHtml = `
        <span class="status-badge status-cancelled">
          <i class="bi bi-x-circle-fill"></i> ĐÃ HỦY
        </span>
      `;
    }

    // Hiển thị khung Danh sách nhiệm vụ (Checklist)
    let taskBoxHtml = '';
    if (bk.task) {
      const isTaskDone = bk.task.status === 'completed';
      const checklist = bk.task.checklist || [];
      const doneCount = checklist.filter(item => item.done).length;
      const totalCount = checklist.length;

      taskBoxHtml = `
        <div class="bk-task-checklist-box ${isTaskDone ? 'is-completed' : ''}">
          <!-- Head Checklist -->
          <div class="task-checklist-head">
            <div class="d-flex align-items-center gap-2">
              <div class="task-checklist-icon-badge ${isTaskDone ? 'completed' : ''}">
                <i class="bi ${isTaskDone ? 'bi-check-circle-fill' : 'bi-card-checklist'}"></i>
              </div>
              <div>
                <h4 class="task-checklist-title">${bk.task.title}</h4>
                <span class="task-reward-pill"><i class="bi bi-gift-fill"></i> ${bk.task.rewardText}</span>
              </div>
            </div>
            <div class="task-progress-badge ${isTaskDone ? 'done' : 'pending'}">
              ${isTaskDone ? '<i class="bi bi-check-all me-1"></i> 3/3 việc đã hoàn thành' : `<i class="bi bi-hourglass-split me-1"></i> ${doneCount}/${totalCount} việc đã làm`}
            </div>
          </div>

          <!-- List các việc cần làm -->
          <div class="task-checklist-body">
            <div class="task-checklist-items">
              ${checklist.map(item => `
                <div class="task-item-row ${item.done ? 'done' : ''}">
                  <div class="task-item-row-left">
                    <span>${item.text}</span>
                  </div>
                  <span class="task-item-status-tag ${item.done ? 'done' : 'pending'}">
                    ${item.done ? 'Đã xong' : 'Chưa xong'}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Nút Hoàn thành nhiệm vụ -->
          <div class="task-checklist-foot">
            ${isTaskDone ? `
              <button class="btn-complete-mission done" onclick="openTaskDetailModal('${bk.id}')">
                <i class="bi bi-patch-check-fill me-1"></i> Nhiệm vụ đã hoàn thành
              </button>
            ` : `
              <button class="btn-complete-mission" onclick="openTaskDetailModal('${bk.id}')">
                <i class="bi bi-cloud-arrow-up-fill me-1"></i> Hoàn thành nhiệm vụ
              </button>
            `}
          </div>
        </div>
      `;
    }

    return `
      <div class="bk-card-item ${bk.status === 'active' ? 'is-active-stay' : ''}">
        <!-- Header Thẻ -->
        <div class="bk-card-header">
          <div class="bk-code-group">
            <span class="bk-code-label">Mã đặt phòng:</span>
            <span class="bk-code-val">${bk.code}</span>
          </div>
          ${statusBadgeHtml}
        </div>

        <!-- Body Thẻ -->
        <div class="bk-card-body">
          <div class="bk-img-box">
            <img src="${bk.homestayImg}" alt="${bk.homestayName}">
          </div>
          <div class="bk-info-box">
            <h3 class="bk-hs-name">${bk.homestayName}</h3>
            <div class="bk-hs-location">
              <i class="bi bi-geo-alt-fill text-danger"></i> ${bk.location}
            </div>
            
            <div class="bk-specs-row">
              <span class="bk-spec-item"><i class="bi bi-house-door text-success"></i> ${bk.roomType}</span>
              <span>•</span>
              <span class="bk-spec-item"><i class="bi bi-people text-primary"></i> ${bk.guests}</span>
            </div>

            <div class="bk-dates-chip">
              <i class="bi bi-calendar-event"></i>
              <span>Nhận: ${bk.checkIn} — Trả: ${bk.checkOut} (${bk.nights} đêm)</span>
            </div>

            <div class="bk-price-row">
              <div>
                <span style="font-size: 0.78rem; color: #64748B;">Tổng cộng:</span>
                <div class="bk-price-val">${bk.totalPrice}</div>
              </div>
              <div class="bk-pay-tag">
                <i class="bi bi-shield-check"></i> ${bk.payStatus}
              </div>
            </div>
          </div>
        </div>

        <!-- Khối Nhiệm vụ Homestay -->
        ${taskBoxHtml}

        <!-- Footer Thẻ -->
        <div class="bk-card-footer">
          <button class="btn-action-ghost" onclick="showToast('Liên hệ chủ nhà ${bk.homestayName}: 0949.050.888')">
            <i class="bi bi-telephone-fill text-success me-1"></i> Liên hệ chủ nhà
          </button>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn-action-ghost" onclick="showToast('Đang tải hóa đơn đặt phòng ${bk.code}...')">
              <i class="bi bi-receipt me-1"></i> Xem hóa đơn
            </button>
            ${bk.status !== 'complaint' ? `
            <button class="btn-complaint-trigger" onclick="openComplaintModal('${bk.id}')">
              <i class="bi bi-exclamation-triangle-fill me-1"></i> Khiếu nại
            </button>` : `
            <button class="btn-complaint-trigger complaint-filed" onclick="openComplaintModal('${bk.id}')">
              <i class="bi bi-eye-fill me-1"></i> Xem khiếu nại
            </button>`}
            <a href="homestayDetail.html" class="btn-action-ghost" style="text-decoration: none;">
              Xem phòng <i class="bi bi-arrow-right ms-1"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Mở Modal Chi tiết Nhiệm vụ & Bài Đánh giá
 */
function openTaskDetailModal(bookingId) {
  const bk = userBookings.find(b => b.id === bookingId);
  if (!bk || !bk.task) return;

  activeTaskBookingId = bookingId;

  const overlay = document.getElementById('taskDetailModalOverlay');
  if (!overlay) return;

  document.getElementById('mHsName').textContent = bk.homestayName;
  document.getElementById('mTaskTitle').textContent = bk.task.title;
  document.getElementById('mRewardText').textContent = bk.task.rewardText;

  // Nếu đã hoàn thành bài đánh giá trước đó
  const reviewForm = document.getElementById('taskReviewForm');
  const reviewDoneBox = document.getElementById('taskReviewDoneBox');

  if (bk.task.status === 'completed' && bk.task.userReview) {
    if (reviewForm) reviewForm.style.display = 'none';
    if (reviewDoneBox) {
      reviewDoneBox.style.display = 'block';
      document.getElementById('doneStars').innerHTML = '⭐'.repeat(bk.task.userReview.rating);
      document.getElementById('doneTitle').textContent = bk.task.userReview.title;
      document.getElementById('doneContent').textContent = bk.task.userReview.content;
      document.getElementById('doneDate').textContent = `Đã đăng ngày ${bk.task.userReview.createdAt || '23/09/2026'}`;
    }
  } else {
    if (reviewForm) reviewForm.style.display = 'block';
    if (reviewDoneBox) reviewDoneBox.style.display = 'none';
    
    // Reset form
    selectedRatingStars = 5;
    updateStarUI(5);
    const titleInput = document.getElementById('reviewTitleInput');
    const contentInput = document.getElementById('reviewContentInput');
    if (titleInput) titleInput.value = '';
    if (contentInput) contentInput.value = '';
  }

  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

/**
 * Đóng Modal
 */
function closeTaskDetailModal() {
  const overlay = document.getElementById('taskDetailModalOverlay');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
}

/**
 * Chọn số sao đánh giá
 */
function setStarRating(stars) {
  selectedRatingStars = stars;
  updateStarUI(stars);
}

function updateStarUI(stars) {
  const starBtns = document.querySelectorAll('#starRatingBox .star-btn');
  const labels = ['Rất tệ (1/5)', 'Chưa hài lòng (2/5)', 'Bình thường (3/5)', 'Hài lòng (4/5)', 'Rất tuyệt vời! (5/5) ⭐'];

  starBtns.forEach((btn, idx) => {
    if (idx < stars) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const feedbackText = document.getElementById('starFeedbackText');
  if (feedbackText) {
    feedbackText.textContent = labels[stars - 1] || 'Rất tuyệt vời! (5/5) ⭐';
  }
}

/**
 * Submit Đăng bài đánh giá để Hoàn thành Nhiệm vụ
 */
function submitReviewTask(event) {
  event.preventDefault();

  if (!activeTaskBookingId) return;

  const bk = userBookings.find(b => b.id === activeTaskBookingId);
  if (!bk || !bk.task) return;

  const titleVal = document.getElementById('reviewTitleInput').value.trim();
  const contentVal = document.getElementById('reviewContentInput').value.trim();

  if (!contentVal || contentVal.length < 10) {
    showToast('Vui lòng nhập nội dung đánh giá chi tiết tối thiểu 10 ký tự!');
    document.getElementById('reviewContentInput').focus();
    return;
  }

  // Cập nhật trạng thái nhiệm vụ & danh sách việc cần làm
  bk.task.status = 'completed';
  if (Array.isArray(bk.task.checklist)) {
    bk.task.checklist.forEach(item => item.done = true);
  }
  bk.task.userReview = {
    rating: selectedRatingStars,
    title: titleVal || 'Đánh giá tuyệt vời!',
    content: contentVal,
    createdAt: 'Hôm nay (23/09/2026)'
  };

  closeTaskDetailModal();
  updateStatsHeader();
  renderBookingsList();

  showToast(`Cảm ơn bạn! Đã hoàn thành danh sách nhiệm vụ và gửi nhận xét chuyến đi ${bk.homestayName}!`);
}

/**
 * Toast Notice Floating
 */
function showToast(message) {
  const toast = document.getElementById('bkToast');
  const msgEl = document.getElementById('bkToastMsg');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}


// ─── Complaint Modal ─────────────────────────────────────────────────────────

let activeComplaintBookingId = null;

/**
 * Mở Modal Khiếu nại
 */
function openComplaintModal(bookingId) {
  const bk = userBookings.find(b => b.id === bookingId);
  if (!bk) return;

  activeComplaintBookingId = bookingId;

  const overlay = document.getElementById('complaintModalOverlay');
  if (!overlay) return;

  // Điền thông tin đặt phòng
  const imgEl = document.getElementById('cmpHsImg');
  if (imgEl) { imgEl.src = bk.homestayImg; imgEl.alt = bk.homestayName; }
  const nameEl = document.getElementById('cmpHsName');
  if (nameEl) nameEl.textContent = bk.homestayName;
  const codeEl = document.getElementById('cmpCode');
  if (codeEl) codeEl.textContent = bk.code;

  // Nếu đã có khiếu nại đang xử lý
  const form = document.getElementById('complaintForm');
  const successBox = document.getElementById('complaintSuccessBox');

  if (bk.complaint && bk.status === 'complaint') {
    if (form) form.style.display = 'none';
    if (successBox) {
      successBox.style.display = 'block';
      const ticketEl = document.getElementById('cmpTicketCode');
      if (ticketEl) ticketEl.textContent = bk.complaint.ticketCode || ('KN-' + bk.id);
    }
  } else {
    if (form) { form.style.display = 'block'; form.reset(); }
    if (successBox) successBox.style.display = 'none';
  }

  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

/**
 * Đóng Modal Khiếu nại
 */
function closeComplaintModal() {
  const overlay = document.getElementById('complaintModalOverlay');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
  activeComplaintBookingId = null;
}

/**
 * Submit Khiếu nại
 */
function submitComplaint(event) {
  event.preventDefault();

  if (!activeComplaintBookingId) return;
  const bk = userBookings.find(b => b.id === activeComplaintBookingId);
  if (!bk) return;

  const cmpType = document.getElementById('cmpTypeSelect').value;
  const cmpContent = document.getElementById('cmpContent').value.trim();
  const cmpContact = document.getElementById('cmpContact').value.trim();
  const cmpResolution = document.getElementById('cmpResolution').value;
  const cmpSeverityEl = document.querySelector('input[name="cmpSeverity"]:checked');
  const cmpSeverity = cmpSeverityEl ? cmpSeverityEl.value : 'medium';

  if (!cmpType) {
    showToast('Vui lòng chọn loại vấn đề cần khiếu nại!');
    return;
  }
  if (!cmpContent || cmpContent.length < 20) {
    showToast('Vui lòng mô tả chi tiết sự việc (tối thiểu 20 ký tự)!');
    document.getElementById('cmpContent').focus();
    return;
  }
  if (!cmpContact) {
    showToast('Vui lòng nhập SĐT hoặc email để nhận phản hồi!');
    document.getElementById('cmpContact').focus();
    return;
  }

  // Tạo mã khiếu nại
  const ticketCode = 'KN-' + bk.id.replace('BK-', '') + '-' + Math.floor(100 + Math.random() * 900);

  // Cập nhật booking
  bk.status = 'complaint';
  bk.complaint = {
    id: ticketCode,
    type: cmpType,
    typeText: document.getElementById('cmpTypeSelect').options[document.getElementById('cmpTypeSelect').selectedIndex].text,
    severity: cmpSeverity,
    content: cmpContent,
    resolution: cmpResolution,
    contact: cmpContact,
    status: 'processing',
    statusText: 'Đang xử lý',
    submittedDate: new Date().toLocaleDateString('vi-VN'),
    ticketCode: ticketCode
  };

  // Hiển thị thành công
  const form = document.getElementById('complaintForm');
  const successBox = document.getElementById('complaintSuccessBox');
  const ticketEl = document.getElementById('cmpTicketCode');

  if (form) form.style.display = 'none';
  if (successBox) successBox.style.display = 'block';
  if (ticketEl) ticketEl.textContent = ticketCode;

  updateStatsHeader();
  renderBookingsList();

  showToast('Khiếu nại đã được gửi thành công! Mã: ' + ticketCode);
}

// Close modals on backdrop click
document.addEventListener('click', function(e) {
  const complaintOverlay = document.getElementById('complaintModalOverlay');
  if (complaintOverlay && e.target === complaintOverlay) {
    closeComplaintModal();
  }
});
