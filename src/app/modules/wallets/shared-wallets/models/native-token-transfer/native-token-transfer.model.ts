import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber, Signer, VoidSigner } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ERC20Provider } from "src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model";
import { Amount } from "src/app/modules/defi-investments/shared-defi-investments/types/amount.type";
import { Coin } from "../../interfaces/coin.interface";
import { Transfer } from "../../interfaces/transfer.interface";

export class NativeTokenTransfer implements Transfer {
    constructor(
        private readonly _anAddressFrom: string,
        private readonly _anAddressTo: string,
        private readonly _anAmount: Amount,
        private readonly _aProvider: ERC20Provider, // TODO: Create native token model
        private readonly _aSigner: Signer
    ) {}

    private get tx() {
        return {
            to: this._anAddressTo,
            value: parseEther(this._anAmount.value.toString())
        }
    } 

    static create(from: string, to: string, amount: number, coin: Coin): NativeTokenTransfer {
        const provider = new ERC20Provider(coin);
        const _anAmount = { value: amount, token: coin.name };

        return new this(from, to, _anAmount, provider, new VoidSigner(from));
    }

    private signer(): Signer {
        return this._aSigner.connect(this._aProvider.value());
    }

    transfer(): Promise<string | TransactionResponse> {
        return this.signer().sendTransaction(this.tx);
    }

    estimateFee(): Promise<BigNumber> {
        return this._aProvider.value().estimateGas(this.tx);
    }
}