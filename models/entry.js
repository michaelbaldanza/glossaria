const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({
  headword: String,
  bodyText: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Entry', entrySchema);