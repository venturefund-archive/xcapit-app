import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { Contact } from '../shared-contacts/interfaces/contact.interface';
import { ContactDataService } from '../shared-contacts/services/contact-data/contact-data.service';
import { structuredClone } from '../../../shared/utils/structured-clone';
import { ContactDetailPage } from './contact-detail.page';

describe('ContactDetailPage', () => {
  let component: ContactDetailPage;
  let fixture: ComponentFixture<ContactDetailPage>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let contactDataServiceSpy: jasmine.SpyObj<ContactDataService>;

  const contacts = [
    {
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      name: 'TestWallet',
      networks: ['ERC20', 'RSK'],
    },
    {
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeaaa',
      name: 'TestWallet2',
      networks: ['ERC20'],
    },
  ];

  const contact: Contact = {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeaaa',
    name: 'TestWallet2',
    networks: ['ERC20'],
    index: 1,
  };

  beforeEach(waitForAsync(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(structuredClone(contacts)),
      set: Promise.resolve(),
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    fakeActivatedRoute = new FakeActivatedRoute({});
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    fakeModalController = new FakeModalController(null, { role: 'confirm' });
    modalControllerSpy = fakeModalController.createSpy();

    contactDataServiceSpy = jasmine.createSpyObj('ContactDataService', {
      getContact: contact,
      updateContact: {},
    });

    TestBed.configureTestingModule({
      declarations: [ContactDetailPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ContactDataService, useValue: contactDataServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render contact', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const imgEl = fixture.debugElement.query(By.css('img.cd__content__wrapper__img'));
    const nameEl = fixture.debugElement.query(By.css('div.cd__content__title > ion-text'));
    const addressEl = fixture.debugElement.query(By.css('div.cd__content__address-wrapper__address > ion-text'));
    expect(imgEl.attributes.src).toContain('/assets/img/contacts/wallet.svg');
    expect(nameEl.nativeElement.innerHTML).toContain(contact.name);
    expect(addressEl.nativeElement.innerHTML).toContain(contact.address);
  });

  it('should navigate to edit and update contact when buton is clicked', async () => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(contacts));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.cd__content__wrapper__icons__edit')).nativeElement.click();
    fixture.detectChanges();
    expect(contactDataServiceSpy.updateContact).toHaveBeenCalledOnceWith({
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeaaa',
      name: 'TestWallet2',
      networks: ['ERC20'],
      index: 1,
    });
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/contacts/register/edit');
  });

  it('should delete contact and navigate to home if modal confirmed', async () => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(structuredClone(contacts)));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('div.cd__content__wrapper__icons__delete > ion-icon'));
    buttonEl.nativeElement.click();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith('contact_list', [contacts[0]]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/contacts/home');
  });
});
