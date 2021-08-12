import { TestBed } from '@angular/core/testing';
import { ethers, Wallet } from 'ethers';
import { WalletService } from '../wallet/wallet.service';
import { WalletEncryptionService } from './wallet-encryption.service';
import { DerivedPaths } from '../../../enums/derived-paths.enum';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { Component } from '@angular/core';

const wallet = {
  address: 'testAddress',
  mnemonic: {
    path: "m/44'/60'/0'/0/0",
  },
};

const encWallet = {
  enc_wallet: 'enc_wallet',
};

const testWallet: Wallet = wallet as Wallet;
testWallet.encrypt = jasmine.createSpy().and.returnValue(Promise.resolve(encWallet));
const testCreatedWallets: Wallet[] = [testWallet];

describe('WalletEncryptionService', () => {
  let service: WalletEncryptionService;
  let storageSpy: any;
  let walletService: WalletService;
  let appStorageService: AppStorageService;
  let walletServiceMock;

  storageSpy = jasmine.createSpyObj('AppStorageService', ['get', 'set']);

  beforeEach(() => {
    walletServiceMock = {
      wallets: testCreatedWallets,
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: AppStorageService, useValue: storageSpy },
        { provide: WalletService, useValue: walletServiceMock },
      ],
    });
    service = TestBed.inject(WalletEncryptionService);
    walletService = TestBed.inject(WalletService);
    appStorageService = TestBed.inject(AppStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Shoud encrypt ETH wallet from array', async () => {
    walletService.createdWallets = testCreatedWallets;
    const res = await service.encryptWallet('testPassword');

    expect(res).toEqual(true);
    expect(storageSpy.set).toHaveBeenCalled();
  });
});
