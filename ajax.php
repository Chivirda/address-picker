<?php

const REGION_INDEX = 2;
const DISTRICT_INDEX = 3;
const CITY_INDEX = 5;
const STREET_INDEX = 6;

// echo '<pre>';
// print_r($addresses);
// echo '</pre>';
// die();

if (isset($_POST['action'])) {
    $action = $_POST['action'];

    switch ($action) {
        case 'get_region':
            echo json_encode(getRegion());
            break;
        case 'get_districts':
            echo json_encode(getDistrict());
            break;
        case 'get_settlements':
            echo json_encode(getSettlements());
            break;
        case 'get_streets':
            $settlement = $_POST['settlement'];
            echo json_encode(getStreets($settlement));
            break;
    }
}

function readAddressesFromCSV($filename)
{
    if (!file_exists($filename) || !is_readable($filename)) {
        return "Error reading from addresses.csv";
    }

    $addresses = [];

    if (($handle = fopen($filename, 'r')) !== false) {
        while (($data = fgetcsv($handle)) !== false) {
            $addresses[] = $data;
        }
        fclose($handle);
    }

    return $addresses;
}

function getColumnUniqueValues(int $columnIndex): array
{
    $addresses = readAddressesFromCSV('addreses.csv');

    $values = [];

    foreach ($addresses as $address) {
        if (count($address) > 1) { // Skip the header row if it exists
            $values[] = $address[$columnIndex];
        }
    }

    return array_unique($values);
}

function getRegion(): array
{
    return getColumnUniqueValues(REGION_INDEX);
}

function getDistrict(): array
{
    return getColumnUniqueValues(DISTRICT_INDEX);
}

function getSettlements(): array
{
    return getColumnUniqueValues(CITY_INDEX);
}

function getStreets(string $city): array
{
    $addresses = readAddressesFromCSV('addreses.csv');

    $values = [];

    foreach ($addresses as $address) {
        if (count($address) > 1 && $address[CITY_INDEX] === $city) {
            $values[] = $address[STREET_INDEX];
        }
    }

    return array_unique($values);
}
