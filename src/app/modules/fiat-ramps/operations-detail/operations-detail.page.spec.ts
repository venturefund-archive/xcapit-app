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

const photo = {
  dataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD==",
  type: "jpeg"
}

const operation = {
  status: 'pending_by_privder',
  amount_in: 100,
  amount_out: 20
}

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

  it('should call getUserSingleOperation on ionViewWillEnter', async (done) => {
    fiatRampsServiceSpy.getUserSingleOperation.and.returnValue(of(operation));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fiatRampsServiceSpy.getUserSingleOperation).toHaveBeenCalledTimes(1);
    });
    done();
  });

  it('should call confirmOperation on sendPicture with and a voucher image', () => {
    fixture.detectChanges();
    component.comprobante = photo;
    component.sendPicture();
    expect(fiatRampsServiceSpy.confirmOperation).toHaveBeenCalledTimes(1);
  });
});
