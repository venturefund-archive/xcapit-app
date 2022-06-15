import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from '../../../shared/services/track/track.service';
import { SUCCESS_TYPES } from '../../../shared/components/success-content/success-types.constant';
import { SuccessSubmodulesPage } from './success-submodules.page';
import { ModulesService } from 'src/app/shared/services/financial-education/modules.service';
import { FakeActivatedRoute } from 'src/testing/fakes/activated-route.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SuccessSubmodulesPage', () => {
  let component: SuccessSubmodulesPage;
  let fixture: ComponentFixture<SuccessSubmodulesPage>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  //Crear 1- Variable
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let moduleServiceSpy: jasmine.SpyObj<ModulesService>;

  //aca definomos todo globalmente antes que arranquen cada test
  beforeEach(
    waitForAsync(() => {
      //2do- definir el spy con sus metodos o variables
      trackServiceSpy = jasmine.createSpyObj('TrackService', {
        trackEvent: Promise.resolve(true),
      });

      moduleServiceSpy = jasmine.createSpyObj('ModulesService', {
        getModules: [
          {
            id: 1,
            sub_modules: [
              {
                id: 1,
                title:'Test',
                screenViewLabel:'Event test'
              },
            ],
          },
        ],
      });

      fakeActivatedRoute = new FakeActivatedRoute({ moduleId: 1, submoduleId: 1 });
      activatedRouteSpy = fakeActivatedRoute.createSpy();

      TestBed.configureTestingModule({
        declarations: [SuccessSubmodulesPage],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          //3ro no uses el real, usa el trackServiceSpy
          { provide: TrackService, useValue: trackServiceSpy },
          { provide: ModulesService, useValue: moduleServiceSpy },
        ],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessSubmodulesPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data on init', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.data).toEqual(SUCCESS_TYPES.success_submodules);
    expect(component.data.textPrimary).toEqual('financial_education.success_submodule.textPrimary');
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledOnceWith({eventAction: 'screenview',
    description: window.location.href,
    eventLabel:'Event test'});
  });
});
