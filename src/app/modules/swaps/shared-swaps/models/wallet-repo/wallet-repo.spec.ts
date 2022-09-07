import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import { FakeAppStorage } from "src/app/shared/services/app-storage/app-storage.service";
import { rawStoredWalletData } from "../fixtures/raw-stored-wallet-data";
import { NewWalletRepo, WalletRepo } from "./wallet-repo";


describe('Wallet Repo', () => {

  let repo: WalletRepo;

  beforeEach(() => {
    repo = new WalletRepo(new FakeAppStorage(rawStoredWalletData));
  });

  it('new', () => {
    expect(new WalletRepo(new FakeAppStorage())).toBeTruthy();
  });

  it('get by blockchain name', async () => {
    expect(await repo.addressByName('MATIC')).toEqual(rawStoredWalletData.enc_wallet.addresses.MATIC);
  });

  it('encrypted value access', async () => {
    expect(await repo.encryptedRootWallet()).toEqual(rawStoredWalletData.enc_wallet.wallet);
  });
});

describe('New Wallet Repo', () => {
  const testWalletSolana: Keypair = { secretKey: 'testPrivate', publicKey: 'testPublicSolana' } as unknown as Keypair;
  const testWalletEthers: ethers.Wallet = { address: 'testAddress', encrypt: (password) => Promise.resolve('testEncrypted') } as ethers.Wallet;

  let newRepo: NewWalletRepo;
  let ethersFromMnemonic: jasmine.Spy;
  let utilsSpy: jasmine.SpyObj<any>;
  let keypairFromSeed: jasmine.Spy;

  beforeEach(() => {
    ethersFromMnemonic = spyOn(ethers.Wallet, 'fromMnemonic').and.returnValue(testWalletEthers);
    utilsSpy = jasmine.createSpyObj('utils', {
      mnemonicToSeed: '0x00323467',
      arrayify: Uint8Array.from([0, 50, 52, 103])
    });
    keypairFromSeed = spyOn(Keypair, 'fromSeed').and.returnValue(testWalletSolana);
    newRepo = new NewWalletRepo('test','test');
    newRepo.utils = utilsSpy;
  });

  it('new', () => {
    expect(new NewWalletRepo('test','test')).toBeTruthy();
  });

  it('get by blockchain name ethers', async () => {
    expect(await newRepo.addressByName('MATIC')).toEqual('testaddress');
  });

  
  it('get by blockchain name solana', async () => {
    expect(await newRepo.addressByName('SOLANA')).toEqual('testPublicSolana');
  });

  it('encrypted value access', async () => {
    expect(await newRepo.encryptedRootWallet()).toEqual('testEncrypted');
  });
});
