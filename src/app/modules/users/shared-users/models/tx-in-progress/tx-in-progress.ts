import { Transaction } from "src/app/modules/wallets/shared-wallets/types/transaction.type";

export class TxInProgress {
    constructor(public readonly type: Transaction, public readonly network?: string, public readonly hash?: string, public readonly startTimestamp = new Date()) {}
  }