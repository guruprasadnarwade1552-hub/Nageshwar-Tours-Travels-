const API_BASE = "https://nageshwar-tours-travels-production.up.railway.app/api";

async function getCars() {

    try {

        const response =
        await fetch(`${API_BASE}/cars`);

        return await response.json();

    } catch(error) {

        console.error(error);

        return [];

    }

}  

async function getAvailableCars() {

    try {

        const response =
        await fetch(`${API_BASE}/cars/available`);

        return await response.json();

    } catch(error) {

        console.error(error);

        return [];

    }

}
