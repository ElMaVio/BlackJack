import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitesresponsablesComponent } from './limitesresponsables-component';

describe('LimitesresponsablesComponent', () => {
  let component: LimitesresponsablesComponent;
  let fixture: ComponentFixture<LimitesresponsablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitesresponsablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitesresponsablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
