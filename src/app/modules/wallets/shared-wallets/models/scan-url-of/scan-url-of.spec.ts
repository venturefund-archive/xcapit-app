import { ScanUrlOf } from './scan-url-of';

describe('ScanUrlOf', () => {
  
  it('should new', () => {
    expect(new ScanUrlOf('test_hash', 'MATIC', { MATIC: 'https://polygonscan.com/' })).toBeTruthy();
  });
  
  it('should create', () => {
    expect(ScanUrlOf.create('test_hash', 'MATIC')).toBeTruthy();
  });
  
  it('should return scan url', () => {
    const scanUrlOf = new ScanUrlOf('test_hash', 'MATIC', { MATIC: 'https://polygonscan.com/' });
    expect(scanUrlOf.value()).toEqual('https://polygonscan.com/tx/test_hash');
  });
});
