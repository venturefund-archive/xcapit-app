import { CovalentRepo } from '../covalent-repo.interface';
import { Observable, of } from 'rxjs';
import { RawToken } from '../../../../../swaps/shared-swaps/models/token-repo/token-repo';

export class FakeCovalentRepo implements CovalentRepo {
  constructor(private readonly _transfersOfResponse: Observable<any> = of()) {}

  transfersOf(aToken: RawToken, inAddress: string): Observable<any> {
    return this._transfersOfResponse;
  }
}
