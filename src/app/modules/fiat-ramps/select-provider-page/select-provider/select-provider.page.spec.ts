import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { navControllerMock } from '../../../../../testing/spies/nav-controller-mock.spec';

import { SelectProviderPage } from './select-provider.page';

describe('SelectProviderPage', () => {
  let component: SelectProviderPage;
  let fixture: ComponentFixture<SelectProviderPage>;
  let navControllerSpy: any;

  beforeEach(waitForAsync(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    TestBed.configureTestingModule({
      declarations: [SelectProviderPage],
      imports: [IonicModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: NavController, useValue: navControllerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectProviderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
