import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerJuegosComponent } from './ver-juegos-component';

describe('VerJuegosComponent', () => {
  let component: VerJuegosComponent;
  let fixture: ComponentFixture<VerJuegosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerJuegosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerJuegosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
