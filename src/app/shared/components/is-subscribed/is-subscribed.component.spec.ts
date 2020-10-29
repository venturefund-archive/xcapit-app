import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsSubscribedComponent } from './is-subscribed.component';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';

describe('IsSubscribedComponent', () => {
  let component: IsSubscribedComponent;
  let fixture: ComponentFixture<IsSubscribedComponent>;
  let apiFundsServiceSpy: any;
  let navControllerSpy: any;

  beforeEach(async(() => {
    apiFundsServiceSpy = jasmine.createSpyObj('ApiFundsService', [
      'isSubscribed'
    ]);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

    TestBed.configureTestingModule({
      declarations: [IsSubscribedComponent, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dummy-route', component: DummyComponent }
        ])
      ],
      providers: [
        { provide: ApiFundsService, useValue: apiFundsServiceSpy },
        { provide: NavController, useValue: navControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsSubscribedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call isSubscribed (return true) on apiFundsServices when component change', () => {
    apiFundsServiceSpy.isSubscribed.and.returnValue(
      of({ is_subscribed: true })
    );
    component.fundName = 'test';
    component.ngOnChanges();
    expect(apiFundsServiceSpy.isSubscribed).toHaveBeenCalledTimes(1);
  });

  it('should call isSubscribed (return true) on apiFundsServices when component change and redirectTo is set', () => {
    apiFundsServiceSpy.isSubscribed.and.returnValue(
      of({ is_subscribed: true })
    );
    component.fundName = 'test';
    component.redirectTo = '/dummy-route';
    component.ngOnChanges();
    expect(apiFundsServiceSpy.isSubscribed).toHaveBeenCalledTimes(1);
  });

  it('should call isSubscribed (return false) on apiFundsServices when component change', () => {
    apiFundsServiceSpy.isSubscribed.and.returnValue(
      of({ is_subscribed: false })
    );
    component.fundName = 'test';
    component.ngOnChanges();
    expect(apiFundsServiceSpy.isSubscribed).toHaveBeenCalledTimes(1);
  });

  it('should call isSubscribed (return false) on apiFundsServices when component change and redirectTo is set', () => {
    apiFundsServiceSpy.isSubscribed.and.returnValue(
      of({ is_subscribed: false })
    );
    component.fundName = 'test';
    component.redirectTo = '/dummy-route';
    component.ngOnChanges();
    expect(apiFundsServiceSpy.isSubscribed).toHaveBeenCalledTimes(1);
  });

  it('should not call isSubscribed on apiFundsServices if fundName = nothing when component change and redirectTo is set', () => {
    component.fundName = '';
    component.ngOnChanges();
    expect(apiFundsServiceSpy.isSubscribed).toHaveBeenCalledTimes(0);
  });

  it('should call navigateBack on navController when isSubscribed return false', () => {
    const dummyRoute = '/dummy-route';
    apiFundsServiceSpy.isSubscribed.and.returnValue(of({ is_subscribed: false }));
    component.fundName = 'test';
    component.redirectTo = dummyRoute;
    component.ngOnChanges();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith([dummyRoute]);
  });

  it('should not call navigateBack on navController when isSubscribed return true', () => {
    const dummyRoute = '/dummy-route';
    apiFundsServiceSpy.isSubscribed.and.returnValue(
      of({ is_subscribed: true })
    );
    component.fundName = 'test';
    component.redirectTo = dummyRoute;
    component.ngOnChanges();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(0);
  });

  it('should not call isSubscribed on apiFundsServices if disabled is true', () => {
    component.fundName = 'asdf';
    component.disabled = true;
    component.ngOnChanges();
    expect(apiFundsServiceSpy.isSubscribed).toHaveBeenCalledTimes(0);
  });
});
