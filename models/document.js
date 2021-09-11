'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Document.init({
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    type: DataTypes.STRING,
    posted: DataTypes.DATEONLY
  }, {
    sequelize,
    tableName: 'documents',
    modelName: 'Document',
  });
  return Document;
};