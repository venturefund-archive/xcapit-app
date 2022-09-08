import { EnvService } from '../../../../../shared/services/env/env.service';
import { Observable } from 'rxjs';
import { FakeHttpClient } from '../../../../../../testing/fakes/fake-http.spec';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { DirectaDepositCreationData } from '../../interfaces/directa-deposit-creation-data.interface';

export default class DepositLinkRequest {
  constructor(
    private readonly depositData: DirectaDepositCreationData,
    private readonly http: CustomHttpService | FakeHttpClient,
    private readonly env: EnvService
  ) {}

  public response(): Observable<any> {
    return this.http.post(
      `${this.env.byKey('apiUrl')}/on_off_ramps/directa/deposit_link`,
      this.depositData,
      undefined,
      false
    );
  }
}
