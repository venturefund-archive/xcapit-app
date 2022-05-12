import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { SuccessDonationPage } from './success-donation.page';

const testData = {
  image: '/assets/img/donations/success/success-donation.svg',
  urlClose: '/tabs/wallets',
  textPrimary: 'donations.success.textPrimary',
  textSecondary: 'donations.success.textSecondary',
  namePrimaryAction: 'donations.success.namePrimaryAction',
  urlPrimaryAction: '/donations/causes',
  nameThirdAction: 'donations.success.nameThirdAction',
  urlThirdAction: '/tabs/wallets',
}

describe('SuccessDonationPage', () => {
  let component: SuccessDonationPage;
  let fixture: ComponentFixture<SuccessDonationPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessDonationPage ],
      imports: [IonicModule.forRoot()],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessDonationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.data = testData;
    const appErrorContentEl = fixture.debugElement.query(By.css('app-success-content'));
    expect(appErrorContentEl).toBeTruthy();
  });

});
