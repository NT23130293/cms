    // State Manager between Active list and Empty state
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
        });

    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        });
    function switchWishlistState(state) {
        const activeView = document.getElementById('wishlist-state-active');
        const emptyView = document.getElementById('wishlist-state-empty');
        const btnActive = document.getElementById('btn-state-active');
        const btnEmpty = document.getElementById('btn-state-empty');
    if (state === 'empty') {
    activeView.classList.add('hidden');
    emptyView.classList.remove('hidden');

    btnEmpty.className = "flex items-center gap-1.5 px-space-md py-2 rounded-full font-label-md text-label-md bg-primary-container text-on-primary shadow-sm transition-all duration-200";
    btnActive.className = "flex items-center gap-1.5 px-space-md py-2 rounded-full font-label-md text-label-md text-text-secondary hover:text-text-primary transition-all duration-200";
    showToast('Đang mô phỏng giao diện khi chưa lưu phòng nào', 'info');
} else {
    emptyView.classList.add('hidden');
    activeView.classList.remove('hidden');

    btnActive.className = "flex items-center gap-1.5 px-space-md py-2 rounded-full font-label-md text-label-md bg-primary-container text-on-primary shadow-sm transition-all duration-200";
    btnEmpty.className = "flex items-center gap-1.5 px-space-md py-2 rounded-full font-label-md text-label-md text-text-secondary hover:text-text-primary transition-all duration-200";
    showToast('Đã chuyển về danh sách 3 homestay đang lưu', 'check_circle');
}
}

    // Remove individual Card Item
    function removeWishlistItem(cardId, name) {
    const el = document.getElementById(cardId);
    if (el) {
    el.style.transform = 'scale(0.95)';
    el.style.opacity = '0';
    setTimeout(() => {
    el.remove();
    updateRemainingCounters();
    showToast('Đã xóa "' + name + '" khỏi danh sách yêu thích', 'delete');
}, 250);
}
}

    // Remove item from Drawer & sync grid
    function removeDrawerItem(drawerItemId, mainCardId) {
    const dItem = document.getElementById(drawerItemId);
    if (dItem) {
    dItem.remove();
}
    const mItem = document.getElementById(mainCardId);
    if (mItem) {
    mItem.remove();
}
    updateRemainingCounters();
    showToast('Đã xóa khỏi danh sách yêu thích', 'delete');
}

    // Update counters dynamically
    function updateRemainingCounters() {
    const remaining = document.querySelectorAll('.wishlist-card').length;
    const counterBadge = document.getElementById('active-counter-badge');
    const statePill = document.getElementById('counter-state-pill');
    const drawerCounter = document.getElementById('drawer-counter');

    if (counterBadge) counterBadge.innerText = remaining;
    if (statePill) statePill.innerText = remaining;
    if (drawerCounter) drawerCounter.innerText = remaining;

    if (remaining === 0) {
    switchWishlistState('empty');
}
}

    // Confirm and clear all items
    function confirmClearAll() {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả 3 homestay khỏi danh sách yêu thích?")) {
    const grid = document.getElementById('homestay-grid');
    const drawerContainer = document.getElementById('drawer-items-container');
    if (grid) grid.innerHTML = '';
    if (drawerContainer) drawerContainer.innerHTML = '<p class="text-caption text-text-muted text-center py-8">Danh sách drawer đang trống</p>';
    updateRemainingCounters();
    switchWishlistState('empty');
    showToast('Đã xóa toàn bộ danh sách yêu thích', 'check');
}
}

    // Filter cards by region
    function filterRegion(region, btn) {
    // Update button styling
    const pills = document.querySelectorAll('#filter-pill-group .filter-pill');
    pills.forEach(p => {
    p.className = 'filter-pill px-space-md py-1.5 rounded-full font-label-md text-label-md bg-surface-card text-text-secondary hover:bg-surface-subtle shadow-sm transition-all whitespace-nowrap';
});
    btn.className = 'filter-pill active px-space-md py-1.5 rounded-full font-label-md text-label-md bg-primary-container text-on-primary shadow-sm transition-all whitespace-nowrap';

    const cards = document.querySelectorAll('.wishlist-card');
    cards.forEach(card => {
    if (region === 'all' || card.getAttribute('data-region') === region) {
    card.style.display = 'flex';
} else {
    card.style.display = 'none';
}
});
}

    // Sort cards logic
    function sortCards(criteria) {
    const grid = document.getElementById('homestay-grid');
    const cards = Array.from(document.querySelectorAll('.wishlist-card'));

    cards.sort((a, b) => {
    if (criteria === 'price-asc') {
    return Number(a.getAttribute('data-price')) - Number(b.getAttribute('data-price'));
} else if (criteria === 'price-desc') {
    return Number(b.getAttribute('data-price')) - Number(a.getAttribute('data-price'));
} else if (criteria === 'rating') {
    return Number(b.getAttribute('data-rating')) - Number(a.getAttribute('data-rating'));
} else {
    return Number(b.getAttribute('data-date')) - Number(a.getAttribute('data-date'));
}
});

    cards.forEach(c => grid.appendChild(c));
    showToast('Đã sắp xếp lại danh sách homestay', 'sort');
}

    // Drawer Slide-over Panel Toggle
    function toggleDrawer(open) {
    const drawer = document.getElementById('wishlist-drawer');
    const backdrop = document.getElementById('wishlist-drawer-backdrop');

    if (open) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
} else {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
}
}

    // Collapsible Tech Guide
    function toggleTechGuide() {
    const guide = document.getElementById('tech-guide-content');
    const icon = document.getElementById('tech-accordion-icon');
    if (guide.classList.contains('hidden')) {
    guide.classList.remove('hidden');
    icon.style.transform = 'rotate(180deg)';
} else {
    guide.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
}
}

    // Quick save recommendation from empty state
    function quickSaveReco(name) {
    showToast('Đã thêm "' + name + '" vào yêu thích!', 'favorite');
    setTimeout(() => {
    switchWishlistState('active');
}, 600);
}

    // Copy share link simulation
    function copyShareLink() {
    if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
}
    showToast('Đã sao chép liên kết danh sách yêu thích vào bộ nhớ tạm!', 'link');
}

    // Direct reserve simulation
    function reserveDirect(name) {
    showToast('Đang chuyển hướng đặt phòng: ' + name, 'shopping_bag');
}

    function reserveAllWishlist() {
    showToast('Đang chuẩn bị lộ trình kết hợp cho 3 địa điểm...', 'event_seat');
}

    // Toast Notification helper
    let toastTimer;

    function showToast(message, iconName = 'check_circle') {
    const toast = document.getElementById('toast-notify');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');

    if (toast && toastMsg && toastIcon) {
    toastMsg.innerText = message;
    toastIcon.innerText = iconName;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0', 'pointer-events-none');
}, 3000);
}
}
