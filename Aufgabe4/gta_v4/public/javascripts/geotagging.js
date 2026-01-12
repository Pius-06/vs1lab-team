// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    const mapManager = new MapManager();
    mapManager.updateLocation();

    const tagForm = document.getElementById('tag-form');
    const discoveryForm = document.getElementById('discovery-form');

    if (tagForm) {
        tagForm.addEventListener('submit', handleTagFormSubmit);
    }

    if (discoveryForm) {
        discoveryForm.addEventListener('submit', handleDiscoveryFormSubmit);
    }

});


async function handleTagFormSubmit(event) {
    event.preventDefault(); // Vorlesung - Prevent default form submission

    const formData = new FormData(form.event.target);

    // JavaScript object
    const geoTagData = {
        name: formData.get('name'),
        latitude: parseFloat(formData.get('latitude')),
        longitude: parseFloat(formData.get('longitude')),
        hashtag: formData.get('hashtag') || ''
    };

    try {
        const response = await fetch('/api/geotags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(geoTagData)
        });

        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }

        const newTag = await response.json();

        // Update UI
        await updateDiscoveryResults(geoTagData.latitude, geoTagData.longitude);
        form.reset();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        alert('Failed to add geotag');
    }
}

async function handleDiscoveryFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(form.event.target);

    const latitude = formData.get('latitudeHidden');
    const longitude = formData.get('longitudeHidden');
    const searchTerm = formData.get('searchTerm') || '';

    await updateDiscoveryResults(latitude, longitude, searchTerm);
}

async function updateDiscoveryResults(latitude, longitude, searchterm = '') {
    try {
        // Query string
        const params = new URLSearchParams({
            latitude: latitude,
            longitude: longitude,
            radius: '10'
        });

        if (searchterm) {
            params.append('searchterm', searchterm);
        }

        const response = await fetch(`/api/geotags?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }

        const tags = await response.json();

        updateResultsList(tags);

        // Update map markers
        const mapManager = new MapManager();
        if (!mapManager.map) {
            mapManager.initMap(parseFloat(latitude), parseFloat(longitude));
        }

        mapManager.updateMarkers(parseFloat(latitude), parseFloat(longitude), tags);

    } catch (error) {
        console.error('Error fetching geotags:', error);
    }
}

function updateResultsList(tags) {
    const resultsList = document.querySelector('#discoveryResults');
    resultsList.innerHTML = tags.map(tag =>
        `<li>${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}</li>`
    ).join('');
}
