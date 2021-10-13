import { TestBed } from '@angular/core/testing';
import { WalletMnemonicService } from './wallet-mnemonic.service';

describe('WalletMnemonicService', () => {
  let service: WalletMnemonicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletMnemonicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a mnemonic on mnemonic', () => {
    const mnemonic = service.newMnemonic();
    expect(mnemonic.phrase.split(' ').length).toBe(12);
  });

  it('should use en as language when creating a new mnemonic', () => {
    const mnemonic = service.newMnemonic();
    expect(mnemonic.locale).toBe('en');
  });
});
