async function loadCars(){

    const cars =
    await getCars();

    const container =
    document.getElementById(
        "carsContainer"
    );

    if(!container) return;

    container.innerHTML = "";

   cars.forEach(car => {

    const isAvailable =
        car.status?.toLowerCase() === "available";

    container.innerHTML += `

    <div class="car-card">

        <div class="car-image">
            <img
            src="${car.image_url}"
            alt="${car.name}">
        </div>

        <div class="car-info">

            <h3>${car.name}</h3>

            <p>
                Brand: ${car.brand}
            </p>

            <p>
                Type: ${car.type}
            </p>

            <p class="price">
                ₹${car.price_per_km} / KM
            </p>

            <span class="car-status ${car.status?.toLowerCase()}">
                ${car.status}
            </span>

            <button
                class="book-btn"
                ${!isAvailable ? "disabled" : ""}
                onclick="bookCar(${car.id}, '${car.name}')">

                ${isAvailable
                    ? "Book Now"
                    : "Not Available"}

            </button>

        </div>

    </div>

    `;

});

}
function bookCar(carId, carName){

    localStorage.setItem(
        "selectedCarId",
        carId
    );

    localStorage.setItem(
        "selectedCarName",
        carName
    );

    window.location.href =
    "booking.html";

}

document.addEventListener(
"DOMContentLoaded",
loadCars
);

