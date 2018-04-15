"use strict"
const bcrypt = require("bcryptjs")

async function buildPasswordHash(instance) {
  if (instance.changed("password")) {
    const hash = await bcrypt.hash(instance.password, 10)
    instance.set("password", hash)
  }
}

module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gitToken: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      classMethods: {
        associate: function(models) {
          user.hasMany(models.Repository, {foreignKey:"ownerId"})
          user.hasMany(models.Commits, {foreignKey:"userId"})
          user.belongsToMany(models.Repository, {as: "Contributed", through: 'Users_has_repositories', foreignKey:"userId"});     
        },
      },
    }
  )
  user.beforeUpdate(buildPasswordHash)
  user.beforeCreate(buildPasswordHash)
  user.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password)
  }
  return user
}
