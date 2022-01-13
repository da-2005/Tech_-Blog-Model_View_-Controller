const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// use bcrypt for password hashing
const bcrypt = require('bcrypt');

class User extends Model {
    // sets up an instance that checks if a login is correct when a user provides one
    checkPassword(loginPw) {
        // this.password is the saved hashed password from the database
        return bcrypt.compareSync(loginPw, this.password);
    };
}

// defining a table and its columns and configurations
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [10]
            }
        }

    },

    {
        hooks: {
            // Before a new user object is inserted in the database, its passoweord property will be a hashed value
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },

            // If a user wants to update thier password and thye actually have a password types in then it is hashed before being saved into the database
            async beforeUpdate(updatedUserData) {
                if (updatedUserData) {
                    updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                }
                return updatedUserData;
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);

module.exports = User;