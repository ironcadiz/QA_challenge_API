
module.exports = (sequelize, DataTypes) => {
  var Score = sequelize.define('Score', {
    type: DataTypes.STRING,
    message: DataTypes.STRING,
    value: DataTypes.INTEGER,
    commitId: DataTypes.INTEGER
  }, {});
  Score.associate = function(models) {
    Score.belongsTo(models.Commit,{foreignKey: "commitId"})
  };
  return Score;
};