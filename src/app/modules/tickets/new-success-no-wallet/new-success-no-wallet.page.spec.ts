import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewSuccessNoWalletPage } from './new-success-no-wallet.page';

describe('NewSuccessNoWalletPage', () => {
  let component: NewSuccessNoWalletPage;
  let fixture: ComponentFixture<NewSuccessNoWalletPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSuccessNoWalletPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewSuccessNoWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
