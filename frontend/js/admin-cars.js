 /* ==========================================
   DRIVENOW ADMIN PANEL — CAR MANAGEMENT
   Talks to the real backend at API_URL.
========================================== */

const API_URL = "https://nageshwar-tours-travels-production.up.railway.app/api/cars";

let editingCarId = null;

/* =========================
   LOAD CARS
========================= */

async function loadCars() {

    const table = document.getElementById("carsTable");
    if (!table) return;

    table.innerHTML = `<tr><td colspan="8">Loading cars...</td></tr>`;

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const cars = await response.json();

        if (!Array.isArray(cars) || cars.length === 0) {
            table.innerHTML = `<tr><td colspan="8">No cars added yet.</td></tr>`;
            updateDashboardStats(cars || []);
            return;
        }

        const rows = cars.map(car => `
            <tr>
                <td>${car.id}</td>
                <td>
                    <div class="car-thumb">
                        <img src="${car.image_url || ''}" alt="${car.name || 'Car'}">
                    </div>
                </td>
                <td>${car.name || "N/A"}</td>
                <td>${car.brand || "N/A"}</td>
                <td>${car.type || "N/A"}</td>
                <td>₹${car.price_per_km ?? 0}</td>
                <td>
                    <span class="status ${car.status === 'available' ? 'available' : 'booked'}">
                        ${car.status || "unknown"}
                    </span>
                </td>
                <td>
                    <button class="btn" onclick="editCar(${car.id})">Edit</button>
                    <button class="btn danger" onclick="deleteCar(${car.id})">Delete</button>
                </td>
            </tr>
        `).join("");

        table.innerHTML = rows;

        updateDashboardStats(cars);

    } catch (error) {

        console.error("Load Cars Error:", error);

        table.innerHTML = `
            <tr>
                <td colspan="8">
                    Could not load cars. Is the server running at ${API_URL}?
                </td>
            </tr>
        `;

    }

}

/* =========================
   DASHBOARD STATS (cars)
========================= */

function updateDashboardStats(cars) {

    const totalCarsEl = document.getElementById("totalCars");

    if (totalCarsEl) {
        totalCarsEl.textContent = cars.length;
    }

}

/* =========================
   EDIT CAR
========================= */

async function editCar(id) {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const cars = await response.json();
        const car = cars.find(c => c.id == id);

        if (!car) {
            alert("Could not find that car. It may have already been deleted.");
            return;
        }

        document.getElementById("carName").value = car.name || "";
        document.getElementById("carBrand").value = car.brand || "";
        document.getElementById("carType").value = car.type || "";
        document.getElementById("carPrice").value = car.price_per_km || "";
        document.getElementById("carImage").value = car.image_url || "";
        document.getElementById("carStatus").value = car.status || "available";

        editingCarId = car.id;

        const saveBtn = document.getElementById("saveCarBtn");
        if (saveBtn) saveBtn.innerText = "Update Car";

        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {

        console.error("Edit Error:", error);
        alert("Could not load that car's details. Please try again.");

    }

}

/* =========================
   ADD OR UPDATE CAR
========================= */

async function addCar() {

    const name = document.getElementById("carName").value.trim();
    const brand = document.getElementById("carBrand").value.trim();
    const type = document.getElementById("carType").value.trim();
    const price = document.getElementById("carPrice").value;
    const image = document.getElementById("carImage").value.trim();
    const status = document.getElementById("carStatus").value;

    if (!name || !price) {
        alert("Please fill in at least the car name and price per KM.");
        return;
    }

    const carData = {
        name,
        brand,
        type,
        price_per_km: price,
        image_url: image,
        status
    };

    // editingCarId can legitimately be 0, so check for null/undefined explicitly
    const isEditing = editingCarId !== null && editingCarId !== undefined;

    try {

        const response = await fetch(

            isEditing ? `${API_URL}/${editingCarId}` : API_URL,

            {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(carData)
            }

        );

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        if (isEditing) {

            editingCarId = null;

            const saveBtn = document.getElementById("saveCarBtn");
            if (saveBtn) saveBtn.innerText = "Save Car";

        }

        clearForm();
        loadCars();

    } catch (error) {

        console.error("Save Error:", error);
        alert("Could not save the car. Please check the server connection and try again.");

    }

}

/* =========================
   DELETE CAR
========================= */

async function deleteCar(id) {

    const confirmDelete = confirm("Delete this car permanently?");
    if (!confirmDelete) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        loadCars();

    } catch (error) {

        console.error("Delete Error:", error);
        alert("Could not delete the car. Please check the server connection and try again.");

    }

}

/* =========================
   CLEAR FORM
========================= */

function clearForm() {

    document.getElementById("carName").value = "";
    document.getElementById("carBrand").value = "";
    document.getElementById("carType").value = "";
    document.getElementById("carPrice").value = "";
    document.getElementById("carImage").value = "";
    document.getElementById("carStatus").value = "available";

}

/* =========================
   EVENTS
========================= */

const saveCarBtn = document.getElementById("saveCarBtn");

if (saveCarBtn) {
    saveCarBtn.addEventListener("click", addCar);
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", loadCars);
