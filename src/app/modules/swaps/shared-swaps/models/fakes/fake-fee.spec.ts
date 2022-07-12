import { BigNumber } from '@ethersproject/bignumber';
import { Fee } from 'src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface';

export class FakeFee implements Fee {

  constructor(private _aTestData: string|number) { }

  async value(): Promise<BigNumber> {
    return BigNumber.from(this._aTestData);
  }
}

fdescribe('FakeFee', () => {

  const testData = 100;

  it('new', () => {
    expect(new FakeFee(testData)).toBeTruthy();
  });

  it('value', async () => {
    expect((await new FakeFee().value()).eq(100)).toBeTrue();
  });
});
