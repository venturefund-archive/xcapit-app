import { Lender } from '../lender.interface';
import { NullLender } from './null-lender';


describe('NullLender', () => {
  let lender: Lender;

  beforeEach(() => {
    lender = new NullLender();
  });

  it('new', () => {
    expect(lender).toBeTruthy();
  });

  it('json', () => {
    expect(lender.json()).toEqual(null);
  });
});
