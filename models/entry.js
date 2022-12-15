const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const senseSchema = new Schema({
  bodyText: { type: String, required: true },
  subsenses: [ this ],
})

const entrySchema = new Schema({
  headword: { type: String, required: false, },
  bodyText: { type: String, required: false, },
  senses: [{ senseSchema, required: false, }],
  etymology: { type: String, required: false, },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
}, {
  timestamps: true,
})



module.exports = mongoose.model('Entry', entrySchema);