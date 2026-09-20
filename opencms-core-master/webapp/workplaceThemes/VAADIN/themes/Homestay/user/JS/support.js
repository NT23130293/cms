/**
 * StayVivu / YÊN Homestay - Support Page Scripts
 * Đường dẫn: opencms-core-master/.../Homestay/user/JS/support.js
 * Quản lý Nạp động Header & Footer, Tìm kiếm Trợ giúp, FAQ Accordion, Gửi Ticket & Live Chat
 */

document.addEventListener('DOMContentLoaded', () => {
  // Nạp động Header & Footer (Đảm bảo nối header & footer chuẩn hóa)
  loadExternalHeader('header-placeholder', 'header.html', 'Hỗ trợ');
  loadExternalFooter('footer-placeholder', 'footer.html');
});

/**
 * Nạp động Header từ file header.html
 */
function loadExternalHeader(placeholderId, filePath, activePageName = 'Hỗ trợ') {
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

/**
 * Khởi tạo sự kiện Header (Active Link, Mobile Toggle, Link Navs)
 */
function initHeaderEvents(activePageName = 'Hỗ trợ') {
  const header = document.querySelector('.header');
  if (!header) return;

  const navLinks = header.querySelectorAll('.nav-link');
  const mobileBtn = header.querySelector('#mobileMenuBtn');
  const navList = header.querySelector('#navList');

  // Đặt trạng thái Active cho tab Hỗ trợ
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

/**
 * Render Header Fallback khi mở offline qua file:///
 */
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
              <a href="support.html" class="nav-link active" data-name="Hỗ trợ">
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

/**
 * Nạp động Footer từ footer.html
 */
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

// --- 1. SEARCH HELP DESK ---
function selectSupportTag(keyword) {
  const input = document.getElementById('supportSearchInput');
  if (input) {
    input.value = keyword;
    handleSupportSearch();
  }
}

function handleSupportSearch() {
  const query = document.getElementById('supportSearchInput').value.trim().toLowerCase();
  if (!query) {
    showToast('Vui lòng nhập từ khóa bạn muốn tìm kiếm!');
    return;
  }

  showToast(`Đang tìm thông tin về "${query}"...`);

  const faqItems = document.querySelectorAll('.sp-acc-item');
  let matchCount = 0;

  faqItems.forEach(item => {
    const questionText = item.querySelector('.sp-acc-q-text').textContent.toLowerCase();
    const answerText = item.querySelector('.sp-acc-body').textContent.toLowerCase();

    if (questionText.includes(query) || answerText.includes(query)) {
      item.style.display = 'block';
      item.classList.add('open');
      matchCount++;
    } else {
      item.style.display = 'none';
      item.classList.remove('open');
    }
  });

  const faqSection = document.getElementById('faqSection');
  if (faqSection) faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (matchCount === 0) {
    showToast(`Không tìm thấy kết quả cho "${query}". Hãy thử gửi yêu cầu hỗ trợ!`);
  } else {
    showToast(`Tìm thấy ${matchCount} câu hỏi phù hợp!`);
  }
}

// --- 2. FAQ ACCORDION TOGGLE & CATEGORY FILTER ---
function toggleFaq(element) {
  const faqItem = element.closest('.sp-acc-item');
  const isActive = faqItem.classList.contains('open');
  faqItem.classList.toggle('open', !isActive);
}

function filterFaqCategory(category, btnElement) {
  const tabBtns = document.querySelectorAll('.sp-faq-tab');
  tabBtns.forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  const faqItems = document.querySelectorAll('.sp-acc-item');
  faqItems.forEach(item => {
    const itemCat = item.getAttribute('data-category');
    item.style.display = (category === 'all' || itemCat === category) ? 'block' : 'none';
  });

  const input = document.getElementById('supportSearchInput');
  if (input) input.value = '';
}

// --- 3. SUPPORT TICKET SUBMISSION ---
function handleTicketSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('ticketName').value.trim();
  const phone = document.getElementById('ticketPhone').value.trim();
  const email = document.getElementById('ticketEmail').value.trim();
  const topic = document.getElementById('ticketTopic').value;
  const message = document.getElementById('ticketMessage').value.trim();

  if (!name || !phone || !email || !message) {
    alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)!');
    return;
  }

  showToast('Đang gửi yêu cầu hỗ trợ của bạn...');

  setTimeout(() => {
    showToast(`Yêu cầu #${Math.floor(100000 + Math.random() * 900000)} đã được gửi thành công! CSKH sẽ phản hồi qua email trong 15 phút.`);
    document.getElementById('ticketForm').reset();
  }, 1200);
}

// --- 4. FLOATING LIVE CHAT MODAL ---
function openLiveChat() {
  const modal = document.getElementById('liveChatModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeLiveChat() {
  const modal = document.getElementById('liveChatModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const messagesBody = document.getElementById('chatMsgs');

  // Thêm tin nhắn của User
  const userBubble = document.createElement('div');
  userBubble.className = 'msg-bubble user';
  userBubble.textContent = text;
  messagesBody.appendChild(userBubble);

  input.value = '';
  messagesBody.scrollTop = messagesBody.scrollHeight;

  // Phản hồi tự động của CSKH YÊN Homestay
  setTimeout(() => {
    const botBubble = document.createElement('div');
    botBubble.className = 'msg-bubble bot';
    botBubble.innerHTML = `Cảm ơn bạn! Chuyên viên tư vấn YÊN Homestay đã nhận được tin nhắn: "<em>${text}</em>". Chúng tôi đang hỗ trợ bạn ngay đây!`;
    messagesBody.appendChild(botBubble);
    messagesBody.scrollTop = messagesBody.scrollHeight;
  }, 1000);
}

// Đăng ký phím Enter gửi chat
document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }
});

// --- 5. TOAST NOTIFICATION HELPER ---
function showToast(message) {
  const toast = document.getElementById('spToast');
  const msgEl = document.getElementById('spToastMsg');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
