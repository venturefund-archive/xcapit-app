import { CovalentTransfersResponse } from '../covalent-transfers-response/covalent-transfers-response';
import { Observable } from 'rxjs';

export interface CovalentRepo {
  transfersOf: () => Observable<CovalentTransfersResponse>;
}
