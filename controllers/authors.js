const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { sequelize } = require('../util/db');

const { Blog, User } = require('../models');
const { SECRET } = require('../util/config');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7));
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

router.get('/', async (req, res) => {
  //   const where = {};

  //   if (req.query.search) {
  //     where[Op.or] = [
  //       { title: { [Op.substring]: req.query.search } },
  //       { author: { [Op.substring]: req.query.search } },
  //     ];
  //   }

  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: 'author',
    order: [['likes', 'DESC']],
  });
  res.json(blogs);
});

module.exports = router;
