const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')

User.hasMany(Blog)
Blog.belongsTo(User)

// Blog.sync({ alter: true })
// User.sync({ alter: true })

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList })

module.exports = {
  Blog,
  User,
  ReadingList,
}
