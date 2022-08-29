import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { RawTransfer } from '../../types/raw-transfer.type';
import { CovalentRepo } from '../covalent-repo/covalent-repo.interface';
import { Transfer } from '../transfer/transfer';

export class Transfers {
  constructor(
    private readonly _aToken: RawToken,
    private readonly _inAddress: string,
    private readonly repo: CovalentRepo
  ) {}

  public all() {
    return this.repo
      .transfersOf(this._aToken, this._inAddress)
      .toPromise()
      .then((res) =>
        res.data.items.map((rawTransfer: RawTransfer) => {
          console.log(rawTransfer);
          if (rawTransfer.hasOwnProperty('transfers')) {
            console.log('la tieene');
            rawTransfer = { ...rawTransfer.transfers[0], ...rawTransfer };
            delete rawTransfer.transfers;
          }
          return new Transfer(rawTransfer, this._aToken);
        })
      );
  }
}
