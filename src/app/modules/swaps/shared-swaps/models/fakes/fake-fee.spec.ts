import { BigNumber } from '@ethersproject/bignumber';
import { Fee } from 'src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface';
import { FakeFee } from './fake-fee';


fdescribe('FakeFee', () => {

  let fee: FakeFee;
  const testData = 100;

  beforeEach(() => {
    fee = new FakeFee(testData);
  });

  it('new', () => {
    expect(fee).toBeTruthy();
  });

  it('value', async () => {
    expect((await fee.value()).eq(testData)).toBeTrue();
  });
});
