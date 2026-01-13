// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

let currentPage = 1;
const pageSize = 10;

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    const mapManager = new MapManager();
    mapManager.updateLocation();

    // TODO:
    const createForm = document.getElementById('tag-form');
    const searchForm = document.getElementById('discovery-form');

    if (createForm) {
        createForm.addEventListener('submit', handleCreateGeoTag);
    }

    if (searchForm) {
        searchForm.addEventListener('submit', handleSearchGeoTag);
    }

    updateDiscoveryWidget();
});

async function handleCreateGeoTag(event) {
    event.preventDefault(); // Seite nicht neu laden

    // Werte aus dem Formular
    const name = document.getElementById('name').value;
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);
    const hashtag = document.getElementById('hashtag').value;

    // POST-Request an den Server
    try {
        const response = await fetch('/api/geotags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, latitude, longitude, hashtag })
        });

        if (!response.ok) {
            const err = await response.json();
            alert(err.error);
            return;
        }

        const newTag = await response.json();
        console.log('Neuer GeoTag erstellt:', newTag);

        await updateDiscoveryWidget();

        event.target.reset(); // Formular zurücksetzen

    } catch (error) {
        console.error(error);
    }
}

async function handleSearchGeoTag(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchTerm').value;
    const latitude = document.getElementById('latitudeHidden').value;
    const longitude = document.getElementById('longitudeHidden').value;

    const params = new URLSearchParams();
    if (searchTerm) params.append('searchTerm', searchTerm);
    if (latitude) params.append('latitude', latitude);
    if (longitude) params.append('longitude', longitude);

    const response = await fetch('/api/geotags?' + params.toString());
    const geotags = await response.json();
    console.log(geotags);
    await updateDiscoveryWidget(
        searchTerm,
        latitude,
        longitude,
        1 // neue Suche startet auf Seite 1
    );
}

async function updateDiscoveryWidget(searchTerm = '', latitude, longitude, page = 1) {
    currentPage = page;

    const params = new URLSearchParams();

    if (searchTerm) params.append('searchTerm', searchTerm);
    if (latitude) params.append('latitude', latitude);
    if (longitude) params.append('longitude', longitude);

    params.append('page', currentPage);
    params.append('pageSize', pageSize);

    const response = await fetch('/api/geotags?' + params.toString());
    const data = await response.json();

    const list = document.getElementById('discoveryResults');
    if (!list) return;

    list.innerHTML = '';
    data.geotags.forEach(tag => {
        const li = document.createElement('li');
        li.textContent = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag || ''}`;
        list.appendChild(li);
    });

    renderPagination(data.currentPage, data.countPages, data.totalEntries);
}



function renderPagination(current, countPages, totalEntries) {
    const container = document.getElementById('pagination');
    if (!container) return;

    container.innerHTML = `
        <button id="prevPage">&lt;</button>
        ${current}/${countPages} (${totalEntries})
        <button id="nextPage">&gt;</button>
    `;

    document.getElementById('prevPage').onclick = () => {
        if (currentPage > 1) {
            updateDiscoveryWidget(
                document.getElementById('searchTerm').value,
                document.getElementById('latitudeHidden').value,
                document.getElementById('longitudeHidden').value,
                currentPage - 1
            );
        }
    };

    document.getElementById('nextPage').onclick = () => {
        if (currentPage < countPages) {
            updateDiscoveryWidget(
                document.getElementById('searchTerm').value,
                document.getElementById('latitudeHidden').value,
                document.getElementById('longitudeHidden').value,
                currentPage + 1
            );
        }
    };
}
