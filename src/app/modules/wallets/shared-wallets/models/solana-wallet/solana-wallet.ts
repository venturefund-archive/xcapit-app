import { Keypair } from "@solana/web3.js";
import { Wallet } from "../../interfaces/wallet.interface";
export class SolanaWallet implements Wallet{
    private readonly _aWallet: Keypair;
    public readonly address: string;
    constructor(private readonly _aSeed: Uint8Array){
        this._aWallet = Keypair.fromSeed(_aSeed);
        this.address = this._aWallet.publicKey.toString();
    }
    isSolana(): boolean {
        return true;
    }
}