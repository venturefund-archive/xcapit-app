import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ContactsHomePage } from './contacts-home.page';

describe('ContactsHomePage', () => {
  let component: ContactsHomePage;
  let fixture: ComponentFixture<ContactsHomePage>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ContactsHomePage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  const contacts = [
    {
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      name: 'TestWallet',
      networks: ['ERC20', 'RSK'],
    },
  ];

  const route = {
    mode: 'select',
    blockchain: 'ERC20',
    token: '0x0000000000000000000000000000000000001010',
    amount: '1',
  };
  beforeEach(waitForAsync(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(contacts),
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    fakeActivatedRoute = new FakeActivatedRoute({});
    activatedRouteSpy = fakeActivatedRoute.createSpy();

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    TestBed.configureTestingModule({
      declarations: [ContactsHomePage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty state if not contacts', async () => {
    ionicStorageServiceSpy.get.and.returnValue(null);
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const imgEl = fixture.debugElement.query(By.css('img.ch__empty-content__img'));
    const titleEl = fixture.debugElement.query(By.css('ion-text.ch__empty-content__text__title'));
    const subtitleEl = fixture.debugElement.query(By.css('ion-text.ch__empty-content__text__subtitle'));
    expect(imgEl.attributes.src).toContain('/assets/img/contacts/empty.svg');
    expect(titleEl.nativeElement.innerHTML).toContain('contacts.home.empty.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('contacts.home.empty.subtitle');
  });

  it('should render contacts', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const imgEl = fixture.debugElement.query(By.css('img.ch__content__item__wrapper__img'));
    const nameEl = fixture.debugElement.query(By.css('div.ch__content__item__wrapper__data__title > ion-text'));
    expect(imgEl.attributes.src).toContain('/assets/img/contacts/wallet.svg');
    expect(nameEl.nativeElement.innerHTML).toContain(contacts[0].name);
  });

  it('should call trackEvent on trackService when ux_address_new button was clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_address_new');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to creation page on click ux_address_new button', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_address_new"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/contacts/register']);
  });

  it('should navigate back to send detail when contact was clicked and mode was select', async () => {
    fakeActivatedRoute.modifySnapshotParams(route);
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(contacts));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const contactEl = fixture.debugElement.query(By.css('div.ch__content__item'));
    contactEl.nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith([
      '/wallets/send/detail/blockchain',
      route.blockchain,
      'token',
      route.token,
      'address',
      contacts[0].address,
      'amount',
      route.amount,
    ]);
  });

  it('should track event when contact was clicked and mode was select', async () => {
    fakeActivatedRoute.modifySnapshotParams(route);
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(contacts));
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const contactEl = fixture.debugElement.query(By.css('div.ch__content__item'));
    contactEl.nativeElement.click();
    fixture.detectChanges();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
