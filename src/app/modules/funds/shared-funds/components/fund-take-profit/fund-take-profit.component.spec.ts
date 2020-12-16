import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTakeProfitComponent } from './fund-take-profit.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
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
  let apiFundsMock: any;
  let apiFundsService: any;
  let modalControllerSpy: any;
  let navControllerSpy: any;

  beforeEach(async(() => {
    apiFundsMock = {
      getMostChosenTP: () => of(15),
    };
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

    TestBed.configureTestingModule({
      declarations: [
        FundTakeProfitComponent,
        TrackClickDirective,
        DummyComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'funds/fund-stop-loss',
            component: DummyComponent,
          },
        ]),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        IonicModule,
      ],
      providers: [
        {
          provide: ApiFundsService,
          useValue: apiFundsMock,
        },
        {
          provide: NavController,
          useValue: navControllerSpy,
        },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundTakeProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.inject(ApiFundsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call apiFunds.getMostChosenTP on getMostChosenTP', () => {
    const spy = spyOn(apiFundsService, 'getMostChosenTP');
    spy.and.returnValue(of(15));
    component.getMostChosenTP();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call modal.present on openCustomTP', () => {
    component.openCustomTP();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Back button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Back'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Save Fund Take Profit button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Save Fund Take Profit'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
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
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Edit Custom Take Profit'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit form data to parent on form valid', async (done) => {
    const spy = spyOn(component.save, 'emit');
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    component.handleSubmit();
    fixture.detectChanges();
    fixture
      .whenStable()
      .then(() => expect(spy).toHaveBeenCalledWith(formData.valid));
    done();
  });

  it('should not emit form data to parent on form invalid', async (done) => {
    const spy = spyOn(component.save, 'emit');
    component.form.patchValue(formData.invalid);
    fixture.detectChanges();
    component.handleSubmit();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(0));
    done();
  });
});
