// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

const GeoTagExamples = require('../models/geotag-examples');

const geoTagStore = new GeoTagStore();
GeoTagExamples.tagList.forEach(([name, latitude, longitude, hashtag]) => {
  geoTagStore.addGeoTag(new GeoTag(name, latitude, longitude, hashtag));
});


/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  res.render('index', {
    taglist: geoTagStore.getAllGeoTags(),
    latitude: '',
    longitude: ''
  });
});
/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post("/tagging", (req, res) => {
  const { latitude, longitude, name, hashtag } = req.body;
  const newTag = new GeoTag(name, latitude, longitude, hashtag);
  geoTagStore.addGeoTag(newTag);

  const nearbyTags = geoTagStore.getNearbyGeoTags(
    parseFloat(latitude),
    parseFloat(longitude),
    10
  );

  res.render('index', {
    taglist: nearbyTags,
    latitude,
    longitude
  });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

// TODO: ... your code here ...
router.post('/discovery', (req, res) => {
  const { latitudeHidden, longitudeHidden, searchTerm } = req.body;

  let results;
  if (searchTerm) {
    results = geoTagStore.searchNearbyGeoTags(
      parseFloat(latitudeHidden),
      parseFloat(longitudeHidden),
      0.00000001,
      searchTerm
    );
  } else {
    results = geoTagStore.getNearbyGeoTags(
      parseFloat(latitudeHidden),
      parseFloat(longitudeHidden),
      0.00000001,
    );
  }

  res.render('index', {
    taglist: results,
    latitude: latitudeHidden,
    longitude: longitudeHidden
  });
});

module.exports = router;


// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
  const { latitude, longitude, radius, searchterm } = req.query;

  let results;

  const lat = latitude ? parseFloat(latitude) : null;
  const lon = longitude ? parseFloat(longitude) : null;
  const rad = radius === undefined ? 10 : parseFloat(radius);

  if (lat && lon && searchterm) {
    results = geoTagStore.searchNearbyGeoTags(lat, lon, rad, searchterm);
  } else if (lat && lon) {
    results = geoTagStore.getNearbyGeoTags(lat, lon, rad);
  } else if (searchterm) {
    results = geoTagStore.getAllGeoTags().filter(tag =>
      tag.name.toLowerCase().includes(searchterm.toLowerCase()) ||
      tag.hashtag.toLowerCase().includes(searchterm.toLowerCase())
    );
  } else {
    results = geoTagStore.getAllGeoTags();
  }

  res.json(results);
});



/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;

  const newTag = geoTagStore.addGeoTag(new GeoTag(name, latitude, longitude, hashtag));

  res.status(201)
    .location(`/api/geotags/${newTag.id}`)  // Sets the response Location HTTP header to the specified path parameter.
    .json(newTag);
})


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', (req, res) => {
  const tag = geoTagStore.getGeoTagById(req.params.id);

  if (!tag) {
    return res.status(404).json({
      error: 'Geotag not found!'
    });
  }

  res.json(tag);
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', (req, res) => {
  const tag = geoTagStore.updateGeoTag(req.params.id, req.body);

  if (!tag) {
    return res.status(404).json({
      error: 'GeoTag not found!'
    });
  }

  res.json(tag);
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
  const deletedTag = geoTagStore.deleteGeoTag(req.params.id);

  if (!deletedTag) {
    return res.status(404).json({
      error: 'GeoTag not found!'
    });
  }

  res.json(deletedTag);
});

module.exports = router;
