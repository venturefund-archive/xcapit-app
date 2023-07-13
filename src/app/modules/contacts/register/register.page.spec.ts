import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { DefaultPlatformService } from 'src/app/shared/services/platform/default/default-platform.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ContactDataService } from '../shared-contacts/services/contact-data/contact-data.service';
import { RegisterPage } from './register.page';

describe('RegisterPage', () => {
  const contactForEdit = {
    address: '0xf8d564837ec51f9ba8ea25f8340003e832b91d52',
    name: 'TestEdit',
    networks: ['MATIC'],
    index: 0,
  };

  const contactForSave = {
    address: '0xf8d564837ec51f9ba8ea25f8340003e832b91d53',
    networks: ['MATIC'],
  };

  const editedContact = {
    networks: ['MATIC'],
    address: '0xf8d564837ec51f9ba8ea25f8340003e832b91d52',
    name: 'newName',
  };

  const contacts = [
    {
      address: '0xf8d564837ec51f9ba8ea25f8340003e832b91d52',
      name: 'TestEdit',
      networks: ['MATIC'],
    },
    {
      address: '0xf8d564837ec51f9ba8ea25f8340003e832b91d50',
      name: 'TestWallet',
      networks: ['ERC20'],
    },
  ];

  const validFormErc20Data = {
    networks: ['ERC20'],
    address: '0xf8d564837ec51f9ba8ea25f8340003e832b91d50',
    name: 'test_name',
  };

  const invalidFormErc20Data = {
    networks: ['ERC20'],
    address: 'HG8cyTD9HdiMiNBLxuM5qZBnESHVNLKocdN4B3npSb45',
    name: 'test_name',
  };
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let platformServiceSpy: jasmine.SpyObj<DefaultPlatformService>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let contactDataServiceSpy: jasmine.SpyObj<ContactDataService>;

  beforeEach(waitForAsync(() => {
    fakeActivatedRoute = new FakeActivatedRoute();
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    contactDataServiceSpy = jasmine.createSpyObj('ContactDataService', {
      getContact: contactForEdit,
    });
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showSuccessToastVerticalOffset: Promise.resolve(),
      showToast: Promise.resolve(),
    });
    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: true,
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    storageSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
      get: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: IonicStorageService, useValue: storageSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: DefaultPlatformService, useValue: platformServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ContactDataService, useValue: contactDataServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const network_selector = fixture.debugElement.query(By.css('app-network-selector'));
    const [addressInputEl, nameInputEl] = fixture.debugElement.queryAll(By.css('app-ux-input'));
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_address_confirm"]'));
    expect(network_selector).toBeTruthy();
    expect(addressInputEl).toBeTruthy();
    expect(nameInputEl).toBeTruthy();
    expect(buttonEl).toBeTruthy();
  });

  it('should open qr when QR button is clicked on input', () => {
    fixture.debugElement.query(By.css('app-ux-input[id="address-input"]')).triggerEventHandler('qrScannerOpened', null);
    fixture.detectChanges();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should save data on storage when form is valid ', async () => {
    storageSpy.get.and.resolveTo([]);
    component.form.patchValue(validFormErc20Data);
    await component.ionViewWillEnter();
    await Promise.all([fixture.whenRenderingDone(), fixture.whenStable()]);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_address_confirm"]')).nativeElement.click();
    await Promise.all([fixture.whenRenderingDone(), fixture.whenStable()]);
    fixture.detectChanges();
    expect(storageSpy.get).toHaveBeenCalledTimes(2);
    expect(storageSpy.set).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showSuccessToastVerticalOffset).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('contacts/home');
  });

  it('should set array when null storage ', async () => {
    storageSpy.get.and.resolveTo(null);
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(storageSpy.set).toHaveBeenCalledOnceWith('contact_list', []);
  });

  it('should dont set array when storage is not null', async () => {
    storageSpy.get.and.resolveTo([]);
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(storageSpy.set).not.toHaveBeenCalled();
  });

  it('should render address on qr code scanned success', fakeAsync(() => {
    fakeModalController.modifyReturns(
      {},
      {
        data: 'testAddress',
        role: 'success',
      }
    );
    fixture.debugElement.query(By.css('app-ux-input[id="address-input"]')).triggerEventHandler('qrScannerOpened', null);
    tick();
    fixture.detectChanges();
    expect(component.form.value.address).toBe('testAddress');
  }));

  it('should not render address and show toast on qr code scanned error', fakeAsync(() => {
    fakeModalController.modifyReturns({}, { data: 'errorData', role: 'error' });
    fixture.debugElement.query(By.css('app-ux-input[id="address-input"]')).triggerEventHandler('qrScannerOpened', null);
    tick();
    fixture.detectChanges();
    expect(component.form.value.address).toBe('');
    expect(toastServiceSpy.showToast).toHaveBeenCalledWith({ message: 'contacts.qr_scanner.scan_error' });
  }));

  it('should not render address and show toast on qr code scanned unauthorized', fakeAsync(() => {
    fakeModalController.modifyReturns({}, { data: 'unauthorizedData', role: 'unauthorized' });
    fixture.debugElement.query(By.css('app-ux-input[id="address-input"]')).triggerEventHandler('qrScannerOpened', null);
    tick();
    fixture.detectChanges();
    expect(component.form.value.address).toBe('');
    expect(toastServiceSpy.showToast).toHaveBeenCalledWith({ message: 'contacts.qr_scanner.scan_unauthorized' });
  }));

  it('should show success validator when address is EVM compatible and not repeated ', async () => {
    storageSpy.get.and.resolveTo([]);
    await component.ionViewWillEnter();
    component.form.patchValue(validFormErc20Data);
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();
    const validatorEl = fixture.debugElement.query(By.css('ion-label[color="successdark"]'));
    expect(validatorEl.nativeElement.innerHTML).toContain('contacts.register.text_valid');
  });

  it('should show error validator when address is EVM compatible but is repeated ', async () => {
    storageSpy.get.and.resolveTo(contacts);
    await component.ionViewWillEnter();
    component.form.patchValue(validFormErc20Data);
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();
    const validatorEl = fixture.debugElement.query(By.css('ion-label[color="dangerdark"]'));
    expect(validatorEl.nativeElement.innerHTML).toContain('contacts.register.repeated_address');
  });

  it('should show error validator when addres is not EVM compatible and not repeated', async () => {
    await component.ionViewWillEnter();
    component.form.patchValue(invalidFormErc20Data);
    fixture.detectChanges();
    const validatorEl = fixture.debugElement.query(By.css('ion-label[color="dangerdark"]'));
    expect(validatorEl.nativeElement.innerHTML).toContain('contacts.register.text_invalid');
  });

  it('should show error validator when have erc20 address and change network to solana', async () => {
    await component.ionViewWillEnter();
    component.form.patchValue(validFormErc20Data);
    fixture.detectChanges();
    component.form.patchValue({ networks: ['SOLANA'] });
    fixture.detectChanges();
    const validatorEl = fixture.debugElement.query(By.css('ion-label[color="dangerdark"]'));
    expect(validatorEl.nativeElement.innerHTML).toContain('contacts.register.text_invalid');
  });

  it('should set properly blockhain and address when mode is save', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      mode: 'save',
    });
    contactDataServiceSpy.getContact.and.returnValue(contactForSave);
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.form.value.address).toEqual('0xf8d564837ec51f9ba8ea25f8340003e832b91d53');
    expect(component.form.value.networks).toEqual(['MATIC']);
  });

  it('should set properly blockhain, address and name when mode is edit', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      mode: 'edit',
    });
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.form.value.address).toEqual('0xf8d564837ec51f9ba8ea25f8340003e832b91d52');
    expect(component.form.value.networks).toEqual(['MATIC']);
    expect(component.form.value.name).toEqual('TestEdit');
  });

  it('should edit contact name', async () => {
    fakeActivatedRoute.modifySnapshotParams({
      mode: 'edit',
    });
    storageSpy.get.and.resolveTo(contacts);
    await component.ionViewWillEnter();
    fixture.detectChanges();
    component.form.patchValue({ name: 'newName' });
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_address_confirm"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    expect(storageSpy.set).toHaveBeenCalledOnceWith('contact_list', [editedContact, contacts[1]]);
    expect(toastServiceSpy.showSuccessToastVerticalOffset).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('contacts/home');
  });
});
