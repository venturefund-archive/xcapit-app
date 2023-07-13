import { StorageService } from "../../services/app-storage/app-storage.service";
import { Lender } from "../lender/lender.interface";
import { Lenders } from "../lenders/lenders.interface";


export class ActiveLender {

  private _cachedLender: Lender;
  private _aStorageKey = 'active_lender';

  constructor(
    private _aStorage: StorageService,
    private _lenders: Lenders = null
  ) {}

  save(aLenderName: string): Promise<void> {
    return this._aStorage.set(this._aStorageKey, aLenderName);
  }

  name(): Promise<string> {
    return this._aStorage.get(this._aStorageKey);
  }

  async value(): Promise<Lender> {
    if (!this._cachedLender) {
      this._cachedLender = this._lenders.oneByName(await this.name());
    }
    return this._cachedLender;
  }
}
