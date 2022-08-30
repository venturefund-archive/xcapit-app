import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { Transfer } from '../transfer.interface';
import { NoNativeTransfer } from './no-native-transfer';
import { rawNoNativeTransfer } from '../../../fixtures/covalent-no-native-transfers.fixture';


fdescribe('NoNativeTransfer', () => {
  let noNativeTransfer: Transfer;
  const aTestAddress = '';

  beforeEach(() => {
    noNativeTransfer = new NoNativeTransfer(rawNoNativeTransfer, rawMATICData, aTestAddress);
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
    const rawData = noNativeTransfer.raw();

    expect(rawData.tx_hash).toEqual('0x7d81572bd8028f7a8a1ea1205f825ce0bf5dad2c757b38af4b78ec2e49e03db9');
    expect(rawData.hasOwnProperty('transfers')).toBeFalse();
  });
});
