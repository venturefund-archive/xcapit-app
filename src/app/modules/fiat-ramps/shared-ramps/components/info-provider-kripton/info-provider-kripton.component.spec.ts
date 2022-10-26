import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoProviderKriptonComponent } from './info-provider-kripton.component';

describe('InfoProviderKriptonComponent', () => {
  let component: InfoProviderKriptonComponent;
  let fixture: ComponentFixture<InfoProviderKriptonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoProviderKriptonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoProviderKriptonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
