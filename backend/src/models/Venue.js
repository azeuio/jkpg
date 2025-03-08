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
    async get(page = 1, limit = 10) {
      try {
        const skip = (page - 1) * limit;
        return await this.model.find().skip(skip).limit(limit);
      } catch (error) {
        console.error("Error getting venues:", error);
        throw new Error('Error getting venues: ' + error.message);
      }
    }
    async insertMany(venues) {
      try {
        return await this.model.insertMany(venues);
      } catch (error) {
        console.error("Error inserting venues:", error);
        throw new Error('Error inserting venues: ' + error.message);
      }
    }
  }

  module.exports = new Venue(mongoose.model("Venue", VenueSchema));
