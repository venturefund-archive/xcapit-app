import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReferralPage } from './new-referral.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReferralFormComponent } from './components/referral-form/referral-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiReferralsService } from '../shared-referrals/services/api-referrals/api-referrals.service';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

const formData = {
  valid: {
    email: 'test@test.com'
  }
};

describe('NewReferralPage', () => {
  let component: NewReferralPage;
  let fixture: ComponentFixture<NewReferralPage>;
  let apiReferralsServiceMock: any;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NewReferralPage>;

  beforeEach(async(() => {
    apiReferralsServiceMock = {
      crud: jasmine.createSpyObj('CRUD', ['create'])
    };
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateBack']);
    navControllerSpy.navigateBack.and.returnValue(of({}).toPromise());
    TestBed.configureTestingModule({
      declarations: [
        NewReferralPage,
        ReferralFormComponent,
        TrackClickDirective
      ],
      imports: [
        IonicModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        TrackClickDirective,
        { provide: ApiReferralsService, useValue: apiReferralsServiceMock },
        { provide: NavController, useValue: navControllerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReferralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call success from handleSubmit', () => {
    apiReferralsServiceMock.crud.create.and.returnValue(of({}));
    const spy = spyOn(component, 'success');
    component.handleSubmit(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call create from handleSubmit', () => {
    apiReferralsServiceMock.crud.create.and.returnValue(of({}));
    component.handleSubmit(null);
    expect(apiReferralsServiceMock.crud.create).toHaveBeenCalledTimes(1);
  });

  it('should reset form on success', async (done) => {
    const spy = spyOn(component.formComponent.form, 'reset');
    component.success().then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should call navigateBack with ["/referrals/list"], on navController when from success', async (done) => {
    component.success().then(() => {
      expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateBack).toHaveBeenCalledWith([
        '/referrals/list'
      ]);
    });
    done();
  });

  it('should call trackEvent on trackService when Save Referral button clicked', () => {
    fixture.detectChanges();
    component.formComponent.form.patchValue(formData.valid);
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Save Referral'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
