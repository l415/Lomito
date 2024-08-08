const mongoose = require('mongoose');

const ChipSchema = new mongoose.Schema({
  chipId: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  ownerName: { type: String, default: '' },
  contactInfo: { type: String, default: '' },
  route: { type: String, required: true },
  registered: { type: Boolean, default: false }
});

module.exports = mongoose.model('Chip', ChipSchema);
