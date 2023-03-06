import { TestBed } from '@angular/core/testing';
import { TokenOperationDataService } from './token-operation-data.service';

describe('TokenOperationDataService', () => {
  let service: TokenOperationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenOperationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('clean', () => {
    service.clean();
    expect(service.tokenOperationData).toBeUndefined();
  });

  it('set', () => {
    service.set({ mode: 'buy' });
    expect(service.tokenOperationData).toEqual({ mode: 'buy' });
  });

  it('add', () => {
    service.add({ mode: 'buy' });
    service.add({ isFirstTime: true });
    expect(service.tokenOperationData).toEqual({ mode: 'buy', isFirstTime: true });
  });

  it('hasAssetInfo true', () => {
    service.set({ asset: 'USDC', network: 'ERC20' });
    expect(service.hasAssetInfo()).toBeTruthy();
  });

  it('hasAssetInfo false', () => {
    expect(service.hasAssetInfo()).toBeFalsy();
  });
});
