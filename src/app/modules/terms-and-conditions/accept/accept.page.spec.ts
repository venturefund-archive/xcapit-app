import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptPage } from './accept.page';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ApiTacService } from '../shared-terms-and-conditions/services/api-tac/api-tac.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AcceptPage', () => {
  let component: AcceptPage;
  let fixture: ComponentFixture<AcceptPage>;
  let apiTacServiceMock: any;

  beforeEach(async(() => {
    apiTacServiceMock = {
      crud: jasmine.createSpyObj('CRUD', ['get', 'update', 'create'])
    };
    apiTacServiceMock.crud.get.and.returnValue(of(null));
    apiTacServiceMock.crud.update.and.returnValue(of(null));
    apiTacServiceMock.crud.create.and.returnValue(of(null));
    TestBed.configureTestingModule({
      declarations: [AcceptPage, TrackClickDirective],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        TrackClickDirective,
        { provide: ApiTacService, useValue: apiTacServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call get on crud when ngOnInit', () => {
    expect(apiTacServiceMock.crud.get).toHaveBeenCalledTimes(1);
  });

  it('should call create on crud when iAgreeTermsAndConditions', () => {
    component.iAgreeTermsAndConditions();
    expect(apiTacServiceMock.crud.create).toHaveBeenCalledTimes(1);
    expect(apiTacServiceMock.crud.update).toHaveBeenCalledTimes(0);
  });

  it('should call update on crud when iAgreeTermsAndConditions and tac is not null', () => {
    component.tac = { id: 1 };
    component.iAgreeTermsAndConditions();
    expect(apiTacServiceMock.crud.update).toHaveBeenCalledTimes(1);
    expect(apiTacServiceMock.crud.create).toHaveBeenCalledTimes(0);
  });
});
