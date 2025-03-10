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


  const createVenue = async (req, res) => {
    try {
        logger.info('Creating venue:', req.body);
        const venue = await venueService.create(req.body);
        
        return res.status(HTTP_STATUS.CREATED).json({
            message: 'Venue created successfully',
            venue
        });
    }
    catch (error) {
        logger.error('Error creating venue:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Error creating venue',
            error: error.message
        });
    }
}


  const getVenues = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;

        logger.info('Getting venues with pagination', { page });        
        const venues = await venueService.get(page);
        
        return res.status(HTTP_STATUS.OK).json({
            message: 'Venues retrieved successfully',
            venues
        });
    } catch (error) {
        logger.error('Error getting venues:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Error getting venues',
            error: error.message
        });
    }
};

    const deleteVenue = async (req, res) => {
        try {
            const { id } = req.params;
            logger.info('Deleting venue:', { id });
            const venue = await venueService.delete(id);
            if (!venue) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: 'Venue not found'
                });
            }
            return res.status(HTTP_STATUS.OK).json({
                message: 'Venue deleted successfully'
            });
        } catch (error) {
            logger.error('Error deleting venue:', error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Error deleting venue',
                error: error.message
            });
        }
    }

    const updateVenue = async (req, res) => {
        try {
            const { id } = req.params;
            logger.info('Updating venue:', { id });
            const venue = await venueService.update(id, req.body);
            if (!venue) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: 'Venue not found'
                });
            }
            return res.status(HTTP_STATUS.OK).json({
                message: 'Venue updated successfully'
            });
        } catch (error) {
            logger.error('Error updating venue:', error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Error updating venue',
                error: error.message
            });
        }
    }


    module.exports = {
        createVenue,
        getVenues,
        updateVenue,
        deleteVenue
    };