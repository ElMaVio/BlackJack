import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerUsuariosComponent } from './usuarios-component';

describe('VerUsuariosComponent', () => {
  let component: VerUsuariosComponent;
  let fixture: ComponentFixture<VerUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerUsuariosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerUsuariosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
