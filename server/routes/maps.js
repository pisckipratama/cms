const express = require('express');
const router = express.Router();
const Maps = require('../models/Maps')

/* GET data main. */
router.get('/', (req, res, next) => {
  Maps.find().then(data => {
    let result = [];
    data.forEach(item => {
      result.push({
        _id: item._id,
        title: item.title,
        lat: item.lat,
        lng: item.lng
      })
    })
    res.json(result);
  })
});

/* POST add data */
router.post('/', (req, res, next) => {
  const {
    title,
    lat,
    lng
  } = req.body;
  let response = {
    status: false,
    message: '',
    data: {}
  }
  const newMaps = new Maps({
    title,
    lat,
    lng
  })
  newMaps.save().then(go => {
    response.status = true;
    response.message = 'data have been added';
    response.data._id = go._id;
    response.data.title = go.title;
    response.data.lat = go.lat;
    response.data.lng = go.lng;
    res.status(200).json(response);
  }).catch(err => res.status(401).json(err));
})

/* GET find maps */
router.get('/:id', (req, res, next) => {
  const {
    id
  } = req.params;
  let response = {
    success: false,
    message: '',
    data: {}
  }
  Maps.findOne({
    _id: id
  }).then(data => {
    if (!data) {
      response.success = true
      response.message = 'data not found'
      res.status(200).json(response);
    }
    response.success = true;
    response.message = 'data found';
    response.data._id = data._id;
    response.data.title = data.title;
    response.data.lat = data.lat;
    response.data.lng = data.lng;
    res.status(200).json(response);
  }).catch(err => res.json(401).json(err));
})

/* PUT edit datadate */
router.put('/:id', (req, res, next) => {
  const {
    id
  } = req.params;
  const {
    title,
    lat,
    lng
  } = req.body;
  let response = {
    success: false,
    message: '',
    data: {}
  }
  Maps.findOne({
    _id: id
  }).then(data => {
    if (!data) {
      response.message = 'data not found'
      res.status(404).json(response);
    }
    data.title = title;
    data.lat = lat;
    data.lng = lng;
    data.save().then(update => {
      response.success = true;
      response.message = 'data have been updated';
      response.data._id = update._id;
      response.data.title = update.title;
      response.data.frequency = update.lat;
      response.data.lng = update.lng;
      res.status(201).json(response)
    }).catch(err => {
      response.message = err;
      res.status(404).json(response);
    })
  }).catch(err => console.error(err));
})

/* DELETE delete maps */
router.delete('/:id', (req, res, next) => {
  const {
    id
  } = req.params;
  let response = {
    success: false,
    message: '',
    data: {}
  }

  Maps.findOneAndDelete({
    _id: id
  }).then((data) => {
    if (!data) {
      response.message = 'data not found'
      res.status(401).json(response);
    }
    response.success = true;
    response.message = 'data have been deleted';
    response.data._id = data._id;
    response.data.title = data.title;
    response.data.lat = data.lat;
    response.data.lng = data.lng;
    res.status(201).json(response);
  }).catch(err => {
    response.message = err;
    res.status(500).json(response)
  })
})

/* POST search maps */
router.post('/search', (req, res, next) => {
  Maps.find({title: req.body.title}).then(data => {
    let result = [];
    data.forEach(item => {
      result.push({
        _id: item._id,
        title: item.title,
        lat: item.lat,
        lng: item.lng
      })
    })
    res.status(200).json(result);
  }).catch(err => {
    res.status(500).json(err);
  })
})

module.exports = router;