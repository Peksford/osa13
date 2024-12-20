const router = require('express').Router()
const { Op } = require('sequelize')

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  const where = {}

  try {
    if (req.query.read === 'true') {
      where.read = true
    } else if (req.query.read === 'false') {
      where.read = false
    }

    const user = await User.findByPk(req.params.id, {
      attributes: ['name', 'username'],
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId'],
          },
          through: {
            attributes: ['read', 'id'],
            // where: { read: true },
            where,
          },
        },
      ],
    })
    if (user) {
      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
    })
    if (user) {
      user.name = req.body.name
      await user.save()
      res.json({ user: user.name })
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
