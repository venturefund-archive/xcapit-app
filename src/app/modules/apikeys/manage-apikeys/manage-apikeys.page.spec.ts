import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { ManageApikeysPage } from './manage-apikeys.page';


describe('ManageApikeysPage', () => {
  let component: ManageApikeysPage;
  let fixture: ComponentFixture<ManageApikeysPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ManageApikeysPage>;
  let apiApikeysServiceSpy: any;
  let navControllerSpy: any;

  beforeEach(waitForAsync(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    apiApikeysServiceSpy = jasmine.createSpyObj('ApiApikeyService', ['getAll']);

    TestBed.configureTestingModule({
      declarations: [ManageApikeysPage, TrackClickDirective, DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'menus/main-menu', component: DummyComponent },
          { path: 'apikeys/list', component: DummyComponent },
          { path: 'apikeys/register', component: DummyComponent }
        ]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        IonicModule
      ],
      providers: [{ provide: ApiApikeysService, useValue: apiApikeysServiceSpy }, TrackClickDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageApikeysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAll on ionViewWillEnter', () => {
    apiApikeysServiceSpy.getAll.and.returnValue(of({}));
    component.ionViewWillEnter();
    expect(apiApikeysServiceSpy.getAll).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when RegisterNewKey Button clicked', () => {
    spyOn(component, 'createApiKey');
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'RegisterNewKey'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
