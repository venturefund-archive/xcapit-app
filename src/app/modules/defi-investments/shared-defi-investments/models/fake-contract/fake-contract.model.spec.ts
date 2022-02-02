import { FakeContract } from './fake-contract.model';
import { BigNumber } from 'ethers';

fdescribe('FakeContract', () => {
  let fakeContract: FakeContract;

  beforeEach(() => {
    fakeContract = new FakeContract({ approval: () => Promise.resolve(BigNumber.from('15')) });
  });

  it('should create', () => {
    expect(fakeContract).toBeTruthy();
  });

  it('should return approval fake value', async () => {
    expect(await fakeContract.estimateGas.approval()).toEqual(BigNumber.from('15'));
  });
});
