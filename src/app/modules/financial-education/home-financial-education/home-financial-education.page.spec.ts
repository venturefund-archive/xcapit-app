import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { HomeFinancialEducationPage } from './home-financial-education.page';
import { By } from '@angular/platform-browser';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { FinancialEducationService } from '../shared-financial-education/services/financial-education/financial-education.service';
import { rawEducationData } from '../shared-financial-education/fixtures/rawEducationData';
import { of } from 'rxjs';

describe('HomeFinancialEducationPage', () => {
  let component: HomeFinancialEducationPage;
  let fixture: ComponentFixture<HomeFinancialEducationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomeFinancialEducationPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let financialEducationServiceSpy: jasmine.SpyObj<FinancialEducationService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      financialEducationServiceSpy = jasmine.createSpyObj('FinancialEducationService', {
        getEducationDataOf: of(rawEducationData),
      });
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getWalletFromStorage: Promise.resolve({
          addresses: { ERC20: 'testAddress', MATIC: 'testAddressMatic', RSK: 'testAddressRsk' },
        }),
      });
      TestBed.configureTestingModule({
        declarations: [HomeFinancialEducationPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: FinancialEducationService, useValue: financialEducationServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeFinancialEducationPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialized in the finance tab with the corresponding data', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(component.segmentsForm.value.tab).toEqual('finance');
    expect(component.modules).toEqual(rawEducationData.finance);
  });

  it('should set the corresponding data in the crypto tab when tab crypto is clicked', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.segmentsForm.patchValue({ tab: 'crypto' });
    fixture.detectChanges();
    expect(component.segmentsForm.value.tab).toEqual('crypto');
    expect(component.modules).toEqual(rawEducationData.crypto);
  });

  it('should set the corresponding data in the finance tab when tab finance is clicked', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    component.segmentsForm.patchValue({ tab: 'crypto' });
    fixture.detectChanges();
    component.segmentsForm.patchValue({ tab: 'finance' });
    fixture.detectChanges();
    expect(component.segmentsForm.value.tab).toEqual('finance');
    expect(component.modules).toEqual(rawEducationData.finance);
  });


  it('should render app-modules-education component', () => {
    component.ionViewWillEnter();
    const componentEl = fixture.debugElement.queryAll(By.css('app-modules-education'));
    fixture.detectChanges();
    expect(componentEl).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when Tokens Tab was clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-segment-button', 'ux_tab_finance');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call appTrackEvent on trackService when NFTs Tab was clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-segment-button', 'ux_tab_crypto');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render app-rule-card component properly', () => {
    const ruleEl = fixture.debugElement.query(By.css('app-rule-card'));
    expect(ruleEl).toBeTruthy();
  });

  it('should render app-global-progress-card component properly', async () => {
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    const progressEl = fixture.debugElement.query(By.css('app-global-progress-card'));
    expect(progressEl).toBeTruthy();
  });

  it('should set open value on a module that isnt completed', async () => {
    rawEducationData.finance[0].status = 'to_do';
    fixture.detectChanges();
    component.ionViewWillEnter();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    fixture.detectChanges();
    expect(rawEducationData.finance[0]['open']).toEqual(true);
  });
});
