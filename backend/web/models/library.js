const Sequelize  = require ('sequelize');

const sequelize = require('../util/database');

const Library = sequelize.define('library', {
    bookId: {        
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
        
    },
    name: {        
        type: Sequelize.TEXT,
        allowNull: false
    },
    author: {        
        type: Sequelize.TEXT,
        allowNull: false
    },
    description: {        
        type: Sequelize.TEXT,
        allowNull: false
    },
    link: {        
        type: Sequelize.TEXT
    }
    
} ,{freezeTableName: true});

module.exports = Library;