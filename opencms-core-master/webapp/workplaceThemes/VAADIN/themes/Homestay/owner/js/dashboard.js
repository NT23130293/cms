document.addEventListener("DOMContentLoaded", function () {

    initRevenueChart();
    initPagination();
    initQuickActions();

});


function initRevenueChart() {
    const canvas = document.getElementById("revenueChart");
    if (!canvas) {
        return;
    }
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(21, 139, 102, 0.25)");
    gradient.addColorStop(1, "rgba(21, 139, 102, 0.02)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["11/09", "12/09", "13/09", "14/09", "15/09", "16/09", "17/09"],
            datasets: [{
                label: "Doanh thu",
                data: [3500000, 7000000, 5800000, 8200000, 11200000, 10500000, 15000000],
                borderColor: "#168B66",
                backgroundColor: gradient,
                borderWidth: 2,
                pointBackgroundColor: "#168B66",
                pointBorderColor: "#FFFFFF",
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: "index"
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: "rgba(12, 76, 59, 0.95)",
                    titleColor: "#FFFFFF",
                    bodyColor: "#FFFFFF",
                    displayColors: false,
                    padding: 10,
                    cornerRadius: 7,
                    callbacks: {
                        label: function (context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: { color: "#8B9994", font: { size: 9 } }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: 20000000,
                    border: { display: false },
                    grid: { color: "#EDF2F0" },
                    ticks: {
                        stepSize: 5000000,
                        color: "#8B9994",
                        font: { size: 9 },
                        callback: function (value) {
                            if (value === 0) {
                                return "0";
                            }
                            return (value / 1000000) + "tr";
                        }
                    }
                }
            }
        }
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(value);
}

function initPagination() {

    const buttons =
        document.querySelectorAll(
            ".pagination button"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const value =
                    this.textContent.trim();


                if (
                    value === "" ||
                    this.querySelector(
                        ".material-symbols-outlined"
                    )
                ) {

                    return;

                }


                buttons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );

            }
        );

    });

}

function initQuickActions() {

    const buttons =
        document.querySelectorAll(
            ".quick-actions button"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const action =
                    this.textContent.trim();

                console.log(
                    "Quick action:",
                    action
                );

            }
        );

    });

}