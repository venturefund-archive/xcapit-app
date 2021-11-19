import { TestBed } from '@angular/core/testing';
import { BigNumber } from '@ethersproject/bignumber';
import { of } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { BlockchainProviderService } from '../blockchain-provider/blockchain-provider.service';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { NftService } from './nft.service';

describe('NftService', () => {
  let service: NftService;
  let customHttpServiceSpy: jasmine.SpyObj<CustomHttpService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let blockchainProviderServiceMock;
  let contractMock;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      get: of({ description: 'Test', name: 'testName', image: 'testImage' }),
    });
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletFromStorage: Promise.resolve({
        addresses: { ERC20: 'testAddress', MATIC: 'testAddressMatic', RSK: 'testAddressRsk' },
      }),
    });
    contractMock = {
      walletOfOwner: (address: string) => Promise.resolve([BigNumber.from('0x01')]),
      tokenURI: (id: number) => Promise.resolve('testURL'),
    };
    blockchainProviderServiceMock = {
      createContract: (contractAddress: string, abi: any, provider: any) => contractMock,
      createProvider: (rpc: string) => Promise.resolve({}),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: BlockchainProviderService, useValue: blockchainProviderServiceMock },
      ],
    });
    service = TestBed.inject(NftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get matadata when getNFTMetadata is called', async () => {
    const metadata = await service.getNFTMetadata();
    expect(metadata.description).toEqual('Test');
    expect(metadata.name).toEqual('testName');
    expect(metadata.image).toEqual('testImage');
  });
});
