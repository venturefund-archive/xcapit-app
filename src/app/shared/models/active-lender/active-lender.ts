import { StorageService } from '../../services/app-storage/app-storage.service';
import { Lender } from '../lender/lender.interface';
import { Lenders } from '../lenders/lenders.interface';

export class ActiveLender {
  private _cachedLender: Lender;
  private _aLenderNameKey = 'active_lender';
  private _aDynamicLinkKey = 'active_lender_from_dynamic_link';
  constructor(private _aStorage: StorageService, private _lenders: Lenders = null) {}

  async save(aLenderName: string, fromDynamicLink: boolean = false): Promise<void> {
    await this._aStorage.set(this._aDynamicLinkKey, fromDynamicLink);
    await this._aStorage.set(this._aLenderNameKey, aLenderName);
    return;
  }

  async initialSave(aLenderName: string, fromDynamicLink: boolean = false) {
    const lenderIsAlreadySet = await this.name();

    if ((fromDynamicLink && lenderIsAlreadySet) || !lenderIsAlreadySet) {
      await this.save(aLenderName, fromDynamicLink);
    }
  }

  name(): Promise<string> {
    return this._aStorage.get(this._aLenderNameKey);
  }

  async value(): Promise<Lender> {
    if (!this._cachedLender) {
      this._cachedLender = this._lenders.oneByName(await this.name());
    }
    return this._cachedLender;
  }

  fromDynamicLink(): Promise<boolean> {
    return this._aStorage.get(this._aDynamicLinkKey);
  }
}
