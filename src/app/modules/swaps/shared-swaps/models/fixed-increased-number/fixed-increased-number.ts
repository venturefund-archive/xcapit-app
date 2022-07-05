export class FixedIncreasedNumber {

  constructor(private _number: number, private _incrementPercentage: number) { }

  value(): number {
    return parseInt(this._incrementedNumber().toFixed());
  }

  private _incrementedNumber(): number {
    return ((this._incrementPercentage / 100) + 1) * this._number;
  }
}
