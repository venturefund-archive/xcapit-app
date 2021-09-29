import { CUSTOM_ELEMENTS_SCHEMA, forwardRef } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DepositCurrencyPage } from './deposit-currency.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LogsService } from 'src/app/shared/services/logs/logs.service';
import { DummyComponent } from '../../../../testing/dummy.component.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const formData = {
  valid: {
    currency: 'BTC',
  },
  invalid: {
    currency: '',
  },
};

describe('DepositCurrencyPage', () => {
  let component: DepositCurrencyPage;
  let fixture: ComponentFixture<DepositCurrencyPage>;
  let logsServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DepositCurrencyPage>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [DepositCurrencyPage, FakeTrackClickDirective],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          ReactiveFormsModule,
          IonicModule,
          RouterTestingModule.withRoutes([{ path: 'deposits/address', component: DummyComponent }]),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: LogsService, useValue: logsServiceMock },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositCurrencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    logsServiceMock = TestBed.inject(LogsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when next is clicked', () => {
    spyOn(component, 'handleSubmit');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Next');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call submitData on handleSubmit and valid form', () => {
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['deposits/address/', 'BTC']);
  });
});
