// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { UserProfilePage } from './user-profile.page';
// import { IonicModule } from '@ionic/angular';
// import { ReactiveFormsModule } from '@angular/forms';
// import { By } from '@angular/platform-browser';
// import { of } from 'rxjs';
// import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
// import { RouterTestingModule } from '@angular/router/testing';
// import { TranslateModule } from '@ngx-translate/core';
// import { ApiRunsService } from '../../runs/shared-runs/services/api-runs/api-runs.service';
// import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
// import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ProfilesHelperService } from '../shared-profiles/services/profiles-helper/profiles-helper.service';

// const formData = {
//   valid: {
//     first_name: 'Test',
//     last_name: 'Test',
//     nro_dni: '21341234',
//     cellphone: '12344321',
//     condicion_iva: 'Cliente del Exterior',
//     tipo_factura: 'C',
//     cuit: '1234123443',
//     direccion: 'calle falsa 123'
//   },
//   invalid: {
//     first_name: 'Test',
//     last_name: 'Test',
//     nro_dni: '213412x34',
//     cellphone: '12x344321',
//     condicion_iva: 'Cliente del Exterior',
//     tipo_factura: 'C',
//     cuit: '12341234x43',
//     direccion: 'calle falsa 123'
//   }
// };

// describe('UserProfilePage', () => {
//   let component: UserProfilePage;
//   let fixture: ComponentFixture<UserProfilePage>;
//   let apiProfilesServiceMock: any;
//   let apiProfilesService: ApiProfilesService;
//   let apiRunsServiceSpy: any;
//   let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserProfilePage>;
//   let profilesHelperSpy: any;

//   beforeEach(async(() => {
//     apiRunsServiceSpy = jasmine.createSpyObj('ApiRunsService', ['hasActive']);
//     apiRunsServiceSpy.hasActive.and.returnValue(of(false));
//     apiProfilesServiceMock = {
//       crud: {
//         update: () => of({}),
//         get: () => of({})
//       }
//     };
//     profilesHelperSpy = jasmine.createSpyObj('ProfilesHelperService', [
//       'isFromGuardHasBeenCalled',
//       'isFromGuard',
//       'getUrlToAccess'
//     ]);

//     TestBed.configureTestingModule({
//       declarations: [UserProfilePage, TrackClickDirective],
//       imports: [
//         HttpClientTestingModule,
//         TranslateModule.forRoot(),
//         IonicModule,
//         ReactiveFormsModule,
//         RouterTestingModule.withRoutes([])
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       providers: [
//         TrackClickDirective,
//         { provide: ApiProfilesService, useValue: apiProfilesServiceMock },
//         { provide: ApiRunsService, useValue: apiRunsServiceSpy },
//         { provide: ProfilesHelperService, useValue: profilesHelperSpy }
//       ]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(UserProfilePage);
//     component = fixture.componentInstance;
//     apiProfilesService = TestBed.get(ApiProfilesService);
//     trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call get on apiProfile.crud when ngOnInit', () => {
//     const spy = spyOn(apiProfilesService.crud, 'get');
//     spy.and.returnValue(of({}));
//     component.ngOnInit();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('should call isFromGuardHasBeenCalled on profileHelper when ionViewWillLeave', () => {
//     component.ionViewWillLeave();
//     expect(profilesHelperSpy.isFromGuardHasBeenCalled).toHaveBeenCalledTimes(1);
//   });

//   it('should call save on submit form', () => {
//     fixture.detectChanges();
//     const spy = spyOn(component, 'save');
//     fixture.debugElement
//       .query(By.css('form'))
//       .triggerEventHandler('ngSubmit', null);
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('should call update on apiProfile.crud, valid form', () => {
//     fixture.detectChanges();
//     component.form.patchValue(formData.valid);
//     fixture.detectChanges();
//     const spy = spyOn(apiProfilesService.crud, 'update');
//     spy.and.returnValue(of(null));
//     component.save();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });

//   it('should not call update on apiProfile.crud, invalid form', () => {
//     fixture.detectChanges();
//     component.form.patchValue(formData.valid);
//     component.form.get('cellphone').setValue(formData.invalid.cellphone);
//     fixture.detectChanges();
//     const spy = spyOn(apiProfilesService.crud, 'update');
//     component.save();
//     expect(spy).toHaveBeenCalledTimes(0);
//   });

//   describe('Form values', () => {
//     it('form should be invalid when fields are empty and active runs is true', () => {
//       apiRunsServiceSpy.hasActive.and.returnValue(of(true));
//       fixture.detectChanges();
//       expect(component.form.valid).toBeFalsy();
//     });

//     it('form should be valid when fields are empty and active runs is false', () => {
//       fixture.detectChanges();
//       expect(component.form.valid).toBeTruthy();
//     });

//     it('form should be invalid when some fields are notvalid', () => {
//       fixture.detectChanges();
//       component.form.get('cellphone').setValue(formData.invalid.cellphone);
//       expect(component.form.valid).toBeFalsy();
//     });
//   });

//   it('should call trackEvent on trackService when Save Profile button clicked', () => {
//     fixture.detectChanges();
//     component.form.patchValue(formData.valid);
//     fixture.detectChanges();
//     const el = trackClickDirectiveHelper.getByElementByName(
//       'ion-button',
//       'Save Profile'
//     );
//     const directive = trackClickDirectiveHelper.getDirective(el);
//     const spy = spyOn(directive, 'clickEvent');
//     el.nativeElement.click();
//     fixture.detectChanges();
//     expect(spy).toHaveBeenCalledTimes(1);
//   });
// });
