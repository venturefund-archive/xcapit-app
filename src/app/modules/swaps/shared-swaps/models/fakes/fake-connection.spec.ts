import { Transaction, Signer } from '@solana/web3.js';

fdescribe('Fake Connection', () => {
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
});
