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
    constructor(name, latitude, longitude, hashtag) {
        this.latitude = latitude
        this.longitude = longitude
        this.name = name
        this.hashtag = hashtag
    }

<<<<<<< HEAD
    toString() {
        return `${this.name} (${this.latitude}, ${this.longitude}) ${this.hashtag}`;
=======
    // TODO: ... your code here ...
    constructor(name, latitude, longitude, hashtag) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hashtag = hashtag;
>>>>>>> 2d5ca83 (add constructor to class GeoTag)
    }
}

module.exports = GeoTag;
