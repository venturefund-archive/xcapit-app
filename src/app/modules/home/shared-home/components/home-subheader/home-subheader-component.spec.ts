import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';
import { HomeSubheaderComponent } from './home-subheader.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

describe('HomeSubheaderComponent', () => {
  let component: HomeSubheaderComponent;
  let fixture: ComponentFixture<HomeSubheaderComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HomeSubheaderComponent>;
  let navControllerSpy: any;
  let modalControllerSpy: any;
  let windowSpy: any;

  beforeEach(
    waitForAsync(() => {
      windowSpy = spyOn(window, 'open');
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
      TestBed.configureTestingModule({
        declarations: [HomeSubheaderComponent, TrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [
          TrackClickDirective,
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeSubheaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to fiat-ramps operations when Go to Buy is clicked', () => {
    const button = fixture.debugElement.query(By.css("app-icon-button-card[name='Go to Buy']"));
    button.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/operations');
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
    expect(windowSpy).toHaveBeenCalledOnceWith('https://www.xcapit.com/#lista-espera', '_blank');
  });

  it('should call trackEvent on trackService when Go to Wallet Button clicked', () => {
    const button = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'Go to Wallet');
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
});
