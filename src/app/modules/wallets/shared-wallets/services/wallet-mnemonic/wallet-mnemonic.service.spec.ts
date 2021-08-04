import { TestBed } from '@angular/core/testing';
import { LanguageService } from 'src/app/shared/services/language/language.service';

import { WalletMnemonicService } from './wallet-mnemonic.service';

describe('WalletMnemonicService', () => {
  let service: WalletMnemonicService;
  let languageServiceMock;
  let languageService;

  beforeEach(() => {
    languageServiceMock = { selected: 'es' };
    TestBed.configureTestingModule({
      providers: [{ provide: LanguageService, useValue: languageServiceMock }],
    });
    service = TestBed.inject(WalletMnemonicService);
    languageService = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a mnemonic on mnemonic', () => {
    const mnemonic = service.mnemonic();
    expect(mnemonic.phrase.split(' ').length).toBe(12);
  });

  it('should match selected language spanish on mnemonic', () => {
    languageService.selected = 'es';
    const mnemonic = service.mnemonic();
    expect(mnemonic.locale).toBe('es');
  });

  it('should match selected language english on mnemonic', () => {
    languageService.selected = 'en';
    const mnemonic = service.mnemonic();
    expect(mnemonic.locale).toBe('en');
  });
});
