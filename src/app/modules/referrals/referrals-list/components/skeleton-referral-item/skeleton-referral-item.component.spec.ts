import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonReferralItemComponent } from './skeleton-referral-item.component';

describe('SkeletonReferralItemComponent', () => {
  let component: SkeletonReferralItemComponent;
  let fixture: ComponentFixture<SkeletonReferralItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkeletonReferralItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonReferralItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
