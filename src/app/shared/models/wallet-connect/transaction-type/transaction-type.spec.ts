import {
  rawApproveTransactionRequest,
  rawSwapTransactionRequest,
} from '../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { TransactionType } from './transaction-type';
import { SessionRequest } from '../session-request/session-request';

describe('TransactionType', () => {
  let transactionType: TransactionType;

  beforeEach(() => {
    transactionType = new TransactionType(new SessionRequest(rawSwapTransactionRequest));
  });

  it('new', () => {
    expect(transactionType).toBeTruthy();
  });

  it('value', () => {
    expect(transactionType.value().name).toEqual('swapTokensForExactTokens');
  });

  it('is approval true', () => {
    transactionType = new TransactionType(new SessionRequest(rawApproveTransactionRequest));
    expect(transactionType.isApproval()).toBeTrue();
  });

  it('is approval false', () => {
    expect(transactionType.isApproval()).toBeFalse();
  });
});
