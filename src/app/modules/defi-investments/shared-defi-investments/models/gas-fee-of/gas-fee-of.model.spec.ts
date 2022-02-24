import { BigNumber, Contract } from 'ethers';
import { GasFeeOf } from './gas-fee-of.model';

describe('GasFee', () => {
  let contractSpy: jasmine.SpyObj<Contract>;
  let args: any[];
  beforeEach(() => {
    contractSpy = jasmine.createSpyObj(
      'Contract',
      {},
      { estimateGas: { approve: () => Promise.resolve(BigNumber.from('15')) } }
    );
    args = ['0x0000001', 100];
  });

  it('should create', () => {
    expect(new GasFeeOf(contractSpy, 'approve', args)).toBeTruthy();
  });

  it('should get fee', async () => {
    const value = await new GasFeeOf(contractSpy, 'approve', args).value();
    expect(value).toEqual(BigNumber.from('15'));
  });
});
