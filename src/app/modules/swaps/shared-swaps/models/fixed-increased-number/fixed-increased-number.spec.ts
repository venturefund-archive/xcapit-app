import { FixedIncreasedNumber } from "./fixed-increased-number";


describe('Fixed Increased Number', () => {

  it('new', () => {
    expect(new FixedIncreasedNumber(100, 25)).toBeTruthy();
  });

  it('value access', () => {
    const expectedValue = 166;
    const fixedIncreasedNumber = new FixedIncreasedNumber(133, 25);

    expect(fixedIncreasedNumber.value()).toEqual(expectedValue);
  });
});
