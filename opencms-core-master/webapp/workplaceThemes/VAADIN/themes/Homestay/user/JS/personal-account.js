// JavaScript for User Personal Account Management - Du lịch Homestay Cộng đồng Việt Nam

document.addEventListener('DOMContentLoaded', function () {
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
          avatarImg.src = event.target.result;
          showToast('Cập nhật ảnh đại diện thành công!', 'Thành công');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Form Save Profile Changes
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const saveBtn = profileForm.querySelector('button[type="submit"]');
      const originalText = saveBtn.innerHTML;
      
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>Đang lưu...`;

      setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
        showToast('Thông tin cá nhân đã được lưu thành công!', 'Thành công');
      }, 700);
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

  // OTP Verification Submit
  const confirmOtpBtn = document.getElementById('confirmOtpBtn');
  if (confirmOtpBtn) {
    confirmOtpBtn.addEventListener('click', function () {
      const modalEl = document.getElementById('phoneVerifyModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();

      // Update phone verification badge
      const phoneBadge = document.getElementById('phoneStatusBadge');
      if (phoneBadge) {
        phoneBadge.className = 'badge-verified';
        phoneBadge.innerHTML = `<i class="bi bi-check-circle-fill"></i> Đã xác minh`;
      }
      if (phoneVerifyBtn) {
        phoneVerifyBtn.className = 'btn-outline-custom';
        phoneVerifyBtn.textContent = 'Cập nhật';
      }
      showToast('Xác minh số điện thoại thành công!', 'Xác thực thành công');
    });
  }
});
