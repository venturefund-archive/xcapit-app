import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule} from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SuccessProfileTestPage } from './success-profile-test.page';

const testData = {
  image: '/assets/img/profiles/success-profile-test.svg',
  urlClose: '/tabs/wallets',
  textPrimary: 'profiles.success_profile_test.text_primary',
  textSecondary: 'profiles.success_profile_test.text_secondary',
  urlPrimaryAction: '/tabs/wallets',
  namePrimaryAction: 'profiles.success_profile_test.name_primary_action',
}

describe('SuccessProfileTestPage', () => {
  let component: SuccessProfileTestPage;
  let fixture: ComponentFixture<SuccessProfileTestPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy',{ trackEvent: Promise.resolve(true),})
    TestBed.configureTestingModule({
      declarations: [ SuccessProfileTestPage ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [ { provide: TrackService, useValue: trackServiceSpy}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessProfileTestPage);
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
