import { Password } from "./password";


describe('Password', () => {

  const aStringValue = '1324';
  let aPassword: Password;

  beforeEach(() => {
    aPassword = new Password(aStringValue);
  });

  it('new', () => {
    expect(aPassword).toBeTruthy();
  });

  it('value access', () => {
    expect(aPassword.value()).toEqual(aStringValue);
  });

  it('empty value throw an exception', () => {
    expect(() => new Password('').value()).toThrowError();
    expect(() => new Password(undefined).value()).toThrowError();
  });
});
