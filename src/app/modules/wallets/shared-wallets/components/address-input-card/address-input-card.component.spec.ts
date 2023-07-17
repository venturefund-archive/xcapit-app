import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddressInputCardComponent } from './address-input-card.component';
import { By } from '@angular/platform-browser';
import { UntypedFormControl, UntypedFormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateModule } from '@ngx-translate/core';
import { UxInputUnderlinedComponent } from '../../../../../shared/components/ux-input-underlined/ux-input-underlined.component';
import { FakeModalController } from '../../../../../../testing/fakes/modal-controller.fake.spec';
import { DefaultPlatformService } from 'src/app/shared/services/platform/default/default-platform.service';
import { FormattedNetworkPipe } from 'src/app/shared/pipes/formatted-network-name/formatted-network.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeFeatureFlagDirective } from '../../../../../../testing/fakes/feature-flag-directive.fake.spec';
import { ContactDataService } from 'src/app/modules/contacts/shared-contacts/services/contact-data/contact-data.service';

describe('AddressInputCardComponent', () => {
  let component: AddressInputCardComponent;
  let fixture: ComponentFixture<AddressInputCardComponent>;
  let modalControllerSpy: any;
  let toastServiceMock: any;
  let toastService: ToastService;
  let controlContainerMock: UntypedFormGroup;
  let formGroupDirectiveMock: FormGroupDirective;
  let fakeModalController: FakeModalController;
  let platformServiceSpy: any;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let contactDataServiceSpy: jasmine.SpyObj<ContactDataService>;

  const contacts = [
    {
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      name: 'TestWallet',
      networks: ['ERC20', 'RSK'],
    },
  ];

  beforeEach(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(contacts),
    });
    contactDataServiceSpy = jasmine.createSpyObj('ContacDataServiceSpy', {
      getContact: contacts[0],
    });

    platformServiceSpy = jasmine.createSpyObj('PlatformService', ['isWeb']);
    platformServiceSpy.isWeb.and.returnValue(false);
    controlContainerMock = new UntypedFormGroup({
      address: new UntypedFormControl(''),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;
    toastServiceMock = {
      showToast: () => Promise.resolve(),
    };
    TestBed.configureTestingModule({
      declarations: [
        AddressInputCardComponent,
        UxInputUnderlinedComponent,
        FormattedNetworkPipe,
        FakeFeatureFlagDirective,
      ],
      imports: [IonicModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: ToastService, useValue: toastServiceMock },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        { provide: DefaultPlatformService, useValue: platformServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: ContactDataService, useValue: contactDataServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressInputCardComponent);
    component = fixture.componentInstance;
    component.title = 'Test title';
    component.helpText = 'Test help text';
    fixture.detectChanges();
    toastService = TestBed.inject(ToastService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render address on qr code scanned success', async () => {
    fakeModalController.modifyReturns(
      {},
      {
        data: 'testAddress',
        role: 'success',
      }
    );
    fixture.debugElement.query(By.css('app-ux-input')).triggerEventHandler('qrScannerOpened', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.address).toBe('testAddress');
  });

  it('should not render address and show toast on qr code scanned error', async () => {
    const spy = spyOn(toastService, 'showToast').and.callThrough();
    fakeModalController.modifyReturns({}, { data: 'errorData', role: 'error' });
    fixture.debugElement.query(By.css('app-ux-input')).triggerEventHandler('qrScannerOpened', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.address).toBe('');
    expect(spy).toHaveBeenCalledWith({ message: 'wallets.shared_wallets.address_input_card.scan_error' });
  });

  it('should not render address and show toast on qr code scanned unauthorized', fakeAsync(() => {
    const spy = spyOn(toastService, 'showToast').and.callThrough();
    fakeModalController.modifyReturns(
      {},
      {
        data: 'unauthorizedData',
        role: 'unauthorized',
      }
    );
    fixture.debugElement.query(By.css('app-ux-input')).triggerEventHandler('qrScannerOpened', null);
    tick();
    fixture.detectChanges();
    expect(component.form.value.address).toBe('');
    expect(spy).toHaveBeenCalledWith({ message: 'wallets.shared_wallets.address_input_card.scan_unauthorized' });
  }));

  it('should render contacts button disabled if there is not contacts on storage', () => {
    ionicStorageServiceSpy.get.and.returnValue(null);
    fixture.detectChanges();
    const contactsButtonEl = fixture.debugElement.query(By.css('ion-button[name="ux_go_to_address_list"]'));
    expect(contactsButtonEl.nativeElement.disabled).toBe(true);
  });

  it('should render contacts button enabled if there is contacts on storage and one or more matches with selected network', fakeAsync(() => {
    component.hasContacts = true;
    fixture.detectChanges();
    const contactsButtonEl = fixture.debugElement.query(By.css('ion-button[name="ux_go_to_address_list"]'));
    expect(contactsButtonEl.nativeElement.disabled).toBe(false);
  }));

  it('should emit event when ux_go_to_address_list button was clicked', () => {
    const spy = spyOn(component.addFromContacts, 'emit');
    const contactsButtonEl = fixture.debugElement.query(
      By.css('ion-button[name="ux_go_to_address_list"]')
    ).nativeElement;
    const customEvent = new CustomEvent('click', {});
    contactsButtonEl.dispatchEvent(customEvent);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render app-contact-item if address was imported from contacts', () => {
    component.form.patchValue({ address: contacts[0].address });
    component.addressFromContact = true;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();

    const contactEl = fixture.debugElement.query(By.css('app-contact-item'));
    expect(contactEl).toBeTruthy();
  });

  it('should remove wallet added from contacts', () => {
    component.form.patchValue({ address: contacts[0].address });
    component.addressFromContact = true;
    fixture.detectChanges();
    const removeContactButtonEl = fixture.debugElement.query(By.css('ion-button[name="ux_remove_contact"]'));
    removeContactButtonEl.nativeElement.click();
    expect(component.form.value.address).toEqual('');
    expect(component.addressFromContact).toEqual(false);
  });
});
