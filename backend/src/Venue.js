const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  district: { type: String, required: true }
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
