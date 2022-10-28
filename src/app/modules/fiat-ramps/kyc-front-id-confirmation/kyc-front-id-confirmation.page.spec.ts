import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserKycKriptonImagesService } from '../shared-ramps/services/user-kyc-kripton-images/user-kyc-kripton-images.service';

import { KycFrontIdConfirmationPage } from './kyc-front-id-confirmation.page';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('KycFrontIdConfirmationPage', () => {
  let component: KycFrontIdConfirmationPage;
  let fixture: ComponentFixture<KycFrontIdConfirmationPage>;
  let userKycKriptonImagesServiceSpy: jasmine.SpyObj<UserKycKriptonImagesService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(waitForAsync(() => {
    userKycKriptonImagesServiceSpy = jasmine.createSpyObj('UserKycKriptonImagesService', {
      getPhotos: { front_document: 'http://localhost:9876/assets/test_image.svg' },
    });

    navControllerSpy = new FakeNavController().createSpy();

    TestBed.configureTestingModule({
      declarations: [KycFrontIdConfirmationPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: UserKycKriptonImagesService, useValue: userKycKriptonImagesServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KycFrontIdConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show front_document on screen', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();

    expect(component.image).toEqual('http://localhost:9876/assets/test_image.svg');
  });

  it('should redirect to back id page', () => {
    const contentEl = fixture.debugElement.query(By.css('app-confirmation-content'));
    contentEl.triggerEventHandler('confirm', null);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tabs/wallets');
  });

  it('should redirect to front id page', () => {
    const contentEl = fixture.debugElement.query(By.css('app-confirmation-content'));
    contentEl.triggerEventHandler('back', null);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/fiat-ramps/kyc-front-id');
  });
});
