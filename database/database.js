const Sequelize  = require("sequelize");


const connection = new Sequelize('guiapressbanco','betizabp','beramones123',{
    host: 'mysql743.umbler.com',
    dialect: 'mysql',
    timezone: "-03:00"
});


module.exports = connection;