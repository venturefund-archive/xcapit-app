import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { StorageWalletsService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { DisclaimerWalletPage } from './disclaimer-wallet.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { By } from '@angular/platform-browser';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ActivatedRoute } from '@angular/router';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';

describe('DisclaimerWalletPage', () => {
  let component: DisclaimerWalletPage;
  let fixture: ComponentFixture<DisclaimerWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DisclaimerWalletPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageWalletsServiceSpy: any;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let linksSpy: jasmine.SpyObj<any>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeActivatedRooute: FakeActivatedRoute;

  beforeEach(
    waitForAsync(() => {
      fakeActivatedRooute = new FakeActivatedRoute();
      activatedRouteSpy = fakeActivatedRooute.createSpy();
      linksSpy = jasmine.createSpyObj('links',{}, {
        xcapitTermsAndConditions: 'https://dummytermsandconditinos',
        xcapitPrivacyPolicy: 'https://dummyprivacypolicy'
      })
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      storageWalletsServiceSpy = jasmine.createSpyObj('StorageWalletsService', ['acceptToS']);
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
  
      TestBed.configureTestingModule({
        declarations: [DisclaimerWalletPage, FakeTrackClickDirective],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          IonicModule.forRoot(),
          ReactiveFormsModule,
        ],
        providers: [
          { provide: StorageWalletsService, useValue: storageWalletsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: BrowserService, useValue: browserServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(DisclaimerWalletPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      component.links = linksSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable button if the checkboxes are not checked', async () => {
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Submit"]'));
    expect(buttonEl.attributes['ng-reflect-disabled']).toEqual('true');
  });

  it('should enable button if all the checkboxes are checked', async () => {
    component.disclaimerForm.patchValue({
      agreePhraseCheckbox: true,
    });
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Submit"]'));
    expect(buttonEl.attributes['ng-reflect-disabled']).toEqual('false');
  });

  it('should go to recovery on import', () => {
    fakeActivatedRooute.modifySnapshotParams({mode:'import'});
    component.ngOnInit();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit');
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/wallet-imports']);
  });

  it('should go to create password on create', () => {
    component.ngOnInit();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit');
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wallets/create-password/create']);
  })


  it('should call trackEvent on trackService when Submit Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Submit');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open terms and conditions when item ux_terms_and_conditions was clicked', () => {
    const tycItem = fixture.debugElement.query(By.css('div[name="ux_terms_and_conditions"]'));
    tycItem.nativeElement.click();
    fixture.detectChanges();
    expect(browserServiceSpy.open).toHaveBeenCalledTimes(1);
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'https://dummytermsandconditinos' });
  });

  it('should open privacy policy when item ux_privacy_policy was clicked', () => {
    const tycItem = fixture.debugElement.query(By.css('div[name="ux_privacy_policy"]'));
    tycItem.nativeElement.click();
    fixture.detectChanges();
    expect(browserServiceSpy.open).toHaveBeenCalledTimes(1);
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'https://dummyprivacypolicy' });
  });
});
