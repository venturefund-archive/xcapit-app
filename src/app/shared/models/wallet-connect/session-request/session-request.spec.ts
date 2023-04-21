import { rawSendTransactionRequestDefault } from '../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { SessionRequest } from './session-request';

describe('SessionRequest', () => {
  let sessionRequest: SessionRequest;

  beforeEach(() => {
    sessionRequest = new SessionRequest(rawSendTransactionRequestDefault);
  });

  it('new', () => {
    expect(sessionRequest).toBeTruthy();
  });

  it('id', () => {
    expect(sessionRequest.id()).toEqual(rawSendTransactionRequestDefault.id);
  });

  it('topic', () => {
    expect(sessionRequest.topic()).toEqual(rawSendTransactionRequestDefault.topic);
  });

  it('transaction', () => {
    expect(sessionRequest.transaction()).toEqual(rawSendTransactionRequestDefault.params.request.params[0]);
  });

  it('gas limit', () => {
    expect(sessionRequest.gasLimit()).toEqual(rawSendTransactionRequestDefault.params.request.params[0].gasLimit);
  });

  it('gas price', () => {
    expect(sessionRequest.gasPrice()).toEqual(rawSendTransactionRequestDefault.params.request.params[0].gasPrice);
  });

  it('method', () => {
    expect(sessionRequest.method()).toEqual(rawSendTransactionRequestDefault.params.request.method);
  });

  it('request', () => {
    expect(sessionRequest.request()).toEqual(rawSendTransactionRequestDefault.params.request);
  });
});
