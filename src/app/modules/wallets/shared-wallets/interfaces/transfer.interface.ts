import { Amount } from "src/app/modules/defi-investments/shared-defi-investments/types/amount.type";
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from "ethers";

export interface Transfer {
    transfer(): Promise<string | TransactionResponse>;
    estimateFee(): Promise<BigNumber>;
}