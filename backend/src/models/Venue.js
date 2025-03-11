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
  },
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

class Venue {
  constructor(model) {
      this.model = model;
    }
    async create(data) {
      try {
        const venue = new this.model(data);
        return await venue.save();
      }
      catch (error) {
        console.error("Error creating venue:", error);
        throw new Error('Error creating venue: ' + error.message);
      }
    }
    async get(page = 1, limit = 10, nom = "name", value = 1) {
      try {
        if (isNaN(value)) {
          value = 1;
        }
        const tmp = {}
        tmp[nom] = value;
        console.log(value)
        const skip = (page - 1) * limit;
        return await this.model.find().sort(tmp).skip(skip).limit(limit);
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
    async update(id, data) {
      try {
        return await this.model.updateOne({ _id: id }, data);
      }
      catch (error) {
        console.error("Error updating venue:", error);
        throw new Error('Error updating venue: ' + error.message);
      }
    }
    async delete(id) {
      try {
        return await this.model.findByIdAndDelete(id);
      } catch (error) {
        console.error("Error deleting venue:", error);
        throw new Error('Error deleting venue: ' + error.message);
      }
    }
  }

  module.exports = new Venue(mongoose.model("Venue", VenueSchema));
