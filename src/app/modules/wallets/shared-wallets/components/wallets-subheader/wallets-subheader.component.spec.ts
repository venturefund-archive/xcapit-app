import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';
import { WalletsSubheaderComponent } from './wallets-subheader.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

describe('WalletsSubheaderComponent', () => {
  let component: WalletsSubheaderComponent;
  let fixture: ComponentFixture<WalletsSubheaderComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletsSubheaderComponent>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [WalletsSubheaderComponent, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletsSubheaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to disclaimer page when when ux_create_create_wallet is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_create_create_wallet');
    el.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/create-first/disclaimer']);
  });

  it('should call trackEvent on trackService when ux_create_create_wallet Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_create_create_wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
