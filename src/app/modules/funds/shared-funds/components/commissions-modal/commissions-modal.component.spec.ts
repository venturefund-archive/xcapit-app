import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionsModalComponent } from './commissions-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommissionNamePipe } from '../../pipes/commission-name/commission-name.pipe';
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';

describe('CommissionsModalComponent', () => {
  let component: CommissionsModalComponent;
  let fixture: ComponentFixture<CommissionsModalComponent>;
  let modalControllerSpy: any;
  let apiFundsSpy: any;

  beforeEach(async(() => {
    apiFundsSpy = jasmine.createSpyObj('ApiFundsService', ['getCommissions']);
    apiFundsSpy.getCommissions.and.returnValue(of([]));
    modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'create',
      'dismiss'
    ]);
    modalControllerSpy.create.and.returnValue(
      of({
        present: () => {},
        onWillDismiss: () => of({}).toPromise()
      }).toPromise()
    );
    TestBed.configureTestingModule({
      declarations: [CommissionsModalComponent, CommissionNamePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ApiFundsService, useValue: apiFundsSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCommissions on init', () => {
    // const spy = spyOn(apiFundsSpy, 'getCommissions')
    expect(apiFundsSpy.getCommissions).toHaveBeenCalledTimes(1);
  });
});
