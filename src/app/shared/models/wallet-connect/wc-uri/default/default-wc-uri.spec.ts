import { DefaultWCUri } from './default-wc-uri';

describe('WCUri', () => {
  const testV1Uri = 'wc:fakeUri@bridge=fakeBridge';
  const testV2Uri =
    'wc:ffa568ea5638294b9f96fe5a052c4cc580c4d6f0e96fcad143d93aaf693a1178@2?relay-protocol=irn&symKey=a7e780271322b12ef46e6647c7edab37882226ccfdf6bdbf22b7bd57e61e87b2';
  let _WCUri: DefaultWCUri;
  beforeEach(() => {
    _WCUri = new DefaultWCUri(testV2Uri);
  });
  it('new', () => {
    expect(DefaultWCUri).toBeTruthy();
  });

  it('value', () => {
    expect(_WCUri.value()).toEqual(testV2Uri);
  });

  it('isV2 must return true when uri is version 2', () => {
    expect(_WCUri.isV2()).toBeTrue();
  });

  it('isV2 must return false when uri is version 1', () => {
    expect(new DefaultWCUri(testV1Uri).isV2()).toBeFalse();
  });
});
