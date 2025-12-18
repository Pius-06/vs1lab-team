// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore {
    #geoTags

    constructor() {
        this.#geoTags = []
    }

    addGeoTag(geoTag) {
        this.#geoTags.push(geoTag)
    }

    removeGeoTag(name) {
        // filter erstellt ein neues Array aus #geoTags, das nur die Elemente enthält, für die die Bedingung geoTag.name !== name wahr ist.
        this.#geoTags = this.#geoTags.filter(geoTag => geoTag.name !== name) 
    }

    getNearbyGeoTags(latitude, longitude, radius = 10) {
        return this.#geoTags.filter(tag => {
            const dLat = tag.latitude - latitude
            const dLon = tag.longitude - longitude
            const distance = Math.sqrt(dLat * dLat + dLon * dLon)   // a^2+b^2=c^2 
            return distance <= radius
        });
    }

    searchNearbyGeoTags(latitude, longitude, radius = 10, keyword) {
        return this.#geoTags.filter(tag => {
            const dLat = tag.latitude - latitude
            const dLon = tag.longitude - longitude
            const inRadius = Math.sqrt(dLat * dLat + dLon * dLon) <= radius

            const matchesKeyword =
                tag.name.toLowerCase().includes(keyword.toLowerCase()) ||
                tag.hashtag.toLowerCase().includes(keyword.toLowerCase())

            return inRadius && matchesKeyword
        });
    }

    getAllGeoTags() {
        // ... Er erstellt eine Kopie des Arrays #geoTags.
        // Vorteil: Wer die zurückgegebene Liste verändert (z. B. Elemente löscht oder hinzufügt), ändert nicht das private Array #geoTags direkt.
        return [...this.#geoTags]
    }

}

module.exports = InMemoryGeoTagStore
