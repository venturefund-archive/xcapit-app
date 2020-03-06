import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApikeysPage } from './new-apikeys.page';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

const formData = {
  api_key: 'asdfad',
  secret_key: 'asdfasdfa'
};

describe('NewApikeysPage', () => {
  let component: NewApikeysPage;
  let fixture: ComponentFixture<NewApikeysPage>;
  let apiApikeysServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NewApikeysPage>;
  let navControllerSpy: any;

  beforeEach(async(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateForward']);
    navControllerSpy.navigateForward.and.returnValue(of({}).toPromise());
    apiApikeysServiceMock = {
      crud: jasmine.createSpyObj('CRUD', ['create'])
    };
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        IonicModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [NewApikeysPage, TrackClickDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        TrackClickDirective,
        {
          provide: ApiApikeysService,
          useValue: apiApikeysServiceMock
        },
        { provide: NavController, useValue: navControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewApikeysPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call setStepper on ionViewDidEnter', () => {
    const spy = spyOn(component, 'setStepper');
    component.ionViewDidEnter();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call success from handleSubmit', () => {
    fixture.detectChanges();
    apiApikeysServiceMock.crud.create.and.returnValue(of({}));
    component.form.patchValue(formData);
    const spy = spyOn(component, 'success');
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call crud.create on handleSubmit', () => {
    fixture.detectChanges();
    apiApikeysServiceMock.crud.create.and.returnValue(of({}));
    component.form.patchValue(formData);
    component.handleSubmit();
    expect(apiApikeysServiceMock.crud.create).toHaveBeenCalledTimes(1);
  });

  it('should reset form on success', async done => {
    fixture.detectChanges();
    const spy = spyOn(component.form, 'reset');
    component.success().then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should call navigateForward with ["/apikeys/linked"], on navController when from success', async done => {
    fixture.detectChanges();
    component.success().then(() => {
      expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(
        ['/apikeys/linked'],
        { replaceUrl: true }
      );
    });
    done();
  });

  describe('TrackService', () => {
    it('should call trackEvent on trackService when YES option was clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName(
        'ion-button',
        'Yes exchange account'
      );
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when No option was clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName(
        'ion-button',
        'No exchange account'
      );
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when help link option was clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName(
        'ion-button',
        'Help Link'
      );
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when list next option was clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName(
        'ion-button',
        'List Next'
      );
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when list APIKEY Next was clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName(
        'ion-button',
        'APIKEY Next'
      );
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call trackEvent on trackService when list SECRETKEY Next was clicked', () => {
      const el = trackClickDirectiveHelper.getByElementByName(
        'ion-button',
        'SECRETKEY Next'
      );
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form and Forms values', () => {
    it('should call handleSubmit when SECRETKEY Next was clicked', () => {
      fixture.detectChanges();
      const spy = spyOn(component, 'handleSubmit');
      fixture.debugElement
        .query(By.css('form'))
        .triggerEventHandler('ngSubmit', null);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('form should be valid when all fields are ok', () => {
      fixture.detectChanges();
      component.form.patchValue(formData);
      expect(component.form.valid).toBeTruthy();
    });

    it('form should be invalid when a field is not ok', () => {
      fixture.detectChanges();
      component.form.patchValue(formData);
      component.form.get('secret_key').setValue(null);
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be invalid when fields are empty', async () => {
      fixture.detectChanges();
      expect(component.form.valid).toBeFalsy();
    });
  });
});
