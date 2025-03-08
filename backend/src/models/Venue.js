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

class Venue {
  constructor(model) {
      this.model = model;
    }
    async get() {
      try {
          return await this.model.find().limit(10);
      }
      catch (error) {
          console.error("Error getting venues:", error);
          throw new Error('Error getting venues: ' + error.message);
      }
    }
  }

  module.exports = new Venue(mongoose.model("Venue", VenueSchema));
