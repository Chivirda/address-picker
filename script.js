document.addEventListener('DOMContentLoaded', async function () {
    // Загрузка населенных пунктов при открытии страницы
    await loadCities();

    async function request(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams(data)
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    async function loadCities() {
        try {
            const data = await request('ajax.php', {action: 'get_cities'});
            populateDropdown('city', data);
        } catch (error) {
            console.error('Error loading cities:', error);
        }
    }

    async function loadStreets() {
        const selectedCity = document.getElementById('city').value;
        try {
            const data = await request('ajax.php', {action: 'get_streets', city: selectedCity});
            populateDropdown('street', data);
        } catch (error) {
            console.error('Error loading streets:', error);
        }
    }

    async function filterAddresses() {
        const selectedCity = document.getElementById('city').value;
        const selectedStreet = document.getElementById('street').value;
        try {
            const data = await request('ajax.php', {
                action: 'filter_addresses',
                city: selectedCity,
                street: selectedStreet
            });
            displayAddresses(data);
        } catch (error) {
            console.error('Error filtering addresses:', error);
        }
    }

    function populateDropdown(elementId, data) {
        const dropdown = document.getElementById(elementId);
        dropdown.innerHTML = '';
        data.forEach(function (value) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            dropdown.appendChild(option);
        });
    }

    function displayAddresses(data) {
        const container = document.getElementById('addresses-container');
        container.innerHTML = '';
        data.forEach(function (value) {
            const p = document.createElement('p');
            p.textContent = value;
            container.appendChild(p);
        });
    }

    // Event listeners for dropdown changes
    document.getElementById('city').addEventListener('change', loadStreets);
    document.querySelector('button').addEventListener('click', filterAddresses);
});

