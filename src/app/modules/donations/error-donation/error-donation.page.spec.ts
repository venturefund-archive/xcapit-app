import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';

import { ErrorDonationPage } from './error-donation.page';

const testData = {
  image: '/assets/img/donations/error/test.svg',
  urlClose: '/donations/causes',
  textPrimary: 'donations.error.textPrimary',
  textSecondary: 'donations.error.textSecondary',
  namePrimaryAction: 'donations.error.namePrimaryAction',
  urlPrimaryAction: '/donations/causes',
  trackClickEventNamePrimaryAction: 'ux_donations_go_to_donations',
}

describe('ErrorDonationPage', () => {
  let component: ErrorDonationPage;
  let fixture: ComponentFixture<ErrorDonationPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy',{ trackEvent: Promise.resolve(true),})
    TestBed.configureTestingModule({
      declarations: [ ErrorDonationPage ],
      imports: [IonicModule.forRoot()],
      providers:[{ provide: TrackService, useValue: trackServiceSpy}],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDonationPage);
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


  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

});
