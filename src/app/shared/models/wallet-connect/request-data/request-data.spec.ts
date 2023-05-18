import { TextRequestMessage } from '../request-message/text-request-message/text-request-message';
import { rawPersonalSignRequest } from '../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { SessionRequest } from '../session-request/session-request';
import { RequestData } from './request-data';

describe('RequestData', () => {
  let requestData: RequestData;
  const testMessage = new TextRequestMessage(new SessionRequest(rawPersonalSignRequest));
  beforeEach(() => {
    requestData = new RequestData(testMessage, true, null, false, undefined);
  });

  it('new', () => {
    expect(requestData).toBeTruthy();
  });

  it('message', () => {
    expect(requestData.message()).toEqual(testMessage);
  });

  it('isSignRequest', () => {
    expect(requestData.isSignRequest()).toEqual(true);
  });

  it('decoded data', () => {
    expect(requestData.decodedData()).toEqual(null);
  });

  it('isApproval', () => {
    expect(requestData.isApproval()).toEqual(false);
  });

  it('fee amount', () => {
    expect(requestData.fee()).toEqual(undefined);
  });
});
