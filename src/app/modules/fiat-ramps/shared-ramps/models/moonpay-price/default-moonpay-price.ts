import { map } from "rxjs/operators"
import { FiatRampsService } from "../../services/fiat-ramps.service"
import { ProviderPrice } from "../provider-price/provider-price"

export class DefaultMoonpayPrice implements ProviderPrice{
    constructor(
      private readonly _aCountryAlphaCode3: string,
      private readonly _aCurrencyCode: string,
      private readonly _fiatRamps: FiatRampsService,
    ) {}
  
    value() {
        return this._fiatRamps
        .getMoonpayQuotation(this._aCurrencyCode)
        .pipe(map((res) => res[this._aCountryAlphaCode3]))    
    }
  }