import { rawSAMOData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { SolanaToken } from 'src/app/modules/swaps/shared-swaps/models/token/solana/solana-token';
import { solanaAddresses } from '../../../fixtures/raw-address-data';
import { SolanaSend } from '../../solana-send/solana-send';
import { SolanaNativeSendTxOf } from './solana-native-send-tx-of';
import { FakeWallet } from '../../wallet/fake/fake-wallet';


describe('SolanaNativeSendTxOf', () => {
  const amount = '2';
  const token = new SolanaToken(rawSAMOData);
  const testToAddress = solanaAddresses[0];
  const testWalletAddress = solanaAddresses[1];
  let solanaNativeTx: SolanaNativeSendTxOf;

  beforeEach(() => {
    solanaNativeTx = new SolanaNativeSendTxOf(
      new SolanaSend(amount, token, testToAddress),
      new FakeWallet(Promise.resolve(false), null, testWalletAddress)
    );
  });

  it('new', () => {
    expect(solanaNativeTx).toBeTruthy();
  });

  it('value', () => {
    expect(solanaNativeTx.value()).toBeTruthy();
  });
});
