import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { DefiInvestmentSuccessWithdrawPage } from './defi-investment-success-withdraw.page';

describe('DefiInvestmentSuccessWithdrawPage', () => {
  let component: DefiInvestmentSuccessWithdrawPage;
  let fixture: ComponentFixture<DefiInvestmentSuccessWithdrawPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [DefiInvestmentSuccessWithdrawPage],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: TrackService, useValue: trackServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DefiInvestmentSuccessWithdrawPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data on will enter', () => {
    component.ionViewWillEnter();
    expect(component.data).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
