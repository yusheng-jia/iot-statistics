import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsRealComponent } from './statistics-real.component';

describe('StatisticsRealComponent', () => {
  let component: StatisticsRealComponent;
  let fixture: ComponentFixture<StatisticsRealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsRealComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticsRealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
