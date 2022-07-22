import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { rawEducationData } from '../../fixtures/rawEducationData';
import { ModulesEducationComponent } from './modules-education.component';

fdescribe('ModulesEducationComponent', () => {
  let component: ModulesEducationComponent;
  let fixture: ComponentFixture<ModulesEducationComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ModulesEducationComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
    
      TestBed.configureTestingModule({
        declarations: [ModulesEducationComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(ModulesEducationComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component.selectedCategory = 'finance';
      component.module = rawEducationData.finance[0];
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to info education page when item is clicked', () => {
    fixture.debugElement.query(By.css('ion-item[name="item_sub_module"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      'tabs/financial-education/information/tab',
      'finance',
      'module',
      'finance_1',
      'submodule',
      'finance_sub_1',
    ]);
  });

  it('should call appTrackEvent on trackService when item is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-item', 'item_sub_module');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  fit('should render properly', async () => {
    const imgModuleEl = fixture.debugElement.query(By.css('img[name="module_img"]'));
    const titleModuleEl = fixture.debugElement.query(By.css('ion-label[name="module_title"]'));
    const comingSoonEl = fixture.debugElement.query(By.css('ion-label[name="module_coming_soon"]'));
    const titleSubModuleEl = fixture.debugElement.query(By.css('ion-label[name="sub_module_title ux-font-text-xxs"]'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(imgModuleEl.attributes.src).toContain('icon_finance_1');
    expect(titleModuleEl.nativeElement.innerHTML).toContain('financial_education.home.module_finance.module_1.title');
    expect(comingSoonEl.nativeElement.innerHTML).toContain('financial_education.home.coming_soon');
    expect(titleSubModuleEl.nativeElement.innerHTML).toContain(
      'financial_education.home.module_finance.module_1.sub_modules.sub_module_1'
    );
  });
});
