const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { Blog, User, ReadingList } = require('../models')
const { SECRET } = require('../util/config')
const { tokenExtractor } = require('../util/middleware')

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user_id = req.body.user_id
    const blog_id = req.body.blog_id

    const checkList = await ReadingList.findOne({
      where: { userId: user_id, blogId: blog_id },
    })

    if (checkList) {
      return res
        .status(403)
        .json({ error: 'You have already added this blog into readinglist' })
    }

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

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const read = await ReadingList.findByPk(req.params.id)
    const user = await User.findByPk(req.decodedToken.id)

    if (read.userId === user.id) {
      read.read = true
    }
    await read.save()
    res.json(read)
  } catch (error) {
    next(error)
    // return res.status(400).json({ error });
  }
})

module.exports = router
