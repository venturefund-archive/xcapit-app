import { BigNumber } from 'ethers';
import { FakeContract } from '../../../../modules/defi-investments/shared-defi-investments/models/fake-contract/fake-contract.model';
import { GasFeeOf } from '../gas-fee-of.model';
import { GasFeeOfFactory } from './gas-fee-of.factory';

describe('GasFeeOfFactory', () => {
  let fakeContract: FakeContract;
  let gasFeeOfFactory: GasFeeOfFactory;

  beforeEach(() => {
    fakeContract = new FakeContract({ transfer: () => Promise.resolve(BigNumber.from('10')) });
    gasFeeOfFactory = new GasFeeOfFactory();
  });

  it('create', () => {
    expect(gasFeeOfFactory).toBeTruthy();
  });

  it('new', () => {
    expect(gasFeeOfFactory.new(fakeContract, 'transfer', [])).toBeInstanceOf(GasFeeOf);
  });
});
