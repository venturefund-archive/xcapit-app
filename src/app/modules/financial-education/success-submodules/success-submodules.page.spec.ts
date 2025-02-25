import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from '../../../shared/services/track/track.service';
import { SUCCESS_TYPES } from '../../../shared/components/success-content/success-types.constant';
import { SuccessSubmodulesPage } from './success-submodules.page';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FinancialEducationService } from '../shared-financial-education/services/financial-education/financial-education.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { rawEducationData } from '../shared-financial-education/fixtures/rawEducationData';
import { of } from 'rxjs';

describe('SuccessSubmodulesPage', () => {
  let component: SuccessSubmodulesPage;
  let fixture: ComponentFixture<SuccessSubmodulesPage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let financialEducationServiceSpy: jasmine.SpyObj<FinancialEducationService>;
  beforeEach(
    waitForAsync(() => {
      trackServiceSpy = jasmine.createSpyObj('TrackService', {
        trackEvent: Promise.resolve(true),
      });

      fakeActivatedRoute = new FakeActivatedRoute({});
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        getWalletFromStorage: Promise.resolve({
          addresses: { ERC20: 'testAddress', MATIC: 'testAddressMatic', RSK: 'testAddressRsk' },
        }),
      });
      financialEducationServiceSpy = jasmine.createSpyObj('FinancialEducationService', {
        getEducationDataOf: of(rawEducationData),
      });
      TestBed.configureTestingModule({
        declarations: [SuccessSubmodulesPage],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: FinancialEducationService, useValue: financialEducationServiceSpy },
        ],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessSubmodulesPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set finance data on init', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      category: 'finance',
      module: 1,
      submodule: 1,
    });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(component.success_data).toEqual(SUCCESS_TYPES.success_submodules);
    expect(component.success_data.textPrimary).toEqual('financial_education.success_submodule.textPrimary');
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'dtc_finance_1_submodule_1',
    });
  });

  it('should set crypto data on init', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      category: 'crypto',
      module: 4,
      submodule: 3,
    });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(component.success_data).toEqual(SUCCESS_TYPES.success_submodules);
    expect(component.success_data.textPrimary).toEqual('financial_education.success_submodule.textPrimary');
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'dtc_crypto_1_submodule_1',
    });
  });
});
