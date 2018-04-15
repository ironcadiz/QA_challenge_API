'use strict';
module.exports = (sequelize, DataTypes) => {
  var Commit = sequelize.define('Commit', {
    branch: DataTypes.STRING,
    commitId: DataTypes.STRING,
    score: DataTypes.INTEGER,
  }, {});
  Commit.associate = function(models) {
    Commit.belongsTo(models.Repository, {foreignKey: "repositoryId"})
    Commit.belongsTo(models.user, {foreignKey: "userId"})
    Commit.hasMany(models.Score, {as: 'Scores', foreignKey: "commitId" })
  };
  return Commit;
};