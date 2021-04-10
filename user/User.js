const Sequelize = require("sequelize");
const connection = require("../database/database");

//slug - versão do titulo otimizada para url's (sem espaços, tudo minusculo)
const User = connection.define('users', {
    email:{
            type: Sequelize.STRING,
            allowNull: false
    }, password:{
            type: Sequelize.STRING,
            allowNull: false
    }
})

// User.sync({force:true});

module.exports = User;