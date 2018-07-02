import { client, clientWithAuth, startServer, FakeAdapter } from './setup';

test('signup - a new user', async () => {
  const req = client(await startServer());

  const result = await req.request(`mutation {
    signup(data: {name: "Roger", email: "roger@volst.nl", password: "testtest2"}) {
      token
      user {
        id
        name
      }
    }
  }`);

  expect((result as any).signup).toEqual({
    // Poorly check for a JWT token
    token: expect.stringContaining('.'),
    user: {
      id: '3',
      name: 'Roger'
    }
  });
});

test('signup - with existent user', async () => {
  const req = client(await startServer());
  expect.assertions(1);

  try {
    await req.request(`mutation {
    signup(data: {name: "Kees", email: "kees@volst.nl", password: "testtest2"}) {
      token
    }
  }`);
  } catch (e) {
    expect(String(e)).toMatch(/User already exists with this email/);
  }
});

test('signup - with weak password', async () => {
  const req = client(await startServer());
  expect.assertions(1);

  try {
    await req.request(`mutation {
    signup(data: {name: "Roger", email: "roger@volst.nl", password: "test"}) {
      token
    }
  }`);
  } catch (e) {
    expect(String(e)).toMatch(/Password is too short/);
  }
});

test('login - correct', async () => {
  const req = client(await startServer());

  const result = await req.request(`mutation {
    login(email: "kees@volst.nl", password: "testtest2") {
      token
      user {
        id
        name
      }
    }
  }`);

  expect((result as any).login).toEqual({
    // Poorly check for a JWT token
    token: expect.stringContaining('.'),
    user: {
      id: '2',
      name: 'Kees'
    }
  });
});

test('login - non-existent user', async () => {
  const req = client(await startServer());
  expect.assertions(1);

  try {
    await req.request(`mutation {
      login(email: "roger@volst.nl", password: "testtest2") {
        token
      }
  }`);
  } catch (e) {
    expect(String(e)).toMatch(/No user found/);
  }
});

test('login - wrong password', async () => {
  const req = client(await startServer());
  expect.assertions(1);

  try {
    await req.request(`mutation {
      login(email: "kees@volst.nl", password: "testtest1") {
        token
      }
  }`);
  } catch (e) {
    expect(String(e)).toMatch(/No user found/);
  }
});

test('update current user data - correct', async () => {
  const req = clientWithAuth(await startServer());

  const result = await req.request(`mutation {
    updateCurrentUser(data: {name: "Voldemort"}) {
      id
      name
    }
  }`);

  expect((result as any).updateCurrentUser).toEqual({
    id: '2',
    name: 'Voldemort'
  });
});

test('update current user data - wrong old passwd', async () => {
  const req = clientWithAuth(await startServer());
  expect.assertions(1);

  try {
    await req.request(`mutation {
      changePassword(oldPassword: "testtest3", newPassword: "testtest4") {
        id
      }
    }`);
  } catch (e) {
    expect(String(e)).toMatch(/Invalid old password/);
  }
});

test('update user password', async () => {
  const req = clientWithAuth(await startServer());

  const result = await req.request(`mutation {
    changePassword(oldPassword: "testtest2", newPassword: "testtest3") {
      id
    }
  }`);

  expect((result as any).changePassword).toEqual({
    id: '2'
  });

  // Now verify the password has actually been changed correctly.
  const result2 = await req.request(`mutation {
    login(email: "kees@volst.nl", password: "testtest3") {
      user {
        id
      }
    }
  }`);

  expect((result2 as any).login.user).toEqual({
    id: '2'
  });
});

test('trigger password reset - correct', async () => {
  const req = clientWithAuth(await startServer());
  expect.assertions(6);
  const spy = jest.spyOn(FakeAdapter.prototype, 'updateUserResetToken');

  const result = await req.request(`mutation {
    triggerPasswordReset(email: "kees@volst.nl") {
      ok
    }
  }`);

  expect(spy).toHaveBeenCalled();

  expect((result as any).triggerPasswordReset).toEqual({
    ok: true
  });

  const { resetToken } = await spy.mock.results[0].value;
  // Verify the resetToken is a UUID
  expect(resetToken.length).toBe(36);

  const result2 = await req.request(`mutation {
    passwordReset(email: "kees@volst.nl", password: "testtest4", resetToken: "${resetToken}") {
      id
    }
  }`);

  expect((result2 as any).passwordReset).toEqual({
    id: '2'
  });

  const result3 = await req.request(`mutation {
    login(email: "kees@volst.nl", password: "testtest4") {
      user {
        id
      }
    }
  }`);

  expect((result3 as any).login.user).toEqual({
    id: '2'
  });

  // Now verify that the resetToken is now invalid
  try {
    await req.request(`mutation {
      passwordReset(email: "kees@volst.nl", password: "badbadbad", resetToken: "${resetToken}") {
        id
      }
    }`);
  } catch (e) {
    expect(String(e)).toMatch(/No user found/);
  }

  spy.mockRestore();
});
