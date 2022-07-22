import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { rawEducationData } from '../shared-financial-education/fixtures/rawEducationData';
import { rawSubmoduleResult } from '../shared-financial-education/fixtures/rawSubmoduleResult';
import { FinancialEducationService } from '../shared-financial-education/services/financial-education/financial-education.service';
import { TestTypeformPage } from './test-typeform.page';
import { of } from 'rxjs';

fdescribe('TestTypeformPage', () => {
  let component: TestTypeformPage;
  let fixture: ComponentFixture<TestTypeformPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TestTypeformPage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let financialEducationServiceSpy: jasmine.SpyObj<FinancialEducationService>;

  beforeEach(
    waitForAsync(() => {
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getWalletFromStorage: Promise.resolve({
          addresses: { ERC20: 'testAddress', MATIC: 'testAddressMatic', RSK: 'testAddressRsk' },
        }),
      });
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['get']);
      fakeActivatedRoute = new FakeActivatedRoute({
        category: 'finance',
        module: 1,
        submodule: 1,
        code: 'tc_finance_1_submodule_1',
      });
      financialEducationServiceSpy = jasmine.createSpyObj('FinancialEducationService', {
        getEducationDataOf: of(rawEducationData),
        getSubmoduleResultOf: of(rawSubmoduleResult),
      });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [TestTypeformPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: FinancialEducationService, useValue: financialEducationServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TestTypeformPage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data on will enter', async () => {
    rawEducationData.finance[0].status = 'completed';
    rawEducationData.finance[0].submodules[0].status = 'completed';
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.data).toEqual(rawEducationData.finance);
    expect(component.module).toEqual(rawEducationData.finance[0]);
    expect(component.subModule).toEqual(rawSubmoduleResult);
    expect(component.code).toEqual('tc_finance_1_submodule_1');
    expect(component.wallet_address).toEqual('testAddress');
  });

  it('should set correct header according to learning_code', async () => {
    rawEducationData.finance[0].status = 'completed';
    rawEducationData.finance[0].submodules[0].status = 'completed';
    fakeActivatedRoute.modifySnapshotParams({
      category: 'finance',
      module: 1,
      submodule: 1,
      code: 'lc_finance_1_submodule_1',
    });
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.headerText).toEqual('financial_education.typeform_header.finance_sub_1');
  });

  it('should set correct header according to test_code', async () => {
    rawEducationData.finance[0].status = 'completed';
    rawEducationData.finance[0].submodules[0].status = 'completed';
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(component.headerText).toEqual(
      'financial_education.typeform_header.text financial_education.typeform_header.finance_sub_1'
    );
  });

  it('should navigate to error test page when submit test on typeform and status is not completed', async () => {
    rawEducationData.finance[0].status = 'to_do';
    rawEducationData.finance[0].submodules[0].status = 'to_do';
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    component.getEducationDataOf('testAddress');
    component.getSubmoduleResult();
    component.redirect();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(
      'financial-education/error-test/category/finance/module/1/submodule/1/code/tc_finance_1_submodule_1'
    );
  });

  it('should navigate to success page when submit test on typeform and status is completed', async () => {
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    component.redirect();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(
      'financial-education/error-test/category/finance/module/1/submodule/1/code/tc_finance_1_submodule_1'
    );
  });
});
