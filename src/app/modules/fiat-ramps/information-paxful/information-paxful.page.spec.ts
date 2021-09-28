import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { InformationPaxfulPage } from './information-paxful.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const formData = {
  valid: {
    responsibilityAccepted: true,
    providerAccepted: true,
    rateAccepted: true,
    investmentAccepted: true,
  },
  invalid: {
    responsibilityAccepted: true,
    providerAccepted: false,
    rateAccepted: true,
    investmentAccepted: false,
  },
};

describe('InformationPaxfulPage', () => {
  let component: InformationPaxfulPage;
  let fixture: ComponentFixture<InformationPaxfulPage>;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InformationPaxfulPage>;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [InformationPaxfulPage, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          TranslateModule.forRoot(),
          IonicModule,
          RouterTestingModule,
          ReactiveFormsModule,
          HttpClientTestingModule,
        ],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(InformationPaxfulPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationPaxfulPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to new-operation page on handleSubmit and valid form', () => {
    fixture.detectChanges();
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/fiat-ramps/new-operation-paxful']);
  });

  it('should call openModalAlert on handleSubmit and invalid form', () => {
    const spyOpenModal = spyOn(component, 'openModalAlert');
    spyOpenModal.and.returnValue(undefined);
    component.form.patchValue(formData.invalid);
    component.handleSubmit();
    expect(component.openModalAlert).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Acept Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Acept');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
