import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NewCreateSupportTicketPage } from './new-create-support-ticket.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavigationExtras } from '@angular/router';

const validFrom = {
  email: 'test@test.com',
  subject: { name: 'Mi cuenta/Registro', value: 'tickets.categories.my_account' },
  message: 'test message',
};

const navigationExtras: NavigationExtras = {
  queryParams: {
    email: 'test@test.com',
  },
  replaceUrl: true,
};

describe('NewCreateSupportTicketPage', () => {
  let component: NewCreateSupportTicketPage;
  let fixture: ComponentFixture<NewCreateSupportTicketPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [NewCreateSupportTicketPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NewCreateSupportTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to ticket creation success when Submit button is clicked and ticket is created and wallet exists', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('successTicketCreation', validFrom);
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(
      ['/tickets/new-success-wallet'],
      navigationExtras
    );
  });

  it('should navigate to ticket creation success when Submit button is clicked and ticket is created and wallet does not exist', async () => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(false));
    component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('successTicketCreation', validFrom);
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/new-success'], navigationExtras);
  });

  it('should navigate back to FAQs', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('ionBackButton');
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/support/options']);
  });
});
