import { FakeBlockchainTx } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-blockchain-tx";
import { FakeConnection } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-connection";
import { SolanaFeeOf } from "./solana-fee-of";


describe('SolanaFeeOf', () => {
  let fee: SolanaFeeOf;
  const testFeeValue = 70000000;

  beforeEach(() => {
    fee = new SolanaFeeOf(
      new FakeBlockchainTx({ getEstimatedFee: () => Promise.resolve(testFeeValue), keys: [] }),
      new FakeConnection()
    );
  });

  it('new', () => {
    expect(fee).toBeTruthy();
  });

  it('value', async () => {
    expect(await fee.value()).toEqual(testFeeValue);
  });
});
