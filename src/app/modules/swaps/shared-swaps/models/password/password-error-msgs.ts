export type RawPasswordErrorMsgs = {
  invalid: string,
  empty: string
}


const rawPasswordErrorMsgsData: RawPasswordErrorMsgs = {
  invalid: 'invalid password',
  empty: 'Empty Password',
};


export class PasswordErrorMsgs {

  constructor(private _rawData: RawPasswordErrorMsgs = rawPasswordErrorMsgsData) { }

  invalid(): string {
    return this._rawData.invalid;
  }

  empty(): string {
    return this._rawData.empty;
  }

  isInvalidError(anError: Error): boolean {
    return anError.message == this.invalid();
  }

  isEmptyError(anError: Error): boolean {
    return anError.message == this.empty();
  }

  isAPassError(anError: Error): boolean {
    return !!Object.values(this._rawData)
      .find((item: string) =>
        item.toLowerCase() == anError.message.toLowerCase());
  }
}
