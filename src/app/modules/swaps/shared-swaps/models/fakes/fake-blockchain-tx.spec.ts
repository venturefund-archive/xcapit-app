import { FakeBlockchainTx } from "./fake-blockchain-tx";


describe('Fake Blockchain Tx', () => {

  it('new', () => {
    expect(new FakeBlockchainTx()).toBeTruthy();
  });

  it('value access', async () => {
    const tx = new FakeBlockchainTx();

    expect(await tx.value()).toEqual({});
  });
});
