import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfilePage } from './user-profile.page';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ApiProfilesService } from '../shared-profiles/services/api-profiles/api-profiles.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { Storage } from '@ionic/storage';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';

describe('UserProfilePage', () => {
  let component: UserProfilePage;
  let fixture: ComponentFixture<UserProfilePage>;
  let apiProfilesServiceMock: any;
  let apiProfilesService: ApiProfilesService;
  let apiUsuariosServiceMock: any;
  let apiUsuariosService: ApiUsuariosService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserProfilePage>;
  let storageSpy: any;
  let storageService: any;

  beforeEach(async(() => {
    apiProfilesServiceMock = {
      crud: {
        update: () => of({}),
        get: () => of({})
      }
    };
    apiUsuariosServiceMock = {
      status: () => of({status_name: 'COMPLETE'})
    };
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']);
    storageSpy.get.and.returnValue(new Promise(resolve => {}));
    storageSpy.set.and.returnValue(new Promise(resolve => {}));
    storageSpy.remove.and.returnValue(new Promise(resolve => {}));

    TestBed.configureTestingModule({
      declarations: [UserProfilePage, TrackClickDirective],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        IonicModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiProfilesService, useValue: apiProfilesServiceMock },
        { provide: Storage, useValue: storageSpy },
        { provide: ApiUsuariosService, useValue: apiUsuariosServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfilePage);
    component = fixture.componentInstance;
    apiProfilesService = TestBed.inject(ApiProfilesService);
    storageService = TestBed.inject(Storage);
    apiUsuariosService = TestBed.inject(ApiUsuariosService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call get on apiProfile.crud when ionViewWillEnter', () => {
    const spy = spyOn(apiProfilesService.crud, 'get');
    spy.and.returnValue(of({}));
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call status on apiUsuarios when ionViewWillEnter', () => {
    const spy = spyOn(apiUsuariosService, 'status');
    spy.and.returnValue(of({status_name: 'COMPLETE'}));
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call get on editProfile when toggleEditProfile', () => {
    component.editing = true;
    fixture.detectChanges();
    component.editProfile = { save: () => of(true) } as EditProfileComponent;
    fixture.detectChanges();
    const spy = spyOn(component.editProfile, 'save');
    spy.and.returnValue(of(true));
    component.toggleEditProfile();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Edit Save Profile button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Edit Save Profile'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
