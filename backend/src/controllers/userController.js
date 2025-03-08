const userService = require('../models/user');
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

    const createUser = async (req, res) => {
        try {
            logger.info('Creating user:', req.body);
            const user = await userService.create(req.body);
            
            return res.status(HTTP_STATUS.CREATED).json({
                message: 'User created successfully',
                user
            });
        }
        catch (error) {
            logger.error('Error creating user:', error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Error creating user',
                error: error.message
            });
        }
    }

    const loginUser = async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await userService.login(username, password);
            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: 'User not found'
                });
            }
            return res.status(HTTP_STATUS.OK).json({
                message: 'User logged in successfully',
                user
            });
        }
        catch (error) {
            logger.error('Error logging in:', error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Error logging in',
                error: error.message
            });
        }
    } 

module.exports = {
    createUser,
    loginUser
};