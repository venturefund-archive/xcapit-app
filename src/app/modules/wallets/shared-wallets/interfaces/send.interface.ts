import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from "ethers";

export interface Send {
    get fee(): BigNumber;
    get tokenDecimals(): number;

    send(): Promise<string | TransactionResponse>;
    sendEstimateGas(): Promise<BigNumber>;
    getGasPrice(): Promise<BigNumber>;
    sendEstimateFee(): Promise<BigNumber>;
    formatFee(): string;
}