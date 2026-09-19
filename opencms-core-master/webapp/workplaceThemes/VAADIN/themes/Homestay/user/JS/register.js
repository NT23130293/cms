/* ============================================================
   REGISTER.JS - 3 Bước: Thông tin -> Xác minh OTP -> Hoàn tất
   Hỗ trợ 2 vai trò: Người thuê (Guest) & Chủ Homestay (Host)
   ============================================================ */

let currentRole = "guest";  // "guest" | "host"
let currentStep = 1;        // 1: Info, 2: OTP, 3: Complete
let currentMethod = "email";
let countdownTimer = null;

// Track API loaded
const _apiLoaded = { guest: false, host: false };

// --- Chuyển tab Người thuê / Chủ Homestay ---
function switchRoleTab(role) {
  if (currentStep !== 1) return;
  currentRole = role;

  const btnGuest = document.getElementById("roleBtnGuest");
  const btnHost = document.getElementById("roleBtnHost");
  const formGuest = document.getElementById("step1-guest");
  const formHost = document.getElementById("step1-host");

  if (role === "guest") {
    btnGuest?.classList.add("active");
    btnHost?.classList.remove("active");
    formGuest?.classList.remove("d-none");
    formHost?.classList.add("d-none");
  } else {
    btnHost?.classList.add("active");
    btnGuest?.classList.remove("active");
    formHost?.classList.remove("d-none");
    formGuest?.classList.add("d-none");
  }

  initAddressAndNationality(role);
}

// Khởi tạo API cho form tương ứng (chỉ load 1 lần)
function initAddressAndNationality(role) {
  if (_apiLoaded[role]) return;
  _apiLoaded[role] = true;

  if (role === "guest") {
    if (typeof populateNationality === "function") populateNationality("guestNationality", "vn");
    if (typeof populateDialCodes === "function") populateDialCodes("guestPhoneCode", "vn");
    if (typeof loadProvinces === "function") loadProvinces("guestProvince", "guestWard");

    // Tự động đổi mã vùng điện thoại khi chọn quốc tịch
    document.getElementById("guestNationality")?.addEventListener("change", function () {
      syncPhoneCode("guestPhoneCode", this.value);
    });
  } else {
    if (typeof populateNationality === "function") populateNationality("hostNationality", "vn");
    if (typeof populateDialCodes === "function") populateDialCodes("hostPhoneCode", "vn");
    if (typeof loadProvinces === "function") loadProvinces("hostProvince", "hostWard");

    // Tự động đổi mã vùng điện thoại khi chọn quốc tịch
    document.getElementById("hostNationality")?.addEventListener("change", function () {
      syncPhoneCode("hostPhoneCode", this.value);
    });
  }
}

function syncPhoneCode(selectId, countryCode) {
  const sel = document.getElementById(selectId);
  if (!sel || !countryCode) return;
  for (let i = 0; i < sel.options.length; i++) {
    if (sel.options[i].getAttribute("data-country") === countryCode) {
      sel.selectedIndex = i;
      break;
    }
  }
}

// Lưu thông tin để hiện thị OTP
let savedEmail = "";
let savedPhone = "";

// --- Submit Bước 1 -> Sang Bước 2 (OTP) ---
function submitStep1(role) {
  if (role === "guest") {
    const name = document.getElementById("guestName")?.value.trim();
    const dob = document.getElementById("guestDob")?.value;
    const email = document.getElementById("guestEmail")?.value.trim();
    const phoneCode = document.getElementById("guestPhoneCode")?.value || "+84";
    const phone = document.getElementById("guestPhone")?.value.trim();
    const pwd = document.getElementById("guestPwd")?.value;
    const cpwd = document.getElementById("guestPwdConfirm")?.value;
    const terms = document.getElementById("guestTerms")?.checked;

    if (!name) { alert("Vui lòng nhập họ và tên."); return; }
    if (!dob) { alert("Vui lòng chọn ngày sinh."); return; }
    if (!email || !email.includes("@")) { alert("Vui lòng nhập email hợp lệ."); return; }
    if (!phone) { alert("Vui lòng nhập số điện thoại."); return; }
    if (!pwd || pwd.length < 8) { alert("Mật khẩu phải có ít nhất 8 ký tự."); return; }
    if (pwd !== cpwd) { alert("Mật khẩu xác nhận không khớp."); return; }
    if (!terms) { alert("Vui lòng đồng ý với điều khoản sử dụng."); return; }

    const fullPhone = phoneCode + " " + phone.replace(/^0/, "");
    updateOtpTarget(email, fullPhone);
  } else {
    const name = document.getElementById("hostName")?.value.trim();
    const email = document.getElementById("hostEmail")?.value.trim();
    const phoneCode = document.getElementById("hostPhoneCode")?.value || "+84";
    const phone = document.getElementById("hostPhone")?.value.trim();
    const cccd = document.getElementById("hostCccd")?.value.trim();
    const bizName = document.getElementById("hostBizName")?.value.trim();
    const taxCode = document.getElementById("hostTaxCode")?.value.trim();
    const bizCode = document.getElementById("hostBizCode")?.value.trim();
    const hsName = document.getElementById("hostHsName")?.value.trim();
    const hsType = document.getElementById("hostType")?.value;
    const rooms = document.getElementById("hostRooms")?.value;
    const street = document.getElementById("hostStreet")?.value.trim();
    const pwd = document.getElementById("hostPwd")?.value;
    const cpwd = document.getElementById("hostPwdConfirm")?.value;
    const terms = document.getElementById("hostTerms")?.checked;

    if (!name) { alert("Vui lòng nhập họ và tên chủ sở hữu."); return; }
    if (!email || !email.includes("@")) { alert("Vui lòng nhập email hợp lệ."); return; }
    if (!phone) { alert("Vui lòng nhập số điện thoại."); return; }
    if (!cccd) { alert("Vui lòng nhập số CCCD/CMND."); return; }
    if (!bizName) { alert("Vui lòng nhập tên cơ sở theo Giấy đăng ký kinh doanh."); return; }
    if (!taxCode) { alert("Vui lòng nhập mã số thuế (MST)."); return; }
    if (!bizCode) { alert("Vui lòng nhập số Giấy phép ĐKKD / Mã số doanh nghiệp."); return; }
    if (!hsName) { alert("Vui lòng nhập tên cơ sở / Homestay."); return; }
    if (!hsType) { alert("Vui lòng chọn loại hình lưu trú."); return; }
    if (!rooms || Number(rooms) < 1) { alert("Vui lòng nhập số phòng hợp lệ."); return; }
    if (!street) { alert("Vui lòng nhập địa chỉ cụ thể của Homestay."); return; }
    if (!pwd || pwd.length < 8) { alert("Mật khẩu phải có ít nhất 8 ký tự."); return; }
    if (pwd !== cpwd) { alert("Mật khẩu xác nhận không khớp."); return; }
    if (!terms) { alert("Vui lòng đồng ý với chính sách đối tác lưu trú."); return; }

    const fullPhone = phoneCode + " " + phone.replace(/^0/, "");
    updateOtpTarget(email, fullPhone);
  }

  // Chuyển sang Bước 2 (OTP)
  currentStep = 2;
  document.getElementById("step1-guest")?.classList.add("d-none");
  document.getElementById("step1-host")?.classList.add("d-none");
  document.getElementById("roleSwitcher")?.classList.add("d-none");
  document.getElementById("step2-otp")?.classList.remove("d-none");

  updateStepIndicator(2);
  switchMethod(currentMethod);
  startCountdown();
}

function updateOtpTarget(email, fullPhone) {
  savedEmail = email;
  savedPhone = fullPhone;
  const emailDesc = document.getElementById("methodEmailDesc");
  const phoneDesc = document.getElementById("methodPhoneDesc");
  if (emailDesc) emailDesc.textContent = maskEmail(email);
  if (phoneDesc) phoneDesc.textContent = fullPhone;
}

// --- Quay lại Bước 1 từ Bước 2 ---
function goBackToStep1() {
  stopCountdown();
  currentStep = 1;
  document.getElementById("step2-otp")?.classList.add("d-none");
  document.getElementById("roleSwitcher")?.classList.remove("d-none");
  if (currentRole === "guest") {
    document.getElementById("step1-guest")?.classList.remove("d-none");
  } else {
    document.getElementById("step1-host")?.classList.remove("d-none");
  }
  updateStepIndicator(1);
}

// --- Xác minh OTP -> Bước 3 (Hoàn tất) ---
function confirmOtp() {
  const boxes = document.querySelectorAll(".otp-box");
  let otp = "";
  boxes.forEach(b => otp += b.value);
  if (otp.length < 6) {
    alert("Vui lòng nhập đủ 6 chữ số mã OTP.");
    return;
  }

  stopCountdown();
  currentStep = 3;
  document.getElementById("step2-otp")?.classList.add("d-none");
  document.getElementById("step3-complete")?.classList.remove("d-none");
  updateStepIndicator(3);

  // Điều chỉnh nội dung thành công theo role
  const descEl = document.getElementById("successDesc");
  const rewardEl = document.getElementById("successReward");
  const btnEl = document.getElementById("successSecondaryBtn");

  if (currentRole === "host") {
    if (descEl) descEl.textContent = "Hồ sơ đăng ký Chủ Homestay của bạn đã được gửi. Đội ngũ kiểm duyệt sẽ liên hệ và xác nhận trong 1-3 ngày làm việc.";
    if (rewardEl) rewardEl.innerHTML = '<i class="bi bi-clock-history me-2"></i>Tài khoản đang chờ duyệt thông tin cơ sở lưu trú.';
    if (btnEl) {
      btnEl.href = "personal-account.html";
      btnEl.innerHTML = '<i class="bi bi-house-gear-fill me-2"></i> Quản lý hồ sơ Homestay';
    }
  } else {
    if (descEl) descEl.textContent = "Chào mừng bạn đến với Homestay Cộng đồng Việt Nam! Tài khoản đã được kích hoạt thành công.";
    if (rewardEl) rewardEl.innerHTML = '<i class="bi bi-gift-fill me-2"></i>Bạn vừa nhận được <strong>100 điểm Eco</strong> chào mừng thành viên mới!';
    if (btnEl) {
      btnEl.href = "personal-account.html";
      btnEl.innerHTML = '<i class="bi bi-person-fill me-2"></i> Hoàn thiện hồ sơ';
    }
  }
}

// --- Đổi phương thức OTP (Email / Phone) ---
function switchMethod(method) {
  currentMethod = method;
  document.getElementById("methodEmail")?.classList.toggle("active", method === "email");
  document.getElementById("methodPhone")?.classList.toggle("active", method === "phone");

  const email = currentRole === "guest"
    ? document.getElementById("guestEmail")?.value
    : document.getElementById("hostEmail")?.value;
  const phone = currentRole === "guest"
    ? document.getElementById("guestPhone")?.value
    : document.getElementById("hostPhone")?.value;

  const target = document.getElementById("otpTarget");
  if (target) {
    target.textContent = method === "email"
      ? maskEmail(savedEmail || "")
      : (savedPhone || "+84");
  }
  document.querySelectorAll(".otp-box").forEach(b => {
    b.value = "";
    b.classList.remove("filled");
  });
}

// --- Gửi lại mã OTP ---
function resendOtp() {
  document.querySelectorAll(".otp-box").forEach(b => {
    b.value = "";
    b.classList.remove("filled");
  });
  startCountdown();
}

function startCountdown() {
  stopCountdown();
  let secs = 60;
  const countEl = document.getElementById("countdown");
  const btnResend = document.getElementById("btnResend");
  if (countEl) countEl.textContent = secs;
  if (btnResend) {
    btnResend.disabled = true;
    btnResend.innerHTML = 'Gửi lại (<span id="countdown">' + secs + '</span>s)';
  }

  countdownTimer = setInterval(() => {
    secs--;
    const cEl = document.getElementById("countdown");
    if (cEl) cEl.textContent = secs;
    if (secs <= 0) {
      stopCountdown();
      const btn = document.getElementById("btnResend");
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Gửi lại OTP";
      }
    }
  }, 1000);
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

// --- Cập nhật Step Indicator (3 bước) ---
function updateStepIndicator(activeStep) {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById("step-dot-" + i);
    const line = document.getElementById("step-line-" + i);
    if (!dot) continue;
    dot.classList.remove("active", "done");
    if (i < activeStep) dot.classList.add("done");
    else if (i === activeStep) dot.classList.add("active");
    if (line) line.classList.toggle("done", i < activeStep);
  }
}

// --- Tiện ích ẩn/hiện mật khẩu ---
function togglePwd(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const hide = input.type === "password";
  input.type = hide ? "text" : "password";
  const icon = btn.querySelector("i");
  if (icon) icon.className = hide ? "bi bi-eye" : "bi bi-eye-slash";
}

function maskEmail(email) {
  if (!email || !email.includes("@")) return email;
  const [user, domain] = email.split("@");
  const masked = user.length > 3 ? user.substring(0, 3) + "***" : user.substring(0, 1) + "***";
  return masked + "@" + domain;
}

// --- DOMContentLoaded ---
document.addEventListener("DOMContentLoaded", function () {
  // Đọc vai trò từ query parameter (ví dụ ?role=host hoặc ?role=guest)
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get("role");
  const initialRole = (roleParam === "host") ? "host" : "guest";

  switchRoleTab(initialRole);

  // OTP inputs auto-navigation
  const otpBoxes = document.querySelectorAll(".otp-box");
  otpBoxes.forEach((box, idx) => {
    box.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, 1);
      this.classList.toggle("filled", this.value !== "");
      if (this.value && idx < otpBoxes.length - 1) otpBoxes[idx + 1].focus();
    });
    box.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !this.value && idx > 0) {
        otpBoxes[idx - 1].focus();
        otpBoxes[idx - 1].value = "";
        otpBoxes[idx - 1].classList.remove("filled");
      }
    });
    box.addEventListener("paste", function (e) {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
      pasted.split("").forEach((ch, i) => {
        if (otpBoxes[i]) {
          otpBoxes[i].value = ch;
          otpBoxes[i].classList.add("filled");
        }
      });
      const next = otpBoxes[Math.min(pasted.length, otpBoxes.length - 1)];
      if (next) next.focus();
    });
  });
});
