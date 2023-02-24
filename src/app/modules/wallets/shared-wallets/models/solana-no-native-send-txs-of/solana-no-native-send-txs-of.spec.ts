import { FakeConnection } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-connection";
import { rawSAMOData } from "src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data";
import { SolanaToken } from "src/app/modules/swaps/shared-swaps/models/token/solana/solana-token";
import { FakeWallet } from "src/app/modules/swaps/shared-swaps/models/wallet/wallet";
import { solanaAddresses } from "../../fixtures/raw-address-data";
import { SolanaSend } from "../solana-send/solana-send";
import { SolanaNoNativeSendTxsOf } from "./solana-no-native-send-txs-of";


describe('SolanaNoNativeSendTxsOf', () => {
  let noNativeSendTxs: SolanaNoNativeSendTxsOf;
  const amount = '2';
  const token = new SolanaToken(rawSAMOData);
  const testToAddress = solanaAddresses[0];
  const testWalletAddress = solanaAddresses[1];
  const _solanaNoNativeSendTxs = (_connection = new FakeConnection()): SolanaNoNativeSendTxsOf => {
    return new SolanaNoNativeSendTxsOf(
      new SolanaSend(amount, token, testToAddress),
      new FakeWallet(Promise.resolve(false), null, testWalletAddress),
      _connection
    );
  };

  beforeEach(() => {
    noNativeSendTxs = _solanaNoNativeSendTxs();
  });

  it('new', () => {
    expect(noNativeSendTxs).toBeTruthy();
  });

  it('without ata creation', async () => {
    expect((await noNativeSendTxs.blockchainTxs()).length).toEqual(1);
  });

  it('with ata creation', async () => {
    const noNativeSendTxs = _solanaNoNativeSendTxs(new FakeConnection([]));

    expect((await noNativeSendTxs.blockchainTxs()).length).toEqual(2);
  });
});
