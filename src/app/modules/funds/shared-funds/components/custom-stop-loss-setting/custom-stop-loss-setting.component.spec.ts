import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomStopLossSettingComponent } from './custom-stop-loss-setting.component';

describe('CustomStopLossSettingComponent', () => {
  let component: CustomStopLossSettingComponent;
  let fixture: ComponentFixture<CustomStopLossSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomStopLossSettingComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomStopLossSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
