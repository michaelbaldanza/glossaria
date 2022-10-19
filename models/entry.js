const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchena = new Schema({
  headword: String,
  body: String,
}, {
  timestamps: true,
})