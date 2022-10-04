export class NativeSendTxOf implements BlockchainTx {

    constructor(private _wallet: Wallet, private _to: string, private _amount: number) { }

    async value(): Promise<Transaction> {
      return new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(this._wallet.address()),
          toPubkey: new PublicKey(this._to),
          lamports: this._amount * LAMPORTS_PER_SOL,
        }),
      );
    }
}