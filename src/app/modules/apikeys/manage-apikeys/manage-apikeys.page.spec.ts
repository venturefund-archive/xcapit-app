import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';

import { ManageApikeysPage } from './manage-apikeys.page';

describe('ManageApikeysPage', () => {
  let component: ManageApikeysPage;
  let fixture: ComponentFixture<ManageApikeysPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageApikeysPage ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'apikeys/list', component: DummyComponent }
        ]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        IonicModule],
      providers: [ ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
