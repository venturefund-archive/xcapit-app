import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { UserKycKriptonDataService } from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';
import { KycUserBasicInformationPage } from './kyc-user-basic-information.page';

describe('KycUserBasicInformationPage', () => {
  let component: KycUserBasicInformationPage;
  let fixture: ComponentFixture<KycUserBasicInformationPage>;
  let userKycKriptonDataServiceSpy: jasmine.SpyObj<UserKycKriptonDataService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  const invalidFormData = {
    firstName: 'test',
    lastName: 'test',
    birthday: '1-1-1999',
  };
  const validFormData = {
    firstName: 'test',
    lastName: 'test',
    birthday: '1/1/1999',
  };

  beforeEach(waitForAsync(() => {
    userKycKriptonDataServiceSpy = jasmine.createSpyObj('UserKycKriptonDataService', {
      updateData: null,
    });
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [KycUserBasicInformationPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: UserKycKriptonDataService, useValue: userKycKriptonDataServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KycUserBasicInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    const progressEl = fixture.debugElement.query(By.css('.ubi__container__progress'));
    const providerEl = fixture.debugElement.query(By.css('div.ubi__container__provider > ion-text'));
    const titleEl = fixture.debugElement.query(By.css('div.ubi__container__title > ion-text'));
    const subtitleEl = fixture.debugElement.query(By.css('div.ubi__container__subtitle > ion-text'));
    const iconEl = fixture.debugElement.query(By.css('div.ubi__container__subtitle > ion-text > ion-icon'));
    const [input1, input2, input3] = fixture.debugElement.queryAll(
      By.css('div.ubi__container__form > form > app-ux-input')
    );
    const buttonEl = fixture.debugElement.query(By.css('ion-footer.ubi__footer > div > ion-button'));
    expect(progressEl).toBeTruthy();
    expect(providerEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_basic.provider');
    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_basic.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_basic.subtitle');
    expect(iconEl).toBeTruthy();
    expect(input1.attributes.controlName).toContain('firstName');
    expect(input2.attributes.controlName).toContain('lastName');
    expect(input3.attributes.controlName).toContain('birthday');
    expect(buttonEl).toBeTruthy();
  });

  it('should disable Continue button if form is not valid', () => {
    component.form.patchValue(invalidFormData);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-footer.ubi__footer > div > ion-button'));

    expect(buttonEl.properties.disabled).toBeTrue();
  });

  it('should set userKycKriptonData when form was sumbitted', () => {
    component.form.patchValue(validFormData);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-footer.ubi__footer > div > ion-button'));
    buttonEl.nativeElement.click();

    expect(userKycKriptonDataServiceSpy.updateData).toHaveBeenCalledOnceWith(validFormData);
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
