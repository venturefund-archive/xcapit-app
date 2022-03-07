import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { StorageWalletsService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { DisclaimerWalletPage } from './disclaimer-wallet.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { By } from '@angular/platform-browser';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';

describe('DisclaimerWalletPage', () => {
  let component: DisclaimerWalletPage;
  let fixture: ComponentFixture<DisclaimerWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DisclaimerWalletPage>;
  let navControllerSpy: any;
  let storageWalletsServiceSpy: any;
  let modalControllerSpy: any;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      storageWalletsServiceSpy = jasmine.createSpyObj('StorageWalletsService', ['acceptToS']);
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });

      TestBed.configureTestingModule({
        declarations: [DisclaimerWalletPage, FakeTrackClickDirective, DummyComponent],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([{ path: 'wallets/select-coins', component: DummyComponent }]),
          IonicModule,
          ReactiveFormsModule,
        ],
        providers: [
          { provide: StorageWalletsService, useValue: storageWalletsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: BrowserService, useValue: browserServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(DisclaimerWalletPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not proceed if the checkboxes are not checked', () => {
    component.handleSubmit();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });

  it('should proceed if all the checkboxes are checked', () => {
    component.disclaimerForm.patchValue({
      localStoredKeysCheckbox: true,
      recoveryPhraseCheckbox: true,
      termsOfUseCheckbox: true,
    });
    component.handleSubmit();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Terms of Use Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Terms of Use');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when ux_create_submit Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_create_submit');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open in app browser when Terms of Use is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Terms of Use"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'https://xcapit.com/tyc/' });
  });
});
