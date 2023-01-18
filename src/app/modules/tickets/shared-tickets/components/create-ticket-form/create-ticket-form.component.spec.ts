import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CreateTicketFormComponent } from './create-ticket-form.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ApiTicketsService } from '../../services/api-tickets.service';
import { of, throwError } from 'rxjs';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { AppVersionInjectable } from 'src/app/shared/models/app-version/injectable/app-version.injectable';
import { CapacitorDeviceInjectable } from 'src/app/shared/models/capacitor-device/injectable/capacitor-device.injectable';
import { CapacitorDevice } from 'src/app/shared/models/capacitor-device/capacitor-device.interface';
import { FakeCapacitorDevice } from 'src/app/shared/models/capacitor-device/fake/fake-capacitor-device';
import { AppVersion } from 'src/app/shared/models/app-version/app-version.interface';
import { FakeAppVersion } from 'src/app/shared/models/app-version/fake/fake-app-version';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';

describe('CreateTicketFormComponent', () => {
  let component: CreateTicketFormComponent;
  let fixture: ComponentFixture<CreateTicketFormComponent>;
  let apiTicketServiceSpy: jasmine.SpyObj<ApiTicketsService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  let fakeAppVersion: AppVersion;
  let capacitorAppVesionInjectableSpy: jasmine.SpyObj<AppVersionInjectable>;
  let fakeCapacitorDevice: CapacitorDevice;
  let capacitorDeviceInjectableSpy: jasmine.SpyObj<CapacitorDeviceInjectable>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;

  beforeEach(() => {
    apiTicketServiceSpy = jasmine.createSpyObj('ApiTicketService', {
      createTicket: of({}),
    });

    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(null),
    });

    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: false,
    });

    fakeAppVersion = new FakeAppVersion(Promise.resolve('3.0.0'));
    capacitorAppVesionInjectableSpy = jasmine.createSpyObj('CapacitorAppVesionInjectable', {
      create: fakeAppVersion,
    });

    fakeCapacitorDevice = new FakeCapacitorDevice(
      Promise.resolve({
        platform: 'web',
        osVersion: 'Windows NT 10.0; Win64; x64',
        operatingSystem: 'windows',
        manufacturer: 'Google Inc.',
        model: 'Windows NT 10.0',
        webViewVersion: '108.0.0.0',
      })
    );
    capacitorDeviceInjectableSpy = jasmine.createSpyObj('CapacitorDeviceInjectable', {
      create: fakeCapacitorDevice,
    });

    TestBed.configureTestingModule({
      declarations: [CreateTicketFormComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'tabs/home',
            component: DummyComponent,
          },
        ]),
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: ApiTicketsService, useValue: apiTicketServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
        { provide: CapacitorDeviceInjectable, useValue: capacitorDeviceInjectableSpy },
        { provide: AppVersionInjectable, useValue: capacitorAppVesionInjectableSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(CreateTicketFormComponent);

    component = fixture.componentInstance;
    component.userEmail = 'test@test.com';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user email on init', () => {
    component.ngOnInit();
    expect(component.form.value.email).toEqual('test@test.com');
  });

  it('should set category if category exist on init', () => {
    component.category = 'Otros';
    component.ngOnInit();
    expect(component.form.value.subject).toEqual({ name: 'Otros', value: 'tickets.categories.others' });
  });

  it('should emit parsed form data to parent when Submit button is clicked and the form is valid', async () => {
    const spy = spyOn(component.successTicketCreation, 'emit');
    component.form.patchValue({
      email: 'test@test.com',
      message: 'test message',
      subject: { name: 'Otros', value: 'tickets.categories.others' },
    });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement.click();
    await fixture.whenStable();
    expect(apiTicketServiceSpy.createTicket).toHaveBeenCalledOnceWith({
      email: 'test@test.com',
      subject: 'tickets.categories.others',
      category_code: 'Otros',
      message: 'test message',
      device_info:
        'platform:web, os_version:Windows NT 10.0; Win64; x64, operatingSystem:windows, manufacturer:Google Inc., model:Windows NT 10.0, webViewVersion:108.0.0.0, versionApp: PWA',
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should send app version on ticket when platform is native', async () => {
    platformServiceSpy.isNative.and.returnValue(true);
    component.form.patchValue({
      email: 'test@test.com',
      message: 'test message',
      subject: { name: 'Otros', value: 'tickets.categories.others' },
    });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement.click();
    await fixture.whenStable();
    expect(apiTicketServiceSpy.createTicket).toHaveBeenCalledOnceWith({
      email: 'test@test.com',
      subject: 'tickets.categories.others',
      category_code: 'Otros',
      message: 'test message',
      device_info:
        'platform:web, os_version:Windows NT 10.0; Win64; x64, operatingSystem:windows, manufacturer:Google Inc., model:Windows NT 10.0, webViewVersion:108.0.0.0, versionApp: 3.0.0',
    });
  });

  it('should emit parsed form error to parent when Submit button is clicked and the form is valid', async () => {
    apiTicketServiceSpy.createTicket.and.returnValue(throwError('Error'));
    const spy = spyOn(component.errorTicketCreation, 'emit');
    component.form.patchValue({
      email: 'test@test.com',
      message: 'test message',
      subject: { name: 'Otros', value: 'tickets.categories.others' },
    });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Submit"]')).nativeElement.click();
    await fixture.whenStable();
    expect(apiTicketServiceSpy.createTicket).toHaveBeenCalledOnceWith({
      email: 'test@test.com',
      subject: 'tickets.categories.others',
      category_code: 'Otros',
      message: 'test message',
      device_info:
        'platform:web, os_version:Windows NT 10.0; Win64; x64, operatingSystem:windows, manufacturer:Google Inc., model:Windows NT 10.0, webViewVersion:108.0.0.0, versionApp: PWA',
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show validation errors if the form is not valid', () => {
    component.form.patchValue({ message: '' });
    const submitEl = fixture.debugElement.query(By.css('ion-button[name="Submit"]'));
    expect(submitEl.attributes['ng-reflect-disabled']).toBe('true');
  });

  it('should open browser in app for privacy policies link', () => {
    const linksSpy = jasmine.createSpyObj('links', {}, { xcapitPrivacyPolicy: 'https://xcapit/privacy' });
    component.links = linksSpy;
    fixture.debugElement.query(By.css('ion-button[name="Privacy Policies"]')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://xcapit/privacy' });
  });

  it('should emit event on ion-back-button click', () => {
    const spy = spyOn(component.ionBackButton, 'emit');
    fixture.debugElement.query(By.css('ion-back-button')).nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
