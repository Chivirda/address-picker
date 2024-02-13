<?php

if (isset($_POST['action'])) {
    $action = $_POST['action'];

    switch ($action) {
        case 'get_cities':
            echo json_encode(getCities());
            break;
        case 'get_streets':
            $city = $_POST['city'];
            echo json_encode(getStreets($city));
            break;
        case 'filter_addresses':
            $city = $_POST['city'];
            $street = $_POST['street'];
            echo json_encode(filterAddresses($city, $street));
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


$addresses = readAddressesFromCSV('addreses.csv');

echo "<pre>";
print_r($addresses);
echo "</pre>";
