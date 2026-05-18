import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitesResponsablesComponent } from './limitesresponsables-component';

describe('LimitesresponsablesComponent', () => {
  let component: LimitesResponsablesComponent;
  let fixture: ComponentFixture<LimitesResponsablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitesResponsablesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LimitesResponsablesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
