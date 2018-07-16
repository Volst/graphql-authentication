const Sequelize = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite' });

const User = sequelize.define('user', {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  name: Sequelize.STRING,
  inviteToken: Sequelize.STRING,
  inviteAccepted: Sequelize.BOOLEAN,
  emailConfirmed: Sequelize.BOOLEAN,
  emailConfirmToken: Sequelize.STRING,
  resetToken: Sequelize.STRING,
  resetExpires: Sequelize.DATE,
  deletedAt: Sequelize.DATE,
  lastLogin: Sequelize.DATE,
  joinedAt: Sequelize.DATE,
  isSuper: Sequelize.BOOLEAN
});

sequelize.sync();

module.exports = { User };
