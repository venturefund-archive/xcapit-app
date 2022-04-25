import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { OperationsListItemComponent } from '../operations-list-item/operations-list-item.component';
import { FiatRampOperation } from '../../models/fiat-ramp-operation';
import { OperationsListAccordionComponent } from './operations-list-accordion.component';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { OperationStatus } from '../../interfaces/operation-status.interface';
import { TEST_ERC20_COINS } from 'src/app/modules/wallets/shared-wallets/constants/coins.test';
import { OperationStatusChipComponent } from '../operation-status-chip/operation-status-chip.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
  colorCssClass: 'success',
};

const firstOperations: FiatRampOperation[] = [
  {
    _anId: 1,
    _anAmount: 12,
    _aCoin: TEST_ERC20_COINS[0],
    _anOperationStatus: operationStatus,
    _aProvider: provider,
    _aCreationDate: new Date(),
  },
  {
    _anId: 2,
    _anAmount: 23,
    _aCoin: TEST_ERC20_COINS[1],
    _anOperationStatus: operationStatus,
    _aProvider: provider,
    _aCreationDate: new Date(),
  },
];

const remainingOperations: FiatRampOperation[] = [
  {
    _anId: 3,
    _anAmount: 32,
    _aCoin: TEST_ERC20_COINS[0],
    _anOperationStatus: operationStatus,
    _aProvider: provider,
    _aCreationDate: new Date(),
  },
];

describe('OperationsListAccordionComponent', () => {
  let component: OperationsListAccordionComponent;
  let fixture: ComponentFixture<OperationsListAccordionComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<OperationsListAccordionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OperationsListAccordionComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(OperationsListAccordionComponent);
      component = fixture.componentInstance;
      component.firstOperations = firstOperations;
      component.remainingOperations = remainingOperations;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start accordion closed', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.accordionGroup.value).toBeUndefined();
  });

  it('should open accordion and set text after one click', () => {
    component.ngOnInit();
    const buttonEl = fixture.debugElement.query(By.css('ion-button')).nativeElement;
    buttonEl.click();
    fixture.detectChanges();
    expect(component.accordionGroup.value).toEqual('operations');
  });

  it('should close accordion and set text after two clicks', () => {
    component.ngOnInit();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Toggle Accordion"]')).nativeElement;
    buttonEl.click();
    buttonEl.click();
    fixture.detectChanges();
    expect(component.accordionGroup.value).toBeUndefined();
  });

  it('should call trackEvent on trackService when Toggle Accordion is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Toggle Accordion');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should render operations', () => {
    component.ngOnInit();
    const els = fixture.debugElement.queryAll(By.css('app-operations-list-item'));
    expect(els.length).toEqual(3);
  });

  it('should not show toggle accordion button if there are no operations hidden', () => {
    component.ngOnInit();
    component.remainingOperations = [];
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="Toggle Accordion"]'));
    expect(buttonEl).toBeNull();
  });
});
