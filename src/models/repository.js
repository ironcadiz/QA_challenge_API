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
    Repository.belongsTo(models.user, {foreignKey:"ownerId"})
    Repository.hasMany(models.Commit, {as: 'Commits', foreignKey:"repositoryId"})
    Repository.belongsToMany(models.user, {through: 'users_has_repositories'});     

  }
  return Repository
}
