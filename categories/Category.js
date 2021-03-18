const Sequelize = require("sequelize");
const connection = require("../database/database");

//slug - versão do titulo otimizada para url's (sem espaços, tudo minusculo)
const Category = connection.define('categories', {
    title:{
            type: Sequelize.STRING,
            allowNull: false
    }, slug:{
            type: Sequelize.STRING,
            allowNull: false
    }
})

//Category.sync({force:true});

module.exports = Category;