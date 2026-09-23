document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('guest-services-grid');
    const modal = document.getElementById('booking-modal');
    const toast = document.getElementById('toast');
    const formatter = new Intl.NumberFormat('vi-VN');
    const names = { food: 'Ẩm thực', culture: 'Khám phá', transport: 'Di chuyển', wellness: 'Thư giãn', combo: 'Gói Combo' };

    function escapeHtml(value = '') { return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]); }
    function showToast(message) { document.getElementById('toast-message').textContent = message; toast.classList.remove('opacity-0', 'translate-y-4'); toast.classList.add('opacity-100', 'translate-y-0'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => { toast.classList.add('opacity-0', 'translate-y-4'); toast.classList.remove('opacity-100', 'translate-y-0'); }, 3000); }
    function card(service) {
        const image = service.image ? `<img class="w-full h-full object-cover" src="${service.image}" alt="${escapeHtml(service.name)}">` : `<div class="w-full h-full flex items-center justify-center bg-surface-container text-secondary"><span class="material-symbols-outlined text-5xl">${service.icon || 'local_activity'}</span></div>`;
        return `<article class="guest-service-card flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-surface-variant" data-category="${service.category}" data-id="${service.id}"><div class="relative h-40 w-full overflow-hidden">${image}<div class="absolute top-2 left-2 px-2 py-1 rounded bg-black/50 text-white text-[10px] flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">${service.icon || 'local_activity'}</span>${names[service.category] || 'Dịch vụ'}</div></div><div class="p-4 flex flex-col flex-1 justify-between"><div><h3 class="font-semibold text-on-surface text-base mb-1">${escapeHtml(service.name)}</h3><p class="text-sm text-on-surface-variant line-clamp-2">${escapeHtml(service.description || 'Trải nghiệm địa phương được tuyển chọn cho kỳ nghỉ của bạn.')}</p></div><div class="mt-4 flex items-center justify-between gap-2"><div><p class="font-bold text-secondary text-lg">${formatter.format(service.price)}đ</p><p class="text-[11px] text-on-surface-variant">${escapeHtml(service.unit || 'khách')}</p></div><button class="book-btn px-4 py-2 bg-secondary text-on-secondary rounded-lg font-semibold text-sm" data-book="${service.id}">Đặt ngay</button></div></div></article>`;
    }
    async function renderBookings() {
        const bookings = (await HomestayUserDB.all('serviceBookings')).sort((a, b) => b.createdAt - a.createdAt);
        document.getElementById('booking-count').textContent = `${bookings.length} yêu cầu`;
        document.getElementById('guest-booking-list').innerHTML = bookings.length ? bookings.map(order => `<div class="flex items-center justify-between gap-3 p-4"><div><p class="font-semibold text-sm">${escapeHtml(order.serviceName)}</p><p class="text-xs text-on-surface-variant mt-1">${order.date.split('-').reverse().join('/')} · ${order.quantity} ${order.quantity > 1 ? 'lượt' : 'lượt'} · ${escapeHtml(order.status)}</p></div>${order.status === 'Chờ xác nhận' ? `<button class="cancel-booking text-sm text-error font-semibold" data-cancel="${order.id}">Hủy yêu cầu</button>` : ''}</div>`).join('') : '<p class="p-4 text-sm text-on-surface-variant">Chưa có yêu cầu dịch vụ nào.</p>';
    }
    async function loadServices() {
        let services = [];
        try {
            const request = indexedDB.open('NSM_ServicesDB');
            const ownerServices = await new Promise((resolve, reject) => { request.onsuccess = e => { const database = e.target.result; if (!database.objectStoreNames.contains('services')) return resolve([]); const get = database.transaction('services').objectStore('services').getAll(); get.onsuccess = () => resolve(get.result); get.onerror = () => reject(get.error); }; request.onerror = () => reject(request.error); });
            services = ownerServices.filter(item => item.status !== 'Tạm ngưng');
        } catch (_) { /* The empty state below is displayed until the owner adds services. */ }
        window.guestServices = services;
        grid.innerHTML = services.length ? services.map(card).join('') : '<p class="col-span-full rounded-xl bg-surface-container-low p-5 text-center text-on-surface-variant">Hiện chưa có dịch vụ nào đang mở bán.</p>';
    }
    document.querySelectorAll('.guest-tab-btn').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.guest-tab-btn').forEach(item => item.classList.remove('active', 'bg-primary', 'text-on-primary', 'shadow-sm')); button.classList.add('active', 'bg-primary', 'text-on-primary', 'shadow-sm'); const category = button.dataset.cat; grid.querySelectorAll('.guest-service-card').forEach(item => item.classList.toggle('hidden', category !== 'all' && item.dataset.category !== category)); }));
    grid.addEventListener('click', event => { const button = event.target.closest('[data-book]'); if (!button) return; const service = window.guestServices.find(item => String(item.id) === button.dataset.book); document.getElementById('booking-service-id').value = service.id; document.getElementById('booking-service-name').textContent = `${service.name} — ${formatter.format(service.price)}đ/${service.unit}`; document.getElementById('booking-date').min = new Date().toISOString().slice(0, 10); modal.classList.remove('hidden'); modal.classList.add('flex'); });
    document.querySelectorAll('.close-booking').forEach(button => button.addEventListener('click', () => { modal.classList.add('hidden'); modal.classList.remove('flex'); }));
    document.getElementById('booking-form').addEventListener('submit', async event => { event.preventDefault(); const service = window.guestServices.find(item => String(item.id) === document.getElementById('booking-service-id').value); const order = { id: Date.now(), serviceId: service.id, serviceName: service.name, date: document.getElementById('booking-date').value, quantity: Number(document.getElementById('booking-quantity').value), note: document.getElementById('booking-note').value.trim(), status: 'Chờ xác nhận', createdAt: Date.now() }; try { await HomestayUserDB.put('serviceBookings', order); modal.classList.add('hidden'); modal.classList.remove('flex'); event.target.reset(); await renderBookings(); showToast('Đã gửi yêu cầu đặt dịch vụ.'); } catch (_) { showToast('Chưa thể lưu yêu cầu. Vui lòng thử lại.'); } });
    document.getElementById('guest-booking-list').addEventListener('click', async event => { const button = event.target.closest('[data-cancel]'); if (!button || !confirm('Bạn muốn hủy yêu cầu dịch vụ này?')) return; await HomestayUserDB.remove('serviceBookings', Number(button.dataset.cancel)); await renderBookings(); showToast('Đã hủy yêu cầu dịch vụ.'); });
    loadServices();
    renderBookings();
});
