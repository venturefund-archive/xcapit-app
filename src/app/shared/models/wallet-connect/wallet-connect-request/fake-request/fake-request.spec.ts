import { FakeRequest } from './fake-request';
import { rawPersonalSignRequest } from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { SessionRequest } from '../../session-request/session-request';
import { TextRequestMessage } from '../../request-message/text-request-message/text-request-message';

describe('FakeRequest', () => {
  let fakeRequest: FakeRequest;
  beforeEach(() => {
    fakeRequest = new FakeRequest(new SessionRequest(rawPersonalSignRequest));
  });

  it('new', () => {
    expect(fakeRequest).toBeTruthy();
  });

  it('approve', async () => {
    await expectAsync(fakeRequest.approve()).toBeResolved();
  });

  it('reject', async () => {
    await expectAsync(fakeRequest.reject()).toBeResolved();
  });

  it('data', () => {
    const requestData = fakeRequest.data();
    expect(requestData.message()).toEqual(new TextRequestMessage(new SessionRequest(rawPersonalSignRequest)));
    expect(requestData.isSignRequest()).toBeTrue();
    expect(requestData.decodedData()).toEqual(null);
    expect(requestData.isApproval()).toBeFalse();
    expect(requestData.fee()).toEqual(undefined);
  });

  it('request', () => {
    expect(fakeRequest.request()).toEqual(rawPersonalSignRequest.params.request);
  });
});
