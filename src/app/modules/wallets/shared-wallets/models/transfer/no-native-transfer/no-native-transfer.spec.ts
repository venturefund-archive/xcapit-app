import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { Transfer } from '../transfer.interface';
import { NoNativeTransfer } from './no-native-transfer';
import { rawNoNativeTransfer } from '../../../fixtures/covalent-no-native-transfers.fixture';

fdescribe('NoNativeTransfer', () => {
  let noNativeTransfer: Transfer;
  const aTestAddress = '0x72fdeb93a64a0eb2b789a9ed87e65bff967928c3';
  const receivedIcon = 'assets/img/wallet-transactions/received.svg';

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

  it('type', () => {
    expect(noNativeTransfer.type()).toEqual('IN');
  });

  it('icon', () => {
    expect(noNativeTransfer.icon()).toEqual(receivedIcon);
  });
});
