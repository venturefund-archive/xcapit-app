import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { rawTransfer } from '../covalent-repo/default/covalent-transfers.fixture';
import { Transfer } from './transfer';

fdescribe('Transfer', () => {
  let transfer: Transfer;

  beforeEach(() => {
    transfer = new Transfer(rawTransfer, rawMATICData);
  });

  it('new', () => {
    expect(transfer).toBeTruthy();
  });

  it('fee', () => {
    expect(transfer.fee()).toEqual(0.024715417086192657);
  });
});
