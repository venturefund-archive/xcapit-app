import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from "ethers";

export interface Send {
    send(): Promise<string | TransactionResponse>;
    sendEstimateGas(): Promise<BigNumber>;
}