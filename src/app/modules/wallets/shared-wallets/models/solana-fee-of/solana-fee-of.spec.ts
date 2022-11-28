import { BlockchainTx } from "src/app/modules/swaps/shared-swaps/models/blockchain-tx";
import { FakeBlockchainTx } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-blockchain-tx";
import { FakeConnection } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-connection";
import { SolanaFeeOf } from "./solana-fee-of";


describe('SolanaFeeOf', () => {
  let fee: SolanaFeeOf;
  const testFeeValue = 70000000;
  const aFakeBlockchainTx = (): BlockchainTx => {
    return new FakeBlockchainTx({ getEstimatedFee: () => Promise.resolve(testFeeValue), keys: [] });
  }

  beforeEach(() => {
    fee = new SolanaFeeOf(
      [aFakeBlockchainTx()],
      new FakeConnection()
    );
  });

  it('new', () => {
    expect(fee).toBeTruthy();
  });

  it('value', async () => {
    expect(await fee.value()).toEqual(testFeeValue);
  });

  it('value of multiples transactions', async () => {
    fee = new SolanaFeeOf(
      [aFakeBlockchainTx(), aFakeBlockchainTx()],
      new FakeConnection()
    );

    expect(await fee.value()).toEqual(testFeeValue * 2);
  });
});
