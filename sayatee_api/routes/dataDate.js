const express = require('express');
const router = express.Router();
const DataDate = require('../models/DataDate')
const moment = require('moment');

/* GET list datadate */
router.get('/', (req, res, next) => {
  DataDate.find().then(data => {
    let result = [];
    data.forEach(item => {
      result.push({
        _id: item._id,
        letter: moment(item.letter).format("YYYY-MM-DD"),
        frequency: item.frequency
      })
    })
    res.status(200).json(result);
  }).catch(err => {
    res.status(500).json(err)
  })
});

/* POST add datadate */
router.post('/', (req, res, next) => {
  const {
    letter,
    frequency
  } = req.body;
  let response = {
    status: false,
    message: '',
    data: {}
  }
  const newDataDate = new DataDate({
    letter,
    frequency
  })
  newDataDate.save().then(go => {
    response.status = true;
    response.message = 'data have been added';
    response.data._id = go._id;
    response.data.letter = moment(go.letter).format("YYYY-MM-DD");
    response.data.frequency = go.frequency;
    res.status(200).json(response);
  }).catch(err => res.status(500).json(err));
})

/* PUT edit datadate */
router.put('/:id', (req, res, next) => {
  const {
    id
  } = req.params;
  const {
    letter,
    frequency
  } = req.body;
  let response = {
    success: false,
    message: '',
    data: {}
  }
  DataDate.findOne({
    _id: id
  }).then(data => {
    if (!data) {
      response.message = 'data not found'
      res.status(404).json(response);
    }
    data.letter = letter;
    data.frequency = frequency;
    data.save().then(update => {
      response.success = true;
      response.message = 'data have been updated';
      response.data._id = update._id;
      response.data.letter = moment(update.letter).format('YYYY-MM-DD');
      response.data.frequency = update.frequency;
      res.status(201).json(response)
    }).catch(err => {
      response.message = err;
      res.status(404).json(response);
    })
  }).catch(err => res.status(500).json(err));
})

/* DELETE delete data */
router.delete('/:id', (req, res, next) => {
  const {
    id
  } = req.params;
  let response = {
    success: false,
    message: '',
    data: {}
  }

  DataDate.findOneAndDelete({
    _id: id
  }).then((data) => {
    if (!data) {
      response.message = 'data not found'
      res.status(401).json(response);
    }
    response.success = true;
    response.message = 'data have been deleted';
    response.data._id = data._id;
    response.data.letter = moment(data.letter).format('YYYY-MM-DD');
    response.data.frequency = data.frequency;
    res.status(201).json(response);
  }).catch(err => {
    response.message = err;
    res.status(500).json(response)
  })
})

/* GET find data */
router.get('/:id', (req, res, next) => {
  let response = {
    success: false,
    message: '',
    data: {}
  }
  DataDate.findOne().then(data => {
    if (!data) {
      response.message = 'data not found'
      res.status(401).json(response);
    }
    response.success = true;
    response.message = 'data found';
    response.data._id = data._id;
    response.data.letter = moment(data.letter).format('YYYY-MM-DD');
    response.data.frequency = data.frequency;
    res.status(200).json(response);
  }).catch(err => {
    response.message = err
    res.status(500).json(response);
  })
})

/* POST search data */
router.post('/search', (req, res, next) => {
  DataDate.find(req.body).then(data => {
    let result = [];
    data.forEach(item => {
      result.push({
        _id: item._id,
        letter: moment(item.letter).format("YYYY-MM-DD"),
        frequency: item.frequency
      })
    })
    res.status(200).json(result);
  }).catch(err => {
    res.status(500).json(err);
  })
})

module.exports = router;