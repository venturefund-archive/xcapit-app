import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { FakeBlockchainTx } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-blockchain-tx';
import { rawSolanaData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { SolanaFeeOfInjectable } from './solana-fee-of-injectable';


describe('SolanaFeeOfInjectable', () => {

  let injectable: SolanaFeeOfInjectable;

  beforeEach(() => {
    injectable = new SolanaFeeOfInjectable();
  });

  it('new', () => {
    expect(injectable).toBeTruthy();
  });

  it('create', () => {
    expect(injectable.create([new FakeBlockchainTx()], new Blockchain(rawSolanaData))).toBeTruthy();
  });
});
