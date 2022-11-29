import { FakeConnection } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-connection";
import { rawSAMOData } from "src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data";
import { SolanaToken } from "src/app/modules/swaps/shared-swaps/models/token/solana/solana-token";
import { FakeWallet } from "src/app/modules/swaps/shared-swaps/models/wallet/wallet";
import { SolanaNoNativeSend } from "../solana-no-native-send/solana-no-native-send";
import { SolanaNoNativeSendTxs } from "./solana-no-native-send-txs";


fdescribe('SolanaNoNativeSendTxs', () => {
  let noNativeSendTxs: SolanaNoNativeSendTxs;
  const amount = '2';
  const token = new SolanaToken(rawSAMOData);
  const testToAddress = 'HVGoaJgWW9TEu19avGRPjc2KvmReUYwxXib7NmwQqm4F';
  const testWalletAddress = 'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH';
  const _solanaNoNativeSendTxs = (_connection = new FakeConnection()): SolanaNoNativeSendTxs => {
    return new SolanaNoNativeSendTxs(
      new SolanaNoNativeSend(amount, token, testToAddress),
      new FakeWallet(Promise.resolve(false), '', testWalletAddress),
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
