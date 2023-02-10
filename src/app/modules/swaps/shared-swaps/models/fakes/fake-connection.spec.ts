import { FakeConnection } from './fake-connection';

describe('Fake Connection', () => {
  let connection: FakeConnection;

  beforeEach(() => {
    connection = new FakeConnection();
  });

  it('new', () => {
    expect(connection).toBeTruthy();
  });

  it('send transaction', async () => {
    expect(await connection.sendTransaction(null, [])).toBeTrue();
  });

  it('getTokenAccountsByOwner', async () => {
    expect(await connection.getTokenAccountsByOwner(null, null)).toBeTruthy();
  });

  it('getTokenAccountsByOwner custom seted', async () => {
    connection = new FakeConnection([]);
    expect((await connection.getTokenAccountsByOwner(null, null)).value).toEqual([]);
  });
});
