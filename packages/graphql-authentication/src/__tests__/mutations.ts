import { client, startServer } from './setup';

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
