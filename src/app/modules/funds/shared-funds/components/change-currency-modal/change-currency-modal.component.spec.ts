import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { ChangeCurrencyModalComponent } from './change-currency-modal.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('ChangeCurrencyModalComponent', () => {
  let component: ChangeCurrencyModalComponent;
  let fixture: ComponentFixture<ChangeCurrencyModalComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ChangeCurrencyModalComponent>;
  let modalControllerMock: any;
  let modalControllerService;
  beforeEach(async(() => {
    modalControllerMock = {
      create: of({
        present: () => {},
        dismiss: () => of({}).toPromise()
      }).toPromise(),
      dismiss: of().toPromise()
    };
    TestBed.configureTestingModule({
      declarations: [ChangeCurrencyModalComponent, TrackClickDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [{ provide: ModalController, useValue: modalControllerMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeCurrencyModalComponent);
    component = fixture.componentInstance;
    component.selected = 'BTC';
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    modalControllerService = TestBed.get(ModalController);

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Change Currency button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Cancel Change Currency'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Change Currency button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Change Currency'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  //TODO: Hacer tests
});
