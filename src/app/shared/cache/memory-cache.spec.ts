import { asyncDelay } from "src/testing/async-delay.spec";
import { MemoryCache } from "./memory-cache";


describe('MemoryCache', () => {
  const aKey = 'testKey';
  const aValue = 'testValue';
  let memoryCache: MemoryCache;

  beforeEach(() => {
    memoryCache = new MemoryCache(0.1);
  });

  it('new', () => {
    expect(memoryCache).toBeTruthy();
  });

  it('set & get a value by key', () => {
    memoryCache.setBy(aKey, aValue);

    expect(memoryCache.getValueBy(aKey)).toEqual(aValue);
  });

  it('has non expired key', async () => {
    memoryCache.setBy(aKey, aValue);

    await asyncDelay(10);

    expect(memoryCache.has(aKey)).toBeTrue();
  });

  it('has non existed key', () => {
    expect(memoryCache.has('anyKey')).toBeFalse();
  });

  it('has an expired key', async () => {
    memoryCache.setBy(aKey, aValue);

    await asyncDelay(101);

    expect(memoryCache.has(aKey)).toBeFalse();
  });
});
