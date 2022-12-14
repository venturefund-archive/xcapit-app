import { rawSAMOData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { SolanaToken } from 'src/app/modules/swaps/shared-swaps/models/token/solana/solana-token';
import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { AssociatedTokenAddress } from './associated-token-address';


describe('AssociatedTokenAddress', () => {
  let address: AssociatedTokenAddress;
  const token = new SolanaToken(rawSAMOData);
  const testWalletAddress = 'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH';
  const expectedAssocitedAddress = 'H8VeStfXPSCgECu3J4qcGSmvJJQEwoxW1W9XSX56oEzu';

  beforeEach(() => {
    address = new AssociatedTokenAddress(
      token,
      new FakeWallet(Promise.resolve(false), null, testWalletAddress)
    );
  });

  it('new', () => {
    expect(address).toBeTruthy();
  });

  it('value', async () => {
    expect((await address.value()).toString()).toEqual(expectedAssocitedAddress);
  });
});
