import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { PointsCardComponent } from './points-card.component';

describe('PointsCardComponent', () => {
  let component: PointsCardComponent;
  let fixture: ComponentFixture<PointsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PointsCardComponent],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [TranslateService],
    }).compileComponents();

    fixture = TestBed.createComponent(PointsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
