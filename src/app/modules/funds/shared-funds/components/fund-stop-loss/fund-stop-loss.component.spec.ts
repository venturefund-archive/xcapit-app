import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { FundStopLossComponent } from './fund-stop-loss.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { of } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
import { By } from '@angular/platform-browser';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

const formData = {
  valid: {
    stop_loss: 15,
  },
  invalid: {
    stop_loss: '',
  },
};

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
        getMostChosenSL: of(10),
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

  it('should call trackEvent on trackService when Edit Custom Stop Loss button clicked', () => {
    component.stopLossOptions = [
      {
        name: '+35%',
        value: 35,
        custom: true,
      },
    ];
    fixture.detectChanges();
    const button = trackClickDirectiveHelper.getByElementByName('ion-button', 'Edit Custom Stop Loss');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Create Custom Stop Loss button clicked', () => {
    const button = trackClickDirectiveHelper.getByElementByName('ion-button', 'Create Custom Stop Loss');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit form data to parent on form valid', () => {
    const spy = spyOn(component.save, 'emit');
    component.form.patchValue(formData.valid);

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

    expect(spy).toHaveBeenCalledWith(formData.valid);
  });

  it('should not emit form data to parent and should mark the form as touched on form invalid', async () => {
    const spy = spyOn(component.save, 'emit');
    const spyForm = spyOn(component.form, 'markAllAsTouched');
    component.form.patchValue(formData.invalid);

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

    expect(spy).toHaveBeenCalledTimes(0);
    expect(spyForm).toHaveBeenCalledTimes(1);
  });

  it('should push manual stop loss option if profile is an index strategy on component creation', async () => {
    component.profile = 'Mary_index';
    component.ngOnInit();
    expect(component.stopLossOptions).toContain(component.stopLossManualOption);
  });

  it('should add custom option to stop loss options and selected it if stop loss was provided on component creation', async () => {
    component.stopLoss = 99;
    component.ngOnInit();
    expect(component.stopLossOptions).toContain({ name: '-99%', value: 99, custom: true });
    expect(component.form.value.stop_loss).toEqual(99);
  });

  it('should selected option if the option exists in stop loss options and stop loss was provided on component creation', async () => {
    component.stopLoss = 5;
    component.ngOnInit();
    expect(component.stopLossOptions).toContain({ name: '-5%', value: 5, custom: false });
    expect(component.form.value.stop_loss).toEqual(5);
  });

  it('should open modal of edition when is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should add custom option when selected option in modal of custom stop loss doesnt exists on initial options', async () => {
    fakeModalController.modifyReturns({}, { data: 99, role: 'selected' });
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.stopLossOptions).toContain({ name: '-99%', value: 99, custom: true });
    expect(component.form.value.stop_loss).toEqual(99);
  });

  it('should replace custom option when selected option in modal of custom stop loss doesnt exists on initial options', async () => {
    component.stopLoss = 82;
    component.ngOnInit();
    fakeModalController.modifyReturns({}, { data: 99, role: 'selected' });
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.stopLossOptions).toContain({ name: '-99%', value: 99, custom: true });
    expect(component.form.value.stop_loss).toEqual(99);
  });

  it('should not add custom option when there is no selected option in modal of custom stop loss', async () => {
    fakeModalController.modifyReturns({}, {});
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();

    expect(component.stopLossOptions).not.toContain({ name: '-99%', value: 99, custom: true });
  });

  it('should remove custom option if selected option in modal exists in initial options', async () => {
    component.stopLoss = 99;
    component.ngOnInit();
    fakeModalController.modifyReturns({}, { data: 5, role: 'selected' });
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();
    await fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.stop_loss).toEqual(5);
    expect(component.customSL).toBeFalse();
  });

  it('should not have to do anything when selected option in modal doesnt exists in initial options', async () => {
    fakeModalController.modifyReturns({}, { data: 5, role: 'selected' });
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();
    expect(component.stopLossOptions.length).toBe(3);
    expect(component.customSL).toBeFalsy();
  });

  it('should get the most chosen SL on component.creation', async () => {
    component.ngOnInit();
    expect(component.mostChosenSL).toEqual(10);
  });

  it('should open modal alert when manual option is selected', async () => {
    fixture.debugElement.query(By.css('ion-radio-group')).triggerEventHandler('ionChange', { detail: { value: 100 } });
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not open modal alert when an option different than manual is selected', async () => {
    fixture.debugElement.query(By.css('ion-radio-group')).triggerEventHandler('ionChange', { detail: { value: 5 } });
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });

  it('should render properly', async () => {
    component.profile = 'Mary_index';

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const radioItems = fixture.debugElement.query(By.css('ion-radio-group')).nativeNode.children;
    expect(radioItems.length).toEqual(4);

    const createCustomButton = fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"'));
    expect(createCustomButton).toBeTruthy();
    expect(createCustomButton.nativeElement.innerText).toContain('funds.fund_stop_loss.custom_tp_button');

    const badgeMostChosenSL = fixture.debugElement.query(By.css('ion-radio-group ion-badge.ux_badge_primary'));
    expect(badgeMostChosenSL.nativeElement.innerText).toContain('funds.fund_stop_loss.most_chosen');
  });

  it('should render properly the custom option and the edition button ', async () => {
    component.profile = 'Mary_index';
    component.stopLoss = 92;

    component.ngOnInit();

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const customOption = fixture.debugElement.query(By.css('ion-radio-group div.container.custom'));
    expect(customOption.nativeElement.innerHTML).toContain('-92%');

    const editButton = fixture.debugElement.query(By.css('ion-button[name="Edit Custom Stop Loss"'));
    expect(editButton.nativeElement.innerText).toContain('funds.fund_stop_loss.edit_custom');
  });

  it('should navigate to "funds/inteligent-stop-loss-information" when Information button clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Information"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['funds/inteligent-stop-loss-information']);
  });
});
