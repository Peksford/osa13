const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { Blog, User, ReadingList } = require('../models')
const { SECRET } = require('../util/config')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    console.log('What is the request', req.body.blog_id)
    const user_id = req.body.user_id
    const blog_id = req.body.blog_id
    const read = await ReadingList.create({
      userId: user_id,
      blogId: blog_id,
    })
    await read.save()
    res.json(read)
  } catch (error) {
    next(error)
    // return res.status(400).json({ error });
  }
})

module.exports = router
