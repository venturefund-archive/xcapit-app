import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { HomeSubheaderComponent } from './home-subheader.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { ApiApikeysService } from 'src/app/modules/apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('HomeSubheaderComponent', () => {
  let component: HomeSubheaderComponent;
  let fixture: ComponentFixture<HomeSubheaderComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomeSubheaderComponent>;
  let navControllerSpy: any;
  let modalControllerSpy: any;
  let fakeNavController: FakeNavController;
  let apiApiKeysServiceSpy;
  let fakeModalController: FakeModalController;
  let windowSpy: any;

  beforeEach(
    waitForAsync(() => {
      windowSpy = spyOn(window, 'open');
      apiApiKeysServiceSpy = jasmine.createSpyObj('ApiApikeysService', ['getAll']);
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [HomeSubheaderComponent, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: ApiApikeysService, useValue: apiApiKeysServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeSubheaderComponent);
      component = fixture.componentInstance;
      apiApiKeysServiceSpy.getAll.and.returnValue(of([{ id: 799, alias: 'testKeys', nombre_bot: '' }]));
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to fiat-ramps operations when Go to Buy is clicked', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("app-icon-button-card[name='Go to Buy']"));
    button.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/moonpay');
  });

  it('should call trackEvent on trackService when Go to Buy Button clicked', () => {
    const button = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Buy');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open in app browser when Go to Wallet is clicked', async () => {
    const button = fixture.debugElement.query(By.css("app-icon-button-card[name='Go to Wallet']"));
    button.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tabs/wallets');
  });

  it('should call trackEvent on trackService when Go to Wallet Button clicked', () => {
    const button = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Wallet');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to tabs/investments operations when Go to Investments is clicked', () => {
    const button = fixture.debugElement.query(By.css("app-icon-button-card[name='Go to Investments']"));
    button.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tabs/investments');
  });

  it('should call trackEvent on trackService when Go to Investments Button clicked', () => {
    const button = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Investments');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call ModalController create when Go to Objectives button is clicked', async () => {
    const IWantMyWalletButton = fixture.debugElement.query(By.css("app-icon-button-card[name='Go to Objectives']"));
    IWantMyWalletButton.nativeElement.click();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go to Objectives Button clicked', () => {
    const button = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Objectives');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open modal when Go to Buy is clicked and there are no apikeys', async () => {
    apiApiKeysServiceSpy.getAll.and.returnValue(of([]));
    component.ngOnInit();

    fixture.debugElement.query(By.css("app-icon-button-card[name='Go to Buy']")).nativeElement.click();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });
});
