import { TestBed } from '@angular/core/testing';
import { BilleteraService } from './billetera-service';

describe('BilleteraService', () => {
  let service: BilleteraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BilleteraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
