const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true 
  },
  url: { 
    type: String, 
    required: false 
  },
  district: { 
    type: String, 
    required: false 
  }
});

module.exports = mongoose.model('Venue', VenueSchema);
