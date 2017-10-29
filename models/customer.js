
module.exports = (sequelize, DataTypes) => {
  let Prospect = sequelize.define("Prospect", {
    firstName: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    title: DataTypes.STRING,
    company: DataTypes.STRING,
    email: { 
      type: DataTypes.STRING,
      validate: {isEmail: true}
    },
    mobile: DataTypes.STRING,
    work: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING
  });

  Prospect.associate = (models) => {
    Prospect.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Prospect;
};



