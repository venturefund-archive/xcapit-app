import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { CreateEmailValidationTicketPage } from './create-email-validation-ticket.page';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

describe('CreateEmailValidationTicketPage', () => {
  let component: CreateEmailValidationTicketPage;
  let fixture: ComponentFixture<CreateEmailValidationTicketPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CreateEmailValidationTicketPage>;
  let activatedRouteMock: any;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['params']);
      activatedRouteMock.snapshot = { paramMap: convertToParamMap({ email: 'test@test.com' }) };
      fakeNavController = new FakeNavController({}, {});
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [DummyComponent, CreateEmailValidationTicketPage, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [HttpClientTestingModule, TranslateModule.forRoot(), ReactiveFormsModule, IonicModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CreateEmailValidationTicketPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to ticket creation success when Submit button is clicked and ticket is created', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('success');
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/success', true]);
  });

  it('should not navigate to ticket creation success when Submit button is clicked and ticket fails to create', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-create-ticket-form')).triggerEventHandler('send');
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });

  it('should fill form with user email if redirected from resend verification email and cant be modified', () => {
    component.ionViewWillEnter();
    expect(component.userEmail).toEqual('test@test.com');
    expect(component.canModifyEmail).toBeFalse();
  });

  it('should be able to modify user email if no user email was available on onit', async () => {
    activatedRouteMock.snapshot = {
      paramMap: convertToParamMap({}),
    };
    component.ionViewWillEnter();
    expect(component.canModifyEmail).toBeTrue();
  });
});
