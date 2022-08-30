import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { Transfer } from '../transfer.interface';
import { NativeTransfer } from './native-transfer';
import { rawTransfer } from '../../../fixtures/covalent-transfers.fixture';

fdescribe('NativeTransfer', () => {
  let nativeTransfer: Transfer;

  beforeEach(() => {
    nativeTransfer = new NativeTransfer(rawTransfer, rawMATICData);
  });

  it('new', () => {
    expect(nativeTransfer).toBeTruthy();
  });

  it('fee', () => {
    expect(nativeTransfer.fee()).toEqual(0.024715417086192657);
  });

  it('token', () => {
    expect(nativeTransfer.token()).toEqual(rawMATICData);
  });

  it('raw', () => {
    expect(nativeTransfer.raw()).toEqual(rawTransfer);
  });
});
