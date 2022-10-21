const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({
  headword: String,
  body: String,
}, {
  timestamps: true,
})

module.exports = mongoose.model('Entry', entrySchema);