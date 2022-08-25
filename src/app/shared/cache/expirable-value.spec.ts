import { asyncDelay } from "src/testing/async-delay.spec";
import { ExpirableValue } from "./expirable-value";


describe('ExpirableValue', () => {
  const aValue = 'testValue';
  const ttlInSeconds = 0.1;
  let value: ExpirableValue;

  beforeEach(async () => {
    value = new ExpirableValue(aValue, ttlInSeconds);
  });

  it('new', () => {
    expect(value).toBeTruthy();
  });

  it('value', () => {
    expect(value.value()).toEqual(aValue);
  });

  it('return null value on expired', async () => {
    await asyncDelay(101);

    expect(value.expired()).toBeTrue();
    expect(value.value()).toEqual(null);
  });

  it('return value on not expired', async () => {
    await asyncDelay(10);

    expect(value.expired()).toBeFalse();
    expect(value.value()).toEqual(aValue);
  });
});
