class GraphqlAuthenticationInMemoryAdapter {
  constructor() {
    this.users = [];
  }
  // If you'd use a database you wouldn't need this
  _generateId() {
    const lastUser = this.users[this.users.length - 1];
    if (lastUser) {
      return String(parseInt(lastUser.id) + 1);
    }
    return '1';
  }

  findUserById(ctx, id, info) {
    return Promise.resolve(this.users.find(user => user.id === id) || null);
  }
  findUserByEmail(ctx, email, info) {
    return Promise.resolve(
      this.users.find(user => user.email === email) || null
    );
  }
  async userExistsByEmail(ctx, email) {
    return Promise.resolve(this.users.some(user => user.email === email));
  }

  _createUser(ctx, data) {
    const user = { id: this._generateId(), ...data };
    this.users.push(user);
    return Promise.resolve(user);
  }
  async _updateUser(ctx, userId, data) {
    const user = await this.findUserById(ctx, userId);
    Object.assign(user, data);
    return Promise.resolve(user);
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

module.exports = { GraphqlAuthenticationInMemoryAdapter };
