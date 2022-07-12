import { BigNumber } from '@ethersproject/bignumber';
import { Fee } from 'src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface';

export class FakeFee implements Fee {

  async value(): Promise<BigNumber> {
    return BigNumber.from(100);
  }
}

fdescribe('FakeFee', () => {

  const testData = 100;

  it('new', () => {
    expect(new FakeFee()).toBeTruthy();
  });

  it('value', async () => {
    expect((await new FakeFee().value()).eq(100)).toBeTrue();
  });
});
