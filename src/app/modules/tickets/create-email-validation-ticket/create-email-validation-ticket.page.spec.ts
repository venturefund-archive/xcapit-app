import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { CreateEmailValidationTicketPage } from './create-email-validation-ticket.page';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NavigationExtras, Router } from '@angular/router';
import { FakeRouter } from 'src/testing/fakes/router.fake.spec';

const params: NavigationExtras = {
  state: { email: 'test@test.com' },
};

describe('CreateEmailValidationTicketPage', () => {
  let component: CreateEmailValidationTicketPage;
  let fixture: ComponentFixture<CreateEmailValidationTicketPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CreateEmailValidationTicketPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let routerSpy: jasmine.SpyObj<Router>;
  let fakeRouter: FakeRouter;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController({}, {});
    navControllerSpy = fakeNavController.createSpy();
    fakeRouter = new FakeRouter(params);
    routerSpy = fakeRouter.createSpy();
    TestBed.configureTestingModule({
      declarations: [DummyComponent, CreateEmailValidationTicketPage, FakeTrackClickDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), ReactiveFormsModule, IonicModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEmailValidationTicketPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to ticket creation success when Submit button is clicked and ticket is created', () => {
    component.ngOnInit();
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('successTicketCreation');
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/success', true]);
  });

  it('should not navigate to ticket creation success when Submit button is clicked and ticket fails to create', () => {
    component.ngOnInit();
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('errorTicketCreation');
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });

  it('should fill form with user email if redirected from resend verification email and cant be modified', () => {
    component.ngOnInit();
    component.ionViewWillEnter();
    expect(component.userEmail).toEqual('test@test.com');
    expect(component.canModifyEmail).toBeFalse();
  });

  it('should be able to modify user email if no user email was available on onit', async () => {
    fakeRouter.modifyReturns(null);
    component.ngOnInit();
    component.ionViewWillEnter();
    expect(component.canModifyEmail).toBeTrue();
  });

  it('should navigate back to login', () => {
    component.ngOnInit();
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('ionBackButton');
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/users/login-new']);
  });
});
