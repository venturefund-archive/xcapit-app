import { Transaction, Signer } from '@solana/web3.js';

export class FakeConnection {
  sendTransaction(transaction: Transaction, signers: Signer[]): Promise<boolean> {
    return Promise.resolve(true);
  }
}

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
