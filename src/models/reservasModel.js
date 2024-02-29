const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Reservas",
      {
    
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      
      reserved: {
        type: DataTypes.ENUM("success", "pending", "failure"),
        allowNull: false,
        defaultValue: "pending",
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      paymentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      totalRooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      totalGuests: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      }
    },
    { timestamps: false, freezeTableName: true }
  );
};