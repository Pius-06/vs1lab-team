// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    constructor({ id = null, name, latitude, longitude, hashtag } = {}) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hashtag = hashtag;
    }

    toString() {
        return `${this.name} (${this.latitude}, ${this.longitude})`;
    }
}

module.exports = GeoTag;
