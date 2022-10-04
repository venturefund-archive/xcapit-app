import { Transaction, Signer } from "@solana/web3.js";

export class FakeConnection {

  sendTransaction(transaction: Transaction, Signer[]) {
    return true;
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

  it('send transaction', () => {
    expect(connection.sendTransaction()).toBeTruthy();
  });
});
