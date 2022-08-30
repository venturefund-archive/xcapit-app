import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { RawTransfer } from '../../types/raw-transfer.type';
import { CovalentRepo } from '../covalent-repo/covalent-repo.interface';
import { NativeTransfer } from '../transfer/native-transfer/native-transfer';
import { NoNativeTransfer } from '../transfer/no-native-transfer/no-native-transfer';
import { Transfer } from '../transfer/transfer.interface';

export class Transfers {
  constructor(
    private readonly _aToken: RawToken,
    private readonly _inAddress: string,
    private readonly repo: CovalentRepo
  ) {}

  public all(): Promise<Transfer[]> {
    return this.repo
      .transfersOf(this._aToken, this._inAddress)
      .toPromise()
      .then((res) =>
        res.data.items.map((rawTransfer: RawTransfer) => {
          let transferType: typeof NativeTransfer | typeof NoNativeTransfer;
          if (rawTransfer.hasOwnProperty('transfers')) {
            transferType = NoNativeTransfer;
          } else {
            transferType = NativeTransfer;
          }
          return new transferType(rawTransfer, this._aToken, this._inAddress);
        })
      );
  }
}
