import { TestBed } from '@angular/core/testing';
import { BlockchainProviderService } from './blockchain-provider.service';
import { BigNumber } from 'ethers';

describe('BlockchainProviderService', () => {
  let service: BlockchainProviderService;
  let providerMock;
  beforeEach(() => {
    providerMock = {
      getBalance: (): Promise<BigNumber> => Promise.resolve(BigNumber.from('0xfffffffffffffff')),
    };
    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(BlockchainProviderService);
    service.provider = providerMock;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save provider on create', () => {
    expect(service.provider).toBeTruthy();
  });

  it('should call provider get balance and format output when formattedBalanceOf is called', async () => {
    const response = service.getFormattedBalanceOf('testAddress');
    await expectAsync(response).toBeResolvedTo('1.152921504606846975');
  });
});
