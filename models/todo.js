'use strict';
const {
  Model
} = require('sequelize');
const company = require('./company');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Todo.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    content: DataTypes.STRING,
    companyId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Company',
        key: 'id'
      },
      field: 'company_id',
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'Todo',
    tableName: 'todo',
    timestamps: false
  });
  return Todo;
};