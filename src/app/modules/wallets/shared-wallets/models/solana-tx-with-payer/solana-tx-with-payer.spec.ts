import { BlockchainTx } from "src/app/modules/wallets/shared-wallets/models/blockchain-tx/blockchain-tx";
import { FakeBlockchainTx } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-blockchain-tx";
import { SolanaTxWithPayer } from "./solana-tx-with-payer";


describe('SolanaTxWithPayer', () => {
  const testValue = 'aPayer';
  let solanaTx: BlockchainTx;

  beforeEach(() => {
    solanaTx = new SolanaTxWithPayer(new FakeBlockchainTx({ keys: [testValue] }));
  });

  it('new', () => {
    expect(solanaTx).toBeTruthy();
  });

  it('value', async () => {
    expect((await solanaTx.value()).feePayer).toEqual(testValue);
  });
});
