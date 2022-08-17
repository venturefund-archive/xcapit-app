import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NewCreateSupportTicketPage } from './new-create-support-ticket.page';

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
      declarations: [ NewCreateSupportTicketPage ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(),],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewCreateSupportTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to ticket creation success when Submit button is clicked and ticket is created and wallet exists', async() => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('success');
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/new-success-wallet'], {replaceUrl: true});
  });

  it('should navigate to ticket creation success when Submit button is clicked and ticket is created and wallet does not exist', async() => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(false));
    component.ionViewWillEnter();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('success');
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/new-success'], {replaceUrl: true});
  });
});
