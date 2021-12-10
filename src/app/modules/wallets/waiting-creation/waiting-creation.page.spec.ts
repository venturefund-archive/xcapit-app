import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaitingCreationPage } from './waiting-creation.page';

describe('WaitingCreationPage', () => {
  let component: WaitingCreationPage;
  let fixture: ComponentFixture<WaitingCreationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingCreationPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
