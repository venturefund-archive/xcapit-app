import { SessionRequest } from '../session-request/session-request';
import { rawSignTypedDataRequest } from '../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { SignedTypedParams } from './sign-typed-params';


describe('SignedTypedParams', () => {
  let signedTypedParams: SignedTypedParams;

  beforeEach(() => {
    signedTypedParams = new SignedTypedParams(new SessionRequest(rawSignTypedDataRequest));
  });

  it('new', () => {
    expect(signedTypedParams).toBeTruthy();
  });

  it('domain', () => {
    expect(signedTypedParams.domain().name).toEqual('Ether Mail');
  });

  it('types', () => {
    expect(signedTypedParams.types().EIP712Domain.length).toBeGreaterThan(0);
  });

  it('message', () => {
    expect(signedTypedParams.message().contents).toEqual('Hello, Bob!');
  });
});
