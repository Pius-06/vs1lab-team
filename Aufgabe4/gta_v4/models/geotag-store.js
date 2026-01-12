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
    #nextId = 1;

    constructor() {
        this.#geoTags = []
    }

    addGeoTag(geoTag) {
        if (!geoTag.latitude || !geoTag.longitude || !geoTag.name) {
            return null;
        }
        geoTag.id = this.#nextId++;
        this.#geoTags.push(geoTag);
        return geoTag;
    }

    removeGeoTag(name) {
        this.#geoTags = this.#geoTags.filter(geoTag => geoTag.name !== name)
    }

    getNearbyGeoTags(latitude, longitude, radius = 10) {
        return this.#geoTags.filter(tag => {
            const distance = this.#distance(tag.latitude, latitude, tag.longitude, longitude)
            return distance <= radius
        });
    }

    searchNearbyGeoTags({ latitude, longitude, radius = 1, keyword } = {}) {
        return this.#geoTags.filter(tag => {

            if (latitude !== undefined && longitude !== undefined) {
                const distance = this.#distance(tag.latitude, tag.longitude, latitude, longitude);
                if (distance > radius) {
                    return false;
                }
            }

            return this.#matchesKeyword(tag, keyword);
        });
    }

    #distance(lat1, lon1, lat2, lon2) {
        const dLat = lat1 - lat2;
        const dLon = lon1 - lon2;
        return Math.sqrt(dLat * dLat + dLon * dLon) // a^2+b^2=c^2 
    }

    #matchesKeyword(tag, keyword) {
        if (!keyword) return true;

        const k = keyword.toLowerCase();
        return (
            tag.name.toLowerCase().includes(k) || tag.hashtag.toLowerCase().includes(k)
        );
    }

    getAllGeoTags() {
        return [...this.#geoTags]
    }

    getGeoTagById(id) {
        const tag = this.#geoTags.find(tag => tag.id === id);
        return tag;
    }

    updateGeoTagById(id, { name, latitude, longitude, hashtag } = {}) {
        const tag = this.#geoTags.find(tag => tag.id === id);

        if (!tag) {
            return null;
        }

        if (name !== undefined) tag.name = name;
        if (latitude !== undefined) tag.latitude = latitude;
        if (longitude !== undefined) tag.longitude = longitude;
        if (hashtag !== undefined) tag.hashtag = hashtag;

        return tag;
    }

    deleteElementById(id) {
        const index = this.#geoTags.findIndex(tag => tag.id == id);
        if (index > -1) {
            const tag = this.#geoTags[index];
            this.#geoTags.splice(index, 1);
            return tag
        } else {
            return null;
        }
    }

}

module.exports = InMemoryGeoTagStore
