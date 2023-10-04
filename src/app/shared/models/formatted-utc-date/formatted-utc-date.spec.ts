import { UtcFormatOf } from './utc-format-of';

describe('FormattedUtcDate', () => {
  let utcFormatOf: UtcFormatOf;
  const aDate = new Date('01/10/1994');

  beforeEach(() => {
    utcFormatOf = new UtcFormatOf(aDate);
  });

  it('new', () => {
    expect(utcFormatOf).toBeTruthy();
  });

  it('value', () => {
    expect(utcFormatOf.value()).toEqual('1994-01-10T03:00:00Z');
  });
});
