import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

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
  let apiFundsMock: any;
  let apiFundsService: any;
  let modalControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      apiFundsMock = {
        getMostChosenSL: () => of(10),
      };
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);

      TestBed.configureTestingModule({
        declarations: [FundStopLossComponent, TrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot(), IonicModule],
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

  it('should emit form data to parent on form valid', async () => {
    const spy = spyOn(component.save, 'emit');
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    component.handleSubmit();
    expect(spy).toHaveBeenCalledWith(formData.valid);
  });

  it('should not emit form data to parent on form invalid', async () => {
    const spy = spyOn(component.save, 'emit');
    component.form.patchValue(formData.invalid);
    fixture.detectChanges();
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call apiFunds.getMostChosenSL on getMostChosenSL', () => {
    const spy = spyOn(apiFundsService, 'getMostChosenSL');
    spy.and.returnValue(of(15));
    component.getMostChosenSL();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call modal.present on openCustomSL', () => {
    component.openCustomSL();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
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
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Edit Custom Stop Loss');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
