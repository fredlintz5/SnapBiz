
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define("User", {
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		validate: {isEmail: true},
		unique: true
	},
	password: {
		type: DataTypes.STRING,
		len: [1],
		allowNull: false
	}
  });

  User.associate = (models) => {
    User.hasMany(models.Prospect, {
      onDelete: "cascade"
    });
  };

  return User;
};



