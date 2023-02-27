import { rawStoredWalletData } from '../../../../swaps/shared-swaps/models/fixtures/raw-stored-wallet-data';
import { AddressesToSave } from './addresses-to-save';

describe('AddressesToSave', () => {
  let addressesToSave: AddressesToSave;

  beforeEach(() => {
    addressesToSave = new AddressesToSave(rawStoredWalletData.enc_wallet);
  });

  it('new', () => {
    expect(addressesToSave).toBeTruthy();
  });

  it('toJson', () => {
    const expectedJson = [
      { network: 'ERC20', address: '0x0' },
      { network: 'MATIC', address: '0x1' },
      { network: 'SOLANA', address: '0x2' },
    ];
    expect(addressesToSave.toJson()).toEqual(expectedJson);
  });
});
