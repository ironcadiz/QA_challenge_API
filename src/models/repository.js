var fs = require('fs');

module.exports = (sequelize, DataTypes) => {
  var Repository = sequelize.define(
    "Repository",
    {
      name: DataTypes.STRING,
      fullName: DataTypes.STRING,
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
  Repository.hook("afterCreate" ,function(repository, options){
    fs.createReadStream('src/public/default_rules.json').pipe(fs.createWriteStream(`src/public/${repository.repoId}_rules.json`));
  })
  return Repository
}
