import { fakeAsync, tick } from "@angular/core/testing";
import { memoryCache, tests } from "./memory-cache.decorator";


class Dummy {

  private _regularValues = [1, 2, 3];
  private _asyncValues = [1, 2, 3];

  @memoryCache(tests)
  regularMethod(aNumber: any = 1, anObject = {}) {
    return this._regularValues.pop();
  }

  @memoryCache(tests)
  asyncMethod() {
    return Promise.resolve(this._asyncValues.pop());
  }
}

describe('cache decorator', () => {
  let dummyObj: Dummy;

  beforeEach(() => {
    dummyObj = new Dummy();
  });

  it('cache decorator', fakeAsync(() => {
    expect(dummyObj.regularMethod()).toEqual(3);

    tick(10);

    expect(dummyObj.regularMethod()).toEqual(3);

    tick(150);

    expect(dummyObj.regularMethod()).toEqual(2);
  }));

  it('async cache decorator fakeAsync', fakeAsync(() => {
    let value: any;
    dummyObj.asyncMethod().then(v => value = v);
    tick();

    expect(value).toEqual(3);

    tick(10);
    dummyObj.asyncMethod().then(v => value = v);
    tick();

    expect(value).toEqual(3);

    tick(150);

    dummyObj.asyncMethod().then(v => value = v);
    tick();
    expect(value).toEqual(2);
    dummyObj.asyncMethod().then(v => value = v);
    tick();
    expect(value).toEqual(2);

    tick(150);

    dummyObj.asyncMethod().then(v => value = v);
    tick();
    expect(value).toEqual(1);
  }));

  it('cache decorator calls with diff args', () => {
    const aSimpleArg = 4;
    const anotherSimpleArg = 2;
    const aComplexArg = {test: () => 1, testProp: 3};
    const anothercomplexArg = {tests: () => 1, testProp: 3};

    expect(dummyObj.regularMethod(anotherSimpleArg, aComplexArg)).toEqual(3);
    expect(dummyObj.regularMethod(aSimpleArg)).toEqual(2);
    expect(dummyObj.regularMethod(anotherSimpleArg, aComplexArg)).toEqual(3);
    expect(dummyObj.regularMethod(aSimpleArg)).toEqual(2);
    expect(dummyObj.regularMethod(anotherSimpleArg, anothercomplexArg)).toEqual(1);
  });
});
