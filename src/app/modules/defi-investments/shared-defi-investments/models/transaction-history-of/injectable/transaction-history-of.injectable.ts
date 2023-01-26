import { Injectable } from '@angular/core';
import { CacheService } from "src/app/shared/services/cache/cache.service";
import { DefaultTransactionHistoryOf } from '../default/default-transaction-history-of';

// TODO: Datos necesarios: tipo de transf, tx_hash, network, amount, status, signed_at

@Injectable({ providedIn: 'root'})
export class TransactionHistoryOf {
	constructor(private cacheService: CacheService) {}

	create(
		cache: CacheService = this.cacheService
	): TransactionHistoryOf {
		return new DefaultTransactionHistoryOf(cache);
	}
}