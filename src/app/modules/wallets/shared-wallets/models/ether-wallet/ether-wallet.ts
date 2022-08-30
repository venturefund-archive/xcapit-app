import { ethers } from "ethers";
import { Wallet } from "../../interfaces/wallet.interface";

export class EtherWallet implements Wallet {
    public readonly address: string;
    private readonly _aWallet: ethers.Wallet;

    constructor(private readonly _aPhrase: string, private readonly _aDerivedPath: string) {
        this._aWallet = ethers.Wallet.fromMnemonic(this._aPhrase, this._aDerivedPath, ethers.wordlists.en);
        this.address = this._aWallet.address;
    }

    isSolana(): boolean {
        return false;
    }

}