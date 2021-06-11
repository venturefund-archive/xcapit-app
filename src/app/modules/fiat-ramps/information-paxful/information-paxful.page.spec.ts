import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformationPaxfulPage } from './information-paxful.page';

describe('InformationPaxfulPage', () => {
  let component: InformationPaxfulPage;
  let fixture: ComponentFixture<InformationPaxfulPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformationPaxfulPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InformationPaxfulPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
