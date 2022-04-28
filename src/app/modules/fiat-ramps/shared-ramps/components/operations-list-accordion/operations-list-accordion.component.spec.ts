import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { OperationsListAccordionComponent } from './operations-list-accordion.component';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';

const firstOperations: FiatRampOperation[] = [
  {
    operation_id: 1,
    amount_in: 12,
    currency_in: 'ETH',
    amount_out: 21,
    currency_out: 'ARS',
    status: 'complete',
    created_at: new Date(),
    provider: '1',
    operation_type: 'cash-in'
  },
  {
    operation_id: 2,
    amount_in: 23,
    currency_in: 'USDT',
    amount_out: 21,
    currency_out: 'ARS',
    status: 'complete',
    created_at: new Date(),
    provider: '1',
    operation_type: 'cash-in'
  },
];

const remainingOperations: FiatRampOperation[] = [
  {
    operation_id: 3,
    amount_in: 32,
    currency_in: 'ETH',
    amount_out: 21,
    currency_out: 'ARS',
    status: 'complete',
    created_at: new Date(),
    provider: '1',
    operation_type: 'cash-in'
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
