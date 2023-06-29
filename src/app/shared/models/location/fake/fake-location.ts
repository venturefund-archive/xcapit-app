import { Location } from '../location.interface';

export class FakeLocation implements Location {
  constructor(private readonly _anHref: string) {}
  href() {
    return this._anHref;
  }
}
