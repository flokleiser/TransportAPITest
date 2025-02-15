function switchDestination() {
    const stationSelect = document.getElementById('stationSelect');
    const destinationSelect = document.getElementById('destinationSelect');

    // Get selected station
    const selectedStation = stationSelect.value;
    // Get the other option as the destination
    for (let option of destinationSelect.options) {
        if (option.value !== selectedStation) {
            destinationSelect.value = option.value;
            break;
        }
    }
}

async function fetchStationBoard() {
    const stationName = document.getElementById('stationSelect').value;
    const destination = document.getElementById('destinationSelect').value;

    const stationTitle = stationName.replace("Zürich, ", "");
    document.getElementById('stationTitle').textContent = `From: ${stationTitle}`;

    const apiUrl = `https://transport.opendata.ch/v1/stationboard?station=${encodeURIComponent(stationName)}&limit=10`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        displayConnections(data.stationboard, destination);
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('displayContainer').innerHTML = "<p>No connections found</p>";
    }
}

function displayConnections(connections, destination) {
    const displayContainer = document.getElementById('displayContainer');
    displayContainer.innerHTML = "";

    const filteredConnections = connections.filter(connection => 
        connection.passList.some(stop => stop.station.name === destination)
    );

    if (filteredConnections.length === 0) {
        displayContainer.innerHTML = `<p>No connections found to ${destination}.</p>`;
        return;
    }

    const list = document.createElement("ul");

    filteredConnections.slice(0, 3).forEach((connection) => {
        const departureTime = new Date(connection.stop.departure).toLocaleTimeString();
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>Dep:</strong> ${departureTime}`;
        list.appendChild(listItem);
    });

    displayContainer.appendChild(list);
}
