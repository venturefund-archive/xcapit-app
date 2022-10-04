import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { ToolsCardComponent } from './tools-card.component';

const testTool = {
  icon: 'test.svg',
  textPrimary: 'testPrimaryText',
  textSecondary: 'testSecondaryText',
  urlPrimaryAction: '/tabs/tools',
  trackClickEventNamePrimaryAction: 'ux_go_to_test',
}

describe('ToolsCardComponent', () => {
  let component: ToolsCardComponent;
  let fixture: ComponentFixture<ToolsCardComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ToolsCardComponent>

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [ ToolsCardComponent, FakeTrackClickDirective ],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [ {provide: NavController, useValue: navControllerSpy}]
      }).compileComponents();

      fixture = TestBed.createComponent(ToolsCardComponent);
      component = fixture.componentInstance;
      component.data = testTool
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('.main__ux-icon img'));
    const titleEl = fixture.debugElement.query(By.css('.main__primary-text'));
    const subtitleEl = fixture.debugElement.query(By.css('.main__secondary-text'));

    expect(iconEl.attributes.src).toContain('test.svg');
    expect(titleEl.nativeElement.innerHTML).toContain('testPrimaryText');
    expect(subtitleEl.nativeElement.innerHTML).toContain('testSecondaryText');
  });

  it('should redirect user to section and trackEvent on trackService when clicked', () => {
    const el = fixture.debugElement.query(By.css('.main'))
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/tools']);
    expect(spy).toHaveBeenCalledTimes(1);
  })
});
