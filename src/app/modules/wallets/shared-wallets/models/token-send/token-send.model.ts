import { Wallet } from "ethers";
import { Coin } from "../../interfaces/coin.interface";
import { ERC20TokenSend } from "../erc20-token-send/erc20-token-send.model";
import { NativeTokenSend } from "../native-token-send/native-token-send.model";

export class TokenSend {
    static create(from: string, to: string, amount: number, coin: Coin, wallet?: Wallet): NativeTokenSend | ERC20TokenSend {
        if (coin.native) {
            return NativeTokenSend.create(from, to, amount, coin, wallet);
        } else {
            return ERC20TokenSend.create(from, to, amount, coin, wallet);
        }
    }
}