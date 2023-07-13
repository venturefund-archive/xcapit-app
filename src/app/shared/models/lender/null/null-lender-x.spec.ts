import { Lender } from '../lender.interface';
import { NullLenderX } from './null-lender-x';


describe('NullLenderX', () => {
  let lender: Lender;

  beforeEach(() => {
    lender = new NullLenderX();
  });

  it('new', () => {
    expect(lender).toBeTruthy();
  });

  it('json', () => {
    expect(lender.json()).toEqual(null);
  });
});
