const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
  word: {type: String, required: true},
  mw: {},
  fd: {},
  odgb: {},
  odus: {},
}, {
  timestamps: true,
});

module.exports = mongoose.model('Response', responseSchema);