import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlertController,
  IonicModule,
  ModalController,
  NavController,
} from '@ionic/angular';
import { TranslateModule} from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { ApiApikeysService } from '../../services/api-apikeys/api-apikeys.service';
import { ApikeyItemComponent } from './apikey-item.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ManageApikeysPage } from '../../../manage-apikeys/manage-apikeys.page';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { RouterTestingModule } from '@angular/router/testing';

const data = { alias: 'miAPIKey', id: 1, nombre_bot: 'BTC' };
const apikeys = {
  apikeyWithFunds: { id: 1, nombre_bot: 'BTC', alias: 'MiKeyBinance' },

  apikeyWithoutFunds: { id: 2, nombre_bot: null, alias: 'MiKeyBinance' },
};

describe('ApikeyItemComponent', () => {
  let component: ApikeyItemComponent;
  let fixture: ComponentFixture<ApikeyItemComponent>;
  let apiApikeysServiceSpy;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ApikeyItemComponent>;
  let modalControllerSpy;
  let alertControllerSpy;
  let navControllerSpy: any;

  beforeEach(async(() => {
    apiApikeysServiceSpy = jasmine.createSpyObj('ApiApikeysService', [
      'delete',
    ]);
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    
    TestBed.configureTestingModule({
      declarations: [ApikeyItemComponent, TrackClickDirective],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'apikeys/list', component: DummyComponent },
        ]),
        IonicModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        TrackClickDirective,
        ManageApikeysPage,
        { provide: NavController, useValue: navControllerSpy },        
        { provide: ApiApikeysService, useValue: apiApikeysServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApikeyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    apiApikeysServiceSpy = TestBed.inject(ApiApikeysService);
  });

  it('should call trackEvent on trackService when elements with the directive are clicked in card without funds', () => {
    spyOn(window, 'open');
    fixture.detectChanges();
    const elms = trackClickDirectiveHelper.getAllElementsWithTheDirective();
    component.id = apikeys.apikeyWithoutFunds.id;
    component.alias = apikeys.apikeyWithoutFunds.alias;
    component.nombre_bot = apikeys.apikeyWithoutFunds.nombre_bot;
    for (const el of elms) {
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    }
    expect(elms.length).toBe(3);
  });

  it('should call create on openModal', () => {
    fixture.detectChanges();
    modalControllerSpy.create.and.returnValue({});
    component.openModal();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call create on ShowAlert', () => {
    fixture.detectChanges();
    alertControllerSpy.create.and.returnValue(of({}));
    component.showAlert(component.id).then(() => {
      expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
    });
  });

  it('should call delete on remove', () => {
    fixture.detectChanges();
    apiApikeysServiceSpy.delete.and.returnValue(of({}));
    component.remove(component.id);
    expect(apiApikeysServiceSpy.delete).toHaveBeenCalledTimes(1);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
