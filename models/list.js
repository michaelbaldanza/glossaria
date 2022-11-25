const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
  name: String,
  entries: [{ type: Schema.Types.ObjectId, ref: 'Entry', required: false }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('List', listSchema);