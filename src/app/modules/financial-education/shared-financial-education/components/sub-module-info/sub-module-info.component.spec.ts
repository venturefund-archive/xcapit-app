import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { SubModuleInfoComponent } from './sub-module-info.component';

describe('SubModuleInfoComponent', () => {
  let component: SubModuleInfoComponent;
  let fixture: ComponentFixture<SubModuleInfoComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let subModuleSpy: any;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      subModuleSpy = jasmine.createSpyObj(
        'subModule',
        {},
        {
          title: 'financial_education.home.module_finance.module_1.sub_modules.sub_module_1.title',
          img: 'assets/img/financial-education/startied.svg',
          info: 'financial_education.home.module_finance.module_1.sub_modules.sub_module_1.description',
        }
      );
      TestBed.configureTestingModule({
        declarations: [SubModuleInfoComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(SubModuleInfoComponent);
      component = fixture.componentInstance;
      component.subModule = subModuleSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const titleEl = fixture.debugElement.query(By.css('ion-header > ion-toolbar > ion-title'));
    const imgEl = fixture.debugElement.query(By.css('div.smi > div > img'));
    const infoEl = fixture.debugElement.query(By.css('div.smi > div > ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain(
      'financial_education.home.module_finance.module_1.sub_modules.sub_module_1.title'
    );
    expect(imgEl.attributes.src).toContain('assets/img/financial-education/startied.svg');
    expect(infoEl.nativeElement.innerHTML).toContain(
      'financial_education.home.module_finance.module_1.sub_modules.sub_module_1.description'
    );
  });
});
