import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { OperationsPagePage } from './operations-page.page';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('OperationsPagePage', () => {
  let component: OperationsPagePage;
  let fixture: ComponentFixture<OperationsPagePage>;
  let fiatRampsServiceSpy: any;
  let navControllerSpy: any;

  beforeEach(async(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getUserOperations: of({})
    });

    TestBed.configureTestingModule({
      declarations: [ OperationsPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'fiat-ramps/operations-detail', component: DummyComponent },
          { path: 'tabs/funds', component: DummyComponent },
          { path: 'fiat-ramps/new-operation', component: DummyComponent }
        ]),
        HttpClientTestingModule,
        IonicModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: NavController, useValue: navControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUserOperations on ionViewWillEnter', async (done) => {
    fiatRampsServiceSpy.getUserOperations.and.returnValue(of({}));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fiatRampsServiceSpy.getUserOperations).toHaveBeenCalledTimes(1);
    });
    done();
  });
});
