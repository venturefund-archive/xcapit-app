import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';

import { ManageApikeysPage } from './manage-apikeys.page';

const apikeys = {
  apikeyWithFunds: { id: 1, nombre_bot: 'BTC', alias: 'MiKeyBinance' },

  apikeyWithoutFunds: { id: 2, alias: 'MiKeyBinance' },
};

describe('ManageApikeysPage', () => {
  let component: ManageApikeysPage;
  let fixture: ComponentFixture<ManageApikeysPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ManageApikeysPage>;
  let navControllerSpy: any;

  beforeEach(async(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    
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
      providers: [TrackClickDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  
  it('should call trackEvent on trackService when RegisterNewKey Button clicked', () => {
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
