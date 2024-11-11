const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  console.log('testing', error)
  if (error.name === 'SequelizeValidationError') {
    logger.error(error)
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'TypeError') {
    logger.error(error)
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'SequelizeForeignKeyConstraintError') {
    logger.error(error)
    return response.status(400).send({ error: error.message })
  }
  //   } else if (error.name === 'ValidationError') {
  //     return response.status(400).json({ error: error.message });
  //   } else if (error.name === 'JsonWebTokenError') {
  //     return response.status(401).json({ error: 'token missing or invalid' });
  //   }
}

module.exports = {
  errorHandler,
}
