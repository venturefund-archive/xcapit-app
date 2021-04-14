import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { OperationsDetailPage } from './operations-detail.page';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { convertToParamMap, ActivatedRoute } from '@angular/router';

describe('OperationsDetailPage', () => {
  let component: OperationsDetailPage;
  let fixture: ComponentFixture<OperationsDetailPage>;
  let fiatRampsServiceSpy: any;
  let navControllerSpy: any;

  beforeEach(async(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getUserSingleOperation: of({}),
      confirmOperation: of({})
    });
    
    let activatedRouteSpy: any;

    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        id: '10',
      }),
    };

    TestBed.configureTestingModule({
      declarations: [ OperationsDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'fiat-ramps/operations', component: DummyComponent }
        ]),
        HttpClientTestingModule,
        IonicModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
