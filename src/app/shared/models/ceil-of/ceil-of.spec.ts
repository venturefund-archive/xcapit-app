import CeilOf from './ceil-of';


describe('CeilOf', () => {
  it('new', () => {
    expect(new CeilOf(10.4153)).toBeTruthy();
  });

  it('value', () => {
    expect(new CeilOf(10.4153, 2).value()).toEqual(10.42);
  });

  it('value with 3 decimals', () => {
    expect(new CeilOf(10.4143, 3).value()).toEqual(10.415);
  });

  it('value with 5 decimals', () => {
    expect(new CeilOf(10.4153517, 5).value()).toEqual(10.41536);
  });

  it('value with less decimals than required', () => {
    expect(new CeilOf(10.42, 5).value()).toEqual(10.42);
  });

  it('value with more decimals than required', () => {
    expect(new CeilOf(10.4211111, 2).value()).toEqual(10.43);
  });
});
