import { rawSAMOData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { SolanaToken } from 'src/app/modules/swaps/shared-swaps/models/token/solana/solana-token';
import { solanaAddresses } from '../../fixtures/raw-address-data';
import { SolanaSend } from '../solana-send/solana-send';
import { SolanaNoNativeSendTxOf } from './solana-no-native-send-tx-of';
import { FakeWallet } from '../../../../swaps/shared-swaps/models/wallet/fake/fake-wallet';


describe('SolanaNoNativeSendTxOf', () => {
  let noNativeSendTxOf: SolanaNoNativeSendTxOf;
  const amount = '2';
  const token = new SolanaToken(rawSAMOData);
  const testToAddress = solanaAddresses[0];
  const testWalletAddress = solanaAddresses[1];

  beforeEach(() => {
    noNativeSendTxOf = new SolanaNoNativeSendTxOf(
      new SolanaSend(amount, token, testToAddress),
      new FakeWallet(Promise.resolve(false), null, testWalletAddress)
    );
  });

  it('new', () => {
    expect(noNativeSendTxOf).toBeTruthy();
  });

  it('value', async () => {
    expect(await noNativeSendTxOf.value()).toBeTruthy();
  });
});
