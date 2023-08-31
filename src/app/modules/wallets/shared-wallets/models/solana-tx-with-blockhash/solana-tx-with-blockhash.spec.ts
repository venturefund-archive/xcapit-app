import { BlockchainTx } from "src/app/modules/wallets/shared-wallets/models/blockchain-tx/blockchain-tx";
import { FakeBlockchainTx } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-blockchain-tx";
import { FakeConnection } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-connection";
import { SolanaTxWithBlockhash } from "./solana-tx-with-blockhash";


describe('SolanaTxWithBlockhash', () => {
  let solanaTx: BlockchainTx;

  beforeEach(() => {
    solanaTx = new SolanaTxWithBlockhash(
      new FakeBlockchainTx(), new FakeConnection());
  });

  it('new', () => {
    expect(solanaTx).toBeTruthy();
  });

  it('value', async () => {
    expect((await solanaTx.value()).recentBlockhash).toBeTruthy();
  });
});
