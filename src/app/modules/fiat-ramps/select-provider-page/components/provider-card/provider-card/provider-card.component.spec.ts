import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { ProviderCardComponent } from './provider-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

const providerTest = {
  id: 2,
  alias: 'kripton',
  name: 'Kripton Market',
  logoRoute: 'assets/img/provider-logos/KriptonMarket.svg',
  description: 'fiat_ramps.select_provider.krypton_description',
  newOperationRoute: '/fiat-ramps/new-operation/kripton',
  countries: ['Argentina', 'Venezuela', 'Uruguay', 'Peru', 'Colombia'],
  trackClickEventName: 'ux_buy_moonpay',
};

describe('ProviderCardComponent', () => {
  let component: ProviderCardComponent;
  let fixture: ComponentFixture<ProviderCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ProviderCardComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [ProviderCardComponent, FakeTrackClickDirective],
        imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCardComponent);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component = fixture.componentInstance;
    component.provider = providerTest;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const imgEl = fixture.debugElement.query(By.css('div.pcc__content__image'));
    const nameEl = fixture.debugElement.query(By.css('ion-text.name'));
    const descriptionEl = fixture.debugElement.query(By.css('ion-text.description'));
    expect(imgEl.nativeElement.innerHTML).toBeTruthy();
    expect(nameEl.nativeElement.innerHTML).toContain(providerTest.name);
    expect(descriptionEl.nativeElement.innerHTML).toContain(providerTest.description);
  });

  it('should emit event when radio button is checked', () => {
    component.disabled = true;
    const spy = spyOn(component.selectedProvider, 'emit');
    fixture.debugElement.query(By.css('ion-radio')).nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when ux_buy_moonpay Radio clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-radio', 'ux_buy_moonpay');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when informative_modal clicked', () => {
    component.provider.showInfo = true;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'informative_modal');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show informative modal of Moonpay provider when information_modal clicked', async () => {
    component.provider.showInfo = true;
    component.provider.name = 'Moonpay';
    component.provider.providerName = 'moonpay';
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="informative_modal"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should show informative modal of Kripton Market provider when information_modal clicked', async () => {
    component.provider.showInfo = true;
    component.provider.name = 'Kripton Market';
    component.provider.providerName = 'kripton';
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="informative_modal"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not show informative modal of Moonpay provider when information_modal clicked', async () => {
    component.provider.showInfo = true;
    component.provider.name = 'Moonpay';
    component.provider.providerName = 'moonpay';
    component.isInfoModalOpen = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="informative_modal"]')).nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });
});
