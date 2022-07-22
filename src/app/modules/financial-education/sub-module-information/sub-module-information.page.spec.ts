import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { MODULES_FINANCE } from '../shared-financial-education/constants/finance';
import { rawEducationData } from '../shared-financial-education/fixtures/rawEducationData';
import { FinancialEducationService } from '../shared-financial-education/services/financial-education/financial-education.service';
import { SubModuleInformationPage } from './sub-module-information.page';
import { of } from 'rxjs';

fdescribe('SubModuleInformationPage', () => {
  let component: SubModuleInformationPage;
  let fixture: ComponentFixture<SubModuleInformationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SubModuleInformationPage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let financialEducationServiceSpy: jasmine.SpyObj<FinancialEducationService>;

  beforeEach(
    waitForAsync(() => {
      financialEducationServiceSpy = jasmine.createSpyObj('FinancialEducationService', {
        getEducationDataOf: of(rawEducationData),
      });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      fakeActivatedRoute = new FakeActivatedRoute({
        tab: 'finance',
        module: '1',
        submodule: '1',
        code: 'tc_finance_1_submodule_1',
      });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getWalletFromStorage: Promise.resolve({
          addresses: { ERC20: 'testAddress', MATIC: 'testAddressMatic', RSK: 'testAddressRsk' },
        }),
      });
      TestBed.configureTestingModule({
        declarations: [SubModuleInformationPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: FinancialEducationService, useValue: financialEducationServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(SubModuleInformationPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data on init', async () => {
    expect(component.data).toEqual(MODULES_FINANCE);
    expect(component.module).toEqual(MODULES_FINANCE[0]);
    expect(component.subModule).toEqual(MODULES_FINANCE[0].sub_modules[0]);
  });

  //ya esta
  it('should call trackEvent on trackService when ux_education_learn Button clicked', () => {
    component.ionViewWillEnter();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_education_learn');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  //


  fit('should navigate to typeform page when button ux_education_learn is clicked', () => {
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('ion-button[name="ux_education_learn"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      'financial-education/typeform/category',
      'finance',
      'module',
      1,
      'submodule',
      1,
      'code',
      'dVKXJqBs',
    ]);
  });

  it('should call trackEvent on trackService when ux_education_test Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_education_test');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to typeform page when button ux_education_test is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_education_test"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      'financial-education/typeform/tab',
      'finance',
      'module',
      'finance_1',
      'submodule',
      'finance_sub_1',
      'code',
      'GGLKURh6',
    ]);
  });

  it('should not redirect to typeform learn page if the user has no wallet', async () => {
    storageServiceSpy.getWalletFromStorage.and.resolveTo(null)
    await component.ngOnInit()
    fixture.debugElement.query(By.css('ion-button[name="ux_education_learn"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['financial-education/error-no-wallet'])
  })

  it('should not redirect to typeform test page if the user has no wallet', async () => {
    storageServiceSpy.getWalletFromStorage.and.resolveTo(null)
    await component.ngOnInit()
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_education_test"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['financial-education/error-no-wallet'])
  })
});
