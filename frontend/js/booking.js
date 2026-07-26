const CAR_API =
"http://localhost:5000/api/cars";

const BOOKING_API =
"http://localhost:5000/api/bookings";

/* LOAD CARS */

async function loadCars(){

    try{

        const response =
        await fetch(`${CAR_API}/available`);

        const cars =
        await response.json();

        const select =
        document.getElementById(
            "carSelect"
        );

        select.innerHTML =
        '<option value="">Select Vehicle</option>';

        cars.forEach(car => {

            select.innerHTML += `

            <option
                value="${car.id}"
                data-price="${car.price_per_km}">

              ${car.name}
              (₹${car.price_per_km}/KM)

            </option>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

/* PRICE CALCULATION */

function calculatePrice(){

    const car =
    document.getElementById("carSelect");

    const km =
    Number(
        document.getElementById("totalKm").value
    );

    if(
        !car.value ||
        !km
    ){
        return;
    }

    const ratePerKm =
    Number(
        car.options[
            car.selectedIndex
        ].dataset.price
    );

    document.getElementById(
        "ratePerKm"
    ).value = ratePerKm;

    const total =
    km * ratePerKm;

    document.getElementById(
        "totalPrice"
    ).value = total;

}

/* BOOKING SUBMIT */

document
.getElementById("bookingForm")
.addEventListener(
"submit",
async function(e){

    e.preventDefault();

    const bookingData = {

    customer_name:
    document.getElementById("customerName").value,

    email:
    document.getElementById("email").value,

    phone:
    document.getElementById("phone").value,

    car_id:
    document.getElementById("carSelect").value,

    pickup_location:
    document.getElementById("pickupLocation").value,

    destination_location:
    document.getElementById("destinationLocation").value,

    round_trip:
    document.getElementById("roundTrip").checked,

    pickup_date:
    document.getElementById("pickupDate").value,

    pickup_time:
    document.getElementById("pickupTime").value,

    return_date:
    document.getElementById("returnDate").value || null,

    return_time:
    document.getElementById("returnTime").value || null,

    passengers:
    document.getElementById("passengers").value,

    total_km:
    document.getElementById("totalKm").value,

    rate_per_km:
    document.getElementById("ratePerKm").value,

    total_price:
    document.getElementById("totalPrice").value,

    advance_amount:
    document.getElementById("advanceAmount").value || 0,

    travel_purpose:
    document.getElementById("travelPurpose").value,

    special_requirements:
    document.getElementById("specialRequirements").value

};

    try{

        const response =
        await fetch(
            BOOKING_API,
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:
                JSON.stringify(
                    bookingData
                )
            }
        );

       const data =
await response.json();

console.log(data);

if(!response.ok){

    alert(
        data.message || "Booking Failed"
    );

    return;
}

 showSuccessPopup();

        document
        .getElementById(
            "bookingForm"
        )
        .reset();

    }

    catch(error){

        console.log(error);

        alert(
            "Booking Failed"
        );

    }

});

/* EVENTS */

document
.getElementById(
"carSelect"
)
.addEventListener(
"change",
calculatePrice
);

document
.getElementById(
"pickupDate"
)
.addEventListener(
"change",
calculatePrice
);

document
.getElementById(
"returnDate"
)
.addEventListener(
"change",
calculatePrice
);

loadCars();

const selectedCarId =
localStorage.getItem(
    "selectedCarId"
);

if(selectedCarId){

    document.getElementById(
        "carSelect"
    ).value = selectedCarId;

}

document
.getElementById("totalKm")
.addEventListener(
    "input",
    calculatePrice
);  


function showSuccessPopup(){

    document.getElementById(
        "bookingSuccessPopup"
    ).style.display = "flex";

}

function closeSuccessPopup(){

    document.getElementById(
        "bookingSuccessPopup"
    ).style.display = "none";

}   