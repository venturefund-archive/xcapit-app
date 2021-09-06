import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';
import { WalletsSubheaderComponent } from './wallets-subheader.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('WalletsSubheaderComponent', () => {
  let component: WalletsSubheaderComponent;
  let fixture: ComponentFixture<WalletsSubheaderComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletsSubheaderComponent>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [WalletsSubheaderComponent, TrackClickDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [TrackClickDirective, { provide: NavController, useValue: navControllerSpy }],
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

  it('should navigate to disclaimer page when when create wallet is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Create Wallet');
    el.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/create-first/disclaimer']);
  });

  it('should call trackEvent on trackService when Create Wallet Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Create Wallet');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
