import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { BuyConditionsPage } from './buy-conditions.page';

describe('BuyConditionsPage', () => {
  let component: BuyConditionsPage;
  let fixture: ComponentFixture<BuyConditionsPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<BuyConditionsPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let storageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    storageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
    });
    tokenOperationDataServiceSpy = jasmine.createSpyObj('TokenOperationDataService', {
      tokenOperationData: { asset: 'USDC', network: 'MATIC', country: 'ECU' },
    });
    TestBed.configureTestingModule({
      declarations: [BuyConditionsPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: IonicStorageService, useValue: storageServiceSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BuyConditionsPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when buy_conditions is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'buy_conditions');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to home of purchases and set storage when buy_conditions button is clicked', async () => {
    fixture.debugElement
      .query(By.css("ion-checkbox[name='checkbox-condition']"))
      .triggerEventHandler('ionChange', { detail: { checked: true }, target: { checked: true } });

    fixture.debugElement.query(By.css('ion-button[name="buy_conditions"]')).nativeElement.click();
    fixture.detectChanges();
    expect(storageServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/purchases']);
  });

  it('should navigate to tabs/wallets when Close Success button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Close Success"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('tabs/wallets');
  });

  it('should activated button when checkbox is checked', async () => {
    fixture.debugElement
      .query(By.css("ion-checkbox[name='checkbox-condition']"))
      .triggerEventHandler('ionChange', { detail: { checked: true }, target: { checked: true } });
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const buttonEl = fixture.debugElement.query(By.css("ion-button[name='buy_conditions']"));
    expect(buttonEl.attributes['ng-reflect-disabled']).toBe('false');
  });

  it('should disabled button when checkbox is not checked', () => {
    fixture.debugElement
      .query(By.css("ion-checkbox[name='checkbox-condition']"))
      .triggerEventHandler('ionChange', { detail: { checked: false }, target: { checked: false } });
    const buttonEl = fixture.debugElement.query(By.css("ion-button[name='buy_conditions']"));
    expect(buttonEl.attributes['ng-reflect-disabled']).toBe('true');
  });
});
