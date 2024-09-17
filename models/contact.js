'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Contact.hasMany(models.User, { foreignKey: 'mobile' });
    }
  }
  Contact.init({
    user_mobile: DataTypes.INTEGER,
    username: DataTypes.STRING,
    friend_mobile: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Contact',
  });
  return Contact;
};