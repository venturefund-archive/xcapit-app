import { rawSAMOData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { SolanaToken } from 'src/app/modules/swaps/shared-swaps/models/token/solana/solana-token';
import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { solanaAddresses } from '../../fixtures/raw-address-data';
import { SolanaNoNativeSend } from '../solana-no-native-send/solana-no-native-send';
import { SolanaNoNativeSendTxOf } from './solana-no-native-send-tx-of';


fdescribe('SolanaNoNativeSendTxOf', () => {
  let noNativeSendTxOf: SolanaNoNativeSendTxOf;
  const amount = '2';
  const token = new SolanaToken(rawSAMOData);
  const testToAddress = solanaAddresses[0];
  const testWalletAddress = solanaAddresses[1];

  beforeEach(() => {
    noNativeSendTxOf = new SolanaNoNativeSendTxOf(
      new SolanaNoNativeSend(amount, token, testToAddress),
      new FakeWallet(Promise.resolve(false), '', testWalletAddress)
    );
  });

  it('new', () => {
    expect(noNativeSendTxOf).toBeTruthy();
  });

  it('value', async () => {
    expect(await noNativeSendTxOf.value()).toBeTruthy();
  });
});
