/**
 * StayVivu / YÊN Homestay - Homepage Scripts
 * Đường dẫn: opencms-core-master/.../Homestay/user/JS/homepage.js
 * Quản lý tương tác Slider, Bộ lọc Lễ hội, Homestay Yêu thích, Wishlist, Modal, Tìm kiếm & Header Menu
 */

// --- 0. DYNAMIC COMPONENT LOADER: HEADER & FOOTER ---
document.addEventListener('DOMContentLoaded', () => {
    // Nạp động Header từ header.html (Link qua trang chủ)
    loadExternalHeader('header-placeholder', 'header.html', 'Trang chủ');

    // Nạp động Footer nếu có file footer.html
    loadExternalFooter('footer-placeholder', 'footer.html');
});

/**
 * Nạp động Header từ file header.html
 * Giữ nguyên tắc tách biệt module: Không nhúng cứng mã header vào homepage.html
 */
function loadExternalHeader(placeholderId, filePath, activePageName = 'Trang chủ') {
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
            console.warn(`[Header Loader] Không thể nạp ${filePath} qua fetch (thường do chính sách CORS khi mở trực tiếp tệp file:/// trên trình duyệt thay vì qua Live Server/OpenCMS):`, err);
            // Fallback an toàn giúp trang vẫn hiển thị header đầy đủ khi mở offline file:///
            renderFallbackHeader(placeholder, activePageName);
        });
}

function initHeaderEvents(activePageName = 'Trang chủ') {
    const header = document.querySelector('.header');
    if (!header) return;

    const navLinks = header.querySelectorAll('.nav-link');
    const mobileBtn = header.querySelector('#mobileMenuBtn');
    const navList = header.querySelector('#navList');

    // Thiết lập tab active phù hợp
    navLinks.forEach(link => {
        const linkName = link.getAttribute('data-name') || link.innerText.trim();
        if (linkName === activePageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }

        link.addEventListener('click', function() {
            if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#') && !this.getAttribute('href').startsWith('javascript')) {
                return;
            }
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Mobile menu toggle
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
              <a href="homepage.html" class="nav-link active" data-name="Trang chủ">
                <i class="bi bi-house-door nav-icon"></i>
                <span class="nav-text">Trang chủ</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#comboSection" class="nav-link" data-name="Khuyến mãi">
                <i class="bi bi-gift nav-icon"></i>
                <span class="nav-text">Khuyến mãi</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="javascript:void(0)" class="nav-link" data-name="Hỗ trợ">
                <i class="bi bi-headset nav-icon"></i>
                <span class="nav-text">Hỗ trợ</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#favoritesSection" class="nav-link" data-name="Wishlist">
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
              <a href="bookings.html" class="nav-link" data-name="Đặt phòng">
                <i class="bi bi-calendar-check nav-icon"></i>
                <span class="nav-text">Đặt phòng</span>
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
        .catch(() => {
            // Footer chưa có thì không hiển thị lỗi console
        });
}

// --- 1. HERO SLIDER LOGIC ---
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dots .dot');
const prevBtn = document.getElementById('sliderPrevBtn');
const nextBtn = document.getElementById('sliderNextBtn');
let currentSlide = 0;
let slideInterval = null;

function showSlide(index) {
    if (index < 0) {
        currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startSlideTimer() {
    slideInterval = setInterval(nextSlide, 5000);
}

function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideTimer();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideTimer();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            showSlide(idx);
            resetSlideTimer();
        });
    });

    // Tạm dừng khi rê chuột vào slider
    const sliderWrapper = document.querySelector('.hero-slider-wrapper');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderWrapper.addEventListener('mouseleave', () => startSlideTimer());
    }

    startSlideTimer();
}

// --- 2. COMBO TỐT NHẤT HÔM NAY SLIDER ---
const comboData = [
    {
        title: "INTERCONTINENTAL ĐÀ NẴNG",
        discount: "Combo tiết kiệm đến 34%",
        days: "Combo 3N2Đ",
        desc: "Bay khứ hồi · Phòng ban công toàn cảnh · Ăn sáng buffet cao cấp",
        price: "14.799.000đ",
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
    },
    {
        title: "TOPAS ECOLODGE SAPA",
        discount: "Tiết kiệm 28%",
        days: "Combo 3N2Đ Săn Mây",
        desc: "Xe Limousine đón tiễn · Bungalow thung lũng Mường Hoa · Hồ bơi vô cực nước ấm",
        price: "4.590.000đ",
        img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80"
    },
    {
        title: "ANA MANDARA VILLAS ĐÀ LẠT",
        discount: "Ưu đãi mùa thu 30%",
        days: "Combo 2N1Đ Sang Trọng",
        desc: "Biệt thự cổ phong cách Pháp · Trà chiều hoàng gia · Ăn sáng tại phòng riêng",
        price: "2.890.000đ",
        img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
    }
];

let currentComboIndex = 0;

function switchCombo(index) {
    currentComboIndex = index;
    const combo = comboData[index];

    const comboCard = document.getElementById('featuredComboCard');
    if (!comboCard) return;

    comboCard.style.opacity = '0.7';
    setTimeout(() => {
        document.getElementById('comboTitle').textContent = combo.title;
        document.getElementById('comboDiscount').textContent = combo.discount;
        document.getElementById('comboDays').textContent = combo.days;
        document.getElementById('comboDesc').textContent = combo.desc;
        document.getElementById('comboPrice').innerHTML = `${combo.price} <span>/ khách</span>`;
        document.getElementById('comboBgImg').src = combo.img;
        comboCard.style.opacity = '1';
    }, 150);

    const comboDots = document.querySelectorAll('.combo-dot');
    comboDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function openComboDetail() {
    const current = comboData[currentComboIndex];
    showQuickDetail(current.title, current.img, current.price, "Gói Combo Nghỉ Dưỡng", current.desc, "Đà Nẵng / Sapa / Đà Lạt");
}

// Chuyển sang homestay trước
function prevCombo() {
    const newIndex = (currentComboIndex - 1 + comboData.length) % comboData.length;
    switchCombo(newIndex);
    resetComboTimer();
}

// Chuyển sang homestay tiếp theo
function nextCombo() {
    const newIndex = (currentComboIndex + 1) % comboData.length;
    switchCombo(newIndex);
    resetComboTimer();
}

// Auto-slide: tự động chuyển mỗi 4 giây
let comboAutoInterval = setInterval(nextCombo, 4000);

function resetComboTimer() {
    clearInterval(comboAutoInterval);
    comboAutoInterval = setInterval(nextCombo, 4000);
}

// Tạm dừng auto-slide khi hover vào card
const comboCard = document.getElementById('featuredComboCard');
if (comboCard) {
    comboCard.addEventListener('mouseenter', () => clearInterval(comboAutoInterval));
    comboCard.addEventListener('mouseleave', () => {
        comboAutoInterval = setInterval(nextCombo, 4000);
    });
}

// --- 3. HOMESTAY THEO LỄ HỘI LOGIC ---
const festivalData = {
    'diff': {
        badge: 'Sắp diễn ra vào tháng 6',
        name: 'Lễ Hội Pháo Hoa Quốc Tế Đà Nẵng (DIFF)',
        location: 'Sân khấu bờ sông Hàn, TP. Đà Nẵng',
        date: '08/06 - 13/07/2026',
        homestays: [
            {
                name: 'Han River Glass House',
                location: 'Bờ sông Hàn, Đà Nẵng',
                distance: 'Cách điểm bắn pháo hoa 450m',
                rating: '4.95',
                reviews: '184',
                specs: '2 phòng ngủ · 4 khách',
                amenities: 'View trực diện pháo hoa · Sân thượng chill · Bếp BBQ',
                price: '1.150.000đ',
                tag: 'Gần khán đài pháo hoa',
                img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Danang Riverside Cozy Villa',
                location: 'Đường Trần Hưng Đạo, Đà Nẵng',
                distance: 'Cách điểm tổ chức 700m',
                rating: '4.92',
                reviews: '142',
                specs: '3 phòng ngủ · 6 khách',
                amenities: 'Sân vườn thoáng mát · Bể ngâm nước nóng · Đi bộ ra sông',
                price: '1.450.000đ',
                tag: 'Đi bộ ra lễ hội',
                img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'My Khe & Sun Wheel Studio',
                location: 'Quận Sơn Trà, Đà Nẵng',
                distance: 'Cách điểm tổ chức 900m',
                rating: '4.89',
                reviews: '96',
                specs: '1 phòng ngủ · 2 khách',
                amenities: 'Ban công ngắm cầu Rồng · Cho thuê xe máy · Bữa sáng nhẹ',
                price: '850.000đ',
                tag: 'Giá tiết kiệm',
                img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Sơn Trà Sunset Infinity Villa',
                location: 'Quận Sơn Trà, Đà Nẵng',
                distance: 'Cách điểm tổ chức 1.2km',
                rating: '4.94',
                reviews: '215',
                specs: '4 phòng ngủ · 8 khách',
                amenities: 'Hồ bơi vô cực view biển · Bếp nướng BBQ · Gần bãi tắm',
                price: '2.750.000đ',
                tag: 'View biển vô cực',
                img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'
            }
        ]
    },
    'dalat-flower': {
        badge: 'Khai mạc cuối năm',
        name: 'Festival Hoa Đà Lạt Sắc Màu Xứ Ngàn Hoa',
        location: 'Quảng trường Lâm Viên & Hồ Xuân Hương, Đà Lạt',
        date: '18/12 - 31/12/2026',
        homestays: [
            {
                name: 'Dalat Blooming Garden Homestay',
                location: 'Hồ Xuân Hương, Đà Lạt',
                distance: 'Cách Quảng trường Lâm Viên 400m',
                rating: '4.97',
                reviews: '230',
                specs: '2 phòng ngủ · 4 khách',
                amenities: 'Vườn cẩm tú cầu nở rộ · Lò sưởi củi · Trà nóng ngắm sương',
                price: '950.000đ',
                tag: 'Đi bộ ra Festival',
                img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Xuan Huong Lake View House',
                location: 'Trung tâm TP. Đà Lạt',
                distance: 'Cách bờ hồ 250m',
                rating: '4.91',
                reviews: '158',
                specs: '3 phòng ngủ · 6 khách',
                amenities: 'View toàn cảnh hồ · Sân BBQ rộng · Gần chợ đêm Đà Lạt',
                price: '1.250.000đ',
                tag: 'View trực diện Hồ',
                img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Rustic Pine Hill Cabin',
                location: 'Đường Khởi Nghĩa Bắc Sơn, Đà Lạt',
                distance: 'Cách điểm tổ chức 1.1km',
                rating: '4.88',
                reviews: '124',
                specs: '1 phòng ngủ · 2 khách',
                amenities: 'Nhà gỗ mái dốc · Săn mây ban mai · Đốt lửa trại nướng khoai',
                price: '790.000đ',
                tag: 'Không gian yên tĩnh',
                img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'The Memory Valley Villa',
                location: 'Đường Tuyền Lâm, Đà Lạt',
                distance: 'Cách điểm tổ chức 1.5km',
                rating: '4.96',
                reviews: '340',
                specs: '3 phòng ngủ · 6 khách',
                amenities: 'Bể bơi nước ấm · Lò sưởi củi · Sân BBQ ngoài trời',
                price: '1.450.000đ',
                tag: 'Săn mây thung lũng',
                img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80'
            }
        ]
    },
    'hue-fest': {
        badge: 'Lễ hội truyền thống',
        name: 'Festival Cố Đô Huế - Di Sản Văn Hóa Tỏa Sáng',
        location: 'Quần thể Di tích Cố đô & Đại Nội Huế',
        date: '25/04 - 02/05/2026',
        homestays: [
            {
                name: 'Nhà Rường Cổ Cố Đô Homestay',
                location: 'Đường Đoàn Thị Điểm, TP. Huế',
                distance: 'Cách Đại Nội Huế 350m',
                rating: '4.94',
                reviews: '167',
                specs: '2 phòng ngủ · 4 khách',
                amenities: 'Kiến trúc nhà rường gỗ · Trà sen Cung đình · Áo dài check-in',
                price: '890.000đ',
                tag: 'Đậm chất cố đô',
                img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Sông Hương Lotus Villa',
                location: 'Đường Lê Lợi, TP. Huế',
                distance: 'Cách Cầu Trường Tiền 500m',
                rating: '4.90',
                reviews: '115',
                specs: '3 phòng ngủ · 6 khách',
                amenities: 'Ban công ngắm dòng sông Hương · Bể bơi sân vườn xanh mát',
                price: '1.180.000đ',
                tag: 'Gần sông Hương',
                img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Vỹ Dạ Ancient Green Haven',
                location: 'Thôn Vỹ Dạ, TP. Huế',
                distance: 'Cách khán đài khai mạc 900m',
                rating: '4.86',
                reviews: '89',
                specs: '1 phòng ngủ · 2 khách',
                amenities: 'Vườn cau xanh ngát · Thưởng trà ngắm hoàng hôn · Xe đạp',
                price: '680.000đ',
                tag: 'Giá tốt nhất',
                img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Imperial Citadel Garden Villa',
                location: 'Phường Thuận Thành, TP. Huế',
                distance: 'Cách Kỳ Đài Huế 400m',
                rating: '4.92',
                reviews: '148',
                specs: '2 phòng ngủ · 4 khách',
                amenities: 'Sân vườn tiểu cảnh · Thưởng trà Ngự Hà · Xe đạp cổ điển',
                price: '920.000đ',
                tag: 'Gần Kỳ Đài',
                img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
            }
        ]
    },
    'ninh-binh': {
        badge: 'Sự kiện độc đáo',
        name: 'Lễ Hội Khinh Khí Cầu Quốc Tế Tràng An',
        location: 'Quần thể danh thắng Tràng An, Ninh Bình',
        date: '10/05 - 18/05/2026',
        homestays: [
            {
                name: 'Tràng An Valley Cloud Retreat',
                location: 'Khu du lịch Tràng An, Ninh Bình',
                distance: 'Cách bãi thả khinh khí cầu 350m',
                rating: '4.96',
                reviews: '175',
                specs: '2 phòng ngủ · 4 khách',
                amenities: 'View núi đá vôi trập trùng · Ngắm khinh khí cầu từ ban công',
                price: '1.050.000đ',
                tag: 'Gần bãi khinh khí cầu',
                img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Ninh Bình Mountain Eco Cabin',
                location: 'Hoa Lư, Ninh Bình',
                distance: 'Cách cổng vào lễ hội 600m',
                rating: '4.91',
                reviews: '138',
                specs: '1 phòng ngủ · 2 khách',
                amenities: 'Hồ bơi tự nhiên · Chèo thuyền kayak đầm sen · Bữa ăn quê',
                price: '860.000đ',
                tag: 'Hồ bơi giữa núi',
                img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Tam Cốc Golden Rice Homestay',
                location: 'Tam Cốc - Bích Động, Ninh Bình',
                distance: 'Cách điểm tổ chức 1km',
                rating: '4.89',
                reviews: '112',
                specs: '2 phòng ngủ · 4 khách',
                amenities: 'View cánh đồng lúa chín · Đạp xe miễn phí · Bữa sáng địa phương',
                price: '790.000đ',
                tag: 'View đồng lúa',
                img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80'
            },
            {
                name: 'Hang Múa Lotus View Ecolodge',
                location: 'Khê Hạ, Ninh Bình',
                distance: 'Cách khu lễ hội 800m',
                rating: '4.93',
                reviews: '164',
                specs: '2 phòng ngủ · 4 khách',
                amenities: 'View đỉnh Hang Múa · Đầm sen ngát hương · Phục vụ đồ nướng',
                price: '980.000đ',
                tag: 'View Hang Múa',
                img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
            }
        ]
    }
};

function switchFestival(festivalKey) {
    const tabs = document.querySelectorAll('#festivalTabs .festival-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const data = festivalData[festivalKey];
    if (!data) return;

    document.getElementById('festBadge').textContent = data.badge;
    document.getElementById('festName').textContent = data.name;
    document.getElementById('festLocation').textContent = data.location;
    document.getElementById('festDate').textContent = data.date;

    renderFestivalHomestays(data.homestays);
}

function renderFestivalHomestays(homestays) {
    const container = document.getElementById('festivalHomestayList');
    if (!container) return;

    container.innerHTML = homestays.map(item => `
    <div class="homestay-card">
      <div class="card-img-wrapper">
        <span class="card-top-tag">${item.tag}</span>
        <button class="card-wishlist-btn" onclick="toggleWishlist(this, '${item.name}')" title="Yêu thích">
          <i class="bi bi-heart"></i>
        </button>
        <img src="${item.img}" alt="${item.name}">
      </div>
      <div class="card-body">
        <div class="distance-badge">
          <i class="bi bi-geo-alt-fill"></i> ${item.distance}
        </div>
        <div class="card-location-rating">
          <span class="card-location"><i class="bi bi-geo-alt-fill text-success"></i> ${item.location}</span>
          <span class="card-rating"><i class="bi bi-star-fill"></i> ${item.rating} <span class="review-count">(${item.reviews})</span></span>
        </div>
        <h3 class="card-title"><a href="javascript:void(0)" onclick="showQuickDetail('${item.name}')">${item.name}</a></h3>
        <div class="card-specs">
          <span>${item.specs}</span>
        </div>
        <div class="card-amenities-box">
          <span class="amenities-label">Tiện nghi nổi bật:</span>
          <p class="amenities-items">${item.amenities}</p>
        </div>
        <div class="card-footer-row">
          <div class="card-price-group">
            <span class="price-label">Giá từ:</span>
            <span class="card-price">${item.price}</span>
          </div>
          <button class="btn-view-room" onclick="showQuickDetail('${item.name}')">Xem homestay</button>
        </div>
      </div>
    </div>
  `).join('');
}

function scrollToHomestayList() {
    const el = document.getElementById('festivalHomestayList');
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Khởi tạo homestay lễ hội ban đầu
renderFestivalHomestays(festivalData['diff'].homestays);

// --- 4. BỘ LỌC HOMESTAY YÊU THÍCH THEO THÀNH PHỐ (ĐÚNG MẪU ẢNH) ---
function filterFavoriteCity(city, element) {
    const tabs = document.querySelectorAll('#favoriteTabs .city-tab');
    tabs.forEach(t => t.classList.remove('active'));
    element.classList.add('active');

    const cards = document.querySelectorAll('#favoritesGrid .homestay-card');
    cards.forEach(card => {
        const cardCity = card.getAttribute('data-city');
        if (city === 'all' || cardCity === city) {
            card.style.display = 'flex';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- 5. XỬ LÝ YÊU THÍCH (WISHLIST) & TOAST NOTIFICATION ---
let wishlistCount = 0;

function toggleWishlist(btn, name) {
    event.stopPropagation();
    const icon = btn.querySelector('i');
    const isHearted = btn.classList.contains('active');

    if (!isHearted) {
        btn.classList.add('active');
        icon.classList.remove('bi-heart');
        icon.classList.add('bi-heart-fill');
        wishlistCount++;
        showToast(`Đã thêm "${name}" vào Wishlist!`);
    } else {
        btn.classList.remove('active');
        icon.classList.remove('bi-heart-fill');
        icon.classList.add('bi-heart');
        wishlistCount = Math.max(0, wishlistCount - 1);
        showToast(`Đã bỏ lưu "${name}" khỏi Wishlist.`);
    }

    // Cập nhật số đếm trên Wishlist link trong Header nếu có
    const wishlistNav = document.querySelector('.header .nav-link[data-name="Wishlist"] .nav-text');
    if (wishlistNav) {
        wishlistNav.textContent = wishlistCount > 0 ? `Wishlist (${wishlistCount})` : 'Wishlist';
    }
}

function showToast(message) {
    const toast = document.getElementById('toastNotice');
    const msgEl = document.getElementById('toastMsg');
    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

// --- 6. QUICK VIEW MODAL (XEM PHÒNG) ---
const modal = document.getElementById('quickModal');

function showQuickDetail(name, customImg, customPrice, customTag, customDesc, customLocation) {
    window.location.href = 'homestayDetail.html';
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function bookNowAction() {
    const homestayName = document.getElementById('modalTitle').textContent;
    closeModal();
    showToast(`Đang chuyển hướng đặt phòng "${homestayName}"...`);
    setTimeout(() => {
        window.location.href = 'homestayDetail.html';
    }, 3000);
}

// --- 7. TÌM KIẾM & GỢI Ý NHANH ---
function selectQuickTag(destination) {
    const input = document.getElementById('searchDestination');
    if (input) {
        input.value = destination;
        input.focus();
        showToast(`Đã chọn điểm đến: ${destination}`);
    }
}

// --- 7b. KHÁCH & PHÒNG: POPOVER DẠNG STEPPER (thay cho 2 ô nhập tay) ---
const guestsCounts = { guests: 2, rooms: 1 };
const guestsLimits = { guests: { min: 1, max: 20 }, rooms: { min: 1, max: 10 } };

function updateGuestsUI() {
    const guestsValueEl = document.getElementById('guestsValue');
    const roomsValueEl = document.getElementById('roomsValue');
    const summaryEl = document.getElementById('guestsSummary');
    const hiddenGuests = document.getElementById('searchGuestsCount');
    const hiddenRooms = document.getElementById('searchRoomsCount');

    if (guestsValueEl) guestsValueEl.textContent = guestsCounts.guests;
    if (roomsValueEl) roomsValueEl.textContent = guestsCounts.rooms;
    if (summaryEl) summaryEl.textContent = `${guestsCounts.guests} khách · ${guestsCounts.rooms} phòng`;
    if (hiddenGuests) hiddenGuests.value = guestsCounts.guests;
    if (hiddenRooms) hiddenRooms.value = guestsCounts.rooms;

    // Vô hiệu hoá nút trừ/cộng khi chạm giới hạn min/max
    document.querySelectorAll('.stepper-row').forEach(row => {});
    const guestsMinusBtn = document.querySelector('[onclick="adjustCount(\'guests\', -1)"]');
    const guestsPlusBtn = document.querySelector('[onclick="adjustCount(\'guests\', 1)"]');
    const roomsMinusBtn = document.querySelector('[onclick="adjustCount(\'rooms\', -1)"]');
    const roomsPlusBtn = document.querySelector('[onclick="adjustCount(\'rooms\', 1)"]');

    if (guestsMinusBtn) guestsMinusBtn.disabled = guestsCounts.guests <= guestsLimits.guests.min;
    if (guestsPlusBtn) guestsPlusBtn.disabled = guestsCounts.guests >= guestsLimits.guests.max;
    if (roomsMinusBtn) roomsMinusBtn.disabled = guestsCounts.rooms <= guestsLimits.rooms.min;
    if (roomsPlusBtn) roomsPlusBtn.disabled = guestsCounts.rooms >= guestsLimits.rooms.max;
}

function adjustCount(type, delta) {
    const limits = guestsLimits[type];
    const next = guestsCounts[type] + delta;
    if (next < limits.min || next > limits.max) return;
    guestsCounts[type] = next;
    updateGuestsUI();
}

function toggleGuestsPopover(event) {
    event.stopPropagation();
    const wrap = document.getElementById('guestsDropdownWrap');
    if (!wrap) return;

    const willOpen = !wrap.classList.contains('open');
    if (willOpen) {
        positionGuestsPopover();
    }
    wrap.classList.toggle('open', willOpen);
}

/**
 * Tính toạ độ chính xác cho popover (position: fixed) dựa theo vị trí thật
 * của nút "Khách & phòng" trên màn hình — tránh bị che khuất bởi
 * overflow:hidden của .hero-slider-wrapper và tránh tràn ra ngoài viewport.
 */
function positionGuestsPopover() {
    const popover = document.getElementById('guestsPopover');
    const btn = document.getElementById('guestsToggleBtn');
    if (!popover || !btn) return;

    const gap = 12;
    const margin = 16;
    const btnRect = btn.getBoundingClientRect();

    // Đo kích thước thật của popover (tạm hiện để đo rồi trả lại trạng thái cũ)
    const prevVisibility = popover.style.visibility;
    const prevDisplay = popover.style.display;
    popover.style.visibility = 'hidden';
    popover.style.display = 'block';
    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;
    popover.style.display = prevDisplay;
    popover.style.visibility = prevVisibility;

    // Căn theo mép phải của nút bấm, giới hạn không tràn ra ngoài viewport
    let left = btnRect.right - popoverWidth;
    left = Math.max(margin, Math.min(left, window.innerWidth - popoverWidth - margin));

    // Ưu tiên hiện bên dưới nút; nếu không đủ chỗ thì tự lật lên trên
    const spaceBelow = window.innerHeight - btnRect.bottom;
    let top;
    if (spaceBelow >= popoverHeight + gap) {
        top = btnRect.bottom + gap;
    } else {
        top = btnRect.top - popoverHeight - gap;
    }
    top = Math.max(margin, top);

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
}

function closeGuestsPopover() {
    const wrap = document.getElementById('guestsDropdownWrap');
    if (wrap) wrap.classList.remove('open');
}

// Đóng popover khi bấm ra ngoài (kể cả khi bấm trúng vùng popover đã fixed)
document.addEventListener('click', (e) => {
    const wrap = document.getElementById('guestsDropdownWrap');
    const popover = document.getElementById('guestsPopover');
    if (wrap && wrap.classList.contains('open') && !wrap.contains(e.target) && !(popover && popover.contains(e.target))) {
        wrap.classList.remove('open');
    }
});

// Vị trí nút có thể đổi khi cuộn/thu phóng cửa sổ -> tính lại hoặc đóng popover
window.addEventListener('resize', () => {
    const wrap = document.getElementById('guestsDropdownWrap');
    if (wrap && wrap.classList.contains('open')) positionGuestsPopover();
});
window.addEventListener('scroll', () => {
    const wrap = document.getElementById('guestsDropdownWrap');
    if (wrap && wrap.classList.contains('open')) closeGuestsPopover();
}, true);

// Khởi tạo trạng thái hiển thị ban đầu cho khối Khách & phòng
updateGuestsUI();

/**
 * Xử lý sự kiện Tìm kiếm chính:
 * - Điểm đến hoặc Tên homestay (đã gộp chung 1 ô)
 * - Ngày nhận phòng / Ngày trả phòng (tùy chọn, kiểm tra hợp lệ nếu có nhập)
 * - Số khách / Số phòng (lấy từ popover Khách & phòng, mặc định 2 khách - 1 phòng)
 */
function handleSearch() {
    const dest = document.getElementById('searchDestination').value.trim();
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const guests = parseInt(document.getElementById('searchGuestsCount').value) || 2;
    const rooms = parseInt(document.getElementById('searchRoomsCount').value) || 1;

    // Bắt buộc phải có điểm đến hoặc tên homestay muốn tìm
    if (!dest) {
        alert('Vui lòng nhập địa điểm hoặc tên homestay bạn muốn tìm!');
        document.getElementById('searchDestination').focus();
        return;
    }

    // Kiểm tra hợp lệ khoảng ngày nếu người dùng có chọn cả 2 mốc
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
        alert('Ngày trả phòng phải sau ngày nhận phòng. Vui lòng chọn lại!');
        document.getElementById('checkOutDate').focus();
        return;
    }

    const query = new URLSearchParams({
        destination: dest,
        checkIn,
        checkOut,
        guests: String(guests),
        rooms: String(rooms)
    });
    window.location.href = `searchResult.html?${query.toString()}`;
}

function filterByCategory(categoryName) {
    showToast(`Đang lọc danh sách homestay phong cách: ${categoryName}`);
    const targetSection = document.getElementById('favoritesSection');
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleSubscribe() {
    const email = document.getElementById('subscriberEmail').value;
    if (email) {
        showToast(`Cảm ơn bạn! Mã giảm giá đã được gửi tới: ${email}`);
        document.getElementById('subscriberEmail').value = '';
    }
}

/**
 * Điều khiển trượt ngang danh mục trải nghiệm
 * @param {number} direction - -1 (trái) hoặc 1 (phải)
 */
function scrollExperience(direction) {
    const grid = document.getElementById('experienceGrid');
    if (grid) {
        const scrollStep = grid.clientWidth * 0.75 || 320;
        grid.scrollBy({ left: direction * scrollStep, behavior: 'smooth' });
    }
}

// --- 8. CAROUSEL SCROLLING ---
function scrollCarousel(button, direction) {
    const container = button.closest('.carousel-container');
    if (!container) return;
    const track = container.querySelector('.carousel-track');
    if (!track) return;
    // Calculate scroll amount (one item width plus gap roughly)
    const scrollAmount = track.clientWidth * 0.5;
    track.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}
