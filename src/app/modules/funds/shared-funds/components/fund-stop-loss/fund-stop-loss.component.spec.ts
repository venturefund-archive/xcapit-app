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
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { By } from '@angular/platform-browser';

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
  let apiFundsMock: any;
  let apiFundsService: any;
  let modalControllerSpy: any;
  let onDidDismissSpy: any;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      modalControllerSpy = {
        create: jasmine.createSpy('create', () =>
          Promise.resolve({
            present: Promise.resolve(),
            onDidDismiss: onDidDismissSpy,
            dismiss: Promise.resolve(),
          })
        ),
        dismiss: Promise.resolve(),
      };
      onDidDismissSpy = jasmine
        .createSpy('onDidDismiss', () => Promise.resolve({ data: '5', role: 'selected' }))
        .and.callThrough();
      apiFundsMock = {
        getMostChosenSL: () => of(10),
      };
      // modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);

      TestBed.configureTestingModule({
        declarations: [FundStopLossComponent, TrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot(), IonicModule.forRoot()],
        providers: [
          {
            provide: ApiFundsService,
            useValue: apiFundsMock,
          },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundStopLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.inject(ApiFundsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Create Fund button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Create Fund');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
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

  it('should call trackEvent on trackService when Back button clicked', () => {
    const button = trackClickDirectiveHelper.getByElementByName('ion-button', 'Back');
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

  fit('should add custom option when selected option in modal of custom stop loss doesnt exists on default options', async () => {
    //TODO: Cambiar por el nuevo fake del modalController cuando esté libreado
    modalControllerSpy.create.and.returnValue(
      Promise.resolve({
        present: () => Promise.resolve(),
        onDidDismiss: () => Promise.resolve({ data: '99', role: 'selected' }),
        dismiss: () => Promise.resolve(),
      })
    );
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();

    expect(component.stopLossOptions).toContain({ name: '-99%', value: 99, custom: true });
    expect(component.form.value.stop_loss).toEqual(99);
  });

  fit('should not add custom option when there is no selected option in modal of custom stop loss', async () => {
    //TODO: Cambiar por el nuevo fake del modalController cuando esté libreado
    modalControllerSpy.create.and.returnValue(
      Promise.resolve({
        present: () => Promise.resolve(),
        onDidDismiss: () => Promise.resolve({}),
        dismiss: () => Promise.resolve(),
      })
    );
    fixture.debugElement.query(By.css('ion-button[name="Create Custom Stop Loss"]')).nativeElement.click();

    expect(component.stopLossOptions).not.toContain({ name: '-99%', value: 99, custom: true });
  });
  // -------------------------------------------------------------------------------------------

  // it('should not emit form data to parent on form invalid', async () => {
  //   const spy = spyOn(component.save, 'emit');
  //   component.form.patchValue(formData.invalid);
  //   fixture.detectChanges();
  //   component.handleSubmit();
  //   expect(spy).toHaveBeenCalledTimes(0);
  // });

  // it('should call apiFunds.getMostChosenSL on getMostChosenSL', () => {
  //   const spy = spyOn(apiFundsService, 'getMostChosenSL');
  //   spy.and.returnValue(of(15));
  //   component.getMostChosenSL();
  //   expect(spy).toHaveBeenCalledTimes(1);
  // });

  // it('should call modal.present on openCustomSL', () => {
  //   component.openCustomSL();
  //   expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  // });
});
