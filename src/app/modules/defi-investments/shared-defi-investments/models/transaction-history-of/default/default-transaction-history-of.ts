import { CacheService } from "src/app/shared/services/cache/cache.service";
import { TransactionHistoryOf } from "../injectable/transaction-history-of.injectable";

export class DefaultTransactionHistoryOf implements TransactionHistoryOf {
	constructor(
		private readonly _cache: CacheService
	) {}

	public async value(): Promise<> {

	}

	public cached(): Promise<> {
		return this._cache
			.get(this._storageKey())
			.then((res) => 
			res
			)
	}

	private _storageKey() {
    return `'asset_transaction_${this._aNetwork}_${this._aToken}`;
  }

	private _saveInCache(transactionHistory: any): Promise<void> {
    return this._cache.update(this._storageKey(), transactionHistory.json());
  }

	private _body(): string {
    return JSON.stringify({ query: this._query() });
  }
}