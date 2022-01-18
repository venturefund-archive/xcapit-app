import { TestBed } from '@angular/core/testing';
import { BlockchainProviderService } from '../../../../wallets/shared-wallets/services/blockchain-provider/blockchain-provider.service';

import { TwoPiService } from './two-pi.service';

describe('TwoPiService', () => {
  let service: TwoPiService;
  let blockchainProviderServiceSpy : jasmine.SpyObj<BlockchainProviderService>;
  let twoPiInstanceSpy : jasmine.SpyObj<any>;

  beforeEach(() => {
    twoPiInstanceSpy = jasmine.createSpyObj('twoPi',{
      getVaults : []
    })
    blockchainProviderServiceSpy = jasmine.createSpyObj('BlockchainProviderService', {
      createProvider : Promise.resolve()
    })
    TestBed.configureTestingModule({
      providers : [{provide: BlockchainProviderService , useValue: blockchainProviderServiceSpy}]
    });
    service = TestBed.inject(TwoPiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return vaults on getVaults', () => {
     service.twoPi = twoPiInstanceSpy;
     const vaults = service.getVaults();
     expect(vaults).toEqual([])
  });
});
