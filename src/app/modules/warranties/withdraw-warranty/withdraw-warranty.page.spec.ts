import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { WarrantiesService } from '../shared-warranties/services/warranties.service';
import { WithdrawWarrantyPage } from './withdraw-warranty.page';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { SummaryWarrantyData } from '../send-warranty/interfaces/summary-warranty-data.interface';
import { WarrantyDataService } from '../shared-warranties/services/send-warranty-data/send-warranty-data.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { ActiveLenderInjectable } from 'src/app/shared/models/active-lender/injectable/active-lender.injectable';
import { FakeLender } from '../../../shared/models/lender/fake/fake-lender';

describe('WithdrawWarrantyPage', () => {
  let component: WithdrawWarrantyPage;
  let fixture: ComponentFixture<WithdrawWarrantyPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WithdrawWarrantyPage>;
  let warrantiesServiceSpy: jasmine.SpyObj<WarrantiesService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let warrantyDataServiceSpy: jasmine.SpyObj<WarrantyDataService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let activeLenderInjectableSpy: jasmine.SpyObj<ActiveLenderInjectable>;
  const aLenderName = 'naranjax';

  const validFormData = {
    dni: '12345678',
    email: 'test@test.com',
  };
  const invalidFormData = {
    dni: '333',
    email: 'test',
  };
  const summaryData: SummaryWarrantyData = {
    amount: 10,
    user_dni: 1234567,
    quoteAmount: 10,
    email: 'test@test.com',
    wallet: '0x00001',
  };

  beforeEach(waitForAsync(() => {
    warrantiesServiceSpy = jasmine.createSpyObj('WarrantiesService', {
      verifyWarranty: of({ amount: 20 }),
    });
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showErrorToast: Promise.resolve(),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    warrantyDataServiceSpy = jasmine.createSpyObj('WarrantyDataService', {}, { data: summaryData });
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletsAddresses: Promise.resolve('0x00001'),
    });
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve('12345678'),
    });

    activeLenderInjectableSpy = jasmine.createSpyObj('ActiveLenderInjectable', {
      create: { name: () => Promise.resolve(aLenderName), value: () => Promise.resolve(new FakeLender()) },
    });

    TestBed.configureTestingModule({
      declarations: [WithdrawWarrantyPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: WarrantiesService, useValue: warrantiesServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: WarrantyDataService, useValue: warrantyDataServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: ActiveLenderInjectable, useValue: activeLenderInjectableSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawWarrantyPage);
    component = fixture.componentInstance;
    component.ionViewWillEnter();
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable Continue button if form is valid', () => {
    component.form.patchValue(validFormData);
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_DNI"]'));

    expect(buttonEl.properties.disabled).toBeFalse();
  });

  it('should disable Continue button if form is invalid', () => {
    component.form.patchValue(invalidFormData);
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_DNI"]'));

    expect(buttonEl.properties.disabled).toBeTrue();
  });

  it('should get warranty balance on valid dni', async () => {
    component.form.patchValue(validFormData);
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_DNI"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(warrantiesServiceSpy.verifyWarranty).toHaveBeenCalledWith({
      user_dni: '12345678',
      wallet: '0x00001',
      lender: aLenderName,
    });
    expect(component.warrantyBalance.amount).toEqual(20);
  });

  it('should show error toast if valid dni has no balance', async () => {
    warrantiesServiceSpy.verifyWarranty.and.returnValue(of({ amount: 0, wallet: '0x00001' }));
    component.form.patchValue(validFormData);
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_DNI"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(warrantiesServiceSpy.verifyWarranty).toHaveBeenCalledWith({
      user_dni: '12345678',
      wallet: '0x00001',
      lender: aLenderName,
    });
    expect(component.warrantyBalance.amount).toEqual(0);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService ux_warranty_withdraw_DNI Button clicked', () => {
    spyOn(component, 'submitForm');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_warranty_withdraw_DNI');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should save data and navigate to withdraw warranty summary when ux_warranty_withdraw_DNI Button clicked and amount is non zero', async () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_DNI"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('warranties/withdraw-warranty-summary');
    expect(warrantyDataServiceSpy.data).toEqual(summaryData);
  });

  it('should autocomplete dni field when user has information on storage', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(ionicStorageServiceSpy.get).toHaveBeenCalledTimes(1);
    expect(component.form.value.dni).toEqual('12345678');
  });
});
