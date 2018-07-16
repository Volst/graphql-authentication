const { User } = require('./database');

// There currently is no package for a sequelize adapter, so we create one ourselves!

class GraphqlAuthenticationSequelizeAdapter {
  findUserById(ctx, id, info) {
    return User.findById(id);
  }
  findUserByEmail(ctx, email, info) {
    return User.findOne({ where: { email } });
  }
  async userExistsByEmail(ctx, email) {
    const user = await User.count({ where: { email } });
    return user > 0;
  }

  // the _createUser and _updateUser methods are just helper methods, they are not used by graphql-authentication.
  _createUser(ctx, data) {
    return User.create(data);
  }
  _updateUser(ctx, userId, data) {
    return User.update(data, { where: { id: userId } });
  }

  createUserBySignup(ctx, data) {
    return this._createUser(ctx, data);
  }
  createUserByInvite(ctx, data) {
    return this._createUser(ctx, data);
  }
  updateUserConfirmToken(ctx, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
  updateUserLastLogin(ctx, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
  updateUserPassword(ctx, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
  updateUserResetToken(ctx, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
  updateUserInfo(ctx, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
  updateUserCompleteInvite(ctx, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
}

module.exports = { GraphqlAuthenticationSequelizeAdapter };
