import { AppStorageService, FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';

import { WalletRepo } from '../wallet-repo/wallet-repo';
import { DefaultWallets } from './default-wallets';
import { solanaAddress4 } from '../../fixtures/raw-address-data';
import { SolanaWallet } from '../wallet/solana/solana-wallet';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/default/default-blockchains';
import { FakeEthersWallet } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-ethers-wallet';
import {
  rawBlockchainsData,
  rawPolygonData,
  rawSolanaData,
} from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import {
  rawStoredWalletDataNew,
  rawStoredWalletData,
  rawStoredWalletDataNew2,
} from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-stored-wallet-data';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { SolanaDerivedWallet } from 'src/app/modules/swaps/shared-swaps/models/solana-derived-wallet/solana-derived-wallet';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains.interface';

describe('Wallets', () => {
  let wallets: DefaultWallets;
  let testObject: any;
  let storageSpy: jasmine.SpyObj<AppStorageService>;
  const blockchains: Blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  beforeEach(() => {
    testObject = { testMethod: () => Promise.resolve(new Password('TestPass123')) };
    spyOn(testObject, 'testMethod').and.callThrough();
    storageSpy = jasmine.createSpyObj('StorageService', {
      get: Promise.resolve(rawStoredWalletDataNew.enc_wallet),
      set: Promise.resolve(),
    });
    wallets = new DefaultWallets(new WalletRepo(storageSpy), blockchains, new FakeEthersWallet());
  });

  it('new', () => {
    expect(wallets).toBeTruthy();
  });

  it('create from', async () => {
    spyOn(SolanaDerivedWallet.prototype, 'address').and.returnValue('0x3');
    const saveSpy = spyOn(WalletRepo.prototype, 'save').and.callThrough();
    const aPhrase = 'super test phrase';
    const aBlockchain = new Blockchain(rawPolygonData);

    await wallets.createFrom(aPhrase, new Password('test'), 'default');

    expect((await wallets.oneBy(aBlockchain)).address()).toBeTruthy();
    expect(saveSpy).toHaveBeenCalledOnceWith({ ERC20: '0x1', MATIC: '0x1', SOLANA: '0x3' }, jasmine.any(String));
  });

  it('update from', async () => {
    spyOn(SolanaDerivedWallet.prototype, 'address').and.returnValue('0x3');
    const saveSpy = spyOn(WalletRepo.prototype, 'update').and.callThrough();
    const aPhrase = 'super test phrase';
    const aBlockchain = new Blockchain(rawPolygonData);

    await wallets.updateFrom(aPhrase, new Password('test'), 'default');

    expect((await wallets.oneBy(aBlockchain)).address()).toBeTruthy();
    expect(saveSpy).toHaveBeenCalledOnceWith({ ERC20: '0x1', MATIC: '0x1', SOLANA: '0x3' }, jasmine.any(String));
  });

  it('create from (legacy)', async () => {
    spyOn(SolanaDerivedWallet.prototype, 'address').and.returnValue('0x3');
    const saveSpy = spyOn(WalletRepo.prototype, 'save').and.callThrough();
    const aPhrase = 'super test phrase';
    const aBlockchain = new Blockchain(rawPolygonData);

    await wallets.createFrom(aPhrase, new Password('test'), 'legacy');

    expect((await wallets.oneBy(aBlockchain)).address()).toBeTruthy();
    expect(saveSpy).toHaveBeenCalledOnceWith({ ERC20: '0x1', MATIC: '0x2', SOLANA: '0x3' }, jasmine.any(String));
  });

  it('return one by blockchain', async () => {
    const expectedResult = rawStoredWalletDataNew.enc_wallet.addresses.MATIC;
    const aBlockchain = new Blockchain(rawPolygonData);

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
  });

  it('return one by blockchain solana', async () => {
    const expectedResult = rawStoredWalletDataNew.enc_wallet.addresses.SOLANA;
    const aBlockchain = new Blockchain(rawSolanaData);

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
    expect(await wallets.oneBy(aBlockchain)).toBeInstanceOf(SolanaWallet);
  });

  it('return one by blockchain (legacy)', async () => {
    storageSpy.get.and.resolveTo(rawStoredWalletData.enc_wallet);

    const expectedResult = rawStoredWalletData.enc_wallet.addresses.MATIC;
    const aBlockchain = new Blockchain(rawPolygonData);

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
  });

  it('return one by blockchain solana (legacy)', async () => {
    storageSpy.get.and.resolveTo(rawStoredWalletData.enc_wallet);

    const expectedResult = rawStoredWalletData.enc_wallet.addresses.SOLANA;
    const aBlockchain = new Blockchain(rawSolanaData);

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
    expect(await wallets.oneBy(aBlockchain)).toBeInstanceOf(SolanaWallet);
  });

  it('upgrade', async () => {
    const fakeStorage = new FakeAppStorage(rawStoredWalletDataNew2);
    const wallets = new DefaultWallets(new WalletRepo(fakeStorage), blockchains, new FakeEthersWallet());
    wallets.onNeedPass().subscribe(() => testObject.testMethod());

    await wallets.upgrade();

    expect((await wallets.oneBy(blockchains.oneByName(rawSolanaData.name))).address()).toEqual(solanaAddress4);
  });

  it('notify wallets was upgraded', async () => {
    const fakeStorage = new FakeAppStorage(rawStoredWalletDataNew2);
    const wallets = new DefaultWallets(new WalletRepo(fakeStorage), blockchains, new FakeEthersWallet());
    wallets.onUpgraded().subscribe(() => testObject.testMethod());
    wallets.onNeedPass().subscribe(() => testObject.testMethod());

    await wallets.upgrade();

    expect(testObject.testMethod).toHaveBeenCalledTimes(2);
  });

  it('should not notify when no upgraded', async () => {
    wallets.onUpgraded().subscribe(() => testObject.testMethod());
    wallets.onNeedPass().subscribe(() => testObject.testMethod());

    await wallets.upgrade();

    expect(testObject.testMethod).not.toHaveBeenCalled();
  });
});
