import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletPasswordChangeErrorPage } from './wallet-password-change-error.page';

describe('WalletPasswordChangeErrorPage', () => {
  let component: WalletPasswordChangeErrorPage;
  let fixture: ComponentFixture<WalletPasswordChangeErrorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletPasswordChangeErrorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletPasswordChangeErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
