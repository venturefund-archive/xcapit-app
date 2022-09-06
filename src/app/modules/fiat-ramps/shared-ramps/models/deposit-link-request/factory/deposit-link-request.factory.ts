import { EnvService } from '../../../../../../shared/services/env/env.service';
import DepositLinkRequest from '../deposit-link-request';
import { Injectable } from '@angular/core';
import { CustomHttpService } from '../../../../../../shared/services/custom-http/custom-http.service';
import { DirectaDepositCreationData } from '../../../interfaces/directa-deposit-creation-data.interface';

@Injectable({ providedIn: 'root' })
export default class DepositLinkRequestFactory {
  constructor(private httpClient: CustomHttpService, private envService: EnvService) {}

  public new(depositData: DirectaDepositCreationData): DepositLinkRequest {
    return new DepositLinkRequest(depositData, this.httpClient, this.envService);
  }
}
