/**
 * YÊN Homestay — Wishlist Page Scripts
 * Đường dẫn: opencms-core-master/.../Homestay/user/JS/wishlist.js
 * Quản lý Nạp động Header & Footer, Bộ lọc theo Khu vực, Sắp xếp, Xóa sản phẩm Yêu thích & Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  // Nạp động Header & Footer
  loadExternalHeader('header-placeholder', 'header.html', 'Wishlist');
  loadExternalFooter('footer-placeholder', 'footer.html');

  // Khởi tạo số lượng ban đầu
  updateCounters();
});

/**
 * Nạp động Header từ file header.html
 */
function loadExternalHeader(placeholderId, filePath, activePageName = 'Wishlist') {
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

function initHeaderEvents(activePageName = 'Wishlist') {
  const header = document.querySelector('.header');
  if (!header) return;

  const navLinks = header.querySelectorAll('.nav-link');
  const mobileBtn = header.querySelector('#mobileMenuBtn');
  const navList = header.querySelector('#navList');

  // Active tab Wishlist
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
              <a href="wishlist.html" class="nav-link active" data-name="Wishlist">
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
              <a href="personal-account.html" class="nav-link" data-name="Tài khoản">
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

// ── WISHLIST CARD ACTIONS ──

/**
 * Xóa 1 Homestay khỏi danh sách yêu thích với hiệu ứng fade/zoom
 */
function removeWishlistItem(cardId, title) {
  const card = document.getElementById(cardId);
  if (!card) return;

  card.style.transform = 'scale(0.9)';
  card.style.opacity = '0';
  card.style.transition = 'all 0.3s ease';

  setTimeout(() => {
    card.remove();
    updateCounters();
    showToast(`Đã xóa "${title}" khỏi danh sách yêu thích!`, 'bi-heartbreak-fill text-danger');
  }, 280);
}

/**
 * Cập nhật lại các bộ đếm số lượng Homestay yêu thích
 */
function updateCounters() {
  const count = document.querySelectorAll('.wl-card-col').length;
  const countBadge = document.getElementById('wishlistCountBadge');
  const countHeader = document.getElementById('wishlistHeaderCount');
  const gridSection = document.getElementById('wishlistGridSection');
  const emptySection = document.getElementById('wishlistEmptySection');

  if (countBadge) countBadge.textContent = count;
  if (countHeader) countHeader.textContent = count;

  if (count === 0) {
    if (gridSection) gridSection.classList.add('d-none');
    if (emptySection) emptySection.classList.remove('d-none');
  } else {
    if (gridSection) gridSection.classList.remove('d-none');
    if (emptySection) emptySection.classList.add('d-none');
  }
}

/**
 * Bộ lọc danh sách Homestay theo khu vực (Khu vực / Tỉnh thành)
 */
function filterRegion(region, btnElement) {
  const pills = document.querySelectorAll('.wl-pill-btn');
  pills.forEach(p => p.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const cardCols = document.querySelectorAll('.wl-card-col');
  let visibleCount = 0;

  cardCols.forEach(col => {
    const cardRegion = col.getAttribute('data-region');
    if (region === 'all' || cardRegion === region) {
      col.style.display = 'block';
      visibleCount++;
    } else {
      col.style.display = 'none';
    }
  });

  if (visibleCount === 0) {
    showToast(`Không có homestay nào ở khu vực được chọn!`, 'bi-info-circle-fill text-warning');
  }
}

/**
 * Sắp xếp danh sách Homestay (Theo giá, đánh giá, ngày thêm)
 */
function sortCards(criteria) {
  const grid = document.getElementById('homestayGridContainer');
  if (!grid) return;

  const cardCols = Array.from(grid.querySelectorAll('.wl-card-col'));

  cardCols.sort((a, b) => {
    const priceA = parseInt(a.getAttribute('data-price') || '0', 10);
    const priceB = parseInt(b.getAttribute('data-price') || '0', 10);
    const ratingA = parseFloat(a.getAttribute('data-rating') || '0');
    const ratingB = parseFloat(b.getAttribute('data-rating') || '0');
    const dateA = parseInt(a.getAttribute('data-date') || '0', 10);
    const dateB = parseInt(b.getAttribute('data-date') || '0', 10);

    if (criteria === 'price-asc') return priceA - priceB;
    if (criteria === 'price-desc') return priceB - priceA;
    if (criteria === 'rating') return ratingB - ratingA;
    return dateB - dateA;
  });

  cardCols.forEach(col => grid.appendChild(col));
  showToast('Đã sắp xếp lại danh sách homestay!', 'bi-arrow-down-up text-success');
}

/**
 * Mở modal xác nhận xóa tất cả
 */
function confirmClearAll() {
  const modalEl = document.getElementById('clearAllModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

/**
 * Thực hiện xóa tất cả sản phẩm
 */
function executeClearAll() {
  const grid = document.getElementById('homestayGridContainer');
  if (grid) grid.innerHTML = '';

  const modalEl = document.getElementById('clearAllModal');
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();

  updateCounters();
  showToast('Đã xóa toàn bộ danh sách homestay yêu thích!', 'bi-trash-fill text-danger');
}

/**
 * Chia sẻ liên kết danh sách yêu thích
 */
function copyShareLink() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
  }
  showToast('Đã sao chép liên kết danh sách yêu thích vào khay nhớ tạm!', 'bi-share-fill text-primary');
}

/**
 * Toast Notification Helper
 */
function showToast(message, iconClass = 'bi-check-circle-fill text-success') {
  const toast = document.getElementById('wlToast');
  const msgEl = document.getElementById('wlToastMsg');
  const iconEl = document.getElementById('wlToastIcon');

  if (!toast || !msgEl || !iconEl) return;

  msgEl.textContent = message;
  iconEl.className = `bi ${iconClass}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
