export class ExpirableValue {

  constructor(private _aValue: any, private _ttlInSeconds: number, private _aNowDate: Date = new Date()) {}

  value() {
    return this.expired() ? null : this._aValue;
  }

  expired(): boolean {
    return new Date() > this._expirationDate();
  }

  private _expirationDate(): Date {
    const copiedDate = new Date(this._aNowDate);
    copiedDate.setMilliseconds(copiedDate.getMilliseconds() + this._ttlMilliseconds());
    return copiedDate;
  }

  private _ttlMilliseconds(): number {
    return this._ttlInSeconds * 1000;
  }
}
