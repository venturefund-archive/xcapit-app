import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDurationPage } from './fund-duration.page';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { IonicModule } from '@ionic/angular';
import { DummyComponent } from 'src/testing/dummy.component.spec';
const formData = {
  valid: {
    cantidad_dias: 30
  },
  invalid: {
    cantidad_dias: ''
  }
};
describe('FundDurationPage', () => {
  let component: FundDurationPage;
  let fixture: ComponentFixture<FundDurationPage>;
  let fundDataStorageServiceMock;
  let fundDataStorageService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundDurationPage>;

  beforeEach(async(() => {
    fundDataStorageServiceMock = {
      getData: () => Promise.resolve({}),
      setData: () => Promise.resolve()
    };
    TestBed.configureTestingModule({
      declarations: [FundDurationPage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'funds/fund-risk', component: DummyComponent },
          { path: 'funds/fund-currency', component: DummyComponent }
        ]),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        IonicModule
      ],
      providers: [
        {
          provide: FundDataStorageService,
          useValue: fundDataStorageServiceMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundDurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fundDataStorageService = TestBed.inject(FundDataStorageService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fundDataStorageService.getData on init', async done => {
    const spy = spyOn(fundDataStorageService, 'getData');
    spy.and.returnValue(Promise.resolve(formData.valid));
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });

  it('should call fundDataStorageService.setData on handleSubmit and form valid', async done => {
    const spy = spyOn(fundDataStorageService, 'setData');
    spy.and.returnValue(Promise.resolve());
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });

  it('should not call fundDataStorageService.setData on handleSubmit and form invalid', async done => {
    const spy = spyOn(fundDataStorageService, 'setData');
    spy.and.returnValue(Promise.resolve());
    component.form.patchValue(formData.invalid);
    component.handleSubmit();
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(0));
    done();
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

  it('should call trackEvent on trackService when Save Fund Duration button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Save Fund Duration'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
