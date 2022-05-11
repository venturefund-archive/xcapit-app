import { FormattedAmount } from './formatted-amount';

describe('FormattedAmount', () => {
  it('should create', () => {
    expect(new FormattedAmount(15.6)).toBeTruthy();
  });

  it('should get entire number if no decimals', () => {
    expect(new FormattedAmount(15).value()).toEqual(15);
  });

  it('should get a max of 8 decimals rounded', () => {
    expect(new FormattedAmount(15.12345678918).value()).toEqual(15.12345679);
  });

  it('should not add unnecessary zeros at right', () => {
    expect(new FormattedAmount(15.123).value()).toEqual(15.123);
  });

  it('should get a max of 14 characters', () => {
    expect(new FormattedAmount(parseFloat('123456789.12345678918')).value()).toEqual(123456789.12346);
  });

  it('should get a max of 14 decimals if entire part is 14', () => {
    expect(new FormattedAmount(parseFloat('12345678912345.12345678918')).value()).toEqual(12345678912345);
  });

  it('should get a max of 16 decimals if entire part is 16', () => {
    expect(new FormattedAmount(parseFloat('1234567891234567.12345678918')).value()).toEqual(1234567891234567);
  });

  it('should transform with custom values', () => {
    expect(new FormattedAmount(15.12345678918, 5, 3).value()).toEqual(15.123);
  });
});
