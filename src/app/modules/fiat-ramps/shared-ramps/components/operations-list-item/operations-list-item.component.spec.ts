import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TEST_ERC20_COINS } from 'src/app/modules/wallets/shared-wallets/constants/coins.test';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { OperationStatus } from '../../interfaces/operation-status.interface';
import { FiatRampOperation } from '../../models/fiat-ramp-operation';
import { OperationStatusChipComponent } from '../operation-status-chip/operation-status-chip.component';
import { OperationsListItemComponent } from './operations-list-item.component';

const provider: FiatRampProvider = {
  id: 1,
  alias: 'kripton',
  name: 'KriptonMarket',
  logoRoute: '../../assets/img/provider-logos/KriptonMarket.svg',
  newOperationRoute: '/fiat-ramps/new-operation',
};

const operationStatus: OperationStatus = {
  provider: provider,
  name: 'complete',
  textToShow: 'deposited',
  colorCssClass: 'success'
};

const operation: FiatRampOperation = {
    _anId: 53,
    _anAmount: 12,
    _aCoin: TEST_ERC20_COINS[0],
    _anOperationStatus: operationStatus,
    _aProvider: provider,
    _aCreationDate: new Date()
}

describe('OperationsListItemComponent', () => {
  let component: OperationsListItemComponent;
  let fixture: ComponentFixture<OperationsListItemComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<OperationsListItemComponent>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    TestBed.configureTestingModule({
      declarations: [ OperationsListItemComponent, FakeTrackClickDirective ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationsListItemComponent);
    component = fixture.componentInstance;
    component.operation = operation;
    component.isLast = false;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show item lines if is the last item', async () => {
    component.isLast = true;
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const el = fixture.debugElement.query(By.css('ion-item[name="Operation Item"')).nativeElement;
    expect(el.attributes['ng-reflect-lines'].value).toEqual('none');
  });

  it('should not show item lines if is not the last item', async () => {
    component.isLast = false;
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const el = fixture.debugElement.query(By.css('ion-item[name="Operation Item"')).nativeElement;
    expect(el.attributes['ng-reflect-lines']).toBeUndefined();
  });

  
  it('should call trackEvent on trackService when Operation Item clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-item', 'Operation Item');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to detail when Operation Item clicked', () => {
    fixture.debugElement.query(By.css('ion-item[name="Operation Item"')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/fiat-ramps/operation-detail/provider/1/operation/53']);
  });
});
