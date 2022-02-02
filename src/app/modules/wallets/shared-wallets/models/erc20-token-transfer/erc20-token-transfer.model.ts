import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber, VoidSigner } from "ethers";
import { ERC20Contract } from "src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model";
import { ERC20Provider } from "src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model";
import { ERC20Token } from "src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/erc20-token.model";
import { Amount } from "src/app/modules/defi-investments/shared-defi-investments/types/amount.type";
import { Coin } from "../../interfaces/coin.interface";
import { Transfer } from "../../interfaces/transfer.interface";

export class ERC20TokenTransfer implements Transfer {
    constructor(
        private readonly _anAddressFrom: string,
        private readonly _anAddressTo: string,
        private readonly _anAmount: Amount,
        private readonly _aToken: ERC20Token
    ) {}

    static create(from: string, to: string, amount: number, coin: Coin): ERC20TokenTransfer {
        const provider = new ERC20Provider(coin);
        const contract = new ERC20Contract(provider, new VoidSigner(from, provider.value()));
        const token = new ERC20Token(contract);
        const _anAmount = { value: amount, token: coin.name };

        return new this(from, to, _anAmount, token);
    }

    transfer(): Promise<string | TransactionResponse> {
        return this._aToken.transfer(this._anAddressTo, BigNumber.from(this._anAmount.value));
    }
    estimateFee(): Promise<BigNumber> {
        return this._aToken.transferFee(this._anAddressTo, BigNumber.from(this._anAmount.value));
    }
}