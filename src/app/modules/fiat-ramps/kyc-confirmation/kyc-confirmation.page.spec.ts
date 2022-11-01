import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserKycKriptonImagesService } from '../shared-ramps/services/user-kyc-kripton-images/user-kyc-kripton-images.service';
import { KycConfirmationPage } from './kyc-confirmation.page';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FakeActivatedRoute } from '../../../../testing/fakes/activated-route.fake.spec';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';

describe('KycConfirmationPage', () => {
  let component: KycConfirmationPage;
  let fixture: ComponentFixture<KycConfirmationPage>;
  let userKycKriptonImagesServiceSpy: jasmine.SpyObj<UserKycKriptonImagesService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController(null, { role: 'confirm' });
    modalControllerSpy = fakeModalController.createSpy();
    activatedRouteSpy = new FakeActivatedRoute({ digitalDocument: 'front_id' }).createSpy();

    userKycKriptonImagesServiceSpy = jasmine.createSpyObj('UserKycKriptonImagesService', {
      getPhotos: { front_document: 'http://localhost:9876/assets/test_image.svg' },
    });

    navControllerSpy = new FakeNavController().createSpy();

    TestBed.configureTestingModule({
      declarations: [KycConfirmationPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: UserKycKriptonImagesService, useValue: userKycKriptonImagesServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KycConfirmationPage);
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
    component.ionViewWillEnter();
    fixture.detectChanges();
    const contentEl = fixture.debugElement.query(By.css('app-confirmation-content'));
    contentEl.triggerEventHandler('confirm', null);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/kyc/validation/back_id');
  });

  it('should redirect to validation page when reload is clicked', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const contentEl = fixture.debugElement.query(By.css('app-confirmation-content'));
    contentEl.triggerEventHandler('reload', null);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/fiat-ramps/kyc/validation/front_id');
  });

  it('should navigate back if modal confirmed', fakeAsync(() => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-confirmation-content')).triggerEventHandler('back', null);
    fixture.detectChanges();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/fiat-ramps/user-register');
  }));

  it('should not navigate back if modal canceled', fakeAsync(() => {
    fakeModalController.modifyReturns(null, { role: 'cancel' });
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-confirmation-content')).triggerEventHandler('back', null);
    fixture.detectChanges();
    tick();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).not.toHaveBeenCalled();
  }));
});