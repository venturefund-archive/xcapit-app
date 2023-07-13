import { RemoteConfig } from 'src/app/shared/services/remote-config/remote-config.interface';
import { RawLender } from '../../lender/raw-lender.type';

export class LendersDataRepo {
  private _aRemoteConfigKey = 'warranty_lenders';
  constructor(private readonly _aRemoteConfigService: RemoteConfig) {}

  public oneByName(aName: string): RawLender {
    return this._aRemoteConfigService.getObject(this._aRemoteConfigKey).find((rawLender) => rawLender.name === aName);
  }
}
