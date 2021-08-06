import { TestBed } from '@angular/core/testing';
import { BlockchainProviderService } from './blockchain-provider.service';

describe('BlockchainProviderService', () => {
  let service: BlockchainProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(BlockchainProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save provider on create', () => {
    expect(service.provider).toBeTruthy();
  });
});
