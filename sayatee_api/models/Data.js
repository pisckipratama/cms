const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = Schema({
  letter: {
    type: String,
    required: true
  },
  frequency: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Data', DataSchema);