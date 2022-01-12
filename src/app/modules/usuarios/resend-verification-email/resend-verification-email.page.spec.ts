import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { Storage } from '@ionic/storage';
import { ResendVerificationEmailPage } from './resend-verification-email.page';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { By } from '@angular/platform-browser';

const extras = {
  extras: {
    state: {
      email: 'test@test.com',
    },
  },
};

describe('ResendVerificationEmailPage', () => {
  let component: ResendVerificationEmailPage;
  let fixture: ComponentFixture<ResendVerificationEmailPage>;
  let apiUsuariosServiceSpy: jasmine.SpyObj<ApiUsuariosService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ResendVerificationEmailPage>;
  let fakeActivatedRoute: FakeActivatedRoute;

  beforeEach(
    waitForAsync(() => {
      apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', ['sendEmailValidationByEmail']);
      apiUsuariosServiceSpy.sendEmailValidationByEmail.and.returnValue(of({}));
      fakeNavController = new FakeNavController({}, {}, {});
      navControllerSpy = fakeNavController.createSpy();
      storageSpy = jasmine.createSpyObj('Storage', {
        get: Promise.resolve(),
        set: Promise.resolve(),
        remove: Promise.resolve(),
      });
      fakeActivatedRoute = new FakeActivatedRoute({ email: 'test@test.com' });
      activatedRouteSpy = fakeActivatedRoute.createSpy();
      TestBed.configureTestingModule({
        declarations: [ResendVerificationEmailPage, FakeTrackClickDirective],
        imports: [HttpClientTestingModule, IonicModule, TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: Storage, useValue: storageSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
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
    expect(storageSpy.set).toHaveBeenCalledWith('email', 'test@test.com');
    expect(openTicketEl).toBeTruthy();
    expect(component.timerSeconds).toBeGreaterThan(55);
  });

  it('should get email from storage on init when email isnt provided and email is in storage', async () => {
    storageSpy.get.withArgs('email').and.returnValue(Promise.resolve('test@test.com'));
    fakeActivatedRoute.modifySnapshotParams({});
    component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(storageSpy.get).toHaveBeenCalledWith('email');
    expect(component.email).toEqual('test@test.com');
  });

  it('should clear storage and navigate back to login when emails was not provided nor exists in storage', async () => {
    storageSpy.get.withArgs('email').and.returnValue(Promise.resolve());
    fakeActivatedRoute.modifySnapshotParams({});
    component.ionViewWillEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(storageSpy.remove).toHaveBeenCalledWith('email');
    expect(component.email).toEqual(null);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['/users/login']);
  });

  it('should resend email and disable resend button at init when an email is provided', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const resendButtonEl = fixture.debugElement.query(By.css('ion-button[name="Resend Verification Email"]'));
    expect(resendButtonEl.attributes['ng-reflect-disabled']).toBe('true');
    expect(storageSpy.set).toHaveBeenCalledWith('email', 'test@test.com');
    expect(component.timerSeconds).toBeGreaterThan(55);
  });

  it('should clear storage and navigate to support ticket creation when Open Ticket button is clicked', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const openTicketEl = fixture.debugElement.query(By.css('ion-button[name="Open Ticket"]'));
    openTicketEl.nativeElement.click();
    expect(storageSpy.remove).toHaveBeenCalledWith('email');
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/create', 'test@test.com']);
  });

  it('should activate the resend button when send email fails', () => {
    apiUsuariosServiceSpy.sendEmailValidationByEmail.and.returnValue(throwError({}));
    component.ionViewWillEnter();
    fixture.detectChanges();
    const resendButtonEl = fixture.debugElement.query(By.css('ion-button[name="Resend Verification Email"]'));
    expect(resendButtonEl.attributes['ng-reflect-disabled']).toBe('false');
  });

  it('should activate the resend button when 60 seconds elapsed after the last resend', fakeAsync(() => {
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
