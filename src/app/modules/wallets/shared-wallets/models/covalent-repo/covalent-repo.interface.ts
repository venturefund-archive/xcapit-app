import { Observable } from 'rxjs';
import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';

export interface CovalentRepo {
  transfersOf: (aToken: RawToken, inAddress: string) => Observable<any>;
}
