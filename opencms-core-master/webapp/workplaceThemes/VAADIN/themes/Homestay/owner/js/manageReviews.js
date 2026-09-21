document.addEventListener("DOMContentLoaded", function() {
    // Logic xử lý lọc đánh giá
    const filterButtons = document.querySelectorAll("#filter-buttons .filter-btn");
    const reviewCards = document.querySelectorAll(".lg\\:col-span-8 > div"); // Chọn các thẻ đánh giá ở cột trái

    filterButtons.forEach(button => {
        button.addEventListener("click", function() {
            const filterValue = this.getAttribute("data-filter");

            // 1. Cập nhật giao diện nút active
            filterButtons.forEach(btn => {
                btn.classList.remove("bg-primary", "text-on-primary", "shadow-sm");
                btn.classList.add("bg-surface-container-low", "text-on-surface-variant");
            });

            this.classList.remove("bg-surface-container-low", "text-on-surface-variant");
            this.classList.add("bg-primary", "text-on-primary", "shadow-sm");

            // 2. Ẩn / Hiển thị các bài đánh giá tương ứng
            reviewCards.forEach(card => {
                const rating = card.getAttribute("data-rating");
                const isReplied = card.getAttribute("data-replied") === "true";

                if (filterValue === "all") {
                    card.style.display = "flex";
                } else if (filterValue === "unreplied") {
                    card.style.display = !isReplied ? "flex" : "none";
                } else {
                    // Lọc theo số sao (5, 4, 3, 2, 1)
                    card.style.display = (rating === filterValue) ? "flex" : "none";
                }
            });
        });
    });
});