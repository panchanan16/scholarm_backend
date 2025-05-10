const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('scholarm', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql'
});

async function makeConnection(params) {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

makeConnection()