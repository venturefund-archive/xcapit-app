import { RequestMethod } from './request-method';
import { SpyProperty } from '../../../../../testing/spy-property.spec';

describe('RequestMethod', () => {
  let requestMethod: RequestMethod;
  let rawRequestSessionSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    rawRequestSessionSpy = jasmine.createSpyObj(
      'RawRequestSession',
      {},
      {
        params: {
          request: {
            method: 'personal_sign',
          },
        },
      }
    );
    requestMethod = new RequestMethod(rawRequestSessionSpy);
  });

  const modifyMethodOfRawRequest = (method: string) => {
    new SpyProperty(rawRequestSessionSpy, 'params').value().and.returnValue({ request: { method } });
  };

  it('new', () => {
    expect(requestMethod).toBeTruthy();
  });

  describe('isSignRequest', () => {
    it('personal sign', () => {
      expect(requestMethod.isSignRequest()).toBeTrue();
      expect(requestMethod.isSignTypedRequest()).toBeFalse();
      expect(requestMethod.isSignTransactionRequest()).toBeFalse();
      expect(requestMethod.isSendTransactionRequest()).toBeFalse();
    });

    it('eth sign', () => {
      modifyMethodOfRawRequest('eth_sign');
      expect(requestMethod.isSignRequest()).toBeTrue();
      expect(requestMethod.isSignTypedRequest()).toBeFalse();
      expect(requestMethod.isSignTransactionRequest()).toBeFalse();
      expect(requestMethod.isSendTransactionRequest()).toBeFalse();
    });
  });

  describe('isSignTypedRequest', () => {
    it('eth_signTypedData', () => {
      modifyMethodOfRawRequest('eth_signTypedData');
      expect(requestMethod.isSignTypedRequest()).toBeTrue();
      expect(requestMethod.isSignRequest()).toBeFalse();
      expect(requestMethod.isSignTransactionRequest()).toBeFalse();
      expect(requestMethod.isSendTransactionRequest()).toBeFalse();
    });

    it('eth_signTypedData_v3', () => {
      modifyMethodOfRawRequest('eth_signTypedData_v3');
      expect(requestMethod.isSignTypedRequest()).toBeTrue();
      expect(requestMethod.isSignRequest()).toBeFalse();
      expect(requestMethod.isSignTransactionRequest()).toBeFalse();
      expect(requestMethod.isSendTransactionRequest()).toBeFalse();
    });

    it('eth_signTypedData_v4', () => {
      modifyMethodOfRawRequest('eth_signTypedData_v4');
      expect(requestMethod.isSignTypedRequest()).toBeTrue();
      expect(requestMethod.isSignRequest()).toBeFalse();
      expect(requestMethod.isSignTransactionRequest()).toBeFalse();
      expect(requestMethod.isSendTransactionRequest()).toBeFalse();
    });
  });

  describe('isSignTransactionRequest', () => {
    it('eth_signTransaction', () => {
      modifyMethodOfRawRequest('eth_signTransaction');
      expect(requestMethod.isSignTransactionRequest()).toBeTrue();
      expect(requestMethod.isSignRequest()).toBeFalse();
      expect(requestMethod.isSignTypedRequest()).toBeFalse();
      expect(requestMethod.isSendTransactionRequest()).toBeFalse();
    });
  });

  describe('isSendTransactionRequest', () => {
    it('eth_sendTransaction', () => {
      modifyMethodOfRawRequest('eth_sendTransaction');
      expect(requestMethod.isSendTransactionRequest()).toBeTrue();
      expect(requestMethod.isSignTransactionRequest()).toBeFalse();
      expect(requestMethod.isSignRequest()).toBeFalse();
      expect(requestMethod.isSignTypedRequest()).toBeFalse();
    });
  });
});
