const express = require('express');
const router = express.Router();
const Data = require('../models/Data')

/* GET data main. */
router.get('/', (req, res, next) => {
  res.json({
    message: `API's data work`
  });
});

/* GET list data. */
router.get('/list', (req, res, next) => {
  let response = []
  Data.find().then((data) => {
    data.forEach(item => {
      response.push({
        _id: item._id,
        letter: item.letter,
        frequency: item.frequency
      })
    })
    res.status(200).json(response)
  }).catch(err => res.status(500).json(err));
})

/* POST add data. */
router.post('/add', (req, res, next) => {
  let response = {
    succes: false,
    message: '',
    data: {}
  }
  const data = new Data({
    letter: req.body.letter,
    frequency: req.body.frequency
  })
  data.save().then(data => {
    response.succes = true;
    response.message = 'data have been added';
    response.data._id = data._id;
    response.data.letter = data.letter;
    response.data.frequency = data.frequency; 
    res.status(200).json(response)
  }).catch(err => {
    response.message = err;
    res.status(401).json(response)
  })
})

/* PUT edit data */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { letter, frequency } = req.body;
  let response = {
    success: false,
    message: '',
    data: {}
  }
  Data.findOne({_id: id}).then(data => {
    if (!data) {
      response.message = 'data not found'
      res.status(404).json(response);
    }
    data.letter = letter,
    data.frequency = frequency;
    data.save().then(update => {
      response.success = true;
      response.message = 'data have been updated';
      response.data._id = update._id;
      response.data.letter = update.letter;
      response.data.frequency = update.frequency;
      res.status(200).json(response)
    }).catch(err => {
      response.message = err;
      res.status(404).json(response);
    })
  }).catch(err => console.error(err));
})

/* DELETE delete data */
router.delete('/delete/:id', (req, res, next) => {
  const { id } = req.params;
  let response = {
    success: false,
    message: '',
    data: {}
  }

  Data.findOneAndDelete({_id: id}).then((data) => {
    if (!data) {
      response.message = 'data not found'
      res.status(401).json(response);
    }
    response.success = true;
    response.message = 'data have been deleted',
    response.data._id = data._id;
    response.data.letter = data.letter;
    response.data.frequency = data.frequency;
    res.status(200).json(response);
  }).catch(err => {
    response.message = err;
    res.status(401).json(response)
  })
})

/* GET find data */
router.get('/:id', (req, res, next) => {
  let response = {
    success: false,
    message: '',
    data: {}
  }
  Data.findOne().then(data => {
    if (!data) {
      response.message = 'data not found'
      res.status(401).json(response);
    }
    response.success = true;
    response.message = 'data found';
    response.data._id = data._id;
    response.data.letter = data.letter;
    response.data.frequency = data.frequency;
    res.status(200).json(response);
  }).catch(err => {
      response.message = err
      res.status(401).json(response);
  })
})

/* POST search data */
router.post('/search', (req, res, next) => {
  Data.find(req.body).then(data => {
    res.status(200).json(data);
  }).catch(err => {
    res.status(401).json(err);
  })
})

module.exports = router;