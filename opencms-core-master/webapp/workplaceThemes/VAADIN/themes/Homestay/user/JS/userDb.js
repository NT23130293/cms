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
    return { all, put, remove };
})();
