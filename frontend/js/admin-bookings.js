/* ==========================================
   DRIVENOW ADMIN PANEL — BOOKING MANAGEMENT
   Talks to the real backend at BOOKING_API.
========================================== */


let allBookings = [];

/* =========================
   LOAD BOOKINGS
========================= */

async function loadBookings() {

    const table = document.getElementById("bookingTable");
    if (!table) return;

    table.innerHTML = `<tr><td colspan="15">Loading bookings...</td></tr>`;

    try {

        const response = await fetch(BOOKING_API);

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const bookings = await response.json();
        allBookings = Array.isArray(bookings) ? bookings : [];

        if (allBookings.length === 0) {
            table.innerHTML = `<tr><td colspan="15">No bookings yet.</td></tr>`;
            updateBookingStats(allBookings);
            return;
        }

        table.innerHTML = allBookings.map(booking => `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.customer_name || "N/A"}</td>
                <td>${booking.phone || "-"}</td>
                <td>${booking.car_name || "N/A"}</td>
                <td>${booking.pickup_location || "-"}</td>
                <td>${booking.destination_location || "-"}</td>
                <td>${booking.pickup_date || "-"}</td>
                <td>${booking.pickup_time || "-"}</td>
                <td>${booking.passengers ?? "-"}</td>
                <td>${booking.total_km ?? "-"}</td>
                <td>₹${booking.rate_per_km ?? 0}</td>
                <td>₹${booking.total_price ?? 0}</td>
                <td>₹${booking.advance_amount || 0}</td>
                <td>
                    <span class="status-badge ${booking.status || ''}">
                        ${booking.status || "pending"}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button type="button" class="view-btn" onclick="viewBooking(${booking.id})">View</button>
                        <button type="button" class="approve-btn" onclick="approveBooking(${booking.id})">Approve</button>
                        <button type="button" class="complete-btn" onclick="completeBooking(${booking.id})">Complete</button>
                        <button type="button" class="reject-btn" onclick="rejectBooking(${booking.id})">Reject</button>
                        <button type="button" class="delete-btn" onclick="deleteBooking(${booking.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `).join("");

        updateBookingStats(allBookings);
        applyBookingFilters();

    } catch (error) {

        console.error("Load Bookings Error:", error);

        table.innerHTML = `
            <tr>
                <td colspan="15">
                    Could not load bookings. Is the server running at ${BOOKING_API}?
                </td>
            </tr>
        `;

    }

}

/* =========================
   DASHBOARD STATS (bookings)
========================= */

function updateBookingStats(bookings) {

    const totalBookingsEl = document.getElementById("totalBookings");
    const pendingBookingsEl = document.getElementById("pendingBookings");
    const totalRevenueEl = document.getElementById("totalRevenue");

    if (totalBookingsEl) {
        totalBookingsEl.textContent = bookings.length;
    }

    if (pendingBookingsEl) {
        const pending = bookings.filter(b => b.status === "pending").length;
        pendingBookingsEl.textContent = pending;
    }

    if (totalRevenueEl) {

        const revenue = bookings
            .filter(b => b.status === "completed")
            .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

        totalRevenueEl.textContent = `₹${revenue.toLocaleString("en-IN")}`;

    }

}

/* =========================
   VIEW BOOKING (modal)
========================= */

function viewBooking(id) {

    const booking = allBookings.find(b => b.id == id);
    if (!booking) return;

    const detailsEl = document.getElementById("bookingDetails");
    if (!detailsEl) return;

    detailsEl.innerHTML = `
        <div class="booking-details">

            <div class="booking-section">
                <h4>Personal Details</h4>
                <p><b>Customer:</b> ${booking.customer_name || "-"}</p>
                <p><b>Phone:</b> ${booking.phone || "-"}</p>
                <p><b>Email:</b> ${booking.email || "-"}</p>
            </div>

            <div class="booking-section">
                <h4>Trip Details</h4>
                <p><b>Vehicle:</b> ${booking.car_name || "-"}</p>
                <p><b>Pickup Location:</b> ${booking.pickup_location || "-"}</p>
                <p><b>Destination:</b> ${booking.destination_location || "-"}</p>
                <p><b>Round Trip:</b> ${booking.round_trip ? "Yes" : "No"}</p>
            </div>

            <div class="booking-section">
                <h4>Schedule</h4>
                <p><b>Pickup Date:</b> ${booking.pickup_date || "-"}</p>
                <p><b>Pickup Time:</b> ${booking.pickup_time || "-"}</p>
                <p><b>Return Date:</b> ${booking.return_date || "-"}</p>
                <p><b>Return Time:</b> ${booking.return_time || "-"}</p>
            </div>

            <div class="booking-section">
                <h4>Pricing</h4>
                <p><b>Passengers:</b> ${booking.passengers ?? "-"}</p>
                <p><b>Total KM:</b> ${booking.total_km ?? "-"}</p>
                <p><b>Rate Per KM:</b> ₹${booking.rate_per_km ?? 0}</p>
                <p><b>Total Price:</b> ₹${booking.total_price ?? 0}</p>
                <p><b>Advance:</b> ₹${booking.advance_amount || 0}</p>
            </div>

            <div class="booking-section">
                <h4>Notes</h4>
                <p><b>Purpose:</b> ${booking.travel_purpose || "-"}</p>
                <p><b>Requirements:</b> ${booking.special_requirements || "-"}</p>
            </div>

            <div class="booking-section">
                <h4>Status</h4>
                <p><b>Current Status:</b> ${booking.status || "pending"}</p>
            </div>

        </div>
    `;

    const modal = document.getElementById("bookingModal");
    if (modal) modal.style.display = "flex";

}

/* =========================
   STATUS ACTIONS
========================= */

async function updateBookingStatus(id, action, confirmMessage) {

    if (confirmMessage && !confirm(confirmMessage)) return;

    try {

        const response = await fetch(`${BOOKING_API}/${id}/${action}`, { method: "PUT" });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        loadBookings();

    } catch (error) {

        console.error(`${action} Booking Error:`, error);
        alert(`Could not ${action} this booking. Please check the server connection and try again.`);

    }

}

function approveBooking(id) {
    updateBookingStatus(id, "approve");
}

function rejectBooking(id) {
    updateBookingStatus(id, "reject", "Reject this booking?");
}

function completeBooking(id) {
    updateBookingStatus(id, "complete", "Mark this booking as completed?");
}

async function deleteBooking(id) {

    if (!confirm("Delete this booking? This cannot be undone.")) return;

    try {

        const response = await fetch(`${BOOKING_API}/${id}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        loadBookings();

    } catch (error) {

        console.error("Delete Booking Error:", error);
        alert("Could not delete this booking. Please check the server connection and try again.");

    }

}

/* =========================
   SEARCH + STATUS FILTER
========================= */

function applyBookingFilters() {

    const searchInput = document.getElementById("bookingSearch");
    const statusFilter = document.getElementById("bookingStatusFilter");

    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const statusValue = statusFilter ? statusFilter.value : "all";

    const rows = document.querySelectorAll("#bookingTable tr");

    rows.forEach(row => {

        const text = row.innerText.toLowerCase();
        const matchesSearch = !searchTerm || text.includes(searchTerm);
        const matchesStatus = statusValue === "all" || text.includes(statusValue);

        row.style.display = (matchesSearch && matchesStatus) ? "" : "none";

    });

}

const bookingSearchInput = document.getElementById("bookingSearch");
if (bookingSearchInput) {
    bookingSearchInput.addEventListener("keyup", applyBookingFilters);
}

const bookingStatusFilterEl = document.getElementById("bookingStatusFilter");
if (bookingStatusFilterEl) {
    bookingStatusFilterEl.addEventListener("change", applyBookingFilters);
}

/* =========================
   MODAL CLOSE
========================= */

const closeBookingModalBtn = document.getElementById("closeBookingModal");

if (closeBookingModalBtn) {

    closeBookingModalBtn.addEventListener("click", () => {

        const modal = document.getElementById("bookingModal");
        if (modal) modal.style.display = "none";

    });

}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", loadBookings);