import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { FundStopLossComponent } from './fund-stop-loss.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { of } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
import { By } from '@angular/platform-browser';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';

const formData = {
  valid: {
    stop_loss: 15,
  },
  invalid: {
    stop_loss: '',
  },
};

fdescribe('FundStopLossComponent', () => {
  let component: FundStopLossComponent;
  let fixture: ComponentFixture<FundStopLossComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundStopLossComponent>;
  let apiFundsServiceSpy: any;
  let modalControllerSpy: any;
  let fakeModalController: FakeModalController;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      apiFundsServiceSpy = jasmine.createSpyObj('ApiFundsService', {
        getMostChosenSL: of(1),
      });
      TestBed.configureTestingModule({
        declarations: [FundStopLossComponent, TrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot(), IonicModule],
        providers: [
          {
            provide: ApiFundsService,
            useValue: apiFundsServiceSpy,
          },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: ModalController, useValue: modalControllerMock },
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

  it('should call trackEvent on trackService when Create Custom Stop Loss button clicked', () => {
    const button = trackClickDirectiveHelper.getByElementByName('ion-button', 'Create Custom Stop Loss');
    const directive = trackClickDirectiveHelper.getDirective(button);
    const spy = spyOn(directive, 'clickEvent');
    button.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open modal of classic SL when classic radio button clicked', fakeAsync(() => {
    fixture.debugElement.query(By.css('ion-item[name="classic"]')).nativeElement.click();
    expect(modalControllerMock.create).toHaveBeenCalledTimes(1);
  }));

  it('should open modal of inteligent SL when iteligent radio button clicked', fakeAsync(() => {
    fixture.debugElement.query(By.css('div[name="inteligent"]')).nativeElement.click();
    expect(modalControllerMock.create).toHaveBeenCalledTimes(1);
  }));

  it('should patch data when withoutSL radio button is clicked', () => {
    fixture.debugElement.query(By.css('ion-item[name="withoutSL"]')).nativeElement.click();
    component.selected = 'withoutSL';
    component.withoutSL('withoutSL');
    fixture.detectChanges();
    expect(component.form.value.stop_loss).toEqual(100);
    expect(component.form.value.trailing_stop).toEqual(0);
  });

  it('should get the most chosen SL', async () => {
    component.ngOnInit();
    expect(component.mostChosenSL).toEqual(1);
  });

  it('should emit form data to parent without TS if TS is 0', () => {
    const spy = spyOn(component.save, 'emit');

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.form.value.trailing_stop).toBeNull();
  });

  // it('should call trackEvent on trackService when Edit Custom Stop Loss button clicked', () => {
  //   component.stopLossOptions = [
  //     {
  //       name: '+35%',
  //       value: 35,
  //       custom: true,
  //     },
  //   ];
  //   fixture.detectChanges();
  //   const button = trackClickDirectiveHelper.getByElementByName('ion-button', 'Edit Custom Stop Loss');
  //   const directive = trackClickDirectiveHelper.getDirective(button);
  //   const spy = spyOn(directive, 'clickEvent');
  //   button.nativeElement.click();
  //   fixture.detectChanges();
  //   expect(spy).toHaveBeenCalledTimes(1);
  // });

  // it('should push manual stop loss option if profile is an index strategy on component creation', async () => {
  //   component.profile = 'Mary_index';
  //   component.ngOnInit();
  //   expect(component.stopLossOptions).toContain(component.stopLossManualOption);
  // });

  // it('should add custom option to stop loss options and selected it if stop loss was provided on component creation', async () => {
  //   component.stopLoss = 99;
  //   component.ngOnInit();
  //   expect(component.stopLossOptions).toContain({ name: '-99%', value: 99, custom: true });
  //   expect(component.form.value.stop_loss).toEqual(99);
  // });

  // it('should selected option if the option exists in stop loss options and stop loss was provided on component creation', async () => {
  //   component.stopLoss = 5;
  //   component.ngOnInit();
  //   expect(component.stopLossOptions).toContain({ name: '-5%', value: 5, custom: false });
  //   expect(component.form.value.stop_loss).toEqual(5);
  // });

  // it('should add custom option when selected option in modal of custom stop loss doesnt exists on initial options', async () => {
  //   fakeModalController.modifyReturns({}, { data: 99, role: 'selected' });
  //   fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();
  //   await fixture.whenStable();
  //   expect(component.stopLossOptions).toContain({ name: '-99%', value: 99, custom: true });
  //   expect(component.form.value.stop_loss).toEqual(99);
  // });

  // it('should replace custom option when selected option in modal of custom stop loss doesnt exists on initial options', async () => {
  //   component.stopLoss = 82;
  //   component.ngOnInit();
  //   fakeModalController.modifyReturns({}, { data: 99, role: 'selected' });
  //   fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();
  //   await fixture.whenStable();
  //   expect(component.stopLossOptions).toContain({ name: '-99%', value: 99, custom: true });
  //   expect(component.form.value.stop_loss).toEqual(99);
  // });

  // it('should not add custom option when there is no selected option in modal of custom stop loss', async () => {
  //   fakeModalController.modifyReturns({}, {});
  //   fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();

  //   expect(component.stopLossOptions).not.toContain({ name: '-99%', value: 99, custom: true });
  // });

  // it('should remove custom option if selected option in modal exists in initial options', async () => {
  //   component.stopLoss = 99;
  //   component.ngOnInit();
  //   fakeModalController.modifyReturns({}, { data: 5, role: 'selected' });
  //   fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();
  //   await fixture.detectChanges();
  //   await fixture.whenStable();
  //   expect(component.form.value.stop_loss).toEqual(5);
  //   expect(component.customSL).toBeFalse();
  // });

  // it('should not have to do anything when selected option in modal doesnt exists in initial options', async () => {
  //   fakeModalController.modifyReturns({}, { data: 5, role: 'selected' });
  //   fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();
  //   expect(component.stopLossOptions.length).toBe(3);
  //   expect(component.customSL).toBeFalsy();
  // });

  it('should render properly', async () => {
    component.profile = 'Mary_index';

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const radioItems = fixture.debugElement.query(By.css('ion-radio-group')).nativeNode.children;
    expect(radioItems.length).toEqual(3);

    const createCustomButton = fixture.debugElement.query(By.css('ion-button[name="Edit Custom Stop Loss"]'));
    expect(createCustomButton).toBeTruthy();
    expect(createCustomButton.nativeElement.innerText).toContain('funds.fund_stop_loss.edit_custom');

    const badgeMostChosenSL = fixture.debugElement.query(By.css('ux_badge_primary'));
    expect(badgeMostChosenSL.nativeElement.innerText).toContain('funds.fund_stop_loss.most_chosen');
  });

  // it('should render properly the custom option and the edition button ', async () => {
  //   component.profile = 'Mary_index';
  //   component.stopLoss = 92;

  //   component.ngOnInit();

  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   await fixture.whenRenderingDone();

  //   const customOption = fixture.debugElement.query(By.css('ion-radio-group div.container.custom'));
  //   expect(customOption.nativeElement.innerHTML).toContain('-92%');

  //   const editButton = fixture.debugElement.query(By.css('ion-button[name="Edit Custom Stop Loss"'));
  //   expect(editButton.nativeElement.innerText).toContain('funds.fund_stop_loss.edit_custom');
  // });
});
