import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { DescriptionCausePage } from './description-cause.page';

const testCause = {
  id: 'unhcr',
  image: 'assets/img/donations/causes/cause_1/image.jpg',
  title: 'UNHCR',
  logo: 'assets/img/donations/causes/cause_1/logo.svg',
  type: 'humanitary',
  title_1: 'donations.description_cause.info.unhcr.title_1',
  title_2: 'donations.description_cause.info.unhcr.title_2',
  title_3: 'donations.description_cause.info.unhcr.title_3',
  description: 'donations.description_cause.info.unhcr.description',
};

describe('DescriptionCausePage', () => {
  let component: DescriptionCausePage;
  let fixture: ComponentFixture<DescriptionCausePage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let activatedRouteSpy: any;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['get']);
      activatedRouteSpy.snapshot = {
        queryParamMap: convertToParamMap({
          cause: 'unhcr',
        }),
      };
      TestBed.configureTestingModule({
        declarations: [DescriptionCausePage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(DescriptionCausePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get correct data on ngOnInit of the cause', () => {
    component.ngOnInit();
    expect(component.data.id).toEqual(testCause.id);
  });

  it('should navigate to donate page when button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="go_to_donate"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['']);
  });
});
