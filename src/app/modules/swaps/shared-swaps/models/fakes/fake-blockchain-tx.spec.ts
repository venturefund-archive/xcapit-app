import { FakeBlockchainTx } from './fake-blockchain-tx';


describe('Fake Blockchain Tx', () => {
  it('new', () => {
    expect(new FakeBlockchainTx()).toBeTruthy();
  });

  it('value', async () => {
    const tx = new FakeBlockchainTx();

    expect(await tx.value()).toEqual({});
  });

  it('custom value', async () => {
    const testValue = 3000000;
    const tx = new FakeBlockchainTx({ getEstimatedFee: () => Promise.resolve(testValue) });

    expect(await (await tx.value()).getEstimatedFee()).toEqual(testValue);
  });
});
