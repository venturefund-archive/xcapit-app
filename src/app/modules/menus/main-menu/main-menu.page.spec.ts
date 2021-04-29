import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MainMenuPage } from './main-menu.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/modules/usuarios/shared-usuarios/services/auth/auth.service';
import { ReplaySubject, of } from 'rxjs';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { LanguageService } from '../../../shared/services/language/language.service';
import { modalControllerMock } from '../../../../testing/spies/modal-controller-mock.spec';
import { ModalController } from '@ionic/angular';

describe('MainMenuPage', () => {
  let component: MainMenuPage;
  let fixture: ComponentFixture<MainMenuPage>;
  let authServiceMock: any;
  let trackServiceSpy: any;
  let languageServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<MainMenuPage>;
  let modalControllerSpy: any;

  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('LogsService', ['trackView']);
    trackServiceSpy.trackView.and.returnValue(null);
    languageServiceSpy = jasmine.createSpyObj('LanguageService', [
      'setInitialAppLanguage',
      'getLanguages'
    ]);
    languageServiceSpy.setInitialAppLanguage.and.returnValue(null);
    languageServiceSpy.setInitialAppLanguage.and.returnValue('es');
    authServiceMock = {
      isLoggedIn: new ReplaySubject<boolean>(1),
      logout: () => null
    };
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );

    TestBed.configureTestingModule({
      declarations: [MainMenuPage, TrackClickDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: AuthService, useValue: authServiceMock },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy }
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'users/login', component: DummyComponent },
          { path: 'tutorials/help', component: DummyComponent },
          { path: 'tabs/funds', component: DummyComponent },
          { path: 'profiles/user', component: DummyComponent },
          { path: 'deposits/currency', component: DummyComponent },
          { path: 'users/password-change', component: DummyComponent },
          { path: 'referrals/list', component: DummyComponent },
          { path: 'notifications/list', component: DummyComponent },
          { path: 'apikeys/list', component: DummyComponent }
        ])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when elements with the directive are clicked', () => {
    spyOn(window, 'open');
    fixture.detectChanges();
    const elms = trackClickDirectiveHelper.getAllElementsWithTheDirective();
    for (const el of elms) {
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    }
    expect(elms.length).toBe(12);
  });
});
