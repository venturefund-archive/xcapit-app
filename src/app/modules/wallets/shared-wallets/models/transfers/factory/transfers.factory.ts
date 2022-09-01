import { Transfers } from '../transfers';
import { Injectable } from '@angular/core';
import { RawToken } from '../../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { DefaultCovalentRepo } from '../../covalent-repo/default/default-covalent-repo';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../../../../shared/services/env/env.service';

@Injectable({ providedIn: 'root' })
export class TransfersFactory {
  constructor(private http: HttpClient, private env: EnvService) {}

  public create(_aToken: RawToken, _anAddress: string): Transfers {
    return new Transfers(_aToken, _anAddress, new DefaultCovalentRepo(this.http, this.env));
  }
}
