import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { MODULES_FINANCE } from '../shared-financial-education/constants/finance';
import { TestTypeformPage } from './test-typeform.page';

describe('TestTypeformPage', () => {
  let component: TestTypeformPage;
  let fixture: ComponentFixture<TestTypeformPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<TestTypeformPage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(
    waitForAsync(() => {
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getWalletFromStorage: Promise.resolve({
          addresses: { ERC20: 'testAddress', MATIC: 'testAddressMatic', RSK: 'testAddressRsk' },
        }),
      });
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['get']);
      fakeActivatedRoute = new FakeActivatedRoute({
        tab: 'finance',
        module: 'finance_1',
        submodule: 'finance_sub_1',
        code: 'dVKXJqBs',
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
          {provide: StorageService, useValue: storageServiceSpy}
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
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.data).toEqual(MODULES_FINANCE);
    expect(component.module).toEqual(MODULES_FINANCE[0]);
    expect(component.subModule).toEqual(MODULES_FINANCE[0].sub_modules[0]);
    expect(component.code).toEqual('dVKXJqBs');
    expect(component.wallet_address).toEqual('testAddress');
  });

  it('should set correct header according to learning_code', async () => {
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    component.redirectToPage();
    expect(component.headerText).toEqual('financial_education.typeform_header.finance_sub_1');
  });

  it('should set correct header according to test_code', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      tab: 'finance',
      module: 'finance_1',
      submodule: 'finance_sub_1',
      code: 'GGLKURh6',
    });
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    component.redirectToPage();
    fixture.detectChanges();
    expect(component.headerText).toEqual(
      'financial_education.typeform_header.text financial_education.typeform_header.finance_sub_1'
    );
  });

  it('should navigate to information page when submit test on typeform', async () => {
    await component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    component.redirectToPage();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      'financial-education/information/tab',
      'finance',
      'module',
      'finance_1',
      'submodule',
      'finance_sub_1',
    ]);
  });
});
