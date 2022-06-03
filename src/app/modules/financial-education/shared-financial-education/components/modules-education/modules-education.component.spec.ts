import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ModulesEducationComponent } from './modules-education.component';

describe('FinanceEducationComponent', () => {
  let component: ModulesEducationComponent;
  let fixture: ComponentFixture<ModulesEducationComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ModulesEducationComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let moduleSpy: jasmine.SpyObj<any>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      moduleSpy = jasmine.createSpyObj(
        'module',
        {},
        {
          icon: 'assets/ux-icons/introduction-finances.svg',
          title: 'financial_education.home.module_finance.module_1.title',
          comingSoon: true,
          sub_modules: [
            {
              link: '',
              title: 'financial_education.home.module_finance.module_1.sub_modules.sub_module_1',
              dataToTrack: 'how_to_get_started_in_finance',
            },
          ],
        }
      );
      TestBed.configureTestingModule({
        declarations: [ModulesEducationComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(ModulesEducationComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component.module = moduleSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to info education page when item is clicked', async () => {
    fixture.debugElement.query(By.css('ion-item[name="item_sub_module"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('');
  });

  it('should call appTrackEvent on trackService when item is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-item', 'item_sub_module');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render properly', async () => {
    const imgModuleEl = fixture.debugElement.query(By.css('img[name="module_img"]'));
    const titleModuleEl = fixture.debugElement.query(By.css('ion-label[name="module_title"]'));
    const comingSoonEl = fixture.debugElement.query(By.css('ion-label[name="module_coming_soon"]'));
    const titleSubModuleEl = fixture.debugElement.query(By.css('ion-label[name="sub_module_title"]'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(imgModuleEl.attributes.src).toContain('assets/ux-icons/introduction-finances.svg');
    expect(titleModuleEl.nativeElement.innerHTML).toContain('financial_education.home.module_finance.module_1.title');
    expect(comingSoonEl.nativeElement.innerHTML).toContain('financial_education.home.coming_soon');
    expect(titleSubModuleEl.nativeElement.innerHTML).toContain('financial_education.home.module_finance.module_1.sub_modules.sub_module_1');
  });
});
