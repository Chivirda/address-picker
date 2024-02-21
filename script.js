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
    const settlement = document.getElementById('settlement').value;
    try {
        const data = await request('ajax.php', { action: 'get_streets', settlement });
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

async function displayAddresses() {
    const container = document.getElementById('addresses-container');
    container.innerHTML = '';
    const district = document.getElementById('district').value;
    const settlement = document.getElementById('settlement').value;
    const street = document.getElementById('street').value;
    const data = await request('ajax.php', { action: 'print_addresses', district, settlement, street });

    data.forEach((address) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = address;
        container.appendChild(paragraph);
    });
}

function resetFormField(event) {
    const clickedButton = document.getElementById(event.target.id);
    clickedButton.previousElementSibling.value = '';
}

function resetForm() {
    document.getElementById('district').value = '';
    document.getElementById('settlement').value = '';
    document.getElementById('street').value = '';
    document.getElementById('addresses-container').innerHTML = '';
}

// События работы с формой
document.getElementById('district').addEventListener('change', loadSettlements);
document.getElementById('settlement').addEventListener('change', loadStreets);
// События работы с кнопками
document.getElementById('button').addEventListener('click', displayAddresses);
document.getElementById('reset').addEventListener('click', resetForm);

