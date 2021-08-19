import { TestBed } from '@angular/core/testing';
import { BlockchainProviderService } from './blockchain-provider.service';
import { BigNumber } from 'ethers';
import { Coin } from '../../interfaces/coin.interface';

const COINS: Coin[] = [
  {
    id: 1,
    name: 'coinTest',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ETH',
    rpc: 'http://testrpc.test',
  },
];

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
    spyOn(service, 'getProvider').and.returnValue(providerMock);
    const response = service.getFormattedBalanceOf('testAddress', 'coinTest');
    await expectAsync(response).toBeResolvedTo('1.152921504606846975');
  });
});
