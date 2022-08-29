import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';

fdescribe('NativeTransfer', () => {
  let nativeTransfer: Transfer;

  beforeEach(() => {
    transfer = new Transfer(rawTransfer, rawMATICData);
  });

  it('new', () => {
    expect(transfer).toBeTruthy();
  });

  it('fee', () => {
    expect(transfer.fee()).toEqual(0.024715417086192657);
  });
  it('token', () => {
    expect(transfer.token()).toEqual(rawMATICData);
  });

  it('raw', () => {
    expect(transfer.raw()).toEqual(rawTransfer);
  });
});