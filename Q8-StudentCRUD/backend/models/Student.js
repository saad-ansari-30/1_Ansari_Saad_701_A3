const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Student = sequelize.define(
    "Student",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        mobile: {
            type: DataTypes.STRING,
            allowNull: false
        },

        course: {
            type: DataTypes.STRING,
            allowNull: false
        },

        city: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "Students",
        timestamps: true
    }
);

module.exports = Student;