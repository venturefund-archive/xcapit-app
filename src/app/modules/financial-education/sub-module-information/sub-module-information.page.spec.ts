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
import { rawEducationData } from '../shared-financial-education/fixtures/rawEducationData';
import { FinancialEducationService } from '../shared-financial-education/services/financial-education/financial-education.service';
import { SubModuleInformationPage } from './sub-module-information.page';
import { of } from 'rxjs';

describe('SubModuleInformationPage', () => {
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
        category: 'finance',
        module: 1,
        submodule: 1,
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

  it('should get finance data on init', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(component.data).toEqual(rawEducationData);
    expect(component.module).toEqual(rawEducationData.finance[0]);
    expect(component.subModule).toEqual(rawEducationData.finance[0].submodules[0]);
  });

  it('should get crypto data on init', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      category: 'crypto',
      module: 4,
      submodule: 3,
    });
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(component.data).toEqual(rawEducationData);
    expect(component.module).toEqual(rawEducationData.crypto[0]);
    expect(component.subModule).toEqual(rawEducationData.crypto[0].submodules[0]);
  });


  it('should call trackEvent on trackService when ux_education_learn Button clicked', async () => {
    await component.ionViewWillEnter();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_education_learn');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });


  it('should navigate to typeform page when button ux_education_learn is clicked', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
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
      'lc_finance_1_submodule_1',
    ]);
  });

  it('should call trackEvent on trackService when ux_education_test Button clicked', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_education_test');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });


  it('should navigate to typeform page when button ux_education_test is clicked', async () => {
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.debugElement.query(By.css('ion-button[name="ux_education_test"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      'financial-education/typeform/category',
      'finance',
      'module',
      1,
      'submodule',
      1,
      'code',
      'tc_finance_1_submodule_1',
    ]);
  }); 
});
