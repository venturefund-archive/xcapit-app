import { NullWCUri } from './null-wc-uri';

describe('NullWCUri', () => {
  let nullWCUri: NullWCUri;

  beforeEach(() => {
    nullWCUri = new NullWCUri();
  });

  it('new', () => {
    expect(nullWCUri).toBeTruthy();
  });

  it('value', () => {
    expect(nullWCUri.value()).toEqual('');
  });

  it('isV2', () => {
    expect(nullWCUri.isV2()).toBeFalse();
  });
});
