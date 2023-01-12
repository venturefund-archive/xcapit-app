import { PasswordErrorMsgs, RawPasswordErrorMsgs } from "./password-error-msgs";


describe('PasswordErrorMsgs', () => {
  let passErrorMsgs: PasswordErrorMsgs;
  const testRawData: RawPasswordErrorMsgs = {
    invalid: 'invalid',
    empty: 'empty'
  };
  const anInvalidPassError = new Error(testRawData.invalid);
  const aNotPassError = new Error('no a pass error');
  const anEmptyPassError = new Error(testRawData.empty);

  beforeEach(() => {
    passErrorMsgs = new PasswordErrorMsgs(testRawData);
  });

  it('new', () => {
    expect(passErrorMsgs).toBeTruthy();
  });

  it('property access', () => {
    expect(passErrorMsgs.invalid()).toBeTruthy();
    expect(passErrorMsgs.empty()).toBeTruthy();
  });

  it('is an invalid error', () => {
    expect(passErrorMsgs.isInvalidError(aNotPassError)).toBeFalse();
    expect(passErrorMsgs.isInvalidError(anInvalidPassError)).toBeTrue();
  });

  it('is an invalid error', () => {
    expect(passErrorMsgs.isEmptyError(aNotPassError)).toBeFalse();
    expect(passErrorMsgs.isEmptyError(anEmptyPassError)).toBeTrue();
  });

  it('is a pass error', () => {
    expect(passErrorMsgs.isAPassError(aNotPassError)).toBeFalse();
    expect(passErrorMsgs.isAPassError(anEmptyPassError)).toBeTrue();
    expect(passErrorMsgs.isAPassError(anInvalidPassError)).toBeTrue();
  });
});
