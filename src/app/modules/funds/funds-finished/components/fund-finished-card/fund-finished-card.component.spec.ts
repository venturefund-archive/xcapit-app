import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FundFinishedCardComponent } from './fund-finished-card.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TranslateModule } from '@ngx-translate/core';
import { FundDataStorageService } from '../../../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { ApiApikeysService } from '../../../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import { ApiFundsService } from '../../../shared-funds/services/api-funds/api-funds.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';

describe('FundFinishedCardComponent', () => {
  let component: FundFinishedCardComponent;
  let fixture: ComponentFixture<FundFinishedCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundFinishedCardComponent>;
  let fundDataStorageServiceSpy: any;
  let apiApikeysServiceSpy: jasmine.SpyObj<ApiApikeysService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let apiFundsServiceSpy: jasmine.SpyObj<ApiFundsService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  beforeEach(
    waitForAsync(() => {
      toastServiceSpy = jasmine.createSpyObj('ToastService', { showToast: Promise.resolve() });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      apiApikeysServiceSpy = jasmine.createSpyObj('ApiApikeysService', {
        getByFundName: of({ pk: 1, nombre_bot: 'testFundName', alias: 'testAlias' }),
      });
      fundDataStorageServiceSpy = jasmine.createSpyObj('FundDataStorageService', {
        setData: Promise.resolve(),
      });
      apiFundsServiceSpy = jasmine.createSpyObj('ApiFundsService', {
        deleteFundRuns: of({}),
      });
      TestBed.configureTestingModule({
        declarations: [FundFinishedCardComponent, FakeTrackClickDirective],
        imports: [IonicModule, TranslateModule.forRoot()],
        providers: [
          { provide: FundDataStorageService, useValue: fundDataStorageServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ApiApikeysService, useValue: apiApikeysServiceSpy },
          { provide: ApiFundsService, useValue: apiFundsServiceSpy },
          { provide: ToastService, useValue: toastServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FundFinishedCardComponent);
      component = fixture.componentInstance;
      component.fund = { nombre_bot: 'testFundName', nivel_de_riesgo: 'Test' };
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dataStorageService.setData on click', async () => {
    await component.renewFund();
    fixture.detectChanges();
    expect(fundDataStorageServiceSpy.setData).toHaveBeenCalledTimes(3);
  });

  it('should call trackEvent on trackService when Renovate Fund button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Renovate Fund');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set data and navigate when Renovate Fund button clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Renovate Fund"]')).nativeElement.click();
    await fixture.whenStable();
    expect(apiApikeysServiceSpy.getByFundName).toHaveBeenCalledOnceWith('testFundName');
    expect(fundDataStorageServiceSpy.setData).toHaveBeenCalledTimes(3);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['funds/fund-investment']);
  });

  it('should call trackEvent on trackService when Delete Fund button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Delete Fund');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
