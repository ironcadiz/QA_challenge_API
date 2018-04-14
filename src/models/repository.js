module.exports = (sequelize, DataTypes) => {
  var Repository = sequelize.define(
    "Repository",
    {
      name: DataTypes.STRING,
      score: DataTypes.INTEGER,
      url: DataTypes.STRING,
      repoId: DataTypes.STRING
    },
    {}
  )
  Repository.associate = function(models) {
    Repository.belongsTo(model.user, {foreignKey:"ownerId"})
    Repository.hasMany(models.commits, {foreignKey:"repositoryId"})
    Repository.belongsToMany(user, {through: 'users_has_repositories'});     

  }
  return Repository
}
