import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';
import { ItemLicenseComponent } from './item-license.component';
import { PlanType } from '../../../select-license/enums/plan_type.enum';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('ItemLicenseComponent', () => {
  let component: ItemLicenseComponent;
  let fixture: ComponentFixture<ItemLicenseComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ItemLicenseComponent>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      navControllerSpy.navigateForward.and.returnValue(Promise.resolve());
      TestBed.configureTestingModule({
        declarations: [ItemLicenseComponent, FakeTrackClickDirective],
        imports: [IonicModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemLicenseComponent);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Next Button clicked', () => {
    component.plan = { type: PlanType.premium };
    fixture.detectChanges();
    spyOn(component, 'goToContactUs');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Contact Us');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call navigateForward in goToContactUs', () => {
    component.goToContactUs();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/payment/contact-license']);
  });
});
