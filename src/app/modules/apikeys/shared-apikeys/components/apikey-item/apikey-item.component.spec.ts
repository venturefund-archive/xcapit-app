import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlertController,
  IonicModule,
  ModalController,
} from '@ionic/angular';
import { TranslateModule} from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { ApiApikeysService } from '../../services/api-apikeys/api-apikeys.service';
import { ApikeyItemComponent } from './apikey-item.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';

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
  let de: DebugElement = fixture.debugElement;
  let modalControllerSpy;
  let alertControllerSpy;

  beforeEach(async(() => {
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    TestBed.configureTestingModule({
      declarations: [ApikeyItemComponent],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ApiApikeysService, useValue: apiApikeysServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
      ],
    }).compileComponents();

    apiApikeysServiceSpy = jasmine.createSpyObj('ApiApikeysService', [
      'delete',
    ]);

    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    fixture = TestBed.createComponent(ApikeyItemComponent);
    component = fixture.componentInstance;
    component.alias = data.alias;
    component.id = data.id;
    component.nombre_bot = data.nombre_bot;
    fixture.detectChanges();
    de = fixture.debugElement;
  }));

  it('should call trackEvent on trackService when elements with the directive are clicked in card with funds', () => {
    spyOn(window, 'open');
    fixture.detectChanges();
    const elms = trackClickDirectiveHelper.getAllElementsWithTheDirective();
    component.id = apikeys.apikeyWithFunds.id;
    component.nombre_bot = apikeys.apikeyWithFunds.nombre_bot;
    component.alias = apikeys.apikeyWithFunds.alias;
    for (const el of elms) {
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    }
    expect(elms.length).toBe(3);
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
    expect(elms.length).toBe(5);
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
    component.openModal();
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call delete on remove', () => {
    fixture.detectChanges();
    apiApikeysServiceSpy.delete.and.returnValue({});
    component.remove(component.id);
    expect(apiApikeysServiceSpy.delete).toHaveBeenCalledTimes(1);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
