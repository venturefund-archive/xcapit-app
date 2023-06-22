import { FiatRampsService } from '../../services/fiat-ramps.service';
import { FakeFiatRampsService } from '../fake-fiat-ramps-service/fake-fiat-ramps-service';

export class KriptonWallet {

  constructor(private _anExternalCode: string, private _aFiatRampsService: FiatRampsService | FakeFiatRampsService) {}

  public async address(): Promise<string> {
    return (await this._aFiatRampsService.getAddressByVoucher(this._anExternalCode).toPromise()).data.to;
  }
}
