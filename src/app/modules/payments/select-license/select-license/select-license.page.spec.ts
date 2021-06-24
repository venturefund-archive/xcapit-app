import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../../testing/spies/nav-controller-mock.spec';
import { SelectLicensePage } from './select-license.page';

describe('SelectLicensePage', () => {
  let component: SelectLicensePage;
  let fixture: ComponentFixture<SelectLicensePage>;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectLicensePage>;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [SelectLicensePage, TrackClickDirective],
        imports: [IonicModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectLicensePage);
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when anual button is clicked', () => {
    spyOn(component, 'changeLicenses');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'anual');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when mensual button is clicked', () => {
    spyOn(component, 'changeLicenses');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'mensual');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call changeLicenses on ionViewWillEnter', () => {
    const spy = spyOn(component, 'changeLicenses');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
