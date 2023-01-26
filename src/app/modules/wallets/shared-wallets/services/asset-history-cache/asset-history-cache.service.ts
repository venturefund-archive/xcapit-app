import { Injectable } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { CacheService } from '../../../../../shared/services/cache/cache.service';
import { Coin } from '../../interfaces/coin.interface';
import { WalletService } from '../wallet/wallet.service';
// export type CachedCoin = { balance: number; price: number; expiration_date: number };
// export type BalanceOrPrice = { balance?: number; price?: number };
export type CachedTransaction = {
  tplTransfer: any;
  formattedDate: Date;
  tx_hash: string;
  network: string;
  amount: number;
  status: any;
};

@Injectable({
  providedIn: 'root',
})
export class AssetHistoryCacheService {
  PREFIX = 'asset_transaction_';
  // Nombre final: asset_transaction_<network>_<token>_<txHash>

  //TODO: Repurpouse
  // usar TX hash como identif unico en nombre?
  // defaultTotalBalanceOf -> Revisar
  // revisar Value() y Cached()
  constructor(private cacheService: CacheService, private walletService: WalletService) {}

  private addPrefix(key: string): string {
    return `${this.PREFIX}${key}`;
  }

  total(): Promise<number | undefined> {
    return this.cacheService.get(this.addPrefix('total')).then((res) => res && res.value);
  }

  async updateTotal(value: number): Promise<void> {
    const hasWallet = await this.walletService.walletExist();
    return hasWallet ? this.cacheService.update(this.addPrefix('total'), { value }) : Promise.resolve();
  }

  removeTotal(): Promise<void> {
    return this.cacheService.remove(this.addPrefix('total'));
  }

  // TODO:
  async transaction(aTransaction: any): Promise<CachedTransaction> {
    const response = await this.cacheService.get(
      this.addPrefix(`${aTransaction.token.network}_${aTransaction.token.value}_${aTransaction.txHash}`)
    );
    console.log('transaccion obtenida (service): ', response);
    return response;
  }

  updateTransaction(aTransaction: any): Promise<void> {
    return this.transaction(aTransaction).then((cachedTransaction: CachedTransaction) => {
      console.log('transaccion recibida: ', aTransaction)
      this.cacheService.update(this.addPrefix(`${aTransaction.network}_${aTransaction.value}_${aTransaction.txHash}`), {
        tplTransfer: aTransaction.type,
        // formattedDate: aTransaction.formatDate(aTransaction.block_signed_at), AGREGAR CUANDO ESTE FORMATEADO
        tx_hash: aTransaction.tx_hash,
        network: aTransaction.network,
        amount: aTransaction.amount,
        status: aTransaction.successful,
      })}
    );
  }

  // imitar cached() y value() sobre como manejar storage como array

  formatDate(value) {
    return format(parseISO(value), 'dd-MM-yyyy');
  }
  // coin(aCoin: Coin): Promise<CachedCoin> {
  //   return this.cacheService.get(this.addPrefix(`${aCoin.network}_${aCoin.value}`));
  // }

  // updateCoin(aCoin: Coin, value: BalanceOrPrice): Promise<void> {
  //   return this.coin(aCoin).then((cachedBalance: CachedCoin) =>
  //     this.cacheService.update(this.addPrefix(`${aCoin.network}_${aCoin.value}`), {
  //       balance: value.balance ?? (cachedBalance && cachedBalance.balance),
  //       price: value.price ?? (cachedBalance && cachedBalance.price),
  //     })
  //   );
  // }
}
