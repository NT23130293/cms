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
