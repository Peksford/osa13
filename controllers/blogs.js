const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { Blog, User, Session } = require('../models')
const { SECRET } = require('../util/config')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
      year: req.body.year,
    })
    res.json(blog)
  } catch (error) {
    next(error)
    // return res.status(400).json({ error });
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.findByPk(req.params.id)

    if (blog.userId === user.id) {
      await Blog.destroy({ where: { id: blog.id } })
      return res.json('Delete succeeded')
    } else {
      return res.status(400).json('Unauthorized to delete')
    }
  } catch (error) {
    console.log(error)
    next(error)
    return res.status(400).json({ error })
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    blog.likes += 1
    await blog.save()
    res.json({ likes: blog.likes })
  } catch (error) {
    next(error)
  }
})

module.exports = router
