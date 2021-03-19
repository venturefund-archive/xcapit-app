import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { RegisterApikeysPage } from '../../../register-apikeys/register-apikeys.page';
import { ApiApikeysService } from '../../services/api-apikeys/api-apikeys.service';

import { ApikeysEditModalComponent } from './apikeys-edit-modal.component';

const formData = {
  valid: {
    alias: 'MiApiKey',
  },
  invalid: {
    alias: 'mi api key',
  },
};

const initData = {
  id: 1,
  alias: 'MiApiKey',
};

describe('ApikeysEditModalComponent', () => {
  let component: ApikeysEditModalComponent;
  let fixture: ComponentFixture<ApikeysEditModalComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ApikeysEditModalComponent>;
  let apiApikeysServiceSpy;

  beforeEach(async(() => {
    apiApikeysServiceSpy = jasmine.createSpyObj('ApiApikeyService', ['update'])
  
    TestBed.configureTestingModule({
      declarations: [ApikeysEditModalComponent, TrackClickDirective],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        TrackClickDirective,
        { provide: ApiApikeysService, useValue: apiApikeysServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApikeysEditModalComponent);
    component = fixture.componentInstance;
    component.id = initData.id;
    component.alias = initData.alias;
    // component.data = formData.valid;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call update on handleSubmit and valid form', () => {
    fixture.detectChanges();
    apiApikeysServiceSpy.update.and.returnValue(of({}));
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    expect(apiApikeysServiceSpy.update).toHaveBeenCalledTimes(1);
  });

  it('should not call update on handleSubmit and invalid form', () => {
    fixture.detectChanges();
    apiApikeysServiceSpy.update.and.returnValue(of({}));
    component.form.patchValue(formData.invalid);
    component.handleSubmit();
    expect(apiApikeysServiceSpy.update).toHaveBeenCalledTimes(0);
  });

  

  it('should call trackEvent on trackService when Submit Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Submit'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
