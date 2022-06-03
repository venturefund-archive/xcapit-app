import { HttpClient } from '@angular/common/http';
import { CachedAssetFactory } from './cached-asset-factory';

describe('CachedAssetFactory', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  beforeEach(() => {});

  it('create', () => {
    expect(new CachedAssetFactory(httpClientSpy)).toBeTruthy();
  });

  it('new', () => {
    expect(new CachedAssetFactory(httpClientSpy).new('')).toBeTruthy();
  });
});
