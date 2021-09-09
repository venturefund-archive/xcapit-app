import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundStopLossPage } from './fund-stop-loss.page';
import { of, throwError } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { modalControllerMock } from '../../../../testing/spies/modal-controller-mock.spec';
import { StorageApikeysService } from '../../apikeys/shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

const formData = {
  valid: {
    stop_loss: 15,
  },
  invalid: {
    stop_loss: '',
  },
};

describe('FundStopLossPage', () => {
  let component: FundStopLossPage;
  let fixture: ComponentFixture<FundStopLossPage>;
  let fundDataStorageServiceMock: any;
  let fundDataStorageService: any;
  let apiFundsServiceSpy: any;
  let modalControllerSpy: any;
  let navControllerSpy: any;
  let fundDataStorageServiceSpy: any;
  let storageApikeysService: StorageApikeysService;
  let storageApikeysServiceMock: any;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController(Promise.resolve(), Promise.resolve());
      navControllerSpy = fakeNavController.createSpy();
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
      apiFundsServiceSpy = {
        crud: jasmine.createSpyObj('CRUD', ['create']),
        renewFund: () => of(),
      };
      storageApikeysServiceMock = {
        data: {},
      };
      fundDataStorageServiceMock = {
        getData: () => Promise.resolve({}),
        setData: () => Promise.resolve({}),
        getFund: () => Promise.resolve({}),
        clearAll: () => Promise.resolve({}),
      };

      TestBed.configureTestingModule({
        declarations: [FundStopLossPage, TrackClickDirective, DummyComponent],
        imports: [ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot(), IonicModule],
        providers: [
          { provide: FundDataStorageService, useValue: fundDataStorageServiceMock },
          { provide: ApiFundsService, useValue: apiFundsServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: StorageApikeysService, useValue: storageApikeysServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundStopLossPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fundDataStorageService = TestBed.inject(FundDataStorageService);
    fundDataStorageServiceSpy = spyOn(fundDataStorageService, 'getData');
    storageApikeysService = TestBed.inject(StorageApikeysService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not define stopLoss and profile when fundStopLoss and fundRiskLevel keys doesnt exists inside fundDataStorageService on ionViewWillEnter', async () => {
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve())
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false))
      .withArgs('fundRiskLevel')
      .and.returnValue(Promise.resolve());
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.stopLoss).toBeFalsy();
    expect(component.profile).toBeFalsy();
  });

  it('should define stopLoss and profile when fundStopLoss and fundRiskLevel keys exists inside fundDataStorageService on ionViewWillEnter', async () => {
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(formData.valid))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false))
      .withArgs('fundRiskLevel')
      .and.returnValue(Promise.resolve({ risk_level: 'volume_profile_strategies_USDT' }));
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.stopLoss).toEqual(15);
    expect(component.profile).toEqual('volume_profile_strategies_USDT');
  });

  it('should renew fund when fundRenew is true and form is valid', async () => {
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(formData.valid))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(true))
      .withArgs('fundRiskLevel')
      .and.returnValue(Promise.resolve({ risk_level: 'volume_profile_strategies_USDT' }));
    const spy = spyOn(apiFundsServiceSpy, 'renewFund').and.returnValue(of({}));

    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const selectStopLossComponent = fixture.debugElement.query(By.css('app-fund-select-stop-loss'));
    selectStopLossComponent.triggerEventHandler('save', formData.valid);
    await fixture.whenStable();

    expect(apiFundsServiceSpy.renewFund).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/funds/fund-success', true], {
      replaceUrl: true,
    });
  });

  it('should create fund and navigate to fund-success when fundRenew is false and form is valid', async () => {
    storageApikeysService.data = { id: 1, alias: '', nombre_bot: '' };
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(formData.valid))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false))
      .withArgs('fundRiskLevel')
      .and.returnValue(Promise.resolve({ risk_level: 'volume_profile_strategies_USDT' }));
    apiFundsServiceSpy.crud.create.and.returnValue(of({}));

    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const selectStopLossComponent = fixture.debugElement.query(By.css('app-fund-select-stop-loss'));
    selectStopLossComponent.triggerEventHandler('save', formData.valid);
    await fixture.whenStable();

    expect(apiFundsServiceSpy.crud.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/funds/fund-success', false], {
      replaceUrl: true,
    });
  });

  it('should navigate back to fund-name when create fund returns fund.create.fundNameExists error code', async () => {
    storageApikeysService.data = { id: 1, alias: '', nombre_bot: '' };
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(formData.valid))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false))
      .withArgs('fundRiskLevel')
      .and.returnValue(Promise.resolve({ risk_level: 'volume_profile_strategies_USDT' }));
    apiFundsServiceSpy.crud.create.and.returnValue(
      throwError({ error: { error_code: 'funds.create.fundNameExists' } })
    );

    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const selectStopLossComponent = fixture.debugElement.query(By.css('app-fund-select-stop-loss'));
    selectStopLossComponent.triggerEventHandler('save', formData.valid);
    await fixture.whenStable();

    expect(apiFundsServiceSpy.crud.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/funds/fund-name');
  });

  it('should not navigate back to fund-name when create fund returns an error code different than fundNameExists', async () => {
    storageApikeysService.data = { id: 1, alias: '', nombre_bot: '' };
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(formData.valid))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false))
      .withArgs('fundRiskLevel')
      .and.returnValue(Promise.resolve({ risk_level: 'volume_profile_strategies_USDT' }));
    apiFundsServiceSpy.crud.create.and.returnValue(throwError({ error: { error_code: 'another_code_error' } }));

    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const selectStopLossComponent = fixture.debugElement.query(By.css('app-fund-select-stop-loss'));
    selectStopLossComponent.triggerEventHandler('save', formData.valid);
    await fixture.whenStable();

    expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(0);
  });

  it('should render properly the header title', async () => {
    fundDataStorageServiceSpy
      .withArgs('fundStopLoss')
      .and.returnValue(Promise.resolve(formData.valid))
      .withArgs('fundRenew')
      .and.returnValue(Promise.resolve(false))
      .withArgs('fundRiskLevel')
      .and.returnValue(Promise.resolve({ risk_level: 'volume_profile_strategies_USDT' }));

    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();

    const headerTitle = fixture.debugElement.query(By.css('.ux_toolbar ion-title'));
    expect(headerTitle.nativeElement.innerText).toContain('funds.fund_stop_loss.header');
  });
});
