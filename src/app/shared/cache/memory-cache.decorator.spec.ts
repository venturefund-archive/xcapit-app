import { asyncDelay } from "src/testing/async-delay.spec";
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

  it('cache decorator', async () => {
    expect(dummyObj.regularMethod()).toEqual(3);

    await asyncDelay(10);

    expect(dummyObj.regularMethod()).toEqual(3);

    await asyncDelay(101);

    expect(dummyObj.regularMethod()).toEqual(2);
  });

  it('async cache decorator', async () => {
    expect(await dummyObj.asyncMethod()).toEqual(3);

    await asyncDelay(10);

    expect(await dummyObj.asyncMethod()).toEqual(3);

    await asyncDelay(101);

    expect(await dummyObj.asyncMethod()).toEqual(2);
    expect(await dummyObj.asyncMethod()).toEqual(2);

    await asyncDelay(101);

    expect(await dummyObj.asyncMethod()).toEqual(1);
  });

  it('cache decorator calls with diff args', async () => {
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
