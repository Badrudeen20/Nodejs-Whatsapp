'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  Chat.init({
    user_mobile: DataTypes.INTEGER,
    friend_mobile: DataTypes.INTEGER,
    status:DataTypes.STRING,
    msg: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};