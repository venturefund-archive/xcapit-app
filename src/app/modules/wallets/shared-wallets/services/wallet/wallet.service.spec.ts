import { TestBed } from '@angular/core/testing';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';

import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;
  let walletMnemonicServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WalletMnemonicService, useValue: walletMnemonicServiceMock }],
    });
    service = TestBed.inject(WalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
