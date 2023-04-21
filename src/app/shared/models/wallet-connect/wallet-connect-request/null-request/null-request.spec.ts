import { NullRequest } from './null-request';
import { WalletConnectRequest } from '../wallet-connect-request.interface';
import { NullRequestMessage } from '../../request-message/null-request-message/null-request-message';

describe('NullRequest', () => {
  let request: WalletConnectRequest;

  beforeEach(() => {
    request = new NullRequest();
  });

  it('new', () => {
    expect(request).toBeTruthy();
  });

  it('request', () => {
    expect(request.request()).toEqual(undefined);
  });

  it('approve', async () => {
    await expectAsync(request.approve()).toBeResolved();
  });

  it('reject', async () => {
    await expectAsync(request.reject()).toBeResolved();
  });

  it('data', () => {
    const requestData = request.data();
    expect(requestData.message()).toEqual(new NullRequestMessage());
    expect(requestData.isSignRequest()).toEqual(false);
    expect(requestData.decodedData()).toEqual(null);
    expect(requestData.isApproval()).toBeFalse();
    expect(requestData.fee()).toEqual(undefined);
  });
});
