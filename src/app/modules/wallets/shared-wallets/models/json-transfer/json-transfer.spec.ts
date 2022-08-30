import { rawTransfer } from '../../fixtures/covalent-transfers.fixture';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { JSONTransfer } from './json-transfer';
import { NativeTransfer } from '../transfer/native-transfer/native-transfer';
import { NoNativeTransfer } from '../transfer/no-native-transfer/no-native-transfer';
import { rawNoNativeTransfer } from '../../fixtures/covalent-no-native-transfers.fixture';

fdescribe('JSONTransfer', () => {
  let jsonTransfer: JSONTransfer;
  const aTestAddress = '0x1111111254fb6c44bac0bed2854e76f90643097d';

  beforeEach(() => {
    jsonTransfer = new JSONTransfer(new NativeTransfer(rawTransfer, rawMATICData, aTestAddress));
  });

  it('new', () => {
    expect(jsonTransfer).toBeTruthy();
  });

  it('value', () => {
    const value = jsonTransfer.value();
    expect(value.tx_hash).toEqual('0x7d81572bd8028f7a8a1ea1205f825ce0bf5dad2c757b38af4b78ec2e49e03db9');
    expect(value.type).toEqual('IN');
    expect(value.icon).toEqual('assets/img/wallet-transactions/received.svg');
  });

  it('value when no native transfer', () => {
    jsonTransfer = new JSONTransfer(new NoNativeTransfer(rawNoNativeTransfer, rawMATICData, aTestAddress));
    const value = jsonTransfer.value();
    expect(value.tx_hash).toEqual('0x7d81572bd8028f7a8a1ea1205f825ce0bf5dad2c757b38af4b78ec2e49e03db9');
    expect(value.type).toEqual('IN');
    expect(value.icon).toEqual('assets/img/wallet-transactions/received.svg');
  });
