import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { StorageWalletsService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { DisclaimerWalletPage } from './disclaimer-wallet.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { By } from '@angular/platform-browser';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

const textLink = "'Text test <a class='ux-link-xs' href='https://testLink'>terms of use</a>.'"

describe('DisclaimerWalletPage', () => {
  let component: DisclaimerWalletPage;
  let fixture: ComponentFixture<DisclaimerWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DisclaimerWalletPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageWalletsServiceSpy: any;
  let modalControllerSpy: any;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let elementRefSpy: jasmine.SpyObj<ElementRef>;
  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      storageWalletsServiceSpy = jasmine.createSpyObj('StorageWalletsService', ['acceptToS']);
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
      elementRefSpy = jasmine.createSpyObj(
        'ElementRef',
        {},
        {
          nativeElement: {
            querySelectorAll: () => [
              {
                addEventListener: () => null,
              },
            ],
          },
        }
      );
      TestBed.configureTestingModule({
        declarations: [DisclaimerWalletPage, FakeTrackClickDirective, DummyComponent],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([{ path: 'wallets/select-coins', component: DummyComponent }]),
          IonicModule.forRoot(),
          ReactiveFormsModule,
        ],
        providers: [
          { provide: StorageWalletsService, useValue: storageWalletsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: BrowserService, useValue: browserServiceSpy },
          {provide: ElementRef, useValue: elementRefSpy}
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


  it('should call trackEvent on trackService when ux_create_submit Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_create_submit');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });


  it('should open the link in the app when link is clicked', async () => {
    component.textLink = textLink;
    fixture.detectChanges();
    component.ngAfterViewInit();
    const anchor = fixture.debugElement.query(By.css('a'));
    const link = anchor.nativeElement.getAttribute('href');
    anchor.nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: 'https://testLink' });
    expect(link).toEqual('https://testLink');
  });
});
