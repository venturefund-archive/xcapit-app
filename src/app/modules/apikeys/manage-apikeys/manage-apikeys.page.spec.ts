import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageApikeysPage } from './manage-apikeys.page';

describe('ManageApikeysPage', () => {
  let component: ManageApikeysPage;
  let fixture: ComponentFixture<ManageApikeysPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageApikeysPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageApikeysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
