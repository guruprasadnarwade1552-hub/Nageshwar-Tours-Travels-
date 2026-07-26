 /* ==========================================
   DRIVENOW ADMIN PANEL
   Core admin UI: sidebar, theme toggle, calendar
   (Cars handled by admin-cars.js, Bookings by admin-bookings.js)
========================================== */
 
const BOOKING_API =
"http://localhost:5000/api/bookings";

const CAR_API =
"http://localhost:5000/api/cars";
// ==========================
// MOBILE SIDEBAR
// ==========================

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");

function openSidebar() {
    sidebar.classList.add("show");
    if (sidebarOverlay) sidebarOverlay.classList.add("show");
}

function closeSidebar() {
    sidebar.classList.remove("show");
    if (sidebarOverlay) sidebarOverlay.classList.remove("show");
}

if (menuBtn && sidebar) {

    // Hamburger opens/closes the sidebar
    menuBtn.addEventListener("click", () => {

        if (sidebar.classList.contains("show")) {
            closeSidebar();
        } else {
            openSidebar();
        }

    });

    // Dedicated close (X) button inside the sidebar
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener("click", closeSidebar);
    }

    // Tapping the dimmed backdrop closes the sidebar
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }

    // Pressing Escape closes the sidebar
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && sidebar.classList.contains("show")) {
            closeSidebar();
        }
    });

    // Tapping any nav link closes the sidebar (mobile only —
    // on desktop the sidebar never has the "show" class, so
    // this is a no-op there)
    sidebar.querySelectorAll(".menu a").forEach(link => {
        link.addEventListener("click", () => {
            if (sidebar.classList.contains("show")) {
                closeSidebar();
            }
        });
    });

}

// ==========================
// THEME TOGGLE (light/dark)
// ==========================

const themeToggle = document.getElementById("themeToggle");

function setThemeIcon(isDark) {

    const icon = themeToggle.querySelector("i");
    if (!icon) return;

    icon.classList.toggle("fa-moon", !isDark);
    icon.classList.toggle("fa-sun", isDark);

}

if (themeToggle) {

    // Restore saved theme preference on load
    const isDark = localStorage.getItem("adminTheme") === "dark";

    if (isDark) {
        document.body.classList.add("dark-theme");
    }

    setThemeIcon(isDark);

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark-theme");

        const nowDark = document.body.classList.contains("dark-theme");

        localStorage.setItem("adminTheme", nowDark ? "dark" : "light");

        setThemeIcon(nowDark);

    });

}

// ==========================
// ADMIN READY
// ==========================

console.log(
    "%cDriveNow Admin Ready 🚗",
    "color:#5b5eff;font-size:18px;font-weight:bold;"
);

/* ==========================
   CALENDAR MANAGEMENT
   Lets admin block/unblock dates for bookings.
   Blocked dates are stored under "blockedDates" in localStorage.
========================== */

const adminCalendarGrid = document.getElementById("adminCalendarGrid");
const adminMonthYear = document.getElementById("adminMonthYear");

let adminCurrentDate = new Date();

function getBlockedDates() {

    try {
        const stored = JSON.parse(localStorage.getItem("blockedDates"));
        return Array.isArray(stored) ? stored : [];
    } catch (err) {
        // Corrupt data in localStorage shouldn't crash the calendar
        console.error("Could not read blockedDates, resetting.", err);
        return [];
    }

}

function saveBlockedDates(blockedDates) {

    localStorage.setItem("blockedDates", JSON.stringify(blockedDates));

}

function toggleBlockedDate(dateString) {

    let blockedDates = getBlockedDates();

    if (blockedDates.includes(dateString)) {
        blockedDates = blockedDates.filter(d => d !== dateString);
    } else {
        blockedDates.push(dateString);
    }

    saveBlockedDates(blockedDates);

}

function renderAdminCalendar() {

    if (!adminCalendarGrid || !adminMonthYear) return;

    adminCalendarGrid.innerHTML = "";

    const year = adminCurrentDate.getFullYear();
    const month = adminCurrentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    adminMonthYear.textContent = adminCurrentDate.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    // Leading blanks so day 1 lines up under the correct weekday
    for (let i = 0; i < firstDay; i++) {
        adminCalendarGrid.appendChild(document.createElement("div"));
    }

    const blockedDates = getBlockedDates();
    const today = new Date();

    for (let day = 1; day <= totalDays; day++) {

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dayBox = document.createElement("div");
        dayBox.classList.add("admin-day");
        dayBox.textContent = day;

        if (blockedDates.includes(dateString)) {
            dayBox.classList.add("admin-booked");
        }

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayBox.classList.add("admin-today");
        }

        dayBox.addEventListener("click", () => {
            toggleBlockedDate(dateString);
            renderAdminCalendar();
        });

        adminCalendarGrid.appendChild(dayBox);

    }

}

/* PREVIOUS MONTH */

const prevMonthAdmin = document.getElementById("prevMonthAdmin");

if (prevMonthAdmin) {

    prevMonthAdmin.addEventListener("click", () => {
        adminCurrentDate.setMonth(adminCurrentDate.getMonth() - 1);
        renderAdminCalendar();
    });

}

/* NEXT MONTH */

const nextMonthAdmin = document.getElementById("nextMonthAdmin");

if (nextMonthAdmin) {

    nextMonthAdmin.addEventListener("click", () => {
        adminCurrentDate.setMonth(adminCurrentDate.getMonth() + 1);
        renderAdminCalendar();
    });

}

/* LOAD CALENDAR ON START */

document.addEventListener("DOMContentLoaded", renderAdminCalendar); 

async function loadAdvancedAnalytics(){

    const bookingsRes =
    await fetch(BOOKING_API);

    const bookings =
    await bookingsRes.json();

    const carsRes =
    await fetch(CAR_API);

    const cars =
    await carsRes.json();

    // Available Cars

    const availableCars =
    cars.filter(
        c => c.status === "available"
    ).length;

    document.getElementById(
        "availableCars"
    ).innerHTML =

    `
    <h2>${availableCars}</h2>
    <p>Available Cars</p>
    `;

    // Completed Trips

    const completedTrips =
    bookings.filter(
        b => b.status === "completed"
    ).length;

    document.getElementById(
        "completedTrips"
    ).innerHTML =

    `
    <h2>${completedTrips}</h2>
    <p>Completed Trips</p>
    `;

    // Most Booked Vehicle

    const vehicleCount = {};

    bookings.forEach(b=>{

        vehicleCount[b.car_name] =
        (vehicleCount[b.car_name] || 0)+1;

    });

    let topVehicle = "";
    let topCount = 0;

    for(const car in vehicleCount){

        if(vehicleCount[car] > topCount){

            topVehicle = car;
            topCount = vehicleCount[car];

        }

    }

    document.getElementById(
        "topVehicle"
    ).innerHTML =

    `
    <h3>${topVehicle || "-"}</h3>
    <p>${topCount} Bookings</p>
    `;

    // Top Customer

    const customerCount = {};

    bookings.forEach(b=>{

        customerCount[b.customer_name] =
        (customerCount[b.customer_name] || 0)+1;

    });

    let topCustomer = "";
    let customerBookings = 0;

    for(const customer in customerCount){

        if(customerCount[customer] > customerBookings){

            topCustomer = customer;
            customerBookings =
            customerCount[customer];

        }

    }

    document.getElementById(
        "topCustomer"
    ).innerHTML =

    `
    <h3>${topCustomer || "-"}</h3>
    <p>${customerBookings} Bookings</p>
    `;  


    const monthlyRevenue =
bookings.reduce(

    (sum, booking) =>

    sum + Number(
        booking.total_price || 0
    ),

    0

);

document.getElementById(
    "monthlyRevenue"
).innerHTML =

`
<h2>₹${monthlyRevenue}</h2>
<p>Total Revenue</p>
`;

document.getElementById(
    "bookingTrend"
).innerHTML =

`
<h2>${bookings.length}</h2>
<p>Total Bookings</p>
`;
}

async function loadRevenueChart(){

    const response =
    await fetch(BOOKING_API);

    const bookings =
    await response.json();

    const labels = [];
    const revenueData = [];

    for(let i=6;i>=0;i--){

        const d =
        new Date();

        d.setDate(
            d.getDate()-i
        );

        const dateString =
        d.toISOString()
        .split("T")[0];

        labels.push(dateString);

        const revenue =
        bookings
        .filter(

            b =>

            b.pickup_date
            ?.split("T")[0]

            === dateString

            &&

            b.status === "completed"

        )

        .reduce(

            (sum,b)=>

            sum +

            Number(
                b.total_price || 0
            ),

            0

        );

        revenueData.push(
            revenue
        );

    }

    new Chart(

        document.getElementById(
            "revenueChart"
        ),

        {

            type:"line",

            data:{

                labels,

                datasets:[{

                    label:
                    "Revenue",

                    data:
                    revenueData,

                    tension:0.4,

                    fill:false

                }]

            }

        }

    );

}

loadAdvancedAnalytics();
loadRevenueChart();   

 
// ===========================
// LOGOUT POPUP
// ===========================

const logoutBtn =
document.getElementById("logoutBtn");

const logoutPopup =
document.getElementById("logoutPopup");

const cancelLogout =
document.getElementById("cancelLogout");

const confirmLogout =
document.getElementById("confirmLogout");

logoutBtn.addEventListener("click",()=>{

    logoutPopup.classList.add("show");

});

cancelLogout.addEventListener("click",()=>{

    logoutPopup.classList.remove("show");

});

confirmLogout.addEventListener("click",()=>{

    localStorage.removeItem("adminToken");

    window.location.replace("admin-login.html");

});  

logoutPopup.addEventListener("click",(e)=>{

    if(e.target===logoutPopup){

        logoutPopup.classList.remove("show");

    }

});