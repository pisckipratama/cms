const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataDateSchema = Schema({
  letter: {
    type: Date,
    required: true
  },
  frequency: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Datadate', DataDateSchema);