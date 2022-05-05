import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from "ethers";

export interface Send {
    get tokenDecimals(): number;

    send(): Promise<string | TransactionResponse>;
}