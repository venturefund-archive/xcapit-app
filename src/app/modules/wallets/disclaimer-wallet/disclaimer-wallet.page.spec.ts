import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisclaimerWalletPage } from './disclaimer-wallet.page';

describe('DisclaimerWalletPage', () => {
  let component: DisclaimerWalletPage;
  let fixture: ComponentFixture<DisclaimerWalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisclaimerWalletPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DisclaimerWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
