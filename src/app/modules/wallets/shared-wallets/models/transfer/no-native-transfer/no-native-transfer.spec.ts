import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { Transfer } from '../transfer.interface';
import { rawTransfer } from '../../../fixtures/covalent-transfers.fixture';
import { NoNativeTransfer } from './no-native-transfer';
import { rawNoNativeTransfer } from '../../../fixtures/covalent-no-native-transfers.fixture';

fdescribe('NoNativeTransfer', () => {
  let noNativeTransfer: Transfer;

  beforeEach(() => {
    noNativeTransfer = new NoNativeTransfer(rawTransfer, rawMATICData);
  });

  it('new', () => {
    expect(noNativeTransfer).toBeTruthy();
  });

  it('fee', () => {
    expect(noNativeTransfer.fee()).toEqual(0.024715417086192657);
  });
  it('token', () => {
    expect(noNativeTransfer.token()).toEqual(rawMATICData);
  });

  it('raw', () => {
    expect(noNativeTransfer.raw()).toEqual(rawNoNativeTransfers);
  });
});
