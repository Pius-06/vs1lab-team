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
<<<<<<< HEAD
    #geoTags

    constructor() {
        this.#geoTags = []
    }

    addGeoTag(geoTag) {
        this.#geoTags.push(geoTag)
    }

    removeGeoTag(name) {
        this.#geoTags = this.#geoTags.filter(geoTag => geoTag.name !== name)
    }

    getNearbyGeoTags(latitude, longitude, radius = 10) {
        return this.#geoTags.filter(tag => {
            const dLat = tag.latitude - latitude
            const dLon = tag.longitude - longitude
            const distance = Math.sqrt(dLat * dLat + dLon * dLon)   // c calculation by Pytaghoras
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
        return [...this.#geoTags]
=======

    // TODO: ... your code here ...
    #tags = [];
    addGeoTag(tag) {
        this.#tags.push(tag);
>>>>>>> 3f14969 (implement these methods:)
    }

    removeGeoTag(tagName) {
        this.#tags = this.#tags.filter(tag => tag.name !== tagName);
    }

    // Latitude (Breitengrad): Gibt an, wie weit nördlich oder südlich man vom Äquator ist.
    // Longitude (Längengrad): Gibt an, wie weit östlich oder westlich man vom Nullmeridian ist.
    getNearbyGeoTags(latitude, longitude, distance) {
        let nearbyTags = [];
        this.#tags.forEach(tag => {
            if (this.isTagNearbyLocation(latitude, longitude, distance, tag)) {
                nearbyTags.push(tag);
            }
        });
        return nearbyTags;
    }

    searchNearbyGeoTags(latitude, longitude, distance, searchTerm) {
        let nearbyTags = this.getNearbyGeoTags(latitude, longitude, distance);
        let nearbyTagsWithTerm = [];
        nearbyTags.forEach(nearbyTag => {
            if (nearbyTag.name.includes(searchTerm) || nearbyTag.hashtag.includes(searchTerm)) {
                nearbyTagsWithTerm.push(nearbyTag);
            }
        });
        return nearbyTagsWithTerm;
    }

    // Rechteck, kein Kreis!
    isTagNearbyLocation(latitude, longitude, distance, tag) {
        if ((tag.latitude < latitude + distance) && (tag.latitude > latitude - distance)) {
            if ((tag.longitude < longitude + distance) && (tag.longitude > longitude - distance)) {
                return true;
            }
        }
        return false;
    }
}

module.exports = InMemoryGeoTagStore
