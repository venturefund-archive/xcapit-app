import { Injectable } from '@angular/core';
import { Fee } from '../../../interfaces/fee.interface';
import { FormattedFee } from '../formatted-fee.model';

@Injectable({ providedIn: 'root' })
export class FormattedFeeController {
  public new(_aFee: Fee, _decimals?: number): FormattedFee {
    return _decimals ? new FormattedFee(_aFee, _decimals) : new FormattedFee(_aFee);
  }
}
