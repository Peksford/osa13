const router = require('express').Router()
const { Op } = require('sequelize')

const User = require('../models/user')
const Session = require('../models/session')

router.delete('/', async (request, response, next) => {
  try {
    const body = request.body

    const user = await User.findOne({
      where: {
        username: body.username,
      },
    })

    await Session.destroy({
      where: {
        [Op.and]: [{ userId: user.id }, { session: true }],
      },
    })

    response.status(200).send({ message: 'Logout succesful' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
