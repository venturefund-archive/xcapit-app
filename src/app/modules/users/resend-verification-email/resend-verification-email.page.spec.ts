import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NavigationExtras, Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ApiUsuariosService } from '../shared-users/services/api-usuarios/api-usuarios.service';
import { Storage } from '@ionic/storage-angular';
import { ResendVerificationEmailPage } from './resend-verification-email.page';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { FakeRouter } from 'src/testing/fakes/router.fake.spec';

const params: NavigationExtras = {
  state: { email: 'test@test.com' }
};

describe('ResendVerificationEmailPage', () => {
  let component: ResendVerificationEmailPage;
  let fixture: ComponentFixture<ResendVerificationEmailPage>;
  let apiUsuariosServiceSpy: jasmine.SpyObj<ApiUsuariosService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ResendVerificationEmailPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let fakeRouter: FakeRouter;

  beforeEach(
    waitForAsync(() => {
      apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', ['sendEmailValidationByEmail']);
      apiUsuariosServiceSpy.sendEmailValidationByEmail.and.returnValue(of({}));
      fakeNavController = new FakeNavController({}, {}, {});
      navControllerSpy = fakeNavController.createSpy();
      storageSpy = jasmine.createSpyObj('Storage', {
        get: Promise.resolve(params.state.email),
        set: Promise.resolve(),
        remove: Promise.resolve(),
      });
      fakeRouter = new FakeRouter(params);
      routerSpy = fakeRouter.createSpy();
      TestBed.configureTestingModule({
        declarations: [ResendVerificationEmailPage, FakeTrackClickDirective],
        imports: [HttpClientTestingModule, IonicModule, TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: Storage, useValue: storageSpy },
          { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
          { provide: Router, useValue: routerSpy },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(ResendVerificationEmailPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resend email and disable resend button at init when an email is provided', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const resendButtonEl = fixture.debugElement.query(By.css('ion-button[name="Resend Verification Email"]'));
    const openTicketEl = fixture.debugElement.query(By.css('ion-button[name="Open Ticket"]'));
    expect(resendButtonEl.attributes['ng-reflect-disabled']).toBe('true');
    expect(storageSpy.set).toHaveBeenCalledWith('email', params.state.email);
    expect(openTicketEl).toBeTruthy();
    expect(component.timerSeconds).toBeGreaterThan(55);
  });

  it('should get email from storage on init when email isnt provided and email is in storage', async () => {
    fakeRouter.modifyReturns(null);
    component.ngOnInit();
    component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(storageSpy.get).toHaveBeenCalledWith('email');
    expect(component.email).toEqual(params.state.email);
  });

  it('should clear storage and navigate back to login when emails was not provided nor exists in storage', async () => {
    fakeRouter.modifyReturns(null);
    storageSpy.get.and.returnValue(Promise.resolve());
    component.ngOnInit();
    component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(storageSpy.remove).toHaveBeenCalledWith('email');
    expect(component.email).toEqual(undefined);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/users/login']);
  });

  it('should resend email and disable resend button at init when an email is provided', () => {
    component.ngOnInit();
    component.ionViewWillEnter();
    fixture.detectChanges();
    const resendButtonEl = fixture.debugElement.query(By.css('ion-button[name="Resend Verification Email"]'));
    expect(resendButtonEl.attributes['ng-reflect-disabled']).toBe('true');
    expect(storageSpy.set).toHaveBeenCalledWith('email', 'test@test.com');
    expect(component.timerSeconds).toBeGreaterThan(55);
  });

  it('should clear storage and navigate to support ticket creation when Open Ticket button is clicked', () => {
    component.ngOnInit();
    component.ionViewWillEnter();
    fixture.detectChanges();
    const openTicketEl = fixture.debugElement.query(By.css('ion-button[name="Open Ticket"]'));
    openTicketEl.nativeElement.click();
    expect(storageSpy.remove).toHaveBeenCalledWith('email');
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/create'], params);
  });

  it('should activate the resend button when send email fails', () => {
    apiUsuariosServiceSpy.sendEmailValidationByEmail.and.returnValue(throwError({}));
    component.ngOnInit();
    component.ionViewWillEnter();
    fixture.detectChanges();
    const resendButtonEl = fixture.debugElement.query(By.css('ion-button[name="Resend Verification Email"]'));
    expect(resendButtonEl.attributes['ng-reflect-disabled']).toBe('false');
  });

  it('should activate the resend button when 60 seconds elapsed after the last resend', fakeAsync(() => {
    component.ngOnInit();
    component.ionViewWillEnter();
    fixture.detectChanges();
    const resendButtonEl = fixture.debugElement.query(By.css('ion-button[name="Resend Verification Email"]'));
    expect(resendButtonEl.attributes['ng-reflect-disabled']).toBe('true');
    expect(component.timerSeconds).toBeGreaterThan(55);
    tick(60000);
    fixture.detectChanges();
    expect(resendButtonEl.attributes['ng-reflect-disabled']).toBe('false');
    flush();
  }));
});
