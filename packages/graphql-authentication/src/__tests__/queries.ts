import { client, startServer, clientWithAuth } from './setup';

test('currentUser - throw error when login fails', async () => {
  const req = client(await startServer());
  expect.assertions(1);

  try {
    await req.request(`query {
      currentUser {
        name
      }
    }`);
  } catch (e) {
    expect(String(e)).toMatch(/Not authorized/);
  }
});

test('currentUser - fetch user data', async () => {
  const req = clientWithAuth(await startServer());

  const result = await req.request(`query {
    currentUser {
      name
    }
  }`);

  expect((result as any).currentUser.name).toBe('Kees');
});
