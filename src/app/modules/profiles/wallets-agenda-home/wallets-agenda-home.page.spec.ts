import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { WalletsAgendaHomePage } from './wallets-agenda-home.page';

describe('WalletsAgendaHomePage', () => {
  let component: WalletsAgendaHomePage;
  let fixture: ComponentFixture<WalletsAgendaHomePage>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletsAgendaHomePage>;

  const contacts = [
    { 
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', 
      name: 'TestWallet', 
      networks: ['ERC20', 'RSK'] 
    },
  ];
  beforeEach(waitForAsync(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(contacts),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [WalletsAgendaHomePage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletsAgendaHomePage);
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
    const imgEl = fixture.debugElement.query(By.css('img.wa__empty-content__img'));
    const titleEl = fixture.debugElement.query(By.css('ion-text.wa__empty-content__text__title'));
    const subtitleEl = fixture.debugElement.query(By.css('ion-text.wa__empty-content__text__subtitle'));
    expect(imgEl.attributes.src).toContain('assets/img/agenda/empty.svg');
    expect(titleEl.nativeElement.innerHTML).toContain('contacts.home.empty.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('contacts.home.empty.subtitle');
  });

  it('should render contacts', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const imgEl = fixture.debugElement.query(By.css('img.wa__content__item__wrapper__img'));
    const nameEl = fixture.debugElement.query(By.css('div.wa__content__item__wrapper__data__title > ion-text'));
    expect(imgEl.attributes.src).toContain('assets/img/agenda/wallet.svg');
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
});
