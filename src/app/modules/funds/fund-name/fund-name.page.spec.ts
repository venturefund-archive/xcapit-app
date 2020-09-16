import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundNamePage } from './fund-name.page';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';

const formData = {
  valid: {
    fund_name: 'test'
  },
  invalid: {
    fund_name: ''
  }
};

describe('FundNamePage', () => {
  let component: FundNamePage;
  let fixture: ComponentFixture<FundNamePage>;
  let fundDataStorageServiceMock;
  let fundDataStorageService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundNamePage>;

  beforeEach(async(() => {
    fundDataStorageServiceMock = {
      getData: () => Promise.resolve({}),
      setData: () => Promise.resolve()
    };

    TestBed.configureTestingModule({
      declarations: [FundNamePage, TrackClickDirective, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'funds/fund-risk', component: DummyComponent }
        ]),
        HttpClientTestingModule,
        TranslateModule.forRoot()
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
    fixture = TestBed.createComponent(FundNamePage);
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

  it('should call fundDataStorageService.setData on handleSubmit and form valid', () => {
    const spy = spyOn(fundDataStorageService, 'setData');
    spy.and.returnValue(Promise.resolve());
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should not call fundDataStorageService.setData on handleSubmit and form invalid', () => {
    const spy = spyOn(fundDataStorageService, 'setData');
    spy.and.returnValue(Promise.resolve());
    component.form.patchValue(formData.invalid);
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call trackEvent on trackService when Save Fund Name button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Save Fund Name'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
