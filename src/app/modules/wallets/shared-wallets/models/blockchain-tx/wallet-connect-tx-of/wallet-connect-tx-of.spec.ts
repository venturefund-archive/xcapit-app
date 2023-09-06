import { WalletConnectTxOf } from './wallet-connect-tx-of';
import { rawSendTransactionRequestDefault } from '../../../fixtures/raw-wallet-connect-requests';
import { BlockchainTx } from '../blockchain-tx';

describe('WalletConnectTxOf', () => {
  let walletConnectTx: BlockchainTx;
  const rawTx = rawSendTransactionRequestDefault.params.request.params[0];

  beforeEach(() => {
    walletConnectTx = new WalletConnectTxOf(rawTx);
  });

  it('new', () => {
    expect(walletConnectTx).toBeTruthy();
  });

  it('value access', async () => {
    expect(await walletConnectTx.value()).toEqual(rawTx);
  });
});
