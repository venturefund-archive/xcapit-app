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
    expect(fakeRequest.json()).toEqual({
      message: 'My email is john@doe.com - 1678769188349',
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
