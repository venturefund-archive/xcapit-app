import { FormattedAmountPipe } from './formatted-amount.pipe';

describe('FormattedAmountPipe', () => {
  let pipe: FormattedAmountPipe;

  beforeEach(() => {
    pipe = new FormattedAmountPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a number', () => {
    expect(pipe.transform(15.12345678918)).toEqual(15.12345679);
  });

  it('should transform an undefined value', () => {
    expect(pipe.transform(undefined)).toEqual(undefined);
  });

  it('should transform with custom values', () => {
    expect(pipe.transform(15.12345678918, 5, 3)).toEqual(15.123);
  });
});
