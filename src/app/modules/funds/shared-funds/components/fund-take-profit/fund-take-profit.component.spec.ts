import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTakeProfitComponent } from './fund-take-profit.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { By } from '@angular/platform-browser';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
const formData = {
  valid: {
    take_profit: 15,
  },
  invalid: {
    take_profit: '',
  },
};
describe('FundTakeProfitComponent', () => {
  let component: FundTakeProfitComponent;
  let fixture: ComponentFixture<FundTakeProfitComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundTakeProfitComponent>;
  let apiFundsServiceSpy: any;
  let modalControllerSpy: any;
  let navControllerSpy: any;
  let fakeModalController: FakeModalController;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      apiFundsServiceSpy = jasmine.createSpyObj('ApiFundsService', {
        getMostChosenTP: of(15),
      });
      fakeNavController = new FakeNavController({}, Promise.resolve(), {});
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [FundTakeProfitComponent, TrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot(), IonicModule],
        providers: [
          {
            provide: ApiFundsService,
            useValue: apiFundsServiceSpy,
          },
          {
            provide: NavController,
            useValue: navControllerSpy,
          },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundTakeProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  ['Create Custom Take Profit', 'Back', 'Save Fund Take Profit'].forEach((buttonName) => {
    it(`should call trackEvent on trackService when ${buttonName} button clicked`, () => {
      const button = trackClickDirectiveHelper.getByElementByName('ion-button', buttonName);
      const directive = trackClickDirectiveHelper.getDirective(button);
      const spy = spyOn(directive, 'clickEvent');
      button.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('should call trackEvent on trackService when Edit Custom Take Profit button clicked', () => {
    component.takeProfitsOptions = [
      {
        name: '+35%',
        value: 35,
        custom: true,
      },
    ];
    fixture.detectChanges();
    const button = trackClickDirectiveHelper.getByElementByName('ion-button', 'Edit Custom Take Profit');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Edit Fund button clicked', () => {
    component.opType = 'edit';
    fixture.detectChanges();
    const button = trackClickDirectiveHelper.getByElementByName('ion-button', 'Edit Fund');
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

  it('should push manual take profit option if profile is an index strategy on component creation', async () => {
    component.profile = 'Mary_index';
    component.ngOnInit();
    expect(component.takeProfitsOptions).toContain(component.takeProfitManualOption);
  });

  it('should add custom option to take profit options and selected it if take profit was provided on component creation', async () => {
    component.takeProfit = 99;
    component.ngOnInit();
    expect(component.takeProfitsOptions).toContain({ name: '+99%', value: 99, custom: true });
    expect(component.form.value.take_profit).toEqual(99);
  });

  it('should selected option if the option exists in take profit options and take profit was provided on component creation', async () => {
    component.takeProfit = 5;
    component.ngOnInit();
    expect(component.takeProfitsOptions).toContain({ name: '+5%', value: 5, custom: false });
    expect(component.form.value.take_profit).toEqual(5);
  });

  it('should open modal of edition when is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Take Profit"]')).nativeElement.click();

    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should add custom option when selected option in modal of custom take profit doesnt exists on initial options', async () => {
    fakeModalController.modifyReturns({}, { data: 99, role: 'selected' });
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Take Profit"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.takeProfitsOptions).toContain({ name: '+99%', value: 99, custom: true });
    expect(component.form.value.take_profit).toEqual(99);
  });

  it('should replace custom option when selected option in modal of custom take profit doesnt exists on initial options', async () => {
    component.takeProfit = 82;
    component.ngOnInit();
    fakeModalController.modifyReturns({}, { data: 99, role: 'selected' });
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Take Profit"]')).nativeElement.click();
    await fixture.whenStable();
    expect(component.takeProfitsOptions).toContain({ name: '+99%', value: 99, custom: true });
    expect(component.form.value.take_profit).toEqual(99);
  });

  it('should not add custom option when there is no selected option in modal of custom take profit', async () => {
    fakeModalController.modifyReturns({}, {});
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Take Profit"]')).nativeElement.click();

    expect(component.takeProfitsOptions).not.toContain({ name: '+99%', value: 99, custom: true });
  });

  it('should remove custom option if selected option in modal exists in initial options', async () => {
    component.takeProfit = 99;
    component.ngOnInit();
    fakeModalController.modifyReturns({}, { data: 5, role: 'selected' });
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Take Profit"]')).nativeElement.click();
    await fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.take_profit).toEqual(5);
    expect(component.customTP).toBeFalse();
  });

  it('should not have to do anything when selected option in modal doesnt exists in initial options', async () => {
    fakeModalController.modifyReturns({}, { data: 5, role: 'selected' });
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Take Profit"]')).nativeElement.click();
    expect(component.takeProfitsOptions.length).toBe(3);
    expect(component.customTP).toBeFalsy();
  });

  it('should get the most chosen TP on component.creation', async () => {
    component.ngOnInit();
    expect(component.mostChosenTP).toEqual(15);
  });

  it('should render properly', async () => {
    component.profile = 'Mary_index';

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const radioItems = fixture.debugElement.query(By.css('ion-radio-group')).nativeNode.children;
    expect(radioItems.length).toEqual(4);

    const createCustomButton = fixture.debugElement.query(By.css('ion-button[name="Create Custom Take Profit"'));
    expect(createCustomButton).toBeTruthy();
    expect(createCustomButton.nativeElement.innerText).toContain('funds.fund_take_profit.custom_tp_button');

    const badgeMostChosenSL = fixture.debugElement.query(By.css('ion-radio-group ion-badge.ux_badge_primary'));
    expect(badgeMostChosenSL.nativeElement.innerText).toContain('funds.fund_take_profit.most_chosen');
  });

  it('should render properly the custom option and the edition button ', async () => {
    component.profile = 'Mary_index';
    component.takeProfit = 30;

    component.ngOnInit();

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const customOption = fixture.debugElement.query(By.css('ion-radio-group div.container.custom'));
    expect(customOption.nativeElement.innerHTML).toContain('+30%');

    const editButton = fixture.debugElement.query(By.css('ion-button[name="Edit Custom Take Profit"'));
    expect(editButton.nativeElement.innerText).toContain('funds.fund_take_profit.edit_custom');
  });

  it('should navigate to selection of strategy when Back button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Back"]')).nativeElement.click();

    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['funds/fund-investment']);
  });

  it('should open modal alert when manual option is selected', async () => {
    fixture.debugElement.query(By.css('ion-radio-group')).triggerEventHandler('ionChange', { detail: { value: 5000 } });
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not open modal alert when an option different than manual is selected', async () => {
    fixture.debugElement.query(By.css('ion-radio-group')).triggerEventHandler('ionChange', { detail: { value: 30 } });
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(0);
  });
});
