import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FirstStepsPage } from './first-steps.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonSlides, NavController } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { Storage } from '@ionic/storage';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { BehaviorSubject } from 'rxjs';
class IonSlidesMock {
  public constructor() {}

  public getActiveIndex = () => Promise.resolve(0);
  public length = () => Promise.resolve(3);
  public slideNext = () => Promise.resolve();
  public slidePrev = () => Promise.resolve();
}

describe('FirstStepsPage', () => {
  let component: FirstStepsPage;
  let fixture: ComponentFixture<FirstStepsPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({}, {}, {});
      navControllerSpy = fakeNavController.createSpy();
      storageSpy = jasmine.createSpyObj('Storage', {
        set: Promise.resolve(),
      });

      walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', { 
        uri: new BehaviorSubject(null),
        checkDeeplinkUrl: Promise.resolve(null)
      });

      TestBed.configureTestingModule({
        declarations: [FirstStepsPage],
        imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: IonSlides, useClass: IonSlidesMock },
          { provide: NavController, useValue: navControllerSpy },
          { provide: Storage, useValue: storageSpy },
          { provide: WalletConnectService, useValue: walletConnectServiceSpy},
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstStepsPage);
    component = fixture.componentInstance;
    component.slide = TestBed.inject(IonSlides);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set actual step to one on init', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.actualStep).toEqual(1);
  });

  it('should set slider length to three on init', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    expect(component.sliderLength).toEqual(3);
  });

  it('should go to the next slide when slideNextEvent is received', () => {
    const spy = spyOn(component.slide, 'slideNext');
    fixture.debugElement.query(By.css('app-step')).triggerEventHandler('slideNextEvent', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should go to the previous slide when slideBackEvent is received', () => {
    const spy = spyOn(component.slide, 'slidePrev');
    fixture.debugElement.queryAll(By.css('app-step'))[1].triggerEventHandler('slideBackEvent', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should go to the menu when finishEvent is received and walletConnectService does not have defined an uri', () => {
    walletConnectServiceSpy.uri = new BehaviorSubject(null);
    fixture.detectChanges();

    fixture.debugElement.queryAll(By.css('app-step'))[2].triggerEventHandler('finishEvent', null);
    expect(storageSpy.set).toHaveBeenCalledOnceWith('FINISHED_ONBOARDING', true);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['tabs/home']);
  });

  it('should check walletConnectService checkDeeplinkUrl when finishEvent is received and walletConnectService does have defined an uri', () => {
    walletConnectServiceSpy.uri = new BehaviorSubject('wc://');
    fixture.detectChanges();

    fixture.debugElement.queryAll(By.css('app-step'))[2].triggerEventHandler('finishEvent', null);
    expect(storageSpy.set).toHaveBeenCalledOnceWith('FINISHED_ONBOARDING', true);
    expect(walletConnectServiceSpy.checkDeeplinkUrl).toHaveBeenCalled();
  });
});
