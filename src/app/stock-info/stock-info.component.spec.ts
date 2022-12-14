import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInfoComponent } from './stock-info.component';

describe('StockInfoComponent', () => {
  let component: StockInfoComponent;
  let fixture: ComponentFixture<StockInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
