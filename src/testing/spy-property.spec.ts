export class SpyProperty<T, K extends keyof T> {
  constructor(private readonly _aSpy: jasmine.SpyObj<T>, private readonly _aProperty: K) {}

  value(): jasmine.Spy<() => T[K]> {
    return Object.getOwnPropertyDescriptor(this._aSpy, this._aProperty)?.get as jasmine.Spy;
  }
}