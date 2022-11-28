import { BlockchainTx } from "src/app/modules/swaps/shared-swaps/models/blockchain-tx";
import { rawSAMOData } from "src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data";
import { SolanaToken } from "src/app/modules/swaps/shared-swaps/models/token/solana/solana-token";
import { FakeWallet, Wallet } from "src/app/modules/swaps/shared-swaps/models/wallet/wallet";
import { SolanaNoNativeSend } from "../solana-no-native-send/solana-no-native-send";

export class SolanaNoNativeSendTxs {

  private _transactions: BlockchainTx[];

  constructor(private _aNoNativeSend: SolanaNoNativeSend, private _aWallet: Wallet) { }

  async blockchainTxs(): Promise<BlockchainTx[]> {
    return [];
  }
}

fdescribe('SolanaNoNativeSendTxs', () => {
  let noNativeSendTxs: SolanaNoNativeSendTxs;
  const amount = '2';
  const token = new SolanaToken(rawSAMOData);
  const testToAddress = 'HVGoaJgWW9TEu19avGRPjc2KvmReUYwxXib7NmwQqm4F';
  const testWalletAddress = 'iuwtfpp8yzDrJNQbHXBSufSCZKhGctw5bQFAx23VgBH';


  beforeEach(() => {
    noNativeSendTxs = new SolanaNoNativeSendTxs(
      new SolanaNoNativeSend(amount, token, testToAddress),
      new FakeWallet(Promise.resolve(false), '', testWalletAddress)
    );
  });

  it('new', () => {
    expect(noNativeSendTxs).toBeTruthy();
  });

  it('without ata creation', async () => {
    expect((await noNativeSendTxs.blockchainTxs()).length).toEqual(1);
  });

  it('with ata creation', async () => {
    expect((await noNativeSendTxs.blockchainTxs()).length).toEqual(2);
  });
});
