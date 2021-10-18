import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ABOUTXCAPITOPTIONS } from '../../../constants/about-xcapit-account';

import { DesplegableComponent } from './desplegable.component';

describe('DesplegableComponent', () => {
  let component: DesplegableComponent;
  let fixture: ComponentFixture<DesplegableComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [DesplegableComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(DesplegableComponent);
      component = fixture.componentInstance;
      component.answer = ABOUTXCAPITOPTIONS[0];
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
