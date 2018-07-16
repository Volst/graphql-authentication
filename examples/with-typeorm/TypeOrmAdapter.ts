import { getRepository } from 'typeorm';
import { User } from './database';
import { GraphqlAuthenticationAdapter } from './node_modules/graphql-authentication';

// There currently is no package for a TypeORM adapter, so we create one ourselves!

export class GraphqlAuthenticationTypeOrmAdapter
  implements GraphqlAuthenticationAdapter {
  private db() {
    return getRepository(User);
  }
  async findUserById(ctx: object, id, info) {
    return (await this.db().findOne(id)) || null;
  }
  async findUserByEmail(ctx: object, email, info) {
    return (await this.db().findOne({ where: { email } })) || null;
  }
  async userExistsByEmail(ctx: object, email) {
    const user = await this.db().count({ email });
    return user > 0;
  }

  // the _createUser and _updateUser methods are just helper methods, they are not used by graphql-authentication.
  async _createUser(ctx: object, data) {
    const user = ((await this.db().create(data)) as any) as User;
    await this.db().save(user);
    return user;
  }
  async _updateUser(ctx: object, userId, data) {
    return await this.db().update(userId, { name: 'kees' })[0];
  }

  createUserBySignup(ctx: object, data) {
    return this._createUser(ctx, data);
  }
  createUserByInvite(ctx: object, data) {
    return this._createUser(ctx, data);
  }
  updateUserConfirmToken(ctx: object, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
  updateUserLastLogin(ctx: object, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
  updateUserPassword(ctx: object, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
  updateUserResetToken(ctx: object, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
  updateUserInfo(ctx: object, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
  updateUserCompleteInvite(ctx: object, userId, data) {
    return this._updateUser(ctx, userId, data);
  }
}
