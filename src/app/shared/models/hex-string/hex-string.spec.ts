import { HexString } from './hex-string';

describe('HexString', () => {
  const testHexString = '0x546869732069732061207465787420696e20686578';
  it('new', () => {
    expect(new HexString(testHexString)).toBeTruthy();
  });

  it('value when the input is a hex string', () => {
    expect(new HexString(testHexString).toUtf8()).toEqual('This is a text in hex');
  });

  it('value when the input is not a hex string', () => {
    expect(new HexString('some random string').toUtf8()).toEqual('some random string');
  });
});
