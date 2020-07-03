const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Maps = Schema({
  title: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Map', Maps);