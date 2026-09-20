// JavaScript for User Personal Account Management - Du lịch Homestay Cộng đồng Việt Nam

document.addEventListener('DOMContentLoaded', function () {
  // Nạp động Header & Footer
  loadExternalHeader('header-placeholder', 'header.html', 'Tài khoản');
  loadExternalFooter('footer-placeholder', 'footer.html');

  // --- INDEXEDDB IMPLEMENTATION FOR TEMPORARY DATA STORAGE ---
  const DB_NAME = 'HomestayUserDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'user_profile';
  const PROFILE_KEY = 'current_user';

  let db = null;
  let currentProfileData = {
    id: PROFILE_KEY,
    fullName: 'Lê Hoàng Mai Chi',
    nickname: 'Mai Chi Homestay',
    cccd: '001203004005',
    dobDay: '18',
    dobMonth: '8',
    dobYear: '1998',
    gender: 'nu',
    nationality: 'vn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+84 912 345 678',
    email: 'maichi.lehoang@gmail.com',
    phoneVerified: false
  };

  // Open IndexedDB connection
  function initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = function (e) {
        const dbInstance = e.target.result;
        if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
          dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = function (e) {
        db = e.target.result;
        resolve(db);
      };

      request.onerror = function (e) {
        console.error('Không thể mở IndexedDB:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  // Read Profile from IndexedDB
  function loadProfileFromDB() {
    if (!db) return Promise.resolve(currentProfileData);
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(PROFILE_KEY);

      request.onsuccess = function () {
        if (request.result) {
          currentProfileData = Object.assign({}, currentProfileData, request.result);
          resolve(currentProfileData);
        } else {
          // Initialize DB with default profile
          saveProfileToDB(currentProfileData).then(() => resolve(currentProfileData));
        }
      };

      request.onerror = function () {
        resolve(currentProfileData);
      };
    });
  }

  // Save Profile to IndexedDB
  function saveProfileToDB(profileData) {
    if (!db) return Promise.resolve(false);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(profileData);

      request.onsuccess = function () {
        resolve(true);
      };

      request.onerror = function (e) {
        console.error('Lỗi khi lưu vào IndexedDB:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  // Populate UI elements from Profile data
  function populateUI(profile) {
    const fullNameInput = document.getElementById('profileFullName');
    if (fullNameInput && profile.fullName !== undefined) fullNameInput.value = profile.fullName;

    const nicknameInput = document.getElementById('profileNickname');
    if (nicknameInput && profile.nickname !== undefined) nicknameInput.value = profile.nickname;

    const cccdInput = document.getElementById('profileCccd');
    if (cccdInput && profile.cccd !== undefined) cccdInput.value = profile.cccd;

    const dobDayInput = document.getElementById('dobDay');
    if (dobDayInput && profile.dobDay !== undefined) dobDayInput.value = profile.dobDay;

    const dobMonthInput = document.getElementById('dobMonth');
    if (dobMonthInput && profile.dobMonth !== undefined) dobMonthInput.value = profile.dobMonth;

    const dobYearInput = document.getElementById('dobYear');
    if (dobYearInput && profile.dobYear !== undefined) dobYearInput.value = profile.dobYear;

    if (profile.gender) {
      const genderRadio = document.querySelector(`input[name="gender"][value="${profile.gender}"]`);
      if (genderRadio) genderRadio.checked = true;
    }

    const nationalityInput = document.getElementById('profileNationality');
    if (nationalityInput && profile.nationality !== undefined) nationalityInput.value = profile.nationality;

    const avatarImg = document.getElementById('userAvatarImg');
    if (avatarImg && profile.avatar) avatarImg.src = profile.avatar;

    if (profile.phoneVerified) {
      const phoneBadge = document.getElementById('phoneStatusBadge');
      if (phoneBadge) {
        phoneBadge.className = 'badge-verified';
        phoneBadge.innerHTML = `<i class="bi bi-check-circle-fill"></i> Đã xác minh`;
      }
      const phoneVerifyBtn = document.getElementById('phoneVerifyBtn');
      if (phoneVerifyBtn) {
        phoneVerifyBtn.className = 'btn-outline-custom';
        phoneVerifyBtn.textContent = 'Cập nhật';
      }
    }
  }

  // Initialize DB and populate initial profile
  initIndexedDB()
    .then(() => loadProfileFromDB())
    .then((profile) => {
      populateUI(profile);
    })
    .catch((err) => {
      console.warn('Sử dụng dữ liệu tạm trong bộ nhớ do IndexedDB không khả dụng:', err);
      populateUI(currentProfileData);
    });

  // Initialize Toast
  const toastEl = document.getElementById('ecoToast');
  let ecoToast = null;
  if (toastEl) {
    ecoToast = new bootstrap.Toast(toastEl, { delay: 3500 });
  }

  function showToast(message, header = 'Thông báo') {
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    if (toastTitle) toastTitle.textContent = header;
    if (toastBody) toastBody.textContent = message;
    if (ecoToast) ecoToast.show();
  }

  // Sidebar Tab Navigation Switching
  const navItems = document.querySelectorAll('.account-nav-item[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content-panel');

  navItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      const targetTab = this.getAttribute('data-tab');
      if (!targetTab) return;

      // Update active nav item state
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');

      // Hide all panels and show target panel
      tabContents.forEach(content => {
        if (content.id === targetTab) {
          content.classList.remove('d-none');
          content.classList.add('animate-fade-in');
        } else {
          content.classList.add('d-none');
        }
      });

      // Smooth scroll on mobile devices if needed
      if (window.innerWidth < 992) {
        document.querySelector('section').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Avatar Upload / Edit Preview
  const avatarInput = document.getElementById('avatarFileInput');
  const avatarImg = document.getElementById('userAvatarImg');
  const avatarEditBtn = document.getElementById('avatarEditBtn');

  if (avatarEditBtn && avatarInput) {
    avatarEditBtn.addEventListener('click', function () {
      avatarInput.click();
    });
  }

  if (avatarInput && avatarImg) {
    avatarInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showToast('Kích thước ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.', 'Cảnh báo');
          return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
          const avatarDataUrl = event.target.result;
          avatarImg.src = avatarDataUrl;
          currentProfileData.avatar = avatarDataUrl;
          saveProfileToDB(currentProfileData);
          showToast('Cập nhật ảnh đại diện và đã lưu vào IndexedDB thành công!', 'Thành công');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Form Save Profile Changes with IndexedDB
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const saveBtn = profileForm.querySelector('button[type="submit"]');
      const originalText = saveBtn.innerHTML;

      saveBtn.disabled = true;
      saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>Đang lưu IndexedDB...`;

      // Read form input values
      const fullNameVal = document.getElementById('profileFullName')?.value || '';
      const nicknameVal = document.getElementById('profileNickname')?.value || '';
      const cccdVal = document.getElementById('profileCccd')?.value || '';
      const dobDayVal = document.getElementById('dobDay')?.value || '';
      const dobMonthVal = document.getElementById('dobMonth')?.value || '';
      const dobYearVal = document.getElementById('dobYear')?.value || '';
      const genderVal = document.querySelector('input[name="gender"]:checked')?.value || 'nu';
      const nationalityVal = document.getElementById('profileNationality')?.value || 'vn';

      // Update current profile object
      currentProfileData = Object.assign({}, currentProfileData, {
        fullName: fullNameVal,
        nickname: nicknameVal,
        cccd: cccdVal,
        dobDay: dobDayVal,
        dobMonth: dobMonthVal,
        dobYear: dobYearVal,
        gender: genderVal,
        nationality: nationalityVal
      });

      // Save to IndexedDB
      saveProfileToDB(currentProfileData)
        .then(() => {
          setTimeout(() => {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
            showToast('Thông tin cá nhân (bao gồm số CCCD) đã được lưu tạm vào IndexedDB!', 'Thành công');
          }, 500);
        })
        .catch((err) => {
          saveBtn.disabled = false;
          saveBtn.innerHTML = originalText;
          showToast('Không thể lưu vào IndexedDB. Lỗi: ' + err, 'Lỗi');
        });
    });
  }

  // Copy Voucher Code Logic
  const copyButtons = document.querySelectorAll('.btn-copy-code');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const code = this.getAttribute('data-code');
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Đã sao chép mã: ${code}`, 'Mã giảm giá');
        }).catch(() => {
          showToast(`Mã giảm giá: ${code}`, 'Mã giảm giá');
        });
      }
    });
  });

  // Verification & Security Action Modals
  const phoneVerifyBtn = document.getElementById('phoneVerifyBtn');
  if (phoneVerifyBtn) {
    phoneVerifyBtn.addEventListener('click', function () {
      const phoneModal = new bootstrap.Modal(document.getElementById('phoneVerifyModal'));
      phoneModal.show();
    });
  }

  const pwdUpdateBtn = document.getElementById('pwdUpdateBtn');
  if (pwdUpdateBtn) {
    pwdUpdateBtn.addEventListener('click', function () {
      const pwdModal = new bootstrap.Modal(document.getElementById('passwordModal'));
      pwdModal.show();
    });
  }

  const pinSetupBtn = document.getElementById('pinSetupBtn');
  if (pinSetupBtn) {
    pinSetupBtn.addEventListener('click', function () {
      const pinModal = new bootstrap.Modal(document.getElementById('pinModal'));
      pinModal.show();
    });
  }

  const deleteAccBtn = document.getElementById('deleteAccBtn');
  if (deleteAccBtn) {
    deleteAccBtn.addEventListener('click', function () {
      const deleteModal = new bootstrap.Modal(document.getElementById('deleteAccountModal'));
      deleteModal.show();
    });
  }

  const logoutSidebarBtn = document.getElementById('logoutSidebarBtn');
  if (logoutSidebarBtn) {
    logoutSidebarBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
      logoutModal.show();
    });
  }

  // OTP Verification Submit
  const confirmOtpBtn = document.getElementById('confirmOtpBtn');
  if (confirmOtpBtn) {
    confirmOtpBtn.addEventListener('click', function () {
      const modalEl = document.getElementById('phoneVerifyModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();

      // Update phone verification badge & data
      currentProfileData.phoneVerified = true;
      saveProfileToDB(currentProfileData);

      const phoneBadge = document.getElementById('phoneStatusBadge');
      if (phoneBadge) {
        phoneBadge.className = 'badge-verified';
        phoneBadge.innerHTML = `<i class="bi bi-check-circle-fill"></i> Đã xác minh`;
      }
      if (phoneVerifyBtn) {
        phoneVerifyBtn.className = 'btn-outline-custom';
        phoneVerifyBtn.textContent = 'Cập nhật';
      }
      showToast('Xác minh số điện thoại thành công và đã lưu trạng thái!', 'Xác thực thành công');
    });
  }
});

/**
 * Lọc danh sách đánh giá
 */
function filterReviews(status, chipBtn) {
  const chips = document.querySelectorAll('.review-filter-chips .btn-review-chip');
  chips.forEach(c => c.classList.remove('active'));
  if (chipBtn) chipBtn.classList.add('active');

  const items = document.querySelectorAll('#reviewsListContainer .review-card-item');
  items.forEach(item => {
    const itemStatus = item.getAttribute('data-status');
    const isReplied = item.getAttribute('data-replied') === 'true';

    if (status === 'all') {
      item.style.display = 'block';
    } else if (status === 'approved') {
      item.style.display = (itemStatus === 'approved') ? 'block' : 'none';
    } else if (status === 'pending') {
      item.style.display = (itemStatus === 'pending') ? 'block' : 'none';
    } else if (status === 'replied') {
      item.style.display = isReplied ? 'block' : 'none';
    }
  });
}

/**
 * Mở modal viết đánh giá mới
 */
function openAddReviewModal() {
  const modalEl = document.getElementById('addReviewModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

/**
 * Xem lightbox hình ảnh
 */
function openPhotoLightbox(src) {
  const modalEl = document.getElementById('lightboxModal');
  const imgEl = document.getElementById('lightboxImg');
  if (modalEl && imgEl) {
    imgEl.src = src;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

/**
 * Gửi đánh giá mới
 */
function submitNewReview(e) {
  e.preventDefault();
  const selectHs = document.getElementById('newRevHomestaySelect');
  const revText = document.getElementById('newRevText');

  if (!selectHs.value || !revText.value.trim()) return;

  const modalEl = document.getElementById('addReviewModal');
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();

  const container = document.getElementById('reviewsListContainer');
  if (container) {
    const newCard = document.createElement('div');
    newCard.className = 'review-card-item';
    newCard.setAttribute('data-status', 'pending');
    newCard.setAttribute('data-replied', 'false');
    newCard.innerHTML = `
      <div class="review-card-header">
        <div class="d-flex align-items-center gap-3">
          <img src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=200&q=80" alt="Homestay" class="review-hs-thumb">
          <div>
            <div class="d-flex align-items-center gap-2">
              <h5 class="review-hs-name mb-0">${selectHs.value}</h5>
              <span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 text-xs"><i class="bi bi-hourglass-split"></i> Đang chờ duyệt</span>
            </div>
            <p class="text-xs text-muted mb-0 mt-1"><i class="bi bi-geo-alt-fill text-danger me-1"></i>Mới cập nhật • Ngày vừa gửi: Vừa xong</p>
          </div>
        </div>
        <div class="review-stars-group">
          <span class="review-score-pill">5.0 ★</span>
        </div>
      </div>
      <p class="review-body-text mt-3">"${revText.value.trim()}"</p>
      <div class="review-card-footer">
        <span class="text-xs text-muted"><i class="bi bi-info-circle me-1"></i>Bài đánh giá vừa gửi đang được duyệt.</span>
        <div class="ms-auto d-flex gap-2">
          <button class="btn btn-sm btn-outline-danger" onclick="deleteReviewCard(this)"><i class="bi bi-trash"></i> Xóa</button>
        </div>
      </div>
    `;
    container.prepend(newCard);
  }

  const toastBody = document.getElementById('toastBody');
  if (toastBody) toastBody.textContent = 'Gửi bài đánh giá thành công! Bài viết đang chờ kiểm duyệt.';
  const toastEl = document.getElementById('ecoToast');
  if (toastEl) new bootstrap.Toast(toastEl).show();

  selectHs.value = '';
  revText.value = '';
}

/**
 * Xóa 1 thẻ đánh giá
 */
function deleteReviewCard(btn) {
  const card = btn.closest('.review-card-item');
  if (card && confirm('Bạn có chắc chắn muốn xóa bài đánh giá này?')) {
    card.remove();
    const toastBody = document.getElementById('toastBody');
    if (toastBody) toastBody.textContent = 'Đã xóa bài đánh giá.';
    const toastEl = document.getElementById('ecoToast');
    if (toastEl) new bootstrap.Toast(toastEl).show();
  }
}

/**
 * Xóa 1 sản phẩm đã xem khỏi lịch sử
 */
function removeViewedItem(btn) {
  const col = btn.closest('.viewed-item-col');
  if (col) {
    col.remove();
    const toastBody = document.getElementById('toastBody');
    if (toastBody) toastBody.textContent = 'Đã xóa homestay khỏi lịch sử xem.';
    const toastEl = document.getElementById('ecoToast');
    if (toastEl) new bootstrap.Toast(toastEl).show();
  }
}

/**
 * Mở modal xác nhận xóa toàn bộ lịch sử
 */
function clearViewedHistoryModal() {
  const modalEl = document.getElementById('clearHistoryModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

function confirmClearHistory() {
  const modalEl = document.getElementById('clearHistoryModal');
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();

  const container = document.getElementById('viewedGridContainer');
  if (container) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-eye-slash display-4 text-muted mb-3 d-block"></i>
        <h6 class="fw-bold text-dark mb-1">Lịch sử xem trống</h6>
        <p class="text-muted text-xs">Bạn chưa có sản phẩm homestay nào trong danh sách xem gần đây.</p>
        <a href="homepage.html" class="btn btn-sm btn-eco-save mt-2">Khám phá Homestay ngay</a>
      </div>
    `;
  }

  const toastBody = document.getElementById('toastBody');
  if (toastBody) toastBody.textContent = 'Đã xóa toàn bộ lịch sử xem homestay.';
  const toastEl = document.getElementById('ecoToast');
  if (toastEl) new bootstrap.Toast(toastEl).show();
}

/**
 * Lọc trong lịch sử đã xem
 */
function filterViewedHistory(query) {
  const q = query.trim().toLowerCase();
  const cols = document.querySelectorAll('#viewedGridContainer .viewed-item-col');
  cols.forEach(col => {
    const text = col.textContent.toLowerCase();
    col.style.display = text.includes(q) ? 'block' : 'none';
  });
}

/**
 * Kích hoạt mã voucher trong trang tài khoản
 */
function acctSubmitRedeemCode() {
  const input = document.getElementById('acctRedeemInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    const toastBody = document.getElementById('toastBody');
    if (toastBody) toastBody.textContent = 'Vui lòng nhập mã ưu đãi!';
    const toastEl = document.getElementById('ecoToast');
    if (toastEl) new bootstrap.Toast(toastEl).show();
    return;
  }

  const toastBody = document.getElementById('toastBody');
  if (toastBody) toastBody.textContent = `Kích hoạt thành công mã ưu đãi "${code}" vào ví của bạn!`;
  const toastEl = document.getElementById('ecoToast');
  if (toastEl) new bootstrap.Toast(toastEl).show();

  input.value = '';
}

/**
 * Mở modal Hóa đơn chi tiết giao dịch lúc thanh toán
 */
function openInvoiceModal(code, hsName, loc, stayDates, paidVal, originalVal, discountVal, method, status, txnId) {
  const codeEl = document.getElementById('invCode');
  const hsNameEl = document.getElementById('invHomestayName');
  const locEl = document.getElementById('invHomestayLoc');
  const stayDatesEl = document.getElementById('invStayDates');
  const totalPaidEl = document.getElementById('invTotalPaid');
  const subTotalEl = document.getElementById('invSubTotal');
  const subTotalRightEl = document.getElementById('invSubTotalRight');
  const discountValEl = document.getElementById('invDiscountVal');
  const methodEl = document.getElementById('invMethod');
  const statusBadgeEl = document.getElementById('invStatusBadge');
  const txnIdEl = document.getElementById('invTxnId');

  if (codeEl) codeEl.textContent = '#' + code;
  if (hsNameEl) hsNameEl.textContent = hsName;
  if (locEl) locEl.textContent = loc;
  if (stayDatesEl) stayDatesEl.textContent = stayDates;
  if (totalPaidEl) totalPaidEl.textContent = paidVal;
  if (subTotalEl) subTotalEl.textContent = originalVal || paidVal;
  if (subTotalRightEl) subTotalRightEl.textContent = originalVal || paidVal;
  if (discountValEl) discountValEl.textContent = '-' + (discountVal || '0đ');
  if (methodEl) methodEl.textContent = method || 'Chuyển khoản Ngân hàng';
  if (statusBadgeEl) statusBadgeEl.textContent = status || 'Đã xác nhận thanh toán';
  if (txnIdEl) txnIdEl.textContent = 'Mã Giao Dịch: ' + (txnId || 'VCB' + Math.floor(Math.random() * 899999 + 100000));

  const modalEl = document.getElementById('invoiceModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

/**
 * Rút tiền số dư về ngân hàng
 */
function openWithdrawModal() {
  if (confirm('Bạn muốn gửi yêu cầu rút 350.000đ từ Ví YÊN Pay về tài khoản Vietcombank (*6868)?')) {
    const toastBody = document.getElementById('toastBody');
    if (toastBody) toastBody.textContent = 'Yêu cầu rút 350.000đ đã được tiếp nhận. Tiền sẽ về ngân hàng của bạn trong vòng 5 phút.';
    const toastEl = document.getElementById('ecoToast');
    if (toastEl) new bootstrap.Toast(toastEl).show();
  }
}

/**
 * Đổi điểm tích lũy Eco Xu sang Voucher
 */
function openRedeemPointsModal() {
  if (confirm('Quy đổi 500 Xu tích lũy lấy Mã giảm giá 50.000đ cho chuyến đi tiếp theo?')) {
    const toastBody = document.getElementById('toastBody');
    if (toastBody) toastBody.textContent = 'Đổi điểm thành công! Mã ưu đãi ECO50K đã được thêm vào ví của bạn.';
    const toastEl = document.getElementById('ecoToast');
    if (toastEl) new bootstrap.Toast(toastEl).show();
  }
}

/**
 * Yêu thích homestay
 */
function toggleSaveFav(btn) {
  const icon = btn.querySelector('i');
  if (icon) {
    if (icon.classList.contains('bi-heart-fill')) {
      icon.className = 'bi bi-heart';
      btn.classList.remove('active', 'text-danger');
      const toastBody = document.getElementById('toastBody');
      if (toastBody) toastBody.textContent = 'Đã bỏ lưu homestay khỏi danh sách yêu thích.';
      const toastEl = document.getElementById('ecoToast');
      if (toastEl) new bootstrap.Toast(toastEl).show();
    } else {
      icon.className = 'bi bi-heart-fill';
      btn.classList.add('active', 'text-danger');
      const toastBody = document.getElementById('toastBody');
      if (toastBody) toastBody.textContent = 'Đã lưu homestay vào danh sách yêu thích!';
      const toastEl = document.getElementById('ecoToast');
      if (toastEl) new bootstrap.Toast(toastEl).show();
    }
  }
}

/**
 * Nạp động Header từ file header.html
 */
function loadExternalHeader(placeholderId, filePath, activePageName = 'Tài khoản') {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  fetch(filePath)
    .then(response => {
      if (response.ok) return response.text();
      throw new Error(`Chưa thể đọc ${filePath} (status: ${response.status})`);
    })
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const headerEl = doc.querySelector('header');
      if (headerEl) {
        placeholder.replaceWith(headerEl);
      } else {
        placeholder.innerHTML = html;
      }
      initHeaderEvents(activePageName);
    })
    .catch(err => {
      console.warn(`[Header Loader] Nạp header offline fallback:`, err);
      renderFallbackHeader(placeholder, activePageName);
    });
}

function initHeaderEvents(activePageName = 'Tài khoản') {
  const header = document.querySelector('.header');
  if (!header) return;

  const navLinks = header.querySelectorAll('.nav-link');
  const mobileBtn = header.querySelector('#mobileMenuBtn');
  const navList = header.querySelector('#navList');

  // Đặt trạng thái Active cho tab
  navLinks.forEach(link => {
    const linkName = link.getAttribute('data-name') || link.innerText.trim();
    if (linkName === activePageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Toggle Menu Mobile
  if (mobileBtn && navList) {
    mobileBtn.onclick = (e) => {
      e.stopPropagation();
      navList.classList.toggle('show');
    };
  }
}

function renderFallbackHeader(placeholder, activePageName) {
  if (!placeholder) return;
  placeholder.outerHTML = `
    <header class="header">
      <div class="header-container">
        <a href="homepage.html" class="brand-logo" title="YÊN - Homestay Booking">
          <img src="../images/logo.png" alt="YÊN - Homestay Booking" class="brand-logo-img">
        </a>
        <button class="mobile-toggle" id="mobileMenuBtn" aria-label="Toggle Menu">
          <i class="bi bi-list"></i>
        </button>
        <nav class="header-nav">
          <ul class="nav-list" id="navList">
            <li class="nav-item">
              <a href="homepage.html" class="nav-link" data-name="Trang chủ">
                <i class="bi bi-house-door nav-icon"></i>
                <span class="nav-text">Trang chủ</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="homepage.html#comboSection" class="nav-link" data-name="Khuyến mãi">
                <i class="bi bi-gift nav-icon"></i>
                <span class="nav-text">Khuyến mãi</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="support.html" class="nav-link" data-name="Hỗ trợ">
                <i class="bi bi-headset nav-icon"></i>
                <span class="nav-text">Hỗ trợ</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="wishlist.html" class="nav-link" data-name="Wishlist">
                <i class="bi bi-heart nav-icon"></i>
                <span class="nav-text">Wishlist</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link" data-name="Thông báo">
                <i class="bi bi-bell nav-icon"></i>
                <span class="nav-text">Thông báo</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="homepage.html#festivalSection" class="nav-link" data-name="Đặt chỗ">
                <i class="bi bi-calendar-check nav-icon"></i>
                <span class="nav-text">Đặt chỗ</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="personal-account.html" class="nav-link active" data-name="Tài khoản">
                <i class="bi bi-person-circle nav-icon"></i>
                <span class="nav-text">Tài khoản</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `;
  initHeaderEvents(activePageName);
}

function loadExternalFooter(placeholderId, filePath) {
  fetch(filePath)
    .then(response => {
      if (response.ok) return response.text();
      throw new Error(`Chưa có file ${filePath}`);
    })
    .then(html => {
      const container = document.getElementById(placeholderId);
      if (container) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const footerEl = doc.querySelector('footer');
        if (footerEl) {
          container.replaceWith(footerEl);
        } else {
          container.innerHTML = html;
        }
      }
    })
    .catch(err => {
      console.warn(`[Footer Loader] Nạp footer offline fallback:`, err);
    });
}
