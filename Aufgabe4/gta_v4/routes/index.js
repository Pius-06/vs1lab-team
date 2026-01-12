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
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const GeoTagExamples = require('../models/geotag-examples');

// Examples hinzufügen
const geoTagStore = new GeoTagStore();
GeoTagExamples.tagList.forEach(([name, latitude, longitude, hashtag]) => {
  geoTagStore.addGeoTag(
    new GeoTag({
      name,
      latitude,
      longitude,
      hashtag
    }));
});

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => { 
  res.render('index', { // render: Rendere die EJS-Template-Datei index.ejs und schicke sie als HTML zurück
    taglist: geoTagStore.getAllGeoTags(),
    latitude: '',
    longitude: ''
  });
});

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

// TODO: ... your code here ...
router.get('/api/geotags', (req, res) => {
  const { latitude, longitude, searchTerm, page = 1, pageSize = 10 } = req.query;

  const allGeoTags = geoTagStore.searchNearbyGeoTags({
    latitude: latitude ? parseFloat(latitude) : undefined,
    longitude: longitude ? parseFloat(longitude) : undefined,
    radius: 10,
    keyword: searchTerm
  });

  const totalEntries = allGeoTags.length;
  const countPages = Math.ceil(totalEntries / pageSize);
  const currentPage = Math.max(1, Math.min(page, countPages));

  const startIndex = (currentPage - 1) * pageSize;
  const pagedGeoTags = allGeoTags.slice(startIndex, startIndex + parseInt(pageSize));

  res.status(200).json({
    geotags: pagedGeoTags,
    currentPage,
    countPages,
    totalEntries
  });
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

// TODO: ... your code here ...
router.post('/api/geotags', (req, res) => {
  const { latitude, longitude, name, hashtag } = req.body;

  if (!latitude || !longitude || !name) {
    return res
      .status(400)
      .json({ error: 'Missing required fields' });
  }
  const newTag = new GeoTag({
    name,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    hashtag
  });
  geoTagStore.addGeoTag(newTag);

  res
    .status(201)
    .location(`/api/geotags/${newTag.id}`)
    .json(newTag);
});



/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get('/api/geotags/:id', async (req, res) => {
  const id = Number(req.params.id);
  const tag = geoTagStore.getGeoTagById(id);

  if (!tag) {
    return res
      .status(404)
      .json({ error: `GeoTag with id ${id} not found` });
  }

  res
    .status(200)
    .json(tag);
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

// TODO: ... your code here ...
router.put('/api/geotags/:id', async (req, res) => {
  const id = Number(req.params.id);
  const updatedTag = geoTagStore.updateGeoTagById(id, req.body);

  if (!updatedTag) {
    return res
      .status(404)
      .json({ error: `GeoTag with id ${id} not found` });
  }

  res
    .status(200)
    .json(updatedTag);
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

// TODO: ... your code here ...
router.delete('/api/geotags/:id', async (req, res) => {
  const id = Number(req.params.id)
  const deletedTag = geoTagStore.deleteElementById(id);
  if (!deletedTag) {
    return res
      .status(404)
      .json({ error: `GeoTag with id ${id} not found` });
  }

  res
    .status(200)
    .json(deletedTag);
});

module.exports = router;
