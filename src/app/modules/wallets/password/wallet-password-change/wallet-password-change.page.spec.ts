import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { WalletPasswordChangePage } from './wallet-password-change.page';

const formData = {
  valid: {
    old_password: 'oldTestPassword0',
    new_password: 'newTestPassword0',
    repeat_password: 'newTestPassword0'
  },
  invalid: {

  }
}

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

  it('should enable Submit button if form is valid', () => {
    
  });

  it('should show error message and disable Submit button if new password and repeat password do not match');

  it('should show error message and disable Submit button if old password and new password match');

  it('should show error message if old password is not the current password');
});
