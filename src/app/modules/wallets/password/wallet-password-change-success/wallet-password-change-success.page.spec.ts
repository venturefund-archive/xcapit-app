import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletPasswordChangeSuccessPage } from './wallet-password-change-success.page';

describe('WalletPasswordChangeSuccessPage', () => {
  let component: WalletPasswordChangeSuccessPage;
  let fixture: ComponentFixture<WalletPasswordChangeSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletPasswordChangeSuccessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletPasswordChangeSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
