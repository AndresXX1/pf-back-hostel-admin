const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Review = sequelize.define(
    "Review",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },


      userId:{

        type: DataTypes.INTEGER,
        allowNull:false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      surName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activo: { 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      

      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    { timestamps: false, freezeTableName: true }
  );

  return Review;
};