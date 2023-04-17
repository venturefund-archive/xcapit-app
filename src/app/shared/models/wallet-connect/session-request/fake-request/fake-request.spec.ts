import { FakeRequest } from './fake-request';
import { rawPersonalSignRequest } from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';

describe('FakeRequest', () => {
  let fakeRequest: FakeRequest;
  beforeEach(() => {
    fakeRequest = new FakeRequest(rawPersonalSignRequest);
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

  it('json', () => {
    const message = document.createElement('div');
    message.appendChild(document.createTextNode('My email is john@doe.com - 1678769188349'));
    expect(fakeRequest.json()).toEqual({
      message: message,
      isSignRequest: true,
      decodedData: null,
      isApproval: false,
      totalFeeAmount: undefined,
    });
  });

  it('method', () => {
    expect(fakeRequest.method()).toBeUndefined();
  });

  it('raw', () => {
    expect(fakeRequest.raw()).toEqual(rawPersonalSignRequest);
  });
});
