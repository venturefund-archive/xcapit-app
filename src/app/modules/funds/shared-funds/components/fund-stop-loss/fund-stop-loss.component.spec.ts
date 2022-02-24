import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundStopLossComponent } from './fund-stop-loss.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
import { By } from '@angular/platform-browser';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

describe('FundStopLossComponent', () => {
  let component: FundStopLossComponent;
  let fixture: ComponentFixture<FundStopLossComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundStopLossComponent>;
  let apiFundsServiceSpy: any;
  let modalControllerSpy: any;
  let fakeModalController: FakeModalController;
  let navControllerSpy: any;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      apiFundsServiceSpy = jasmine.createSpyObj('ApiFundsService', {
        getMostChosenSL: of(1),
      });
      fakeNavController = new FakeNavController({}, Promise.resolve(), {});
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [FundStopLossComponent, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot(), IonicModule],
        providers: [
          {
            provide: ApiFundsService,
            useValue: apiFundsServiceSpy,
          },
          { provide: ModalController, useValue: modalControllerSpy },
          {
            provide: NavController,
            useValue: navControllerSpy,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundStopLossComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Create Fund button clicked', () => {
    const button = trackClickDirectiveHelper.getByElementByName('ion-button', 'Create Fund');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when radio button classicStopLoss clicked', () => {
    component.selected = 'classicStopLoss';
    fixture.detectChanges();
    const button = trackClickDirectiveHelper.getByElementByName('ion-button', 'Edit Classic Stop Loss');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when radio button inteligentStopLoss clicked', () => {
    component.selected = 'inteligentStopLoss';
    fixture.detectChanges();
    const button = trackClickDirectiveHelper.getByElementByName('ion-button', 'Edit Inteligent Stop Loss');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not patch value if there is not stop_loss on ngOnInit', () => {
    component.ngOnInit();
    expect(component.form.value.stop_loss).toBe('');
    expect(component.form.value.trailing_stop).toBe('');
    expect(component.selected).toBeFalsy();
  });

  it('should select inteligent option when there is trailingStop on ngOnInit', () => {
    component.stopLoss = 25;
    component.trailingStop = 25;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.value.stop_loss).toEqual(25);
    expect(component.form.value.trailing_stop).toEqual(25);
    expect(component.selected).toEqual('inteligentStopLoss');
  });

  it('should select classic option when there is only stopLoss and is different than 100 on ngOnInit', () => {
    component.stopLoss = 25;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.value.stop_loss).toEqual(25);
    expect(component.selected).toEqual('classicStopLoss');
  });

  it('should select without stop loss option when there is only stopLoss and is equal to 100 on ngOnInit', () => {
    component.stopLoss = 100;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.value.stop_loss).toEqual(100);
    expect(component.selected).toEqual('withoutStopLoss');
  });

  it('should render radio button withoutStopLoss when profile contain "index"', async () => {
    component.profile = 'Mary_index';
    component.ngOnInit();
    component.isIndexProfile = true;
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const radioButton = fixture.debugElement.query(By.css('div[name="withoutStopLoss"]'));
    expect(radioButton).toBeTruthy();
    expect(radioButton.nativeElement.innerText).toContain('funds.fund_stop_loss.without_stop_loss');
  });

  it('should open modal of classic SL when classicStopLoss radio button clicked and if there is data, patch values', async () => {
    fakeModalController.modifyReturns({}, { data: 25, role: 'valueSL' });
    fixture.debugElement.query(By.css('ion-item[name="classicStopLoss"]')).nativeElement.click();
    await fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(component.selected).toEqual('classicStopLoss');
    expect(component.form.value.stop_loss).toEqual(25);
    expect(component.form.value.trailing_stop).toEqual(0);
  });

  it('should open modal of classic SL when classicStopLoss radio button clicked if and there is not data, not patch values', async () => {
    fakeModalController.modifyReturns({}, { data: undefined, role: 'valueSL' });
    fixture.debugElement.query(By.css('ion-item[name="classicStopLoss"]')).nativeElement.click();
    await fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(component.selected).toEqual(undefined);
    expect(component.form.value.stop_loss).toEqual('');
    expect(component.form.value.trailing_stop).toEqual('');
  });

  it('should open modal of inteligentStopLoss SL when iteligent radio button clicked and if there is data, patch values', async () => {
    fakeModalController.modifyReturns({}, { data: 25, role: 'valueSL' });
    fixture.debugElement.query(By.css('div[name="inteligentStopLoss"]')).nativeElement.click();
    await fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(component.selected).toEqual('inteligentStopLoss');
    expect(component.form.value.stop_loss).toEqual(25);
    expect(component.form.value.trailing_stop).toEqual(25);
  });

  it('should open modal of inteligent SL when inteligentStopLoss radio button clicked and if there is not data, not patch values', async () => {
    fakeModalController.modifyReturns({}, { data: undefined, role: 'valueSL' });
    fixture.debugElement.query(By.css('div[name="inteligentStopLoss"]')).nativeElement.click();
    await fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(component.selected).toEqual(undefined);
    expect(component.form.value.stop_loss).toEqual('');
    expect(component.form.value.trailing_stop).toEqual('');
  });

  it('should patch data when withoutStopLoss radio button is clicked', () => {
    component.isIndexProfile = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-item[name="withoutStopLoss"]')).nativeElement.click();
    component.withoutSL('withoutStopLoss');
    fixture.detectChanges();
    expect(component.selected).toEqual('withoutStopLoss');
    expect(component.form.value.stop_loss).toEqual(100);
    expect(component.form.value.trailing_stop).toEqual(0);
  });

  it('should get the most chosen SL', async () => {
    component.ngOnInit();
    expect(component.mostChosenSL).toEqual(1);
  });

  it('should emit form data to parent without Trailing Stop if Trailing Stop is 0', () => {
    component.form.value.stop_loss = 25;
    component.form.value.trailing_stop = 0;
    const spy = spyOn(component.save, 'emit');
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledWith(Object({ stop_loss: 25 }));
  });

  it('should emit form data to parent with Trailing Stop if Trailing Stop is diferent of 0', () => {
    component.form.value.stop_loss = 25;
    component.form.value.trailing_stop = 25;
    const spy = spyOn(component.save, 'emit');
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledWith(Object({ stop_loss: 25, trailing_stop: 25 }));
  });

  it('should navigate to "funds/inteligent-stop-loss-information" when Information button clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Information"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['funds/inteligent-stop-loss-information']);
  });
});
