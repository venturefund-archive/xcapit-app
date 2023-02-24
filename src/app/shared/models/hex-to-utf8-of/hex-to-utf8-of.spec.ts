import { HexToUtf8Of } from './hex-to-utf8-of';

describe('HexToUtf8Of', () => {
  let testHexString = '0x546869732069732061207465787420696e20686578';
  it('new', () => {
    expect(new HexToUtf8Of(testHexString)).toBeTruthy();
  });

  it('value when the input is a hex string', () => {
    expect(new HexToUtf8Of(testHexString).value()).toEqual('This is a text in hex');
  });

  it('value when the input is not a hex string', () => {
    expect(new HexToUtf8Of('some random string').value()).toEqual('some random string');
  });
});
