import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { CacheService } from 'src/app/shared/services/cache/cache.service';
import { RawTransfer } from '../../types/raw-transfer.type';
import { CovalentRepo } from '../covalent-repo/covalent-repo.interface';
import { NativeTransfer } from '../transfer/native-transfer/native-transfer';
import { NoNativeTransfer } from '../transfer/no-native-transfer/no-native-transfer';
import { Transfer } from '../transfer/transfer.interface';

export class Transfers {
  constructor(
    private readonly _aToken: RawToken,
    private readonly _inAddress: string,
    private readonly repo: CovalentRepo,
    private readonly _cache: CacheService
  ) {}

  public all(): Promise<Transfer[]> {
    return this.repo
      .transfersOf(this._aToken, this._inAddress)
      .toPromise()
      .then((res) => res.data.items)
      .then((res) => {
        this._saveInCache(res);
        return this._transferResponseOf(res);
      });
  }

  public cached(): Promise<Transfer[]> {
    return this._cache.get(this._storageKey())
      .then((res) => res ? this._transferResponseOf(res) : undefined);
  }

  private _storageKey() {
    return `asset_transaction_${this._aToken.network}_${this._aToken.value}`;
  }

  private _saveInCache(data: RawTransfer[]): Promise<void> {
    return this._cache.update(this._storageKey(), data);
  }

  private _transferResponseOf(res: RawTransfer[]): Transfer[] {
    return res.map((rawTransfer: RawTransfer) => {
      let transferType: typeof NativeTransfer | typeof NoNativeTransfer;
      if (rawTransfer.hasOwnProperty('transfers')) {
        transferType = NoNativeTransfer;
      } else {
        transferType = NativeTransfer;
      }
      return new transferType(rawTransfer, this._aToken, this._inAddress);
    });
  }
}
