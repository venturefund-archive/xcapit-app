import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EditProfileComponent } from './edit-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiProfilesService } from '../../../shared-profiles/services/api-profiles/api-profiles.service';
import { of } from 'rxjs';
const formData = {
  valid: {
    first_name: 'Test',
    last_name: 'Test',
    nro_dni: '21341234',
    cellphone: '12344321',
    condicion_iva: 'Cliente del Exterior',
    tipo_factura: 'C',
    pais: 'Argentina',
    cuit: '1234123443',
    direccion: 'calle falsa 123'
  },
  invalid: {
    first_name: 'Test',
    last_name: 'Test',
    nro_dni: '213412x34',
    cellphone: '12x344321',
    condicion_iva: 'Cliente del Exterior',
    tipo_factura: 'C',
    pais: 'Argentina',
    cuit: '12341234x43',
    direccion: 'calle falsa 123'
  }
};

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let apiProfiles: any;
  let apiProfilesMock;
  beforeEach(async(() => {
    apiProfilesMock = {
      crud: {
        update: () => of(),
        get: () => of({})
      }
    };
    TestBed.configureTestingModule({
      declarations: [EditProfileComponent],
      imports: [IonicModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: ApiProfilesService,
          useValue: apiProfilesMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiProfiles = TestBed.get(ApiProfilesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call get on apiProfile get when ngOnInit', () => {
    const spy = spyOn(apiProfiles.crud, 'get');
    spy.and.returnValue(of({}));
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call get on apiProfile update when save', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.valid);
    const spy = spyOn(apiProfiles.crud, 'update');
    spy.and.returnValue(of({}));
    component.save();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call update on apiProfile.crud, valid form', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    const spy = spyOn(apiProfiles.crud, 'update');
    spy.and.returnValue(of(null));
    component.save();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call update on apiProfile.crud, invalid form', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.valid);
    component.form.get('cellphone').setValue(formData.invalid.cellphone);
    fixture.detectChanges();
    const spy = spyOn(apiProfiles.crud, 'update');
    component.save();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  describe('Form values', () => {
    it('form should be invalid when some fields are notvalid', () => {
      fixture.detectChanges();
      component.form.get('cellphone').setValue(formData.invalid.cellphone);
      expect(component.form.valid).toBeFalsy();
    });

    it('form should be valid when all fields are valid', () => {
      component.form.patchValue(formData.valid);
      fixture.detectChanges();
      expect(component.form.valid).toBeTruthy();
    });
  });
});
