import { RequestMethod } from '../../request-method/request-method';
import { NullRequest } from './null-request';
import { RawSessionRequest } from '../raw-session-request.type';
import { SessionRequest } from '../session-request.interface';

describe('NullRequest', () => {
  let request: SessionRequest;

  beforeEach(() => {
    request = new NullRequest();
  });

  it('new', () => {
    expect(request).toBeTruthy();
  });

  it('raw', () => {
    expect(request.raw()).toEqual(undefined as RawSessionRequest);
  });

  it('method', () => {
    expect(request.method()).toEqual(undefined as RequestMethod);
  });

  it('approve', async () => {
    await expectAsync(request.approve()).toBeResolved();
  });

  it('reject', async () => {
    await expectAsync(request.reject()).toBeResolved();
  });

  it('json', () => {
    expect(request.json()).toEqual({
      message: undefined,
      isSignRequest: false,
      decodedData: null,
      isApproval: false,
      totalFeeAmount: undefined,
    });
  });
});
