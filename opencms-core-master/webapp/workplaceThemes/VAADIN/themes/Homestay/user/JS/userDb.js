window.HomestayUserDB = (() => {
    const DB_NAME = 'HomestayUserDB', VERSION = 3;
    let ready;
    function open() {
        if (ready) return ready;
        ready = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, VERSION);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('favorites')) db.createObjectStore('favorites', { keyPath: 'id' });
                if (!db.objectStoreNames.contains('serviceBookings')) db.createObjectStore('serviceBookings', { keyPath: 'id' });
                if (!db.objectStoreNames.contains('homestays')) db.createObjectStore('homestays', { keyPath: 'id' });
                if (!db.objectStoreNames.contains('selectedHomestay')) db.createObjectStore('selectedHomestay', { keyPath: 'id' });
            };
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = () => reject(request.error);
        });
        return ready;
    }
    async function all(store) { const db = await open(); return new Promise((resolve, reject) => { const r = db.transaction(store).objectStore(store).getAll(); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }); }
    async function put(store, item) { const db = await open(); return new Promise((resolve, reject) => { const r = db.transaction(store, 'readwrite').objectStore(store).put(item); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }); }
    async function remove(store, id) { const db = await open(); return new Promise((resolve, reject) => { const r = db.transaction(store, 'readwrite').objectStore(store).delete(id); r.onsuccess = resolve; r.onerror = () => reject(r.error); }); }
    async function ensureSearchData() {
        const existing = await all('homestays');
        if (existing.length) {
            const proudStay = existing.find(item => item.id === 'hs-hoian-river');
            if (proudStay && !Array.isArray(proudStay.travelGroups)) proudStay.travelGroups = [];
            if (proudStay && !proudStay.travelGroups.includes('Travel Proud (thân thiện với cộng đồng LGBTQ+)')) {
                proudStay.travelGroups.push('Travel Proud (thân thiện với cộng đồng LGBTQ+)');
                await put('homestays', proudStay);
            }
            return;
        }
        const homestays = [
            { id: 'hs-maichau-moc', name: 'Nhà Sàn Mộc', location: 'Mai Châu, Hòa Bình', address: 'Bản Lác, Mai Châu, Hòa Bình', description: 'Nhà sàn truyền thống giữa thung lũng, phù hợp cho kỳ nghỉ yên tĩnh và trải nghiệm văn hóa bản địa.', image: '../images/categories/4_nha_que_truyen_thong.jpg', pricePerNight: 650000, maxGuests: 6, rating: 4.8, reviewCount: 42, stars: 4, services: ['Trekking', 'Ẩm thực bản địa', 'Đạp xe bản làng'], roomAmenities: ['Phòng tắm riêng', 'Ban công', 'Quạt máy'], amenities: ['Wi‑Fi miễn phí', 'Bãi đỗ xe', 'Nhà hàng', 'Sân vườn'], travelGroups: ['Gia đình', 'Cặp đôi', 'LGPT'], featured: true },
            { id: 'hs-maichau-cloud', name: 'Mây Trôi Valley Lodge', location: 'Mai Châu, Hòa Bình', address: 'Bản Pom Coọng, Mai Châu, Hòa Bình', description: 'Lodge gỗ ấm cúng, có không gian ngắm núi và phục vụ tour khám phá bản làng.', image: '../images/categories/7_thien_nhien_sinh_thai.jpg', pricePerNight: 920000, maxGuests: 4, rating: 4.9, reviewCount: 58, stars: 4, services: ['Tour bản làng', 'Ngâm chân thảo mộc'], roomAmenities: ['Máy điều hòa', 'Phòng tắm riêng', 'Ban công'], amenities: ['Wi‑Fi miễn phí', 'Bữa sáng', 'Bãi đỗ xe'], travelGroups: ['Cặp đôi', 'Gia đình'], featured: true },
            { id: 'hs-dalat-pine', name: 'Pine Hill Retreat', location: 'Đà Lạt, Lâm Đồng', address: 'Đường Ankroet, Đà Lạt, Lâm Đồng', description: 'Không gian nhà gỗ bên đồi thông, có bếp chung và khu đốt lửa trại.', image: '../images/categories/10_kham_pha_lang_que.jpg', pricePerNight: 780000, maxGuests: 8, rating: 4.7, reviewCount: 35, stars: 4, services: ['Đốt lửa trại', 'Tour săn mây'], roomAmenities: ['Bếp nhỏ', 'Nước nóng', 'Ban công'], amenities: ['Wi‑Fi miễn phí', 'Bãi đỗ xe', 'Khu BBQ'], travelGroups: ['Nhóm bạn', 'Gia đình', 'Cho phép mang theo vật nuôi'], featured: false },
            { id: 'hs-hoian-river', name: 'Riverside Garden Homestay', location: 'Hội An, Quảng Nam', address: 'Cẩm Thanh, Hội An, Quảng Nam', description: 'Homestay ven sông với vườn xanh, gần làng rau Trà Quế và phố cổ Hội An.', image: '../images/categories/3_song_nuoc.jpg', pricePerNight: 540000, maxGuests: 3, rating: 4.6, reviewCount: 27, stars: 3, services: ['Đi thuyền thúng', 'Lớp nấu ăn'], roomAmenities: ['Phòng tắm riêng', 'Máy điều hòa', 'Minibar'], amenities: ['Wi‑Fi miễn phí', 'Xe đạp miễn phí', 'Đưa đón sân bay'], travelGroups: ['Cặp đôi', 'Du lịch một mình', 'Travel Proud (thân thiện với cộng đồng LGBTQ+)'], featured: false },
            { id: 'hs-sapa-farm', name: 'Tả Van Farmstay', location: 'Sa Pa, Lào Cai', address: 'Tả Van, Sa Pa, Lào Cai', description: 'Farmstay mộc mạc với ruộng bậc thang, hoạt động làm nông và trải nghiệm đời sống bản địa.', image: '../images/categories/2_nong_trai.jpg', pricePerNight: 480000, maxGuests: 10, rating: 4.8, reviewCount: 49, stars: 3, services: ['Làm nông', 'Trekking', 'Thuê trang phục dân tộc'], roomAmenities: ['Phòng gia đình', 'Chăn điện', 'Phòng tắm riêng'], amenities: ['Wi‑Fi miễn phí', 'Nhà hàng', 'Bãi đỗ xe'], travelGroups: ['Gia đình', 'Nhóm bạn', 'Khách du lịch ba lô'], featured: true }
        ];
        await Promise.all(homestays.map(item => put('homestays', item)));
    }
    return { all, put, remove, ensureSearchData };
})();
