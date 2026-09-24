document.addEventListener('DOMContentLoaded', async () => {
    const list = document.querySelector('.hotel-list');
    const title = document.querySelector('.results-header h2');
    const toast = document.getElementById('result-toast');
    const params = new URLSearchParams(window.location.search);
    let homestays = [];
    let favoriteIds = new Set();
    const filters = { services: new Set(), roomAmenities: new Set(), amenities: new Set(), travelGroups: new Set(), minPrice: '', maxPrice: '' };

    const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
    const showToast = message => { toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600); };
    const formatRating = rating => Number(rating || 0).toLocaleString('vi-VN', { maximumFractionDigits: 1 });
    const ratingText = rating => rating >= 9 ? 'Xuất sắc' : rating >= 8 ? 'Rất tốt' : rating >= 7 ? 'Tốt' : 'Mới';

    function readHomestays() {
        return HomestayUserDB.all('homestays');
    }

    function matchesQuery(item) {
        const keyword = (params.get('q') || params.get('destination') || '').trim().toLocaleLowerCase('vi');
        if (!keyword) return true;
        const guestSpec = params.get('guests') || '';
        const guestCount = Number((guestSpec.match(/^\d+/) || [0])[0]);
        if (guestCount && Number(item.maxGuests || item.capacity || 0) && Number(item.maxGuests || item.capacity) < guestCount) return false;
        return [item.name, item.address, item.location, item.description].filter(Boolean).join(' ').toLocaleLowerCase('vi').includes(keyword);
    }

    function values(item, key) { const value = item[key]; return Array.isArray(value) ? value : value ? [value] : []; }
    function matchesFilters(item) {
        const price = Number(item.pricePerNight ?? item.price ?? 0);
        if (filters.minPrice !== '' && price < Number(filters.minPrice)) return false;
        if (filters.maxPrice !== '' && price > Number(filters.maxPrice)) return false;
        return ['services', 'roomAmenities', 'amenities', 'travelGroups'].every(key => !filters[key].size || [...filters[key]].every(value => values(item, key).includes(value)));
    }

    function renderSidebar() {
        const host = document.getElementById('search-filter-groups');
        const groups = [
            ['services', 'Dịch vụ & trải nghiệm'], ['roomAmenities', 'Tiện nghi phòng'], ['amenities', 'Tiện nghi homestay'], ['travelGroups', 'Nhóm du lịch phù hợp']
        ];
        const options = key => [...new Set(homestays.flatMap(item => values(item, key)))].sort((a, b) => String(a).localeCompare(String(b), 'vi'));
        host.innerHTML = `<section class="filter-group"><h3>Giá mỗi đêm</h3><div class="price-range"><input id="filter-min-price" type="number" min="0" placeholder="Từ (VNĐ)" value="${filters.minPrice}"><input id="filter-max-price" type="number" min="0" placeholder="Đến (VNĐ)" value="${filters.maxPrice}"></div></section>` + groups.map(([key, label]) => {
            const list = options(key);
            return `<section class="filter-group"><h3>${label}</h3>${list.length ? list.map(option => `<label class="filter-option"><input type="checkbox" data-filter="${key}" value="${escapeHtml(option)}" ${filters[key].has(option) ? 'checked' : ''}><span>${escapeHtml(option)}</span><small>${homestays.filter(item => values(item, key).includes(option)).length}</small></label>`).join('') : '<p class="text-empty">Chưa có dữ liệu.</p>'}</section>`;
        }).join('');
    }

    function render() {
        const selected = homestays.filter(item => matchesQuery(item) && matchesFilters(item));
        const keyword = params.get('q') || params.get('destination') || 'Tất cả điểm đến';
        title.textContent = `${keyword}: tìm thấy ${selected.length} chỗ nghỉ`;
        list.innerHTML = selected.length ? selected.map(item => {
            const rating = Number(item.rating || 0);
            const price = Number(item.pricePerNight || item.price || 0).toLocaleString('vi-VN');
            const image = item.image ? `<img src="${item.image}" alt="${escapeHtml(item.name)}">` : `<div class="hotel-image-placeholder"><span class="material-symbols-outlined">holiday_village</span></div>`;
            const stars = '★'.repeat(Math.max(1, Math.min(5, Number(item.stars || 4))));
            return `<article class="hotel-card mui-shadow" data-id="${escapeHtml(item.id)}" data-rating="${rating}" data-name="${escapeHtml(item.name)}">
                <div class="hotel-image">${image}<button class="btn-favorite" aria-label="Lưu chỗ nghỉ" aria-pressed="${favoriteIds.has(item.id)}"><i class="fa-${favoriteIds.has(item.id) ? 'solid' : 'regular'} fa-heart"></i></button></div>
                <div class="hotel-info"><div class="info-main"><h3 class="hotel-title">${escapeHtml(item.name)} <span class="stars">${stars}</span></h3><div class="hotel-location"><a href="#">${escapeHtml(item.address || item.location || 'Đang cập nhật địa chỉ')}</a></div><div class="hotel-distance">${escapeHtml(item.distance || 'Thông tin khoảng cách đang cập nhật')}</div><p class="hotel-desc">${escapeHtml(item.description || 'Homestay đang cập nhật thông tin chi tiết.')}</p></div>
                <div class="info-action"><div class="rating-section"><div class="rating-text"><div class="rating-word">${ratingText(rating)}</div><div class="rating-count">${Number(item.reviewCount || 0)} đánh giá</div></div><div class="rating-score">${formatRating(rating)}</div></div><div class="location-score">${price ? `Giá: <strong>${price} VNĐ</strong> / đêm` : 'Chưa có giá'}</div><button class="btn-primary mui-btn choose-stay">Xem chi tiết</button></div></div></article>`;
        }).join('') : `<div class="empty-results"><span class="material-symbols-outlined">travel_explore</span><h3>Chưa tìm thấy chỗ nghỉ phù hợp</h3><p>Hãy thử đổi địa điểm tìm kiếm hoặc quay lại sau khi chủ homestay đã thêm cơ sở.</p></div>`;
    }

    // Hàm thực hiện sắp xếp mảng homestays
    function sortHomestays(dataList, sortBy) {
        return dataList.sort((a, b) => {
            const priceA = Number(a.pricePerNight || a.price || 0);
            const priceB = Number(b.pricePerNight || b.price || 0);

            switch (sortBy) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'name-asc':
                    return String(a.name).localeCompare(String(b.name), 'vi');
                case 'name-desc':
                    return String(b.name).localeCompare(String(a.name), 'vi');
                case 'rating':
                    return Number(b.rating || 0) - Number(a.rating || 0);
                case 'recommended':
                default:
                    return Number(b.featured || 0) - Number(a.featured || 0);
            }
        });
    }

    // Quản lý Custom Dropdown
    const customSelect = document.getElementById('custom-sort');
    if (customSelect) {
        const selectedText = customSelect.querySelector('.selected-option');
        const selectItems = customSelect.querySelector('.select-items');
        const options = customSelect.querySelectorAll('.select-option');

        // Bật/Tắt menu khi click vào nút
        customSelect.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !selectItems.classList.contains('hide');
            selectItems.classList.toggle('hide', isOpen);
            customSelect.classList.toggle('open', !isOpen);
        });

        // Chọn option
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.dataset.value;

                // Cập nhật giao diện active
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                selectedText.textContent = option.textContent;

                // Đóng menu
                selectItems.classList.add('hide');
                customSelect.classList.remove('open');

                // Sắp xếp và render lại
                sortHomestays(homestays, value);
                render();
            });
        });

        // Tự động đóng menu khi click ra ngoài
        document.addEventListener('click', () => {
            selectItems.classList.add('hide');
            customSelect.classList.remove('open');
        });
    }

    document.getElementById('search-sidebar-placeholder').addEventListener('change', event => {
        const input = event.target;
        if (input.matches('[data-filter]')) { filters[input.dataset.filter][input.checked ? 'add' : 'delete'](input.value); render(); }
        if (input.id === 'filter-min-price' || input.id === 'filter-max-price') { filters[input.id === 'filter-min-price' ? 'minPrice' : 'maxPrice'] = input.value; render(); }
    });
    document.getElementById('search-sidebar-placeholder').addEventListener('click', event => { if (event.target.id === 'clear-filters') { Object.values(filters).forEach(value => value instanceof Set ? value.clear() : null); filters.minPrice = ''; filters.maxPrice = ''; renderSidebar(); render(); } });
    document.querySelectorAll('.btn-view').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.btn-view').forEach(item => item.classList.remove('active')); button.classList.add('active'); list.classList.toggle('compact-view', button.textContent.includes('dọc')); }));

    list.addEventListener('click', async event => {
        const card = event.target.closest('.hotel-card');
        if (!card) return;
        const id = card.dataset.id;
        const favorite = event.target.closest('.btn-favorite');
        if (favorite) {
            const isFavorite = favoriteIds.has(id);
            try { if (isFavorite) { await HomestayUserDB.remove('favorites', id); favoriteIds.delete(id); } else { await HomestayUserDB.put('favorites', { id, savedAt: Date.now(), type: 'homestay' }); favoriteIds.add(id); } favorite.classList.toggle('active', !isFavorite); favorite.setAttribute('aria-pressed', String(!isFavorite)); favorite.querySelector('i').className = `fa-${isFavorite ? 'regular' : 'solid'} fa-heart`; showToast(isFavorite ? 'Đã bỏ khỏi danh sách yêu thích.' : 'Đã thêm vào danh sách yêu thích.'); } catch (_) { showToast('Không thể cập nhật yêu thích.'); }
            return;
        }
        if (event.target.closest('.choose-stay')) {
            await HomestayUserDB.put('selectedHomestay', { id: 'current', homestayId: id, selectedAt: Date.now() });
            window.location.href = `homestayDetail.html?id=${encodeURIComponent(id)}`;
        }
    });

    try {
        let sidebar;
        try { sidebar = await fetch('searchSidebar.html').then(response => { if (!response.ok) throw new Error('Không tải được sidebar'); return response.text(); }); }
        catch (_) { sidebar = '<aside class="search-filter-sidebar"><div class="filter-heading"><span class="material-symbols-outlined">tune</span><div><h2>Bộ lọc tìm kiếm</h2><p>Chọn theo nhu cầu lưu trú</p></div><button id="clear-filters" class="filter-clear" type="button">Xóa lọc</button></div><div id="active-filter-summary" class="active-filter-summary" hidden></div><div id="search-filter-groups" class="filter-groups"></div></aside>'; }
        document.getElementById('search-sidebar-placeholder').innerHTML = sidebar;
        await HomestayUserDB.ensureSearchData();
        [homestays, favoriteIds] = [await readHomestays(), new Set((await HomestayUserDB.all('favorites')).filter(item => item.type === 'homestay').map(item => String(item.id)))];

        // Lấy lựa chọn sắp xếp active hiện tại từ Custom Dropdown
        const activeOption = customSelect?.querySelector('.select-option.active');
        const initialSort = activeOption?.dataset.value || 'recommended';
        sortHomestays(homestays, initialSort);

        renderSidebar();
        render();
    } catch (error) { list.innerHTML = '<div class="empty-results"><h3>Không thể tải dữ liệu</h3><p>Vui lòng tải lại trang.</p></div>'; }
});