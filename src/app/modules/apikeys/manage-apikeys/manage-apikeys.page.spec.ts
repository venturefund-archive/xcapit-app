import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
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

  beforeEach(async(() => {
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    TestBed.configureTestingModule({
      declarations: [ManageApikeysPage],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'apikeys/list', component: DummyComponent },
        ]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        IonicModule,
      ],
      providers: [TrackClickDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageApikeysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
