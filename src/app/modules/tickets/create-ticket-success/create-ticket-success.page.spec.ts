import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateTicketSuccessPage } from './create-ticket-success.page';

describe('CreateTicketSuccessPage', () => {
  let component: CreateTicketSuccessPage;
  let fixture: ComponentFixture<CreateTicketSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTicketSuccessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTicketSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
