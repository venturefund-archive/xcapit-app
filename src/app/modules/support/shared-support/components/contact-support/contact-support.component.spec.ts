import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { ContactSupportComponent } from './contact-support.component';

describe('ContactSupportComponent', () => {
  let component: ContactSupportComponent;
  let fixture: ComponentFixture<ContactSupportComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [ContactSupportComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(ContactSupportComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to create-ticket-support when Go To Create Ticket is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Go To Create Ticket"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tickets/create-support-ticket']);
  });
});
