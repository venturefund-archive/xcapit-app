import { FakeConnection } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-connection';
import { rawSAMOData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { SolanaToken } from 'src/app/modules/swaps/shared-swaps/models/token/solana/solana-token';
import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { AssociatedTokenAddress } from '../associated-token-address/associated-token-address';
import { AssociatedTokenAccountTxOf } from './associated-token-account-tx-of';


fdescribe('AssociatedTokenAccountTxOf', () => {
  let ataTxOf: AssociatedTokenAccountTxOf;
  const token = new SolanaToken(rawSAMOData);
  const connection = new FakeConnection();
  const testWalletAddress = 'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH';

  beforeEach(() => {
    ataTxOf = new AssociatedTokenAccountTxOf(
      new AssociatedTokenAddress(
        token,
        testWalletAddress,
        connection
      ),
      new FakeWallet(Promise.resolve(false), '', testWalletAddress),
    );
  });

  it('new', () => {
    expect(ataTxOf).toBeTruthy();
  });

  it('value', async () => {
    expect(await ataTxOf.value()).toBeTruthy();
  });
});
