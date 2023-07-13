import { Lender } from '../../lender/lender.interface';
import { Lenders } from '../lenders.interface';
import { FakeLenders } from './fake-lenders';
import { FakeLender } from '../../lender/fake/fake-lender';

describe('FakeLenders', () => {
  let lenders: Lenders;
  let lender: Lender;
  beforeEach(() => {
    lender = new FakeLender();
    lenders = new FakeLenders(lender);
  });

  it('new', () => {
    expect(lenders).toBeTruthy();
  });

  it('oneByName', () => {
    expect(lenders.oneByName('aName')).toEqual(lender);
  });
});
