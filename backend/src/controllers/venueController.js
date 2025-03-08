const venueService = require('../models/Venue');
const winston = require('winston');

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  };
  
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'app.log' })
    ]
  });


  const getVenues = async (req, res) => {
    try {
        logger.info('Getting venues');
        const venues = await venueService.get();
        
        return res.status(HTTP_STATUS.OK).json({
            message: 'Venues retrieved successfully',
            venues
        });
    }
    catch (error) {
        logger.error('Error getting venues:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Error getting venues',
            error: error.message
        });
    }
  }

    module.exports = {
        getVenues
    };