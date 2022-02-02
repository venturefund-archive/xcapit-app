import { Fee } from '../../interfaces/fee.interface';
import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber } from 'ethers';
import { NativeFeeOf } from './native-fee-of.model';

describe('NativeFeeOf', () => {
  let providerSpy: jasmine.SpyObj<Provider>;
  let feeSpy: jasmine.SpyObj<Fee>;

  beforeEach(() => {
    feeSpy = jasmine.createSpyObj('GasFeeOf', { value: Promise.resolve(BigNumber.from('5')) });
    providerSpy = jasmine.createSpyObj(
      'Provider',
      { getGasPrice: Promise.resolve(BigNumber.from('2500000007')) },
      {
        _isProvider: true,
      }
    );
  });

  it('should create', () => {
    expect(new NativeFeeOf(feeSpy, providerSpy)).toBeTruthy();
  });

  it('should get native fee value', async () => {
    expect(await new NativeFeeOf(feeSpy, providerSpy).value()).toEqual(BigNumber.from('12500000035'));
  });
});
