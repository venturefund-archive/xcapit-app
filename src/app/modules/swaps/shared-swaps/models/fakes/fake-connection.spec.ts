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
    expect(await connection.sendTransaction(null, [])).toEqual('testHash');
  });
});
