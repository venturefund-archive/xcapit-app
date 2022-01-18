import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { UrlSerializer } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletEncryptionService } from '../../../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { WalletService } from '../../../../wallets/shared-wallets/services/wallet/wallet.service';
import { BlockchainProviderService } from '../../services/blockchain-provider/blockchain-provider.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { WalletConnectSignRequestComponent } from './wallet-connect-sign-request.component';

describe('WalletConnectSignRequestComponent', () => {
  let component: WalletConnectSignRequestComponent;
  let fixture: ComponentFixture<WalletConnectSignRequestComponent>;
  const walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService> = null;
  const walletServiceSpy: jasmine.SpyObj<WalletService> = null;
  const blockchainProviderServiceMock = null;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WalletConnectSignRequestComponent],
        imports: [IonicModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [
          UrlSerializer,
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: BlockchainProviderService, useValue: blockchainProviderServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletConnectSignRequestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
