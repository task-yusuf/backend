const { DataTypes, Model } = require('sequelize');
const sequelizePromise = require('../config/database');

class Todo extends Model {}

async function initModel() {
    const sequelize = await sequelizePromise;
    
    Todo.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Todo'
    });

    return Todo;
}

module.exports = initModel();