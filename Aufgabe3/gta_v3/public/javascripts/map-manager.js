import LocationHelper from './location-helper.js';
// File origin: VS1LAB A2 

// eslint-disable-next-line no-unused-vars
/**
<<<<<<< HEAD
* A class to help using the Leaflet map service.
*/
=======
 * A class to help using the Leaflet map service.
 */
>>>>>>> c819ee4 (MapManager and LocationHelper classes moved to separate scripts and the updateLocation function optimized)
class MapManager {

    #map
    #markers

    /**
    * Initialize a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {number} zoom The map zoom, defaults to 18
    */
    initMap(latitude, longitude, zoom = 18) {
        // set up dynamic Leaflet map
        this.#map = L.map('map').setView([latitude, longitude], zoom);
        var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors'
        }).addTo(this.#map);
        this.#markers = L.layerGroup().addTo(this.#map);
    }

    /**
    * Update the Markers of a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
    */
    updateMarkers(latitude, longitude, tags = []) {
        // delete all markers
        this.#markers.clearLayers();
        L.marker([latitude, longitude])
            .bindPopup("Your Location")
            .addTo(this.#markers);
        for (const tag of tags) {
            L.marker([tag.latitude, tag.longitude])
                .bindPopup(tag.name)
                .addTo(this.#markers);
<<<<<<< HEAD
        }
    }


    #removeMapPlaceholders() {
        const imgElement = document.querySelector('#mapView');
        if (imgElement) {
            imgElement.remove();
        }

        const descriptionParagraph = document.querySelector('p');
        if (descriptionParagraph) {
            descriptionParagraph.remove();
        }
    }

    #renderMap(lat, lon, tags) {
        this.initMap(lat, lon);
        this.updateMarkers(lat, lon, tags);
        this.#removeMapPlaceholders();
    }

    #getTagsFromDOM() {
        const mapElement = document.querySelector('#map');
        const tags = mapElement?.getAttribute('data-tags');
        return tags ? JSON.parse(tags) : [];
    }

    /**
    * TODO: 'updateLocation'
    * A function to retrieve the current location and update the page.
    * It is called once the page has been fully loaded.
    */
    updateLocation() {
        const latitudeInput = document.querySelector('#latitude');
        const longitudeInput = document.querySelector('#longitude');

        const latExists = latitudeInput?.value || '';
        const lonExists = longitudeInput?.value || '';

        // Wenn lat und lon existieren
        if (latExists && lonExists) {
            const lat = parseFloat(latExists);
            const lon = parseFloat(lonExists);
            const tags = this.#getTagsFromDOM()

            this.#renderMap(lat, lon, tags);
        } else {
            LocationHelper.findLocation((locationHelper) => {
                const lat = locationHelper.latitude;
                const lon = locationHelper.longitude;
                if (latitudeInput) {
                    latitudeInput.value = lat;
                }
                if (longitudeInput) {
                    longitudeInput.value = lon;
                }

                const hiddenLat = document.querySelector('#latitudeHidden');
                const hiddenLon = document.querySelector('#longitudeHidden');
                if (hiddenLat) {
                    hiddenLat.value = lat;
                }
                if (hiddenLon) {
                    hiddenLon.value = lon;
                }

                const tags = this.#getTagsFromDOM();
                this.#renderMap(lat, lon, tags);
            });
=======
>>>>>>> c819ee4 (MapManager and LocationHelper classes moved to separate scripts and the updateLocation function optimized)
        }
    }

    /**
    * TODO: 'updateLocation'
    * A function to retrieve the current location and update the page.
    * It is called once the page has been fully loaded.
    */
    updateLocation() {
        const latitudeInput = document.querySelector('#latitude');
        const longitudeInput = document.querySelector('#longitude');
        if (!latitudeInput || !longitudeInput || latitudeInput.value === '' || longitudeInput.value === '') {
            LocationHelper.findLocation(locationHelper => {
                // Koordinaten bestimmen
                const lat = locationHelper.latitude;
                const lon = locationHelper.longitude;

                const discoveryLatInput = document.querySelector('#latitudeHidden');
                const discoveryLonInput = document.querySelector('#longitudeHidden');

                // Koordinaten in Formulare eintragen
                if (latitudeInput) {
                    latitudeInput.value = lat;
                }
                if (longitudeInput) {
                    longitudeInput.value = lon;
                }
                if (discoveryLatInput) {
                    discoveryLatInput.value = lat;
                }
                if (discoveryLonInput) {
                    discoveryLonInput.value = lon;
                }

                const mapDiv = document.getElementById('#map');      // <div id="map">
                const tagsJson = mapElement?.getElementById('data-tags');  
                tagsJson ? JSON.parse(tagsJson) : [];            // in JavaScript-Array umwandeln

                this.initMap(lat, lon);
                this.updateMarkers(lat, lon, tagsArray);

                const imgElement = document.querySelector('#mapView');
                if (imgElement) {
                    imgElement.remove();
                }

                const descriptionParagraph = document.querySelector('span');
                if (descriptionParagraph) {
                    descriptionParagraph.remove();
                }
            });
        }
    }
}

export default MapManager; 