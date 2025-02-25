import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HideEmailPipe } from 'src/app/shared/pipes/hide-email/hide-email.pipe';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { rawOperationsData } from '../../fixtures/raw-operations-data';
import { rawProvidersData } from '../../fixtures/raw-providers-data';
import { ProvidersFactory } from '../../models/providers/factory/providers.factory';
import { Providers } from '../../models/providers/providers.interface';
import { KriptonStorageService } from '../../services/kripton-storage/kripton-storage.service';
import { OperationsListComponent } from './operations-list.component';

describe('OperationsListComponent', () => {
  let component: OperationsListComponent;
  let fixture: ComponentFixture<OperationsListComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let kriptonStorageServiceSpy: jasmine.SpyObj<KriptonStorageService>

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    providersSpy = jasmine.createSpyObj('Providers', {
      byAlias: rawProvidersData[1],
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    kriptonStorageServiceSpy = jasmine.createSpyObj('KriptonStorageService', {
      get: Promise.resolve('email@ejemplo'),
      removeCredentials: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [OperationsListComponent, HideEmailPipe],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageServiceSpy}
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsListComponent);
    component = fixture.componentInstance;
    component.operationsList = rawOperationsData;
    component.isLogged = true;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render operations list component if there is four operations', async () => {
    const change: SimpleChanges = { operationsList: new SimpleChange(null, rawOperationsData, true) };
    await component.ngOnChanges(change);
    fixture.detectChanges();
    const tableEl = fixture.debugElement.query(By.css('app-operations-list-accordion'));
    const textEl = fixture.debugElement.query(By.css('ion-text[name="No Operations"]'));
    expect(tableEl).toBeTruthy();
    expect(textEl).toBeFalsy();
    expect(component.firstOperations.length).toEqual(3);
    expect(component.remainingOperations.length).toEqual(1);
  });

  it('should render operations list component if there is one operation', async () => {
    const change: SimpleChanges = { operationsList: new SimpleChange(null, [rawOperationsData[1]], true) };
    await component.ngOnChanges(change);
    fixture.detectChanges();
    const tableEl = fixture.debugElement.query(By.css('app-operations-list-accordion'));
    expect(tableEl).toBeTruthy();
    expect(component.firstOperations.length).toEqual(1);
    expect(component.remainingOperations.length).toEqual(0);
  });

  it('should render message if no operations', async () => {
    component.operationsList = [];
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const tableEl = fixture.debugElement.query(By.css('app-operations-list-accordion'));
    const textEl = fixture.debugElement.query(By.css('ion-text[name="No Operations"]'));
    expect(textEl).toBeTruthy();
    expect(tableEl).toBeFalsy();
  });

  it('should render message with login link when user is not logged', async () => {
    component.isLogged = false;
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const message = fixture.debugElement.query(By.css('ion-text[name="Not Logged"]'));
    const link = fixture.debugElement.query(By.css('ion-text.link'));
    expect(message).toBeTruthy();
    expect(link).toBeTruthy();
  });

  it('should update operation List when input changes', async () => {
    component.operationsList = [];
    fixture.detectChanges();
    const change: SimpleChanges = { operationsList: new SimpleChange([], [{}, {}], true) };
    await component.ngOnChanges(change);
    expect(component.operationsList.length).toEqual(2);
  });

  it('should navigate to user-email when link is clicked', () => {
    component.isLogged = false;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-text.link')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/user-email');
  });

  it('should show informative modal of Kripton Market provider when information-circle clicked', async () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-icon[name="information-circle"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should log out of kripton account when modal if confirm', async ()=>{
    const spy = spyOn(component.loggedOut, 'emit');
    fakeModalController.modifyReturns(null, { role: 'confirm' });
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('div.logout-icon > ion-icon'));
    buttonEl.nativeElement.click();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(kriptonStorageServiceSpy.removeCredentials).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
