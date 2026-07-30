 // =====================================================
// NAGESWAR TOURS & TRAVELS
// MAIN JAVASCRIPT FILE
// =====================================================
const CALENDAR_API =
 "https://nageshwar-tours-travels-production.up.railway.app/api/calendar";

(function () {
    if (typeof emailjs !== "undefined") {
        emailjs.init({
            publicKey: "H-iMYvb-_01lsvBSA"
        });
    } else {
        console.warn("EmailJS SDK not loaded - contact form sending will be disabled.");
    }
})();

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================

    const menuBtn = document.querySelector(".menu-btn");
    const navbar = document.querySelector(".navbar");

    if (menuBtn && navbar) {

        menuBtn.addEventListener("click", () => {

            navbar.classList.toggle("active");

            const icon = menuBtn.querySelector("i");

            if (navbar.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });
    }
    // ==========================================
    // CLOSE MOBILE MENU ON LINK CLICK
    // ==========================================

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (navbar) {

                navbar.classList.remove("active");

                if (menuBtn) {

                    const icon = menuBtn.querySelector("i");

                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });
    });

    // ==========================================
    // STICKY HEADER EFFECT
    // ==========================================

    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {

        if (!header) return;

        if (window.scrollY > 80) {

            header.style.padding = "12px 8%";
            header.style.boxShadow =
                "0 10px 25px rgba(0,0,0,0.25)";

        } else {

            header.style.padding = "18px 8%";
            header.style.boxShadow = "none";
        }
    });

    // ==========================================
    // SCROLL TO TOP BUTTON
    // ==========================================

    const scrollBtn = document.createElement("button");

    scrollBtn.id = "scrollTopBtn";

    scrollBtn.innerHTML =
        '<i class="fa-solid fa-arrow-up"></i>';

    document.body.appendChild(scrollBtn);

    Object.assign(scrollBtn.style, {

        position: "fixed",
        bottom: "25px",
        right: "25px",

        width: "50px",
        height: "50px",

        border: "none",
        borderRadius: "50%",

        cursor: "pointer",

        background:
            "linear-gradient(135deg,#00c6ff,#0072ff)",

        color: "#fff",

        fontSize: "18px",

        display: "none",

        zIndex: "999",

        boxShadow:
            "0 8px 20px rgba(0,114,255,.4)"
    });

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            scrollBtn.style.display = "block";

        } else {

            scrollBtn.style.display = "none";
        }
    });

    scrollBtn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,
            behavior: "smooth"
        });
    });

    // ==========================================
    // HERO BUTTON RIPPLE EFFECT
    // ==========================================

    const buttons =
        document.querySelectorAll(
            ".btn-primary, .btn-secondary, .book-btn"
        );

    buttons.forEach(button => {

        button.addEventListener("click", function (e) {

            const ripple =
                document.createElement("span");

            const rect =
                this.getBoundingClientRect();

            const size =
                Math.max(rect.width, rect.height);

            ripple.style.width = size + "px";
            ripple.style.height = size + "px";

            ripple.style.position = "absolute";
            ripple.style.borderRadius = "50%";

            ripple.style.background =
                "rgba(255,255,255,0.4)";

            ripple.style.transform =
                "translate(-50%, -50%)";

            ripple.style.left =
                (e.clientX - rect.left) + "px";

            ripple.style.top =
                (e.clientY - rect.top) + "px";

            ripple.style.pointerEvents = "none";

            ripple.style.animation =
                "ripple 0.6s linear";

            this.style.position = "relative";
            this.style.overflow = "hidden";

            this.appendChild(ripple);

            setTimeout(() => {

                ripple.remove();

            }, 600);
        });
    });

    // ==========================================
    // FADE-IN ON SCROLL
    // ==========================================

    const animatedElements =
        document.querySelectorAll(
            ".feature-card, .car-card, .step"
        );

    const observer =
        new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";
                }
            });

        }, {
            threshold: 0.2
        });

    animatedElements.forEach(item => {

        item.style.opacity = "0";

        item.style.transform =
            "translateY(40px)";

        item.style.transition =
            "all 0.8s ease";

        observer.observe(item);
    });

});

// =====================================================
// RIPPLE ANIMATION CSS
// =====================================================

const rippleStyle = document.createElement("style");

rippleStyle.textContent = `

@keyframes ripple {

    from {

        opacity: 1;
        transform: translate(-50%, -50%) scale(0);
    }

    to {

        opacity: 0;
        transform: translate(-50%, -50%) scale(4);
    }
}

`;

document.head.appendChild(rippleStyle);  


// ==========================================
// CUSTOMER CALENDAR
// ==========================================

async function getBlockedDates() {

    try{

        const response = await fetch(CALENDAR_API);

        return await response.json();

    }

    catch(error){

        console.error(error);

        return [];

    }

}

async function renderCalendar() {

    const calendarGrid = document.getElementById("calendarGrid");
    const monthYear = document.getElementById("monthYear");

    if (!calendarGrid || !monthYear) {
        console.warn('Calendar: missing DOM elements', { calendarGrid: !!calendarGrid, monthYear: !!monthYear });
        return;
    }

    calendarGrid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const totalDays = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    // Empty boxes before first day
    for (let i = 0; i < firstDay; i++) {
        calendarGrid.appendChild(document.createElement("div"));
    }

    const blockedDates =await getBlockedDates();
    const today = new Date();

    for (let day = 1; day <= totalDays; day++) {

        const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dayBox = document.createElement("div");
        dayBox.classList.add("day");
        dayBox.textContent = day;

     const blocked = blockedDates.find(

    d => d.blocked_date.split("T")[0] === dateString

);

if(blocked){

    dayBox.classList.add("booked-date");

}
else{

    dayBox.classList.add("available-date");

}

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayBox.classList.add("today-date");
        }

        calendarGrid.appendChild(dayBox);
    }

}

// Attach month navigation and load calendar when DOM is ready
document.addEventListener("DOMContentLoaded", () => {

    console.info('Calendar: DOMContentLoaded - initializing calendar controls');

    const prevMonth = document.getElementById("prevMonth");
    if (prevMonth) {
        prevMonth.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    const nextMonth = document.getElementById("nextMonth");
    if (nextMonth) {
        nextMonth.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    try {
        window.renderCalendar = renderCalendar;
    } catch (e) {
        // ignore if assignment not allowed
    }

    renderCalendar();

});

// ==========================================
// CONTACT FORM
// ==========================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const submitBtn = contactForm.querySelector("button");

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending...";

        if (typeof emailjs === "undefined") {
            alert("❌ Email service is not available right now. Please call us instead.");
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Send Message";
            return;
        }

        emailjs.sendForm(
            "service_q0m5g7f",
            "template_t0sryai",
            this
        )

        .then(function () {

           contactForm.reset();

           submitBtn.disabled = false;
           submitBtn.innerHTML = "Send Message";

            const popup = document.getElementById("successPopup");

popup.classList.add("show");
        })

        .catch(function (error) {

            console.error(error);

            alert("❌ Failed to send message. Please try again.");

            submitBtn.disabled = false;
            submitBtn.innerHTML = "Send Message";

        });

    });
   
   }  


   const popup = document.getElementById("successPopup");
const popupCloseBtn = document.getElementById("popupCloseBtn");

if (popup && popupCloseBtn) {

    popupCloseBtn.addEventListener("click", () => {

        popup.classList.remove("show");

    });

}
 

// =====================================================
// END OF FILE
// =====================================================
