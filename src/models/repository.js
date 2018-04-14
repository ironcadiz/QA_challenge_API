module.exports = (sequelize, DataTypes) => {
  var Repository = sequelize.define(
    "Repository",
    {
      name: DataTypes.STRING,
      repoId: DataTypes.STRING,
      score: DataTypes.INTEGER,
      ownerId: DataTypes.INTEGER,
    },
    {}
  )
  Repository.associate = function(models) {
    Repository.belongsTo(model.user, {foreignKey:"ownerId"})
  }
  return Repository
}
