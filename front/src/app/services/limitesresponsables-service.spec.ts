import {  } from '@angular/core';
import { LimitesService } from './limitesresponsables-service'; // Asegúrate de que apunte a tu archivo real
import { TestBed } from '@angular/core/testing';

describe('LimitesService', () => {
  let service: LimitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LimitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});