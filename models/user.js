
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define("User", {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		validate: {isEmail: true}
	},
	password: {
		type: DataTypes.STRING,
		len: [1]
	},
	phone: {
		type: DataTypes.STRING,
		len: [1]
	},
  });

  User.associate = (models) => {
    User.hasMany(models.Prospect, {
      onDelete: "cascade"
    });
  };

  return User;
};



