import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApikeysPage } from './new-apikeys.page';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

const formData = {
  apikey: 'asdfad',
  secret_key: 'asdfasdfa'
};

describe('NewApikeysPage', () => {
  let component: NewApikeysPage;
  let fixture: ComponentFixture<NewApikeysPage>;
  let apiApikeysServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NewApikeysPage>;

  beforeEach(async(() => {
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
        {
          provide: ApiApikeysService,
          useValue: apiApikeysServiceMock
        }
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

  xit('should stepper be set', async () => {
    // TODO: falta probar que el stepper sea seteado con los
    // datos correctos, al ser ésto el resultado de conectar el
    // ion-slides con el stepper y al ser ion-slides un componente
    // referenciado con ViewChild no estoy pudiendo realizar el test.
    // A lo mejor conviene crear un stub de ion-slides y del stepper y
    // probar con eso.
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
