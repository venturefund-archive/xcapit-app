import { MemoryCache } from './memory-cache';
import { SerializedArgs } from './serialized-args';


const tests = 'tests';
const superFast1Sec = 'superFast1Sec';
const fast10Sec = 'fast10Sec';
const standard60Sec = 'standard60Sec';
const slow120Sec = 'slow120Sec';

const _memoryCaches = new Map<string, MemoryCache>([
  [tests, new MemoryCache(0.1)],
  [superFast1Sec, new MemoryCache(1)],
  [fast10Sec, new MemoryCache(10)],
  [standard60Sec, new MemoryCache(60)],
  [slow120Sec, new MemoryCache(120)],
]);

function memoryCache(aMemoryCacheName: string) {
  const _memoryCache = _memoryCaches.get(aMemoryCacheName);

  function updateCache(aCacheKey: string, aValue: any) {
    if (aValue) {
      _memoryCache.setBy(aCacheKey, aValue);
    }
  }

  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      let result: any;
      const cacheKey = `${target.constructor.name}#${propertyName}#${new SerializedArgs(args).value()}`;

      if (_memoryCache.has(cacheKey)) {
        result = _memoryCache.getValueBy(cacheKey);
      } else {
        result = method.apply(this, args);
        updateCache(cacheKey, result);
      }

      return result;
    };
  };
}

export { tests, superFast1Sec, fast10Sec, standard60Sec, slow120Sec, memoryCache };
