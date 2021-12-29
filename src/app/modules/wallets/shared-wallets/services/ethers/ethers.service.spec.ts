import { EthersService } from './ethers.service';
import { ContractInterface, ethers, Wallet } from 'ethers';
import { Coin } from '../../interfaces/coin.interface';
import { NONPROD_COINS } from '../../constants/coins.nonprod';

const LINK: Coin = NONPROD_COINS.find((coin) => coin.value === 'LINK');
const testWallet = {
  encryptedWallet:
    '{"address":"a8d720dbc2bea006e8450a6c0456e169d2fd7954","id":"4c559f54-bcc2-447e-aacf-215d61402c04","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"256988c1ef9a6c7f7baa788a4c2f6049"},"ciphertext":"424cb609679351166ed8ec32e755f6bf0da3bc24564865e375f447d2c1e9aff9","kdf":"scrypt","kdfparams":{"salt":"2202153f3cafa53809c177c80da0880d3a928f24988f786b186825b15ee2b833","n":131072,"dklen":32,"p":1,"r":8},"mac":"d9d41ba202a2520883ab3b933eeeb0a129d4884b7bb88661758edec8fabf3002"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2021-09-07T14-51-41.0Z--a8d720dbc2bea006e8450a6c0456e169d2fd7954","mnemonicCounter":"0b972e8bdfb383008c2709eea1a5045d","mnemonicCiphertext":"d3b1c4361bebae20854f01128665ca48","path":"m/44\'/60\'/0\'/0/0","locale":"en","version":"0.1"}}',
  password: 'TestPass1234',
};

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

  it('should decrypt wallet on decryptWalletJsonSync', () => {
    const decryptedWallet = service.decryptWalletJsonSync(testWallet.encryptedWallet, testWallet.password);
    expect(decryptedWallet).toBeDefined();
    expect(decryptedWallet).toBeInstanceOf(Wallet);
  });
});
