document.addEventListener('DOMContentLoaded', () => {
    const DB_NAME = 'NSM_ServicesDB', DB_VERSION = 4;
    let db, dbReady, currentServiceImage = null, currentComboImage = null, sortOrder = '';
    const $ = s => document.querySelector(s);
    const money = v => `${Number(v || 0).toLocaleString('vi-VN')}đ`;
    const escapeHtml = (v = '') => String(v).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);
    function notify(message, isError = false) {
        let toast = $('#service-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'service-toast';
            toast.className = 'fixed right-5 top-5 z-[200] rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg transition-opacity';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.backgroundColor = isError ? '#ba1a1a' : '#1b6d24';
        toast.classList.remove('opacity-0');
        clearTimeout(notify.timer);
        notify.timer = setTimeout(() => toast.classList.add('opacity-0'), 2800);
    }

    async function getAll(store) { const database = await dbReady; return new Promise((resolve, reject) => { const r = database.transaction(store).objectStore(store).getAll(); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }); }
    async function save(store, item) { const database = await dbReady; return new Promise((resolve, reject) => { const r = database.transaction(store, 'readwrite').objectStore(store)[item.id ? 'put' : 'add'](item); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }); }
    async function remove(store, id) { const database = await dbReady; return new Promise((resolve, reject) => { const r = database.transaction(store, 'readwrite').objectStore(store).delete(id); r.onsuccess = resolve; r.onerror = () => reject(r.error); }); }

    async function seed() {
        if (!(await getAll('services')).length) await Promise.all([
            save('services', { name: 'Mâm cỗ bản Mường', category: 'food', status: 'Đang phục vụ', price: 250000, unit: 'set', description: 'Mâm cơm truyền thống với nguyên liệu địa phương.', image: null, createdAt: Date.now() }),
            save('services', { name: 'Tour đạp xe bản Lác', category: 'culture', status: 'Cần đặt trước', price: 180000, unit: 'khách', description: 'Khám phá bản làng và ruộng lúa Mai Châu.', image: null, createdAt: Date.now() })
        ]);
        if (!(await getAll('notes')).length) await save('notes', { icon: 'soup_kitchen', title: 'Mâm cỗ tối đặt trước 16h', content: 'Bếp cần chuẩn bị nguyên liệu trước hai tiếng.' });
    }

    const categoryLabel = c => ({ food: 'Ẩm thực & Bữa ăn', culture: 'Trải nghiệm & Tour', transport: 'Thuê xe & Di chuyển', wellness: 'Tiện ích thư giãn', combo: 'Gói Combo' })[c] || 'Dịch vụ';
    const categoryClass = c => c === 'combo' ? 'bg-tertiary-container text-tertiary-fixed' : 'bg-primary-container/90 text-on-primary';

    async function refreshPage() {
        const services = await getAll('services');
        renderServices(services); renderNotes(await getAll('notes')); populateSelectors(services);
        $('#service-count').textContent = services.filter(s => s.status !== 'Tạm ngưng').length;
        $('#service-revenue').textContent = money(services.reduce((sum, s) => sum + Number(s.price || 0), 0));
    }

    function renderServices(services) {
        document.querySelectorAll('.service-card').forEach(card => card.remove());
        if (sortOrder) services.sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);
        services.forEach(service => $('#card-add-service').insertAdjacentHTML('beforebegin', serviceCard(service)));
        filterServices();
    }

    function serviceCard(s) {
        const image = s.image ? `<img src="${s.image}" alt="${escapeHtml(s.name)}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">` : '<div class="w-full h-full flex items-center justify-center text-outline-variant bg-surface-container"><span class="material-symbols-outlined text-[48px]">image</span></div>';
        const active = s.status !== 'Tạm ngưng';
        const combo = s.category === 'combo' ? `<p class="font-body-sm text-body-sm text-secondary mt-1">${(s.linkedServices || []).length} dịch vụ liên kết</p>` : '';
        return `<article class="service-card flex flex-col bg-surface-container-lowest rounded-xl overflow-visible shadow-[0_2px_8px_rgba(21,67,50,0.05)]" data-id="${s.id}" data-category="${s.category}">
          <div class="relative h-48 w-full overflow-hidden rounded-t-xl bg-surface-container">${image}<span class="absolute top-3 left-3 px-2.5 py-1 rounded-full ${categoryClass(s.category)} font-label-sm text-[11px] font-semibold">${categoryLabel(s.category)}</span><span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-bold shadow-sm">${escapeHtml(s.status)}</span></div>
          <div class="p-space-md flex flex-col flex-1 justify-between gap-space-sm"><div><h3 class="font-headline-sm text-headline-sm text-on-surface leading-tight">${escapeHtml(s.name)}</h3><p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">${escapeHtml(s.description)}</p>${combo}</div><div><div class="flex items-center justify-between py-1.5 px-space-sm bg-surface-container-low rounded-lg"><span class="font-label-sm text-label-sm text-on-surface-variant">Đơn vị: <strong class="text-on-surface">${escapeHtml(s.unit)}</strong></span><span class="font-headline-sm text-headline-sm text-secondary">${money(s.price)}</span></div><div class="flex items-center justify-between pt-2"><label class="flex items-center gap-2 cursor-pointer text-body-sm text-on-surface-variant"><input class="service-status-toggle accent-secondary w-4 h-4" type="checkbox" ${active ? 'checked' : ''}><span>${active ? 'Đang mở bán' : 'Tạm ngưng'}</span></label><div class="relative"><button class="service-menu-btn w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container" aria-label="Tùy chọn dịch vụ"><span class="material-symbols-outlined text-[20px]">more_vert</span></button><div class="service-menu hidden absolute right-0 bottom-9 z-20 min-w-32 rounded-lg bg-surface-container-lowest shadow-lg border border-outline-variant/30 py-1"><button class="action-edit-btn w-full text-left px-3 py-2 text-body-sm hover:bg-surface-container-low"><span class="material-symbols-outlined text-[16px] align-middle mr-1">edit</span>Sửa</button><button class="action-delete-btn w-full text-left px-3 py-2 text-body-sm text-error hover:bg-error-container"><span class="material-symbols-outlined text-[16px] align-middle mr-1">delete</span>Xóa</button></div></div></div></div></div></article>`;
    }

    function renderNotes(notes) {
        $('#notes-container').innerHTML = notes.length ? notes.map(n => `<div class="note-row p-space-sm rounded-lg bg-surface-container-low flex items-start justify-between gap-2.5" data-id="${n.id}"><div class="flex items-start gap-2.5"><span class="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">${escapeHtml(n.icon)}</span><div><p class="font-label-md text-label-md text-on-surface">${escapeHtml(n.title)}</p><p class="font-body-sm text-body-sm text-on-surface-variant">${escapeHtml(n.content)}</p></div></div><div class="flex gap-1"><button class="action-edit-note w-7 h-7 rounded hover:bg-surface-container-highest" title="Sửa ghi chú"><span class="material-symbols-outlined text-[16px]">edit</span></button><button class="action-delete-note w-7 h-7 rounded text-error hover:bg-error-container" title="Xóa ghi chú"><span class="material-symbols-outlined text-[16px]">delete</span></button></div></div>`).join('') : '<p class="font-body-sm text-on-surface-variant">Chưa có ghi chú vận hành.</p>';
    }

    function populateSelectors(services) {
        const items = services.filter(s => s.category !== 'combo');
        $('#update-price-select').innerHTML = items.length ? items.map(s => `<option value="${s.id}">${escapeHtml(s.name)} — ${money(s.price)}</option>`).join('') : '<option value="">Chưa có dịch vụ</option>';
        $('#combo-services-list').innerHTML = items.length ? items.map(s => `<label class="flex items-center gap-2 text-body-sm cursor-pointer"><input type="checkbox" value="${s.id}" class="accent-secondary w-4 h-4"> ${escapeHtml(s.name)} (${money(s.price)})</label>`).join('') : '<p class="text-body-sm text-on-surface-variant">Hãy thêm dịch vụ trước khi tạo combo.</p>';
        setPriceInput();
    }
    function setPriceInput() { const id = Number($('#update-price-select').value); if (id) getAll('services').then(items => { const s = items.find(x => x.id === id); if (s) $('#update-price-value').value = s.price; }); }
    function filterServices() { const tab = $('.service-tab-btn.active')?.dataset.cat || 'all', term = $('input[placeholder="Tìm tên dịch vụ..."]').value.trim().toLocaleLowerCase('vi'); document.querySelectorAll('.service-card').forEach(card => card.classList.toggle('hidden', !((tab === 'all' || card.dataset.category === tab) && card.querySelector('h3').textContent.toLocaleLowerCase('vi').includes(term)))); }
    function openModal(id) {
        $('#modal-overlay').classList.remove('hidden', 'opacity-0');
        document.querySelectorAll('.modal-panel').forEach(panel => panel.classList.add('hidden', 'opacity-0', 'scale-95'));
        const modal = $(`#${id}`);
        modal.classList.remove('hidden', 'opacity-0', 'scale-95');
        modal.classList.add('opacity-100', 'scale-100');
    }
    function closeModal() {
        $('#modal-overlay').classList.add('hidden', 'opacity-0');
        document.querySelectorAll('.modal-panel').forEach(panel => {
            panel.classList.add('hidden', 'opacity-0', 'scale-95');
            panel.classList.remove('opacity-100', 'scale-100');
        });
        resetForms();
    }
    function resetImage(input, preview, placeholder, set) { input.value = ''; preview.src = ''; preview.classList.add('hidden'); placeholder.classList.remove('hidden'); set(null); }
    function resetForms() {
        $('#edit-srv-id').value = ''; $('#add-srv-name').value = ''; $('#add-srv-category').value = 'food'; $('#add-srv-status').value = 'Đang phục vụ'; $('#add-srv-price').value = ''; $('#add-srv-unit').value = ''; $('#add-srv-desc').value = ''; $('#modal-service-title').textContent = 'Thêm dịch vụ / trải nghiệm mới'; resetImage($('#add-srv-image'), $('#preview-img'), $('#preview-placeholder'), x => currentServiceImage = x);
        $('#edit-combo-id').value = ''; $('#combo-name').value = ''; $('#combo-price').value = ''; $('#modal-combo-title').textContent = 'Tạo gói Combo liên kết'; $('#btn-save-combo').textContent = 'Tạo Combo'; document.querySelectorAll('#combo-services-list input').forEach(x => x.checked = false); resetImage($('#add-combo-image'), $('#preview-combo-img'), $('#preview-combo-placeholder'), x => currentComboImage = x);
        $('#edit-note-id').value = ''; $('#note-icon').value = 'soup_kitchen'; $('#note-title').value = ''; $('#note-desc').value = ''; $('#modal-note-title').textContent = 'Thêm ghi chú vận hành';
    }
    function previewFile(input, image, placeholder, set) { const file = input.files[0]; if (!file) return; if (!file.type.startsWith('image/')) return alert('Vui lòng chọn tệp hình ảnh.'); const reader = new FileReader(); reader.onload = () => { set(reader.result); image.src = reader.result; image.classList.remove('hidden'); placeholder.classList.add('hidden'); }; reader.readAsDataURL(file); }
    async function editService(id) { const s = (await getAll('services')).find(x => x.id === id); if (!s) return; if (s.category === 'combo') return editCombo(s); $('#edit-srv-id').value = s.id; $('#add-srv-name').value = s.name; $('#add-srv-category').value = s.category; $('#add-srv-status').value = s.status; $('#add-srv-price').value = s.price; $('#add-srv-unit').value = s.unit; $('#add-srv-desc').value = s.description; currentServiceImage = s.image || null; if (s.image) { $('#preview-img').src = s.image; $('#preview-img').classList.remove('hidden'); $('#preview-placeholder').classList.add('hidden'); } $('#modal-service-title').textContent = 'Chỉnh sửa dịch vụ'; openModal('modal-add-service'); }
    function editCombo(s) { $('#edit-combo-id').value = s.id; $('#combo-name').value = s.name; $('#combo-price').value = s.price; currentComboImage = s.image || null; document.querySelectorAll('#combo-services-list input').forEach(x => x.checked = (s.linkedServices || []).includes(Number(x.value))); if (s.image) { $('#preview-combo-img').src = s.image; $('#preview-combo-img').classList.remove('hidden'); $('#preview-combo-placeholder').classList.add('hidden'); } $('#modal-combo-title').textContent = 'Chỉnh sửa gói Combo liên kết'; $('#btn-save-combo').textContent = 'Lưu Combo'; openModal('modal-combo'); }

    $('#add-srv-image').addEventListener('change', e => previewFile(e.target, $('#preview-img'), $('#preview-placeholder'), x => currentServiceImage = x));
    $('#add-combo-image').addEventListener('change', e => previewFile(e.target, $('#preview-combo-img'), $('#preview-combo-placeholder'), x => currentComboImage = x));
    $('#btn-add-service').addEventListener('click', () => { resetForms(); openModal('modal-add-service'); }); $('#card-add-service').addEventListener('click', () => { resetForms(); openModal('modal-add-service'); }); $('#btn-combo').addEventListener('click', () => { resetForms(); openModal('modal-combo'); }); $('#btn-update-price').addEventListener('click', () => openModal('modal-update-price')); $('#btn-add-note').addEventListener('click', () => { resetForms(); openModal('modal-add-note'); });
    $('#update-price-select').addEventListener('change', setPriceInput); $('#sort-price-select').addEventListener('change', e => { sortOrder = e.target.value; refreshPage(); }); $('input[placeholder="Tìm tên dịch vụ..."]').addEventListener('input', filterServices);
    document.querySelectorAll('.service-tab-btn').forEach(b => b.addEventListener('click', () => { document.querySelectorAll('.service-tab-btn').forEach(x => x.classList.remove('active', 'bg-primary', 'text-on-primary')); b.classList.add('active', 'bg-primary', 'text-on-primary'); filterServices(); }));
    $('#btn-submit-service').addEventListener('click', async () => {
        const id = Number($('#edit-srv-id').value) || null, name = $('#add-srv-name').value.trim(), priceText = $('#add-srv-price').value.trim(), price = Number(priceText);
        if (!name || priceText === '' || !Number.isFinite(price) || price < 0) return notify('Vui lòng nhập tên và giá hợp lệ.', true);
        const service = { name, category: $('#add-srv-category').value, status: $('#add-srv-status').value, price, unit: $('#add-srv-unit').value.trim() || 'khách', description: $('#add-srv-desc').value.trim(), image: currentServiceImage };
        if (id) service.id = id;
        else service.createdAt = Date.now();
        try {
            await save('services', service);
            closeModal();
            await refreshPage();
            notify(id ? 'Đã cập nhật dịch vụ.' : 'Đã thêm dịch vụ mới.');
        } catch (error) {
            console.error('Không thể lưu dịch vụ:', error);
            notify(`Không thể lưu dịch vụ (${error.name || 'lỗi dữ liệu'}).`, true);
        }
    });
    $('#btn-save-price').addEventListener('click', async () => { const id = Number($('#update-price-select').value), price = Number($('#update-price-value').value), s = (await getAll('services')).find(x => x.id === id); if (!s || !Number.isFinite(price) || price < 0) return alert('Vui lòng chọn dịch vụ và nhập giá hợp lệ.'); s.price = price; await save('services', s); closeModal(); refreshPage(); });
    $('#btn-save-combo').addEventListener('click', async () => { const id = Number($('#edit-combo-id').value) || null, name = $('#combo-name').value.trim(), priceText = $('#combo-price').value.trim(), price = Number(priceText), linkedServices = [...document.querySelectorAll('#combo-services-list input:checked')].map(x => Number(x.value)); if (!name || priceText === '' || !Number.isFinite(price) || price < 0 || !linkedServices.length) return notify('Nhập tên, giá và chọn ít nhất một dịch vụ cho Combo.', true); const combo = { name, category: 'combo', status: 'Đang phục vụ', price, unit: 'gói', description: `Gói gồm ${linkedServices.length} dịch vụ liên kết`, image: currentComboImage, linkedServices }; if (id) combo.id = id; else combo.createdAt = Date.now(); try { await save('services', combo); closeModal(); await refreshPage(); notify(id ? 'Đã cập nhật Combo.' : 'Đã tạo Combo mới.'); } catch (error) { console.error('Không thể lưu Combo:', error); notify('Không thể lưu Combo. Vui lòng thử lại.', true); } });
    $('#btn-save-note').addEventListener('click', async () => { const id = Number($('#edit-note-id').value) || undefined, title = $('#note-title').value.trim(); if (!title) return alert('Vui lòng nhập tiêu đề ghi chú.'); await save('notes', { id, icon: $('#note-icon').value, title, content: $('#note-desc').value.trim() }); closeModal(); refreshPage(); });
    document.addEventListener('change', async e => { if (!e.target.classList.contains('service-status-toggle')) return; const s = (await getAll('services')).find(x => x.id === Number(e.target.closest('.service-card').dataset.id)); s.status = e.target.checked ? 'Đang phục vụ' : 'Tạm ngưng'; await save('services', s); refreshPage(); });
    document.addEventListener('click', async e => {
        if (!e.target.closest('.service-menu-btn')) document.querySelectorAll('.service-menu').forEach(x => x.classList.add('hidden'));
        const menu = e.target.closest('.service-menu-btn'); if (menu) return menu.nextElementSibling.classList.toggle('hidden');
        const card = e.target.closest('.service-card'); if (card) { const id = Number(card.dataset.id); if (e.target.closest('.action-edit-btn')) return editService(id); if (e.target.closest('.action-delete-btn')) { const all = await getAll('services'), target = all.find(x => x.id === id), combo = all.find(x => x.category === 'combo' && (x.linkedServices || []).includes(id)); if (combo) return alert(`Không thể xóa “${target.name}” vì đang thuộc Combo “${combo.name}”. Hãy sửa Combo để bỏ dịch vụ này hoặc xóa Combo trước.`); if (confirm(`Xóa “${target.name}”?`)) { await remove('services', id); refreshPage(); } } }
        const note = e.target.closest('.note-row'); if (note) { const id = Number(note.dataset.id); if (e.target.closest('.action-delete-note') && confirm('Xóa ghi chú này?')) { await remove('notes', id); refreshPage(); } if (e.target.closest('.action-edit-note')) { const item = (await getAll('notes')).find(x => x.id === id); $('#edit-note-id').value = id; $('#note-icon').value = item.icon; $('#note-title').value = item.title; $('#note-desc').value = item.content; $('#modal-note-title').textContent = 'Chỉnh sửa ghi chú'; openModal('modal-add-note'); } }
    });
    document.querySelectorAll('.close-modal-btn').forEach(b => b.addEventListener('click', closeModal)); $('#modal-overlay').addEventListener('click', e => { if (e.target === $('#modal-overlay')) closeModal(); });
    dbReady = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = e => {
            db = e.target.result;
            if (!db.objectStoreNames.contains('services')) db.createObjectStore('services', { keyPath: 'id', autoIncrement: true });
            if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        };
        request.onsuccess = e => { db = e.target.result; resolve(db); };
        request.onerror = e => reject(e.target.error);
    });
    dbReady.then(async () => { await seed(); await refreshPage(); }).catch(error => notify(`Không thể khởi tạo IndexedDB (${error.name || 'lỗi trình duyệt'}).`, true));
});
