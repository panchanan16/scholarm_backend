const { Sequelize } = require("sequelize")

const Authors = Sequelize.define(
    'Authors',
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
    },
    {
        tableName: 'Authors',
    }
);

module.exports = Authors;