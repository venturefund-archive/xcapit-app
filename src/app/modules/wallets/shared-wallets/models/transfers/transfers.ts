import { RawToken } from "src/app/modules/swaps/shared-swaps/models/token-repo/token-repo";
import { CovalentRepo } from "../covalent-repo/covalent-repo.interface";
import { Transfer } from "../transfer/transfer";
import { RawTransfer } from "./transfers.spec";

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
        .then((res) => res.data.items.map((rawTransfer: RawTransfer) => new Transfer(rawTransfer, this._aToken)));
    }
  }