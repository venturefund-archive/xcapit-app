import { CUSTOM_ELEMENTS_SCHEMA, forwardRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DepositCurrencyPage } from './deposit-currency.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LogsService } from 'src/app/shared/services/logs/logs.service';

const formData = {
  valid: {
    currency: 'BTC'
  },
  invalid: {
    currency: ''
  }
}

describe('DepositCurrencyPage', () => {
  let component: DepositCurrencyPage;
  let fixture: ComponentFixture<DepositCurrencyPage>;
  let logsServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<DepositCurrencyPage>;

  beforeEach(async(() => {
  
    TestBed.configureTestingModule({
      declarations: [ DepositCurrencyPage, TrackClickDirective ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        IonicModule,
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LogsService, useValue: logsServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositCurrencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    logsServiceMock = TestBed.get(LogsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when next is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Next');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
