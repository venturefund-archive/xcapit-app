import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletPasswordChangePage } from './wallet-password-change.page';

describe('WalletPasswordChangePage', () => {
  let component: WalletPasswordChangePage;
  let fixture: ComponentFixture<WalletPasswordChangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletPasswordChangePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletPasswordChangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
