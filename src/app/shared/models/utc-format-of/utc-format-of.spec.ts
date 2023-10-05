import { UtcFormatOf } from './utc-format-of';

describe('UtcFormatOf', () => {
  let utcFormatOf: UtcFormatOf;
  const aDate = new Date('1994-01-10T03:00:00Z');

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
