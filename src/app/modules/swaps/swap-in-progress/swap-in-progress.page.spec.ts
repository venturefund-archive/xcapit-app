import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';

import { SwapInProgressPage } from './swap-in-progress.page';

const testData = {
  image:"assets/img/swaps/swap-in-progress.svg",
  urlClose:'/tabs/wallets',
  textPrimary: 'swaps.swap_in_progress.textPrimary',
  textSecondary:'swaps.swap_in_progress.textSecondary',
  namePrimaryAction:'swaps.swap_in_progress.buttonText',
  urlPrimaryAction:'/tabs/wallets',
}

fdescribe('SwapInProgressPage', () => {
  let component: SwapInProgressPage;
  let fixture: ComponentFixture<SwapInProgressPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    TestBed.configureTestingModule({
      declarations: [ SwapInProgressPage ],
      imports: [IonicModule.forRoot()],
      providers: [ { provide: TrackService, useValue: trackServiceSpy }],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();


    fixture = TestBed.createComponent(SwapInProgressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    component.ionViewDidEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should render properly', () => {
    component.data = testData;
    const appErrorContentEl = fixture.debugElement.query(By.css('app-success-content'));
    expect(appErrorContentEl).toBeTruthy();
  });

});
