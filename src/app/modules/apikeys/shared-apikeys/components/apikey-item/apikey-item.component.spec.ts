import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlertController,
  IonicModule,
  ModalController,
  NavController
} from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
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
import { alertControllerMock } from '../../../../../../testing/spies/alert-controller-mock.spec';
import { modalControllerMock } from '../../../../../../testing/spies/modal-controller-mock.spec';

const apikeys = {
  initial: { id: 1, fundName: 'BTC', alias: 'miAPIKey' },
  apikeyWithFunds: { id: 1, fundName: 'BTC', alias: 'MiKeyBinance' },
  apikeyWithoutFunds: { id: 2, fundName: null, alias: 'MiKeyBinance' }
};

describe('ApikeyItemComponent', () => {
  let component: ApikeyItemComponent;
  let fixture: ComponentFixture<ApikeyItemComponent>;
  let apiApikeysServiceSpy;
  let apiApikeysService: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ApikeyItemComponent>;
  let modalControllerSpy;
  let alertControllerSpy;
  let navControllerSpy: any;
  let alertController: any;

  beforeEach(waitForAsync(() => {
    apiApikeysServiceSpy = jasmine.createSpyObj('ApiApikeysService', {
      delete: of({}),
      getAll: of({})
    });
    modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
    alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    TestBed.configureTestingModule({
      declarations: [ApikeyItemComponent, TrackClickDirective],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'apikeys/list', component: DummyComponent }
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
        { provide: AlertController, useValue: alertControllerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApikeyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    apiApikeysService = TestBed.inject(ApiApikeysService);
    alertController = TestBed.inject(AlertController);
    component.id = apikeys.initial.id;
    component.alias = apikeys.initial.alias;
    component.fundName = apikeys.initial.fundName;
  });

  it('should call trackEvent on trackService when elements with the directive are clicked in card without funds', () => {
    component.id = apikeys.apikeyWithoutFunds.id;
    component.alias = apikeys.apikeyWithoutFunds.alias;
    component.fundName = apikeys.apikeyWithoutFunds.fundName;

    spyOn(window, 'open');
    fixture.detectChanges();
    const elms = trackClickDirectiveHelper.getAllElementsWithTheDirective();

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
    component.openModal();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call create on ShowAlert', async () => {
    fixture.detectChanges();
    await component.showAlert(component.id);
    expect(alertController.create).toHaveBeenCalledTimes(1);
  });

  it('should call delete on remove', () => {
    fixture.detectChanges();
    apiApikeysService.delete.and.returnValue(of({}));
    component.remove(component.id);
    expect(apiApikeysService.delete).toHaveBeenCalledTimes(1);
  });

  it('should emit event on Manage button click', () => {
    const spy = spyOn(component.useButtonClicked, 'emit');
    component.useApiKey(10);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(10);
  });

  it('should emit event on remove keys success', () => {
    apiApikeysServiceSpy.delete.and.returnValue(of({}));
    const spy = spyOn(component.deletedKey, 'emit');
    component.remove(10);
    expect(apiApikeysServiceSpy.delete).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(10);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
