import { FakeConnection } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-connection';
import { rawSAMOData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { SolanaToken } from 'src/app/modules/swaps/shared-swaps/models/token/solana/solana-token';
import { AssociatedTokenAddress } from './associated-token-address';


fdescribe('AssociatedTokenAddress', () => {
  let ata: AssociatedTokenAddress;
  const token = new SolanaToken(rawSAMOData);
  const testAddress = 'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH';
  const expectedAssocitedAddress = 'H8VeStfXPSCgECu3J4qcGSmvJJQEwoxW1W9XSX56oEzu';

  beforeEach(() => {
    ata = new AssociatedTokenAddress(token, testAddress, new FakeConnection());
  });

  it('new', () => {
    expect(ata).toBeTruthy();
  });

  it('value', async () => {
    expect((await ata.value()).toString()).toEqual(expectedAssocitedAddress);
  });

  it('in blockchain', async () => {
    expect(await ata.inBlockchain()).toBeTrue();
  });

  it('token', () => {
    expect(ata.token()).toEqual(token);
  });

  it('address', () => {
    expect(ata.address()).toEqual(testAddress);
  });
});
