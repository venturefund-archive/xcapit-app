import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { PersonalisedProfileTestPage } from './personalised-profile-test.page';

describe('PersonalisedProfileTestPage', () => {
  let component: PersonalisedProfileTestPage;
  let fixture: ComponentFixture<PersonalisedProfileTestPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  
  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [PersonalisedProfileTestPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalisedProfileTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  [
    {
      formData: {
        investor: true,
        remote: true,
        web3: true,
        gamer: true,
        other: true,
      },
      eventLabel: 'ux_user_web3',
    },
    {
      formData: {
        investor: true,
        remote: true,
        web3: false,
        gamer: true,
        other: true,
      },
      eventLabel: 'ux_user_gamer',
    },
    {
      formData: {
        investor: true,
        remote: true,
        web3: false,
        gamer: false,
        other: true,
      },
      eventLabel: 'ux_user_remote',
    },
    {
      formData: {
        investor: true,
        remote: false,
        web3: false,
        gamer: false,
        other: true,
      },
      eventLabel: 'ux_user_investor',
    },
    {
      formData: {
        investor: false,
        remote: false,
        web3: false,
        gamer: false,
        other: true,
      },
      eventLabel: 'ux_user_other',
    },
  ].forEach((testcase) => {
    it(`should call ${testcase.eventLabel} trackEvent on trackService when Submit Button is clicked`, () => {
      component.to_do_in_app_form.patchValue(testcase.formData);
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('ion-button[name="Submit test"]'));
      el.nativeElement.click();
      fixture.detectChanges();
      expect(trackServiceSpy.trackEvent).toHaveBeenCalled();
      expect(component.toDoEventToSend).toEqual(testcase.eventLabel);
    });
  });

  [
    {
      formData: { radio_option: 'beginner' },
      eventLabel: 'ux_user_beginner',
    },
    {
      formData: { radio_option: 'intermediate' },
      eventLabel: 'ux_user_intermediate',
    },
    {
      formData: { radio_option: 'advanced' },
      eventLabel: 'ux_user_advanced',
    },
  ].forEach((testcase) => {
    it(`should call ${testcase.eventLabel} trackEvent on trackService when Submit Button is clicked`, () => {
      component.crypto_experience_form.patchValue(testcase.formData);
      fixture.detectChanges();
      fixture.debugElement.query(By.css('ion-button[name="Submit test"]')).nativeElement.click();
      fixture.detectChanges();
      expect(trackServiceSpy.trackEvent).toHaveBeenCalled();
      expect(component.cryptoEventToSend).toEqual(testcase.eventLabel);
    });
  });

  it('should show warning modal on Skip test button clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Skip test"]')).nativeElement.click();
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should navigateRoot to success page when both forms are valid', async () => {
    component.to_do_in_app_form.patchValue({
      investor: false,
      remote: false,
      web3: false,
      gamer: false,
      other: true,
    });
    component.crypto_experience_form.patchValue({ radio_option: 'beginner' });
    fixture.debugElement.query(By.css('ion-button[name="Submit test"]')).nativeElement.click();
    fixture.detectChanges();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith([component.successProfileTestUrl]);
  });
});
