document.addEventListener('DOMContentLoaded', async function () {
    // Загрузка населенных пунктов при открытии страницы
    await loadRegion();

});
async function request(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}

async function loadRegion() {
    try {
        const data = await request('ajax.php', { action: 'get_region' });
        const region = document.querySelector('#region');
        region.innerHTML = data
        await loadDistricts();
    } catch (error) {
        console.error('Error loading region:', error);
    }
}

async function loadDistricts() {
    try {
        const data = await request('ajax.php', { action: 'get_districts' });
        populateDropdown('district-list', data);
    } catch (error) {
        console.error('Error loading districts:', error);
    }
}

async function loadSettlements() {
    try {
        const data = await request('ajax.php', { action: 'get_settlements' });
        populateDropdown('settlement-list', Object.values(data));
    } catch (error) {
        console.error('Error loading settlements:', error);
    }
}

async function loadStreets() {
    const selectedSettlement = document.getElementById('settlement').value;
    try {
        const data = await request('ajax.php', { action: 'get_streets', settlement: selectedSettlement });
        populateDropdown('street-list', Object.values(data));
    } catch (error) {
        console.error('Error loading streets:', error);
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
document.getElementById('district').addEventListener('change', loadSettlements);
document.getElementById('settlement').addEventListener('change', loadStreets);
document.querySelector('button').addEventListener('click', filterAddresses);
