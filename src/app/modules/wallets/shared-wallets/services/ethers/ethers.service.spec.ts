import { EthersService } from './ethers.service';
import { ContractInterface, ethers } from 'ethers';
import { Coin } from '../../interfaces/coin.interface';
import { COINS } from '../../../constants/coins';

const LINK: Coin = COINS.find((coin) => coin.value === 'LINK');

describe('EthersService', () => {
  let service: EthersService;
  beforeEach(() => {
    service = new EthersService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return ethers lib on ethers is called', () => {
    expect(service.ethers()).toEqual(ethers);
  });

  it('should return created contract with provider', () => {
    const serviceContract = service.newContract(
      '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
      LINK.abi as unknown as ContractInterface,
      new ethers.providers.JsonRpcProvider('')
    );
    expect(serviceContract).toBeTruthy();
  });
});
