import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionsContentComponent } from './commissions-content.component';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { CommissionNamePipe } from '../../pipes/commission-name/commission-name.pipe';

describe('CommissionsContentComponent', () => {
  let component: CommissionsContentComponent;
  let fixture: ComponentFixture<CommissionsContentComponent>;
  let apiFundsSpy: any;
  beforeEach(async(() => {
    apiFundsSpy = jasmine.createSpyObj('ApiFundsService', ['getCommissions']);
    apiFundsSpy.getCommissions.and.returnValue(of([]));
    TestBed.configureTestingModule({
      declarations: [CommissionsContentComponent, CommissionNamePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ApiFundsService, useValue: apiFundsSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCommissions on init', () => {
    expect(apiFundsSpy.getCommissions).toHaveBeenCalledTimes(1);
  });
});
