import { TestBed } from '@angular/core/testing';
import { BalanceCacheService } from './balance-cache.service';
import { CacheService } from '../../../../../shared/services/cache/cache.service';

describe('BalanceCacheService', () => {
  let service: BalanceCacheService;
  let cacheServiceSpy: jasmine.SpyObj<CacheService>;

  beforeEach(() => {
    cacheServiceSpy = jasmine.createSpyObj('CacheService', {
      update: Promise.resolve(),
      get: Promise.resolve({value: 50, expiration_date: 123456}),
    });
    TestBed.configureTestingModule({
      providers: [{ provide: CacheService, useValue: cacheServiceSpy }],
    });
    service = TestBed.inject(BalanceCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update total balance', async () => {
    await service.updateTotal(50);
    expect(cacheServiceSpy.update).toHaveBeenCalledWith('balance_total', { value: 50 });
  });

  it('should get total balance', async () => {
    await expectAsync(service.total()).toBeResolvedTo(50);
    expect(cacheServiceSpy.get).toHaveBeenCalledWith('balance_total');
  });
});
