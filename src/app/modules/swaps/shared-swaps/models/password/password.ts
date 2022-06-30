export class Password {

  constructor(private _aString: string) { }

  value(): string {
    this._validate();
    return this._aString;
  }

  private _validate() {
    if (this._aString === '' || !this._aString) {
      throw Error('Empty Password');
    }
  }
}
